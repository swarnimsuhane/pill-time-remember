import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Medicine {
  id: string;
  user_id: string;
  name: string;
  dosage?: string;
  frequency: string;
  time_slots: string[];
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMedicines = async () => {
    if (!user) {
      console.log('No user found, skipping medicine fetch');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching medicines for user:', user.id);
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching medicines:', error);
        throw error;
      }
      
      console.log('Fetched medicines:', data);
      setMedicines(data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast({
        title: "Error",
        description: "Failed to fetch medicines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMedicine = async (medicine: Omit<Medicine, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      console.error('No user found, cannot add medicine');
      toast({
        title: "Error",
        description: "You must be logged in to add medicine",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('Adding medicine for user:', user.id);
      console.log('Medicine data:', medicine);
      
      const medicineData = {
        ...medicine,
        user_id: user.id, // Explicitly set the user_id
      };
      
      console.log('Final medicine data to insert:', medicineData);
      
      const { data, error } = await supabase
        .from('medicines')
        .insert([medicineData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Successfully added medicine:', data);
      setMedicines(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Medicine added successfully",
      });
      return true;
    } catch (error) {
      console.error('Error adding medicine:', error);
      toast({
        title: "Error",
        description: `Failed to add medicine: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateMedicine = async (id: string, updates: Partial<Medicine>) => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMedicines(prev => prev.map(med => med.id === id ? data : med));
      toast({
        title: "Success",
        description: "Medicine updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating medicine:', error);
      toast({
        title: "Error",
        description: "Failed to update medicine",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteMedicine = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medicines')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      setMedicines(prev => prev.filter(med => med.id !== id));
      toast({
        title: "Success",
        description: "Medicine removed successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting medicine:', error);
      toast({
        title: "Error",
        description: "Failed to remove medicine",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMedicines();

    if (!user) return;

    // Set up real-time subscription
    const channel = supabase
      .channel('medicines-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medicines',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time medicines change:', payload);
          fetchMedicines(); // Refetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    medicines,
    loading,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    refetch: fetchMedicines
  };
};
