
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

    console.log('Fetching medicines for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      console.log('Medicine fetch result:', { data, error });

      if (error) {
        console.error('Medicine fetch error:', error);
        throw error;
      }
      
      setMedicines(data || []);
      console.log('Medicines set to state:', data?.length || 0, 'items');
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
    console.log('Starting addMedicine function');
    console.log('User from auth context:', user);
    
    if (!user) {
      console.error('No authenticated user found');
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add medicine",
        variant: "destructive",
      });
      return false;
    }

    console.log('Adding medicine:', medicine);

    try {
      // Validate required fields
      if (!medicine.name?.trim()) {
        console.error('Medicine name is required');
        toast({
          title: "Validation Error",
          description: "Medicine name is required",
          variant: "destructive",
        });
        return false;
      }

      if (!medicine.frequency) {
        console.error('Frequency is required');
        toast({
          title: "Validation Error",
          description: "Frequency is required",
          variant: "destructive",
        });
        return false;
      }

      if (!medicine.time_slots || medicine.time_slots.length === 0) {
        console.error('At least one time slot is required');
        toast({
          title: "Validation Error",
          description: "At least one time slot is required",
          variant: "destructive",
        });
        return false;
      }
      
      const medicineData = {
        name: medicine.name.trim(),
        dosage: medicine.dosage?.trim() || null,
        frequency: medicine.frequency,
        time_slots: medicine.time_slots,
        notes: medicine.notes?.trim() || null,
        is_active: true,
        user_id: user.id
      };
      
      console.log('Attempting to insert medicine data:', medicineData);
      
      const { data, error } = await supabase
        .from('medicines')
        .insert([medicineData])
        .select()
        .single();

      console.log('Insert result:', { data, error });

      if (error) {
        console.error('Database insert error:', error);
        toast({
          title: "Database Error",
          description: `Failed to add medicine: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }
      
      if (data) {
        setMedicines(prev => {
          const updated = [data, ...prev];
          console.log('Updated medicines state with new item:', updated.length, 'total');
          return updated;
        });
        
        toast({
          title: "Success",
          description: `${medicine.name} has been added successfully`,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Unexpected error adding medicine:', error);
      toast({
        title: "Error",
        description: `Failed to add medicine: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateMedicine = async (id: string, updates: Partial<Medicine>) => {
    if (!user) {
      console.error('No user found when updating medicine');
      return false;
    }

    console.log('Updating medicine:', id, updates);

    try {
      const { data, error } = await supabase
        .from('medicines')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      if (data) {
        setMedicines(prev => prev.map(med => med.id === id ? data : med));
        toast({
          title: "Success",
          description: "Medicine updated successfully",
        });
        return true;
      }
      
      return false;
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
    if (!user) {
      console.error('No user found when deleting medicine');
      return false;
    }

    console.log('Deleting medicine:', id);

    try {
      const { error } = await supabase
        .from('medicines')
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', user.id);

      console.log('Delete result error:', error);

      if (error) {
        console.error('Delete error:', error);
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
    console.log('Medicine hook effect triggered, user:', user?.id);
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
          console.log('Real-time medicine change:', payload);
          fetchMedicines();
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
