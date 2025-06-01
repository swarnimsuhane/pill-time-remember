
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, UserCheck, Phone, Calendar, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Doctor {
  id: string;
  name: string;
  speciality: string;
  contact: string;
  appointmentDate: string;
}

const DoctorModal = ({ isOpen, onClose }: DoctorModalProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    speciality: '',
    contact: '',
    appointmentDate: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load existing doctors from localStorage
    const savedDoctors = localStorage.getItem('pilltime_doctors');
    if (savedDoctors) {
      setDoctors(JSON.parse(savedDoctors));
    }
  }, []);

  if (!isOpen) return null;

  const handleAddDoctor = () => {
    if (!newDoctor.name || !newDoctor.speciality || !newDoctor.contact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const doctor: Doctor = {
      id: Date.now().toString(),
      ...newDoctor
    };

    const updatedDoctors = [...doctors, doctor];
    setDoctors(updatedDoctors);
    localStorage.setItem('pilltime_doctors', JSON.stringify(updatedDoctors));
    
    setNewDoctor({
      name: '',
      speciality: '',
      contact: '',
      appointmentDate: ''
    });

    toast({
      title: "Doctor Added",
      description: `Dr. ${newDoctor.name} has been added to your healthcare team`,
    });
  };

  const handleRemoveDoctor = (id: string) => {
    const updatedDoctors = doctors.filter(doctor => doctor.id !== id);
    setDoctors(updatedDoctors);
    localStorage.setItem('pilltime_doctors', JSON.stringify(updatedDoctors));
    
    toast({
      title: "Doctor Removed",
      description: "Doctor has been removed from your list",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-pill-navy">Healthcare Team</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Add New Doctor Form */}
        <div className="space-y-4 p-4 bg-pill-light rounded-lg mb-6">
          <h4 className="font-semibold text-pill-navy mb-3">Add New Doctor</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doctor-name">Doctor Name</Label>
              <Input
                id="doctor-name"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Dr. John Smith"
              />
            </div>
            <div>
              <Label htmlFor="speciality">Speciality</Label>
              <Input
                id="speciality"
                value={newDoctor.speciality}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, speciality: e.target.value }))}
                placeholder="e.g., Cardiologist, General Physician"
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={newDoctor.contact}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="appointment-date">Next Appointment (Optional)</Label>
              <Input
                id="appointment-date"
                type="date"
                value={newDoctor.appointmentDate}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, appointmentDate: e.target.value }))}
              />
            </div>
          </div>
          <Button 
            onClick={handleAddDoctor}
            className="bg-pill-navy hover:bg-pill-navy/90 w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        </div>

        {/* Doctors List */}
        <div className="space-y-4">
          <h4 className="font-semibold text-pill-navy">Your Healthcare Team</h4>
          {doctors.length === 0 ? (
            <p className="text-pill-navy/70 text-center py-8">No doctors added yet</p>
          ) : (
            <div className="grid gap-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="p-4 bg-white border border-pill-teal rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-pill-teal rounded-full flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-pill-navy" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-pill-navy text-lg">{doctor.name}</h5>
                        <p className="text-pill-navy/70 mb-2">{doctor.speciality}</p>
                        <div className="flex items-center gap-4 text-sm text-pill-navy/70">
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{doctor.contact}</span>
                          </div>
                          {doctor.appointmentDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Next: {new Date(doctor.appointmentDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDoctor(doctor.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-pill-navy hover:bg-pill-navy/90">
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DoctorModal;
