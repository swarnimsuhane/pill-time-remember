
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
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('users_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error: any) {
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert([{ ...doctor, users_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setDoctors(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "Doctor added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add doctor",
        variant: "destructive",
      });
    }
  };

  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('doctors')
        .update(updates)
        .eq('id', id)
        .eq('users_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setDoctors(prev => prev.map(doc => doc.id === id ? data : doc));
      
      toast({
        title: "Success",
        description: "Doctor updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update doctor",
        variant: "destructive",
      });
    }
  };

  const deleteDoctor = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id)
        .eq('users_id', user.id);

      if (error) throw error;
      setDoctors(prev => prev.filter(doc => doc.id !== id));
      
      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
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
