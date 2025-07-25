
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SymptomLog {
  id: string;
  date: string;
  symptoms: string;
  suggestions: string;
  user_id: string;
}

export const useSymptoms = () => {
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLogs = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching symptom logs for user:', user.id);
      const { data, error } = await supabase
        .from('symptoms logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching symptom logs:', error);
        throw error;
      }
      
      console.log('Fetched symptom logs:', data);
      setLogs(data || []);
    } catch (error: any) {
      console.error('Failed to fetch symptom logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch symptom logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addLog = async (symptoms: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const suggestions = generateSuggestions(symptoms);

    try {
      console.log('Adding symptom log:', { symptoms, suggestions });
      const { data, error } = await supabase
        .from('symptoms logs')
        .insert([{ 
          user_id: user.id, 
          date: today, 
          symptoms, 
          suggestions 
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating symptom log:', error);
        throw error;
      }
      
      console.log('Created symptom log:', data);
      setLogs(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "Symptom logged successfully",
      });
    } catch (error: any) {
      console.error('Failed to log symptoms:', error);
      toast({
        title: "Error",
        description: "Failed to log symptoms",
        variant: "destructive",
      });
    }
  };

  const generateSuggestions = (symptoms: string): string => {
    const symptomLower = symptoms.toLowerCase();
    
    if (symptomLower.includes('headache') || symptomLower.includes('head pain')) {
      return "Rest in a quiet, dark room. Stay hydrated. Consider a cold compress. If severe or persistent, consult a doctor.";
    } else if (symptomLower.includes('fever') || symptomLower.includes('temperature')) {
      return "Rest and stay hydrated. Monitor temperature. Take paracetamol if needed. Consult a doctor if fever persists above 101°F.";
    } else if (symptomLower.includes('cough') || symptomLower.includes('cold')) {
      return "Stay hydrated, use a humidifier, and get plenty of rest. Warm salt water gargling may help. See a doctor if symptoms worsen.";
    } else if (symptomLower.includes('stomach') || symptomLower.includes('nausea')) {
      return "Eat light, bland foods. Stay hydrated with small sips of water. Rest and avoid solid foods temporarily. Consult a doctor if severe.";
    } else {
      return "Rest, stay hydrated, and monitor your symptoms. If symptoms persist or worsen, please consult with a healthcare professional.";
    }
  };

  useEffect(() => {
    fetchLogs();

    if (!user) return;

    // Set up real-time subscription
    const channel = supabase
      .channel('symptoms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'symptoms logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time symptoms change:', payload);
          fetchLogs(); // Refetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    logs,
    loading,
    addLog,
    refetch: fetchLogs,
  };
};
