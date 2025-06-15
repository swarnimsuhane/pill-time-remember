
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Bot, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useHydration } from '@/hooks/useHydration';
import { useSymptoms } from '@/hooks/useSymptoms';
import { useMedicines } from '@/hooks/useMedicines';
import { useDoctors } from '@/hooks/useDoctors';
import { useHealthScore } from '@/hooks/useHealthScore';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Claude 4, your advanced AI health assistant with superior medical reasoning capabilities. I can help you with:\n\n🔹 **Medication Analysis** - Drug interactions, dosages, side effects\n🔹 **Health Assessment** - Symptom analysis and condition guidance  \n🔹 **Personalized Advice** - Based on your health data and history\n🔹 **Wellness Planning** - Lifestyle, nutrition, and preventive care\n🔹 **Mental Health** - Emotional support and coping strategies\n\nI'll analyze your current health data to provide personalized recommendations. What would you like to discuss about your health today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  
  // Get user health data for personalized responses
  const { logs: hydrationLogs } = useHydration();
  const { logs: symptomLogs } = useSymptoms();
  const { medicines } = useMedicines();
  const { doctors } = useDoctors();
  const healthScore = useHealthScore();

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
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

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm experiencing connectivity issues. This could be due to:\n\n• Anthropic API key not configured\n• Network connectivity issues\n• Service temporarily unavailable\n\nPlease ensure the Claude API key is properly set up and try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] bg-white flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pill-teal rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-pill-navy" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pill-navy">Claude 4 Health Assistant</h3>
              <p className="text-sm text-pill-navy/70">Advanced medical AI with personalized insights</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-pill-navy text-white' 
                  : 'bg-pill-teal text-pill-navy'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-pill-navy text-white'
                  : 'bg-pill-light text-pill-navy'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-pill-navy/50'
                }`}>
                  {message.timestamp.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pill-teal rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-pill-navy" />
              </div>
              <div className="bg-pill-light p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-pill-navy rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pill-navy rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pill-navy rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your health, medications, symptoms, or get personalized advice..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-pill-navy hover:bg-pill-navy/90"
              disabled={!inputMessage.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
