
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'personal' | 'medical';
}

const ProfileModal = ({ isOpen, onClose, type }: ProfileModalProps) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    age: '',
    email: '',
    phone: ''
  });
  
  const [medicalInfo, setMedicalInfo] = useState({
    conditions: '',
    allergies: '',
    emergencyContact: '',
    bloodType: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Load existing data from localStorage
    const savedPersonal = localStorage.getItem('pilltime_personal_info');
    const savedMedical = localStorage.getItem('pilltime_medical_info');
    
    if (savedPersonal) {
      setPersonalInfo(JSON.parse(savedPersonal));
    }
    if (savedMedical) {
      setMedicalInfo(JSON.parse(savedMedical));
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    if (type === 'personal') {
      localStorage.setItem('pilltime_personal_info', JSON.stringify(personalInfo));
      toast({
        title: "Profile Updated",
        description: "Your personal information has been saved.",
      });
    } else {
      localStorage.setItem('pilltime_medical_info', JSON.stringify(medicalInfo));
      toast({
        title: "Medical History Updated",
        description: "Your medical information has been saved.",
      });
    }
    onClose();
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateMedicalInfo = (field: string, value: string) => {
    setMedicalInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-4 sm:p-6 bg-white max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-pill-navy">
            {type === 'personal' ? 'Personal Information' : 'Medical History'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {type === 'personal' ? (
            <>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={personalInfo.age}
                  onChange={(e) => updatePersonalInfo('age', e.target.value)}
                  placeholder="Enter your age"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="conditions">Medical Conditions</Label>
                <textarea
                  id="conditions"
                  value={medicalInfo.conditions}
                  onChange={(e) => updateMedicalInfo('conditions', e.target.value)}
                  placeholder="List any medical conditions"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md h-20 resize-none"
                />
              </div>
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <textarea
                  id="allergies"
                  value={medicalInfo.allergies}
                  onChange={(e) => updateMedicalInfo('allergies', e.target.value)}
                  placeholder="List any allergies"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md h-20 resize-none"
                />
              </div>
              <div>
                <Label htmlFor="blood-type">Blood Type</Label>
                <select
                  id="blood-type"
                  value={medicalInfo.bloodType}
                  onChange={(e) => updateMedicalInfo('bloodType', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <Label htmlFor="emergency-contact">Emergency Contact</Label>
                <Input
                  id="emergency-contact"
                  value={medicalInfo.emergencyContact}
                  onChange={(e) => updateMedicalInfo('emergencyContact', e.target.value)}
                  placeholder="Emergency contact number"
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-pill-navy hover:bg-pill-navy/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileModal;
