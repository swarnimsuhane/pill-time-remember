
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
    console.log('🚀 ADD MEDICINE FUNCTION CALLED');
    
    if (!user) {
      console.error('❌ No user found, cannot add medicine');
      console.error('User object:', user);
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add medicine. Please sign in and try again.",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('=== ADD MEDICINE START ===');
      console.log('👤 User ID:', user.id);
      console.log('👤 User Email:', user.email);
      console.log('📋 Medicine input:', medicine);
      
      // Validate input data
      if (!medicine.name || !medicine.frequency || !medicine.time_slots || medicine.time_slots.length === 0) {
        console.error('❌ Invalid medicine data:', {
          hasName: !!medicine.name,
          hasFrequency: !!medicine.frequency,
          hasTimeSlots: !!medicine.time_slots,
          timeSlotsLength: medicine.time_slots?.length || 0
        });
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
        user_id: user.id // Explicitly setting user_id
      };
      
      console.log('📤 Final medicine data to insert:', medicineData);
      console.log('🔑 User ID being inserted:', medicineData.user_id);
      
      // Test user authentication
      const { data: authTest, error: authError } = await supabase.auth.getUser();
      console.log('🔐 Auth test result:', { user: authTest?.user?.id, error: authError });
      
      const { data, error } = await supabase
        .from('medicines')
        .insert([medicineData])
        .select()
        .single();

      if (error) {
        console.error('💥 Supabase insert error:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details
        });
        
        // Provide more specific error messages
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
      
      console.log('✅ Successfully added medicine:', data);
      
      // Update local state
      setMedicines(prev => {
        console.log('📝 Updating local medicines state');
        const newMedicines = [data, ...prev];
        console.log('📝 New medicines array length:', newMedicines.length);
        return newMedicines;
      });
      
      toast({
        title: "Success",
        description: `${medicine.name} has been added to your medicine schedule`,
      });
      
      console.log('=== ADD MEDICINE SUCCESS ===');
      return true;
    } catch (error: any) {
      console.error('=== ADD MEDICINE ERROR ===');
      console.error('💥 Error adding medicine:', error);
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
      console.error('Error stack:', error?.stack);
      
      toast({
        title: "Error",
        description: `Failed to add medicine: ${error?.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateMedicine = async (id: string, updates: Partial<Medicine>) => {
    console.log('📝 UPDATE MEDICINE FUNCTION CALLED');
    console.log('Medicine ID:', id);
    console.log('Updates:', updates);
    
    try {
      const { data, error } = await supabase
        .from('medicines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('💥 Update error:', error);
        throw error;
      }
      
      console.log('✅ Successfully updated medicine:', data);
      setMedicines(prev => prev.map(med => med.id === id ? data : med));
      toast({
        title: "Success",
        description: "Medicine updated successfully",
      });
      return true;
    } catch (error) {
      console.error('💥 Error updating medicine:', error);
      toast({
        title: "Error",
        description: "Failed to update medicine",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteMedicine = async (id: string) => {
    console.log('🗑️ DELETE MEDICINE FUNCTION CALLED');
    console.log('Medicine ID:', id);
    
    try {
      const { error } = await supabase
        .from('medicines')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('💥 Delete error:', error);
        throw error;
      }
      
      console.log('✅ Successfully deleted medicine');
      setMedicines(prev => prev.filter(med => med.id !== id));
      toast({
        title: "Success",
        description: "Medicine removed successfully",
      });
      return true;
    } catch (error) {
      console.error('💥 Error deleting medicine:', error);
      toast({
        title: "Error",
        description: "Failed to remove medicine",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('🔄 useMedicines effect triggered. User:', user?.id);
    fetchMedicines();

    if (!user) {
      console.log('👤 No user, skipping realtime setup');
      return;
    }

    // Set up real-time subscription
    console.log('📡 Setting up realtime subscription for user:', user.id);
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
          console.log('📡 Real-time medicines change:', payload);
          fetchMedicines(); // Refetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      console.log('📡 Cleaning up realtime subscription');
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
