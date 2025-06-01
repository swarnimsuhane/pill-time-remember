
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      text: "Hello! I'm your medical AI assistant. I can help you with medication reminders, health questions, and general wellness advice. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

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
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('medication') || input.includes('medicine')) {
      return "I can help you with medication management! Make sure to take your medicines as prescribed. Would you like me to set up a reminder or provide information about drug interactions?";
    } else if (input.includes('pain') || input.includes('hurt')) {
      return "I understand you're experiencing pain. While I can provide general wellness advice, please consult with your healthcare provider for persistent pain. In the meantime, consider rest, hydration, and gentle movement if appropriate.";
    } else if (input.includes('doctor') || input.includes('appointment')) {
      return "It's great that you're staying on top of your healthcare! Regular check-ups are important. You can use the 'Add Doctor' feature to keep track of your healthcare providers and appointments.";
    } else if (input.includes('symptom')) {
      return "Tracking symptoms is very helpful for your healthcare. I recommend keeping a symptom diary and discussing any concerns with your doctor. Would you like tips on what to track?";
    } else {
      return "Thank you for your question! While I'm here to provide general health and wellness guidance, always consult with qualified healthcare professionals for medical advice. Is there something specific about your medication routine I can help with?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl h-[600px] bg-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pill-teal rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-pill-navy" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pill-navy">AI Health Assistant</h3>
              <p className="text-sm text-pill-navy/70">Always here to help with your health questions</p>
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                  ? 'bg-pill-navy text-white ml-auto'
                  : 'bg-pill-light text-pill-navy'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-pill-navy/50'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
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
              placeholder="Ask me about your health, medications, or wellness..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-pill-navy hover:bg-pill-navy/90"
              disabled={!inputMessage.trim()}
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
