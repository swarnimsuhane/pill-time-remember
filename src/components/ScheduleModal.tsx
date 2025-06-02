
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Clock, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMedicines } from '@/hooks/useMedicines';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal = ({ isOpen, onClose }: ScheduleModalProps) => {
  const [newSchedule, setNewSchedule] = useState({
    medicine: '',
    time: '',
    dosage: '',
    frequency: 'daily'
  });
  const { toast } = useToast();
  const { medicines, addMedicine, deleteMedicine } = useMedicines();

  if (!isOpen) return null;

  const handleAddSchedule = async () => {
    if (!newSchedule.medicine || !newSchedule.time || !newSchedule.dosage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    await addMedicine({
      name: newSchedule.medicine,
      time: newSchedule.time,
      dosage: newSchedule.dosage,
      date: today,
      taken: false
    });

    setNewSchedule({
      medicine: '',
      time: '',
      dosage: '',
      frequency: 'daily'
    });

    toast({
      title: "Medicine Added",
      description: `${newSchedule.medicine} has been added to your schedule`,
    });
  };

  const handleRemoveSchedule = async (id: string) => {
    await deleteMedicine(id);
  };

  const handleSaveAll = () => {
    toast({
      title: "Schedules Saved",
      description: `Your medication schedule has been saved successfully`,
    });
    onClose();
  };

  // Get today's medicines for display
  const today = new Date().toISOString().split('T')[0];
  const todaysMedicines = medicines.filter(med => med.date === today);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-pill-navy">Medication Schedule</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Add New Schedule Form */}
        <div className="space-y-4 p-4 bg-pill-light rounded-lg mb-6">
          <h4 className="font-semibold text-pill-navy mb-3">Add New Schedule</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="medicine">Medicine Name</Label>
              <Input
                id="medicine"
                value={newSchedule.medicine}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, medicine: e.target.value }))}
                placeholder="Enter medicine name"
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newSchedule.time}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={newSchedule.dosage}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 1 tablet, 2 capsules"
              />
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <select
                id="frequency"
                value={newSchedule.frequency}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="daily">Daily</option>
                <option value="twice-daily">Twice Daily</option>
                <option value="three-times">Three Times Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>
          </div>
          <Button 
            onClick={handleAddSchedule}
            className="bg-pill-navy hover:bg-pill-navy/90 w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Schedule
          </Button>
        </div>

        {/* Current Schedules */}
        <div className="space-y-4">
          <h4 className="font-semibold text-pill-navy">Current Schedules</h4>
          {todaysMedicines.length === 0 ? (
            <p className="text-pill-navy/70 text-center py-8">No medicines scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {todaysMedicines.map((medicine) => (
                <div key={medicine.id} className="flex items-center justify-between p-4 bg-white border border-pill-teal rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-pill-teal rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-pill-navy" />
                    </div>
                    <div>
                      <h5 className="font-medium text-pill-navy">{medicine.name}</h5>
                      <p className="text-sm text-pill-navy/70">
                        {medicine.dosage} at {medicine.time} (daily)
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSchedule(medicine.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSaveAll} className="flex-1 bg-pill-navy hover:bg-pill-navy/90">
            Save All Schedules
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ScheduleModal;
