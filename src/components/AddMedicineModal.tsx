import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useMedicines, Medicine } from '@/hooks/useMedicines';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMedicine?: Medicine | null;
}

const AddMedicineModal = ({ isOpen, onClose, editMedicine }: AddMedicineModalProps) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addMedicine, updateMedicine } = useMedicines();

  // Populate form when editing
  React.useEffect(() => {
    if (editMedicine) {
      setName(editMedicine.name);
      setDosage(editMedicine.dosage || '');
      setFrequency(editMedicine.frequency);
      setTimeSlots(editMedicine.time_slots);
      setNotes(editMedicine.notes || '');
    }
  }, [editMedicine]);

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Weekly',
    'Monthly'
  ];

  const addTimeSlot = () => {
    if (newTimeSlot && !timeSlots.includes(newTimeSlot)) {
      setTimeSlots([...timeSlots, newTimeSlot]);
      setNewTimeSlot('');
    }
  };

  const removeTimeSlot = (timeSlot: string) => {
    setTimeSlots(timeSlots.filter(slot => slot !== timeSlot));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !frequency || timeSlots.length === 0) return;

    setIsSubmitting(true);
    let success;
    
    if (editMedicine) {
      success = await updateMedicine(editMedicine.id, {
        name,
        dosage: dosage || undefined,
        frequency,
        time_slots: timeSlots,
        notes: notes || undefined,
      });
    } else {
      success = await addMedicine({
        name,
        dosage: dosage || undefined,
        frequency,
        time_slots: timeSlots,
        notes: notes || undefined,
        is_active: true
      });
    }

    if (success) {
      setName('');
      setDosage('');
      setFrequency('');
      setTimeSlots([]);
      setNotes('');
      onClose();
    }
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setName('');
    setDosage('');
    setFrequency('');
    setTimeSlots([]);
    setNewTimeSlot('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-pill-navy">
            {editMedicine ? 'Edit Medicine Schedule' : 'Add Medicine Schedule'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Medicine Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter medicine name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 1 tablet, 5ml, 500mg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency *</Label>
            <Select value={frequency} onValueChange={setFrequency} required>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Slots *</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="time"
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                placeholder="Select time"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addTimeSlot}
                variant="outline"
                size="sm"
                disabled={!newTimeSlot}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2 sm:mr-0" />
                <span className="sm:hidden">Add Time</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {timeSlots.map((timeSlot) => (
                <Badge
                  key={timeSlot}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {timeSlot}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeTimeSlot(timeSlot)}
                  />
                </Badge>
              ))}
            </div>
            {timeSlots.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add at least one time slot for your medicine schedule
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes (e.g., take with food, before meals)"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name || !frequency || timeSlots.length === 0 || isSubmitting}
              className="flex-1 bg-pill-navy hover:bg-pill-navy/90 order-1 sm:order-2"
            >
              {isSubmitting ? (editMedicine ? 'Updating...' : 'Adding...') : (editMedicine ? 'Update Medicine' : 'Add Medicine')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicineModal;