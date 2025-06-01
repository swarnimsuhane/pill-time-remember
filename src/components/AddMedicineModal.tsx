
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Camera, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMedicineModal = ({ isOpen, onClose }: AddMedicineModalProps) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('09:00');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSave = () => {
    if (!medicineName || !dosage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Save medicine to localStorage
    const existingMedicines = JSON.parse(localStorage.getItem('pilltime_medicines') || '[]');
    const newMedicine = {
      id: Date.now(),
      name: medicineName,
      dosage,
      frequency,
      time,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    existingMedicines.push(newMedicine);
    localStorage.setItem('pilltime_medicines', JSON.stringify(existingMedicines));
    
    toast({
      title: "Medicine Added",
      description: `${medicineName} has been added to your schedule.`,
    });
    
    // Reset form
    setMedicineName('');
    setDosage('');
    setFrequency('daily');
    setTime('09:00');
    onClose();
  };

  const handlePhotoCapture = () => {
    toast({
      title: "Camera Feature",
      description: "Photo capture will be available in the next update!",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-pill-navy">Add Medicine</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handlePhotoCapture}
            className="w-full h-20 border-2 border-dashed border-pill-teal bg-pill-light hover:bg-pill-teal/20 text-pill-navy"
            variant="outline"
          >
            <Camera className="w-6 h-6 mr-2" />
            Take Photo of Medicine
          </Button>

          <div>
            <Label htmlFor="medicine-name">Medicine Name *</Label>
            <Input
              id="medicine-name"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g., Vitamin D3"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="dosage">Dosage *</Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 1 tablet, 2 capsules"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="daily">Daily</option>
              <option value="twice-daily">Twice Daily</option>
              <option value="three-times">Three Times Daily</option>
              <option value="weekly">Weekly</option>
              <option value="as-needed">As Needed</option>
            </select>
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-pill-navy hover:bg-pill-navy/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Medicine
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddMedicineModal;
