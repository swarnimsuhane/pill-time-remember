
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HydrationLog {
  id: string;
  date: string;
  liters: number;
  user_id: string;
}

export const useHydration = () => {
  const [logs, setLogs] = useState<HydrationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLogs = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching hydration logs for user:', user.id);
      const { data, error } = await supabase
        .from('hydration logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching hydration logs:', error);
        throw error;
      }
      
      console.log('Fetched hydration logs:', data);
      setLogs(data || []);
    } catch (error: any) {
      console.error('Failed to fetch hydration logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hydration logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addLog = async (liters: number, date?: string) => {
    if (!user) return;

    const logDate = date || new Date().toISOString().split('T')[0];

    try {
      console.log('Adding hydration log:', { liters, date: logDate });
      // Check if log exists for today
      const { data: existing } = await supabase
        .from('hydration logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', logDate)
        .single();

      if (existing) {
        // Update existing log
        const { data, error } = await supabase
          .from('hydration logs')
          .update({ liters: existing.liters + liters })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating hydration log:', error);
          throw error;
        }
        
        console.log('Updated hydration log:', data);
        setLogs(prev => prev.map(log => log.id === existing.id ? data : log));
      } else {
        // Create new log
        const { data, error } = await supabase
          .from('hydration logs')
          .insert([{ user_id: user.id, date: logDate, liters }])
          .select()
          .single();

        if (error) {
          console.error('Error creating hydration log:', error);
          throw error;
        }
        
        console.log('Created hydration log:', data);
        setLogs(prev => [data, ...prev]);
      }

      toast({
        title: "Success",
        description: `Added ${liters}L to your hydration log`,
      });
    } catch (error: any) {
      console.error('Failed to log hydration:', error);
      toast({
        title: "Error",
        description: "Failed to log hydration",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  return {
    logs,
    loading,
    addLog,
    refetch: fetchLogs,
  };
};
