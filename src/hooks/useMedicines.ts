
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
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
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
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add medicine. Please sign in and try again.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Validate input data
      if (!medicine.name || !medicine.frequency || !medicine.time_slots || medicine.time_slots.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return false;
      }
      
      // Create the medicine data with explicit user_id
      const medicineData = {
        name: medicine.name.trim(),
        dosage: medicine.dosage?.trim() || null,
        frequency: medicine.frequency,
        time_slots: medicine.time_slots,
        notes: medicine.notes?.trim() || null,
        is_active: medicine.is_active,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('medicines')
        .insert([medicineData])
        .select()
        .single();

      if (error) {
        let errorMessage = `Failed to add medicine: ${error.message}`;
        if (error.code === '42501') {
          errorMessage = "Permission denied. Please make sure you're logged in properly.";
        } else if (error.code === '23505') {
          errorMessage = "This medicine already exists in your schedule.";
        }
        
        toast({
          title: "Database Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }
      
      // Update local state
      setMedicines(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: `${medicine.name} has been added to your medicine schedule`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error adding medicine:', error);
      
      toast({
        title: "Error",
        description: `Failed to add medicine: ${error?.message || 'Unknown error occurred'}`,
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

      if (error) {
        throw error;
      }
      
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

      if (error) {
        throw error;
      }
      
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

    if (!user) {
      return;
    }

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
