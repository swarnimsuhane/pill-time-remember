
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
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('symptoms logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
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

      if (error) throw error;
      setLogs(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "Symptom logged successfully",
      });
    } catch (error: any) {
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
  }, [user]);

  return {
    logs,
    loading,
    addLog,
    refetch: fetchLogs,
  };
};
