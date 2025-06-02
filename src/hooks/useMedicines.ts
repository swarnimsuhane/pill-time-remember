
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  date: string;
  taken: boolean;
  user_id: string;
}

export const useMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMedicines = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching medicines for user:', user.id);
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('user_id', user.id)
        .order('time', { ascending: true });

      if (error) {
        console.error('Error fetching medicines:', error);
        throw error;
      }
      
      console.log('Fetched medicines:', data);
      setMedicines(data || []);
    } catch (error: any) {
      console.error('Failed to fetch medicines:', error);
      toast({
        title: "Error",
        description: "Failed to fetch medicines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMedicine = async (medicine: Omit<Medicine, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      console.log('Adding medicine:', medicine);
      const { data, error } = await supabase
        .from('medicines')
        .insert([{ ...medicine, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error adding medicine:', error);
        throw error;
      }
      
      console.log('Added medicine:', data);
      setMedicines(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Medicine added successfully",
      });
    } catch (error: any) {
      console.error('Failed to add medicine:', error);
      toast({
        title: "Error",
        description: "Failed to add medicine",
        variant: "destructive",
      });
    }
  };

  const updateMedicine = async (id: string, updates: Partial<Medicine>) => {
    if (!user) return;

    try {
      console.log('Updating medicine:', id, updates);
      const { data, error } = await supabase
        .from('medicines')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating medicine:', error);
        throw error;
      }
      
      console.log('Updated medicine:', data);
      setMedicines(prev => prev.map(med => med.id === id ? data : med));
      
      toast({
        title: "Success",
        description: updates.taken ? "Medicine marked as taken" : "Medicine updated successfully",
      });
    } catch (error: any) {
      console.error('Failed to update medicine:', error);
      toast({
        title: "Error",
        description: "Failed to update medicine",
        variant: "destructive",
      });
    }
  };

  const deleteMedicine = async (id: string) => {
    if (!user) return;

    try {
      console.log('Deleting medicine:', id);
      const { error } = await supabase
        .from('medicines')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting medicine:', error);
        throw error;
      }
      
      console.log('Deleted medicine:', id);
      setMedicines(prev => prev.filter(med => med.id !== id));
      toast({
        title: "Success",
        description: "Medicine deleted successfully",
      });
    } catch (error: any) {
      console.error('Failed to delete medicine:', error);
      toast({
        title: "Error",
        description: "Failed to delete medicine",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [user]);

  return {
    medicines,
    loading,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    refetch: fetchMedicines,
  };
};
