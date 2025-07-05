
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  name: string;
  speciality: string;
  contact: string;
  appointment_date: string | null;
  users_id: string;
}

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDoctors = async () => {
    if (!user) {
      console.log('No user found, skipping doctors fetch');
      setLoading(false);
      return;
    }
    
    console.log('Fetching doctors for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('users_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Doctors fetch result:', { data, error });

      if (error) {
        console.error('Doctors fetch error:', error);
        throw error;
      }
      
      setDoctors(data || []);
      console.log('Doctors set to state:', data?.length || 0, 'items');
    } catch (error: any) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDoctor = async (doctor: Omit<Doctor, 'id' | 'users_id'>) => {
    if (!user) {
      console.error('No user found when adding doctor');
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add doctor",
        variant: "destructive",
      });
      return false;
    }

    console.log('Adding doctor:', doctor);
    console.log('Current user:', user.id);

    try {
      const doctorData = {
        ...doctor,
        users_id: user.id
      };

      console.log('Inserting doctor data:', doctorData);

      const { data, error } = await supabase
        .from('doctors')
        .insert([doctorData])
        .select()
        .single();

      console.log('Doctor insert result:', { data, error });

      if (error) {
        console.error('Doctor insert error:', error);
        throw error;
      }
      
      if (data) {
        setDoctors(prev => {
          const updated = [data, ...prev];
          console.log('Updated doctors state with new item:', updated.length, 'total');
          return updated;
        });
        
        toast({
          title: "Success",
          description: "Doctor added successfully",
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error adding doctor:', error);
      toast({
        title: "Error",
        description: "Failed to add doctor",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    if (!user) {
      console.error('No user found when updating doctor');
      return false;
    }

    console.log('Updating doctor:', id, updates);

    try {
      const { data, error } = await supabase
        .from('doctors')
        .update(updates)
        .eq('id', id)
        .eq('users_id', user.id)
        .select()
        .single();

      console.log('Doctor update result:', { data, error });

      if (error) {
        console.error('Doctor update error:', error);
        throw error;
      }
      
      if (data) {
        setDoctors(prev => prev.map(doc => doc.id === id ? data : doc));
        toast({
          title: "Success",
          description: "Doctor updated successfully",
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error updating doctor:', error);
      toast({
        title: "Error",
        description: "Failed to update doctor",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteDoctor = async (id: string) => {
    if (!user) {
      console.error('No user found when deleting doctor');
      return false;
    }

    console.log('Deleting doctor:', id);

    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id)
        .eq('users_id', user.id);

      console.log('Doctor delete result error:', error);

      if (error) {
        console.error('Doctor delete error:', error);
        throw error;
      }
      
      setDoctors(prev => prev.filter(doc => doc.id !== id));
      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting doctor:', error);
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('Doctors hook effect triggered, user:', user?.id);
    fetchDoctors();

    if (!user) {
      return;
    }

    // Set up real-time subscription for doctors
    const channel = supabase
      .channel('doctors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'doctors',
          filter: `users_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time doctors change:', payload);
          fetchDoctors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    doctors,
    loading,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    refetch: fetchDoctors,
  };
};
