import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  message: string;
  sender: 'user' | 'ai';
  created_at: string;
}

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch all chat sessions
  const fetchSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat sessions:', error);
        throw error;
      }

      setSessions(data || []);
    } catch (error: any) {
      console.error('Failed to fetch chat sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific session
  const fetchMessages = async (sessionId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      setMessages((data || []).map(msg => ({
        ...msg,
        sender: msg.sender as 'user' | 'ai'
      })));
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive",
      });
    }
  };

  // Create a new chat session
  const createSession = async (title?: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .insert([{
          user_id: user.id,
          title: title || 'New Chat'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating chat session:', error);
        throw error;
      }

      // Refresh sessions list
      await fetchSessions();
      return data.id;
    } catch (error: any) {
      console.error('Failed to create chat session:', error);
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive",
      });
      return null;
    }
  };

  // Add a message to the current session
  const addMessage = async (sessionId: string, message: string, sender: 'user' | 'ai'): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('ai_chat_messages')
        .insert([{
          session_id: sessionId,
          user_id: user.id,
          message,
          sender
        }]);

      if (error) {
        console.error('Error adding message:', error);
        throw error;
      }

      // Update session timestamp
      await supabase
        .from('ai_chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      // Refresh messages if this is the current session
      if (sessionId === currentSessionId) {
        await fetchMessages(sessionId);
      }

      // Refresh sessions to update order
      await fetchSessions();
      return true;
    } catch (error: any) {
      console.error('Failed to add message:', error);
      toast({
        title: "Error",
        description: "Failed to save message",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete a chat session
  const deleteSession = async (sessionId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('ai_chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting chat session:', error);
        throw error;
      }

      // Clear current session if it was deleted
      if (sessionId === currentSessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }

      // Refresh sessions list
      await fetchSessions();
      return true;
    } catch (error: any) {
      console.error('Failed to delete chat session:', error);
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update session title
  const updateSessionTitle = async (sessionId: string, title: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('ai_chat_sessions')
        .update({ title })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating session title:', error);
        throw error;
      }

      await fetchSessions();
      return true;
    } catch (error: any) {
      console.error('Failed to update session title:', error);
      toast({
        title: "Error",
        description: "Failed to update chat title",
        variant: "destructive",
      });
      return false;
    }
  };

  // Load a specific session
  const loadSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    await fetchMessages(sessionId);
  };

  // Start a new chat (clear current session)
  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      setSessions([]);
      setCurrentSessionId(null);
      setMessages([]);
    }
  }, [user]);

  return {
    sessions,
    currentSessionId,
    messages,
    loading,
    fetchSessions,
    fetchMessages,
    createSession,
    addMessage,
    deleteSession,
    updateSessionTitle,
    loadSession,
    startNewChat
  };
};