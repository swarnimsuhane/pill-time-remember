import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Bot, User, Plus, History, Trash2, Edit3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useHydration } from '@/hooks/useHydration';
import { useSymptoms } from '@/hooks/useSymptoms';
import { useMedicines } from '@/hooks/useMedicines';
import { useDoctors } from '@/hooks/useDoctors';
import { useHealthScore } from '@/hooks/useHealthScore';
import { useChatSessions } from '@/hooks/useChatSessions';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // Show sidebar by default
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const { toast } = useToast();
  
  // Get user health data for personalized responses
  const { logs: hydrationLogs } = useHydration();
  const { logs: symptomLogs } = useSymptoms();
  const { medicines } = useMedicines();
  const { doctors } = useDoctors();
  const healthScore = useHealthScore();
  
  // Chat sessions hook
  const {
    sessions,
    currentSessionId,
    messages: dbMessages,
    loading,
    createSession,
    addMessage,
    deleteSession,
    updateSessionTitle,
    loadSession,
    startNewChat
  } = useChatSessions();

  // Convert database messages to component format
  const messages: Message[] = currentSessionId 
    ? dbMessages.map(msg => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender,
        timestamp: new Date(msg.created_at)
      }))
    : [
        {
          id: 'welcome',
          text: "Hello! I'm Claude 4, your advanced AI health assistant with superior medical reasoning capabilities. I can help you with:\n\n🔹 **Medication Analysis** - Drug interactions, dosages, side effects\n🔹 **Health Assessment** - Symptom analysis and condition guidance  \n🔹 **Personalized Advice** - Based on your health data and history\n🔹 **Wellness Planning** - Lifestyle, nutrition, and preventive care\n🔹 **Mental Health** - Emotional support and coping strategies\n\nI'll analyze your current health data to provide personalized recommendations. What would you like to discuss about your health today?",
          sender: 'ai',
          timestamp: new Date()
        }
      ];

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    let sessionId = currentSessionId;
    
    // Create new session if none exists
    if (!sessionId) {
      const firstWords = inputMessage.split(' ').slice(0, 4).join(' ');
      const title = firstWords.length > 20 ? firstWords.substring(0, 20) + '...' : firstWords;
      sessionId = await createSession(title || 'Health Chat');
      if (!sessionId) return;
      
      // Load the new session
      await loadSession(sessionId);
    }

    // Add user message to database
    await addMessage(sessionId, inputMessage, 'user');

    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Prepare user health data for personalized responses
      const userHealthData = {
        hydration: hydrationLogs.length > 0 ? `${hydrationLogs[0]?.liters || 0}L today` : 'No recent data',
        symptoms: symptomLogs.length > 0 ? symptomLogs.slice(0, 3).map(s => s.symptoms).join('; ') : 'None logged recently',
        medications: medicines.length > 0 ? medicines.filter(m => m.is_active).map(m => `${m.name} (${m.frequency})`).join(', ') : 'None listed',
        healthScore: `${healthScore.rating} (${healthScore.score}/100)`,
        doctors: doctors.length > 0 ? doctors.map(d => `${d.name} - ${d.speciality}`).join(', ') : 'None added'
      };

      const { data, error } = await supabase.functions.invoke('ai-health-claude', {
        body: { 
          message: currentMessage, 
          userHealthData,
          language: 'en' 
        }
      });

      if (error) throw error;

      // Add AI response to database
      await addMessage(sessionId, data.reply, 'ai');
    } catch (error) {
      console.error('AI Assistant error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to database
      await addMessage(sessionId, "I apologize, but I'm experiencing connectivity issues. This could be due to:\n\n• Anthropic API key not configured\n• Network connectivity issues\n• Service temporarily unavailable\n\nPlease ensure the Claude API key is properly set up and try again.", 'ai');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    startNewChat();
    setShowSidebar(false);
  };

  const handleLoadSession = async (sessionId: string) => {
    await loadSession(sessionId);
    setShowSidebar(false);
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      await deleteSession(sessionId);
    }
  };

  const handleEditTitle = (sessionId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitle(sessionId);
    setNewTitle(currentTitle);
  };

  const handleSaveTitle = async (sessionId: string) => {
    if (newTitle.trim()) {
      await updateSessionTitle(sessionId, newTitle.trim());
    }
    setEditingTitle(null);
    setNewTitle('');
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="w-full h-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] flex flex-col sm:flex-row">
        {/* Chat History Sidebar - Always visible on desktop, toggleable on mobile */}
        <Card className={`w-full sm:w-80 bg-white flex flex-col transition-all duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full absolute z-10'
        } sm:relative sm:translate-x-0 sm:block ${showSidebar ? 'h-1/3 sm:h-full' : 'h-0 sm:h-full'}`}>
          <div className="p-3 sm:p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-pill-navy text-sm sm:text-base">Chat History</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="text-pill-navy hover:bg-pill-light p-1 sm:p-2"
                title="New Chat"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <p className="text-xs text-pill-navy/60 hidden sm:block">Manage your conversations</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 sm:space-y-2">
            {loading ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-pill-navy border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-4 sm:py-8">
                <History className="w-8 h-8 sm:w-12 sm:h-12 text-pill-navy/30 mx-auto mb-2" />
                <p className="text-pill-navy/70 text-xs sm:text-sm">No chat history yet</p>
                <p className="text-pill-navy/50 text-xs hidden sm:block">Start a conversation to see your chats here</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleLoadSession(session.id)}
                  className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors group ${
                    currentSessionId === session.id 
                      ? 'bg-pill-navy text-white' 
                      : 'bg-pill-light hover:bg-pill-teal/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {editingTitle === session.id ? (
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle(session.id)}
                        onBlur={() => handleSaveTitle(session.id)}
                        className="text-xs sm:text-sm h-5 sm:h-6 px-1"
                        autoFocus
                      />
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs sm:text-sm truncate">
                            {session.title}
                          </h4>
                          <p className={`text-xs mt-1 ${
                            currentSessionId === session.id ? 'text-white/70' : 'text-pill-navy/60'
                          }`}>
                            {new Date(session.updated_at).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEditTitle(session.id, session.title, e)}
                            className={`w-5 h-5 sm:w-6 sm:h-6 p-0 ${
                              currentSessionId === session.id 
                                ? 'hover:bg-white/20 text-white' 
                                : 'hover:bg-pill-teal/30 text-pill-navy'
                            }`}
                          >
                            <Edit3 className="w-2 h-2 sm:w-3 sm:h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className={`w-5 h-5 sm:w-6 sm:h-6 p-0 ${
                              currentSessionId === session.id 
                                ? 'hover:bg-white/20 text-white' 
                                : 'hover:bg-red-100 text-red-600'
                            }`}
                          >
                            <Trash2 className="w-2 h-2 sm:w-3 sm:h-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Main Chat Interface */}
        <Card className="flex-1 bg-white flex flex-col min-h-0">
          <div className="flex items-center justify-between p-2 sm:p-4 border-b">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="sm:hidden text-pill-navy p-1"
              >
                <History className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pill-teal rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-pill-navy" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-lg font-semibold text-pill-navy truncate">Claude 4 Health Assistant</h3>
                <p className="text-xs sm:text-sm text-pill-navy/70 truncate">
                  {currentSession ? currentSession.title : 'New Chat'} • Advanced medical AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="hidden sm:flex text-pill-navy hover:bg-pill-light p-1 sm:p-2"
                title="Toggle Chat History"
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="text-pill-navy hover:bg-pill-light p-1 sm:p-2"
                title="New Chat"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} title="Close" className="p-1 sm:p-2">
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 sm:gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-pill-navy text-white' 
                    : 'bg-pill-teal text-pill-navy'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </div>
                <div className={`max-w-[75%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-pill-navy text-white'
                    : 'bg-pill-light text-pill-navy'
                }`}>
                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-pill-navy/50'
                  }`}>
                    {message.timestamp.toLocaleTimeString('en-IN', { 
                      timeZone: 'Asia/Kolkata',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pill-teal rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-pill-navy" />
                </div>
                <div className="bg-pill-light p-2 sm:p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pill-navy rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pill-navy rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pill-navy rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-2 sm:p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your health..."
                className="flex-1 text-sm sm:text-base"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-pill-navy hover:bg-pill-navy/90 px-3 sm:px-4"
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;