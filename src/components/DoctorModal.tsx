
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, UserPlus, Phone, Calendar, Stethoscope, Trash2 } from 'lucide-react';
import { useDoctors } from '@/hooks/useDoctors';

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DoctorModal = ({ isOpen, onClose }: DoctorModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    contact: '',
    appointment_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { doctors, addDoctor, deleteDoctor } = useDoctors();

  console.log('DoctorModal render - isOpen:', isOpen, 'doctors:', doctors?.length || 0);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Doctor form submission:', formData);
    
    if (!formData.name.trim() || !formData.speciality.trim()) {
      console.error('Doctor form validation failed');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await addDoctor({
        name: formData.name,
        speciality: formData.speciality,
        contact: formData.contact,
        appointment_date: formData.appointment_date || null
      });
      
      console.log('Doctor add result:', success);
      
      if (success) {
        setFormData({ name: '', speciality: '', contact: '', appointment_date: '' });
      }
    } catch (error) {
      console.error('Error in doctor form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Deleting doctor:', id);
    if (confirm('Are you sure you want to delete this doctor?')) {
      await deleteDoctor(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-2xl bg-white max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pill-teal rounded-full flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-4 h-4 sm:w-6 sm:h-6 text-pill-navy" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-pill-navy truncate">Manage Doctors</h3>
              <p className="text-xs sm:text-sm text-pill-navy/70 hidden sm:block">Add and manage your healthcare providers</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Add New Doctor Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-pill-navy text-sm sm:text-base">Add New Doctor</h4>
            
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="doctorName">Doctor Name *</Label>
                <Input
                  id="doctorName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. Smith"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="speciality">Speciality *</Label>
                <Input
                  id="speciality"
                  value={formData.speciality}
                  onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                  placeholder="Cardiologist, General Physician, etc."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div>
                <Label htmlFor="appointmentDate">Next Appointment</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.name.trim() || !formData.speciality.trim()}
              className="bg-pill-navy hover:bg-pill-navy/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Doctor'}
            </Button>
          </form>

          {/* Doctors List */}
          <div>
            <h4 className="font-semibold text-pill-navy mb-4">Your Doctors ({doctors.length})</h4>
            
            {doctors.length > 0 ? (
              <div className="space-y-3">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Stethoscope className="w-4 h-4 text-pill-navy" />
                          <h5 className="font-semibold text-pill-navy">{doctor.name}</h5>
                        </div>
                        
                        <p className="text-sm text-pill-navy/70 mb-1">{doctor.speciality}</p>
                        
                        {doctor.contact && (
                          <div className="flex items-center gap-1 text-sm text-pill-navy/60 mb-1">
                            <Phone className="w-3 h-3" />
                            <span>{doctor.contact}</span>
                          </div>
                        )}
                        
                        {doctor.appointment_date && (
                          <div className="flex items-center gap-1 text-sm text-pill-navy/60">
                            <Calendar className="w-3 h-3" />
                            <span>Next appointment: {new Date(doctor.appointment_date).toLocaleDateString('en-IN')}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doctor.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserPlus className="w-12 h-12 text-pill-navy/30 mx-auto mb-3" />
                <p className="text-pill-navy/70">No doctors added yet</p>
                <p className="text-sm text-pill-navy/50">Add your first doctor using the form above</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DoctorModal;
