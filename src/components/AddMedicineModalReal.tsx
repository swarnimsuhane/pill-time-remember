
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useMedicines } from '@/hooks/useMedicines';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMedicineModalReal = ({ isOpen, onClose }: AddMedicineModalProps) => {
  const [medicine, setMedicine] = useState({
    name: '',
    dosage: '',
    time: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { addMedicine } = useMedicines();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with medicine:', medicine);
    
    if (!medicine.name || !medicine.dosage || !medicine.time) {
      console.log('Missing required fields:', { 
        name: medicine.name, 
        dosage: medicine.dosage, 
        time: medicine.time 
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to add medicine...');
      await addMedicine({
        ...medicine,
        taken: false,
      });
      
      console.log('Medicine added successfully');
      // Reset form
      setMedicine({
        name: '',
        dosage: '',
        time: '',
        date: new Date().toISOString().split('T')[0],
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding medicine:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-pill-navy">Add Medicine</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <Label htmlFor="medicine-name">Medicine Name</Label>
              <Input
                id="medicine-name"
                value={medicine.name}
                onChange={(e) => setMedicine(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter medicine name"
                required
              />
            </div>

            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={medicine.dosage}
                onChange={(e) => setMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 1 tablet, 5ml"
                required
              />
            </div>

            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={medicine.time}
                onChange={(e) => setMedicine(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={medicine.date}
                onChange={(e) => setMedicine(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-pill-navy hover:bg-pill-navy/90"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Medicine"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AddMedicineModalReal;
