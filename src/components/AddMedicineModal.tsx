
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useMedicines, Medicine } from '@/hooks/useMedicines';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  // Populate form when editing
  React.useEffect(() => {
    console.log('Modal opened/closed. isOpen:', isOpen, 'editMedicine:', editMedicine);
    if (editMedicine) {
      setName(editMedicine.name);
      setDosage(editMedicine.dosage || '');
      setFrequency(editMedicine.frequency);
      setTimeSlots(editMedicine.time_slots);
      setNotes(editMedicine.notes || '');
    } else {
      // Reset form when not editing
      setName('');
      setDosage('');
      setFrequency('');
      setTimeSlots([]);
      setNotes('');
    }
  }, [editMedicine, isOpen]);

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
    console.log('Adding time slot:', newTimeSlot);
    console.log('Current time slots:', timeSlots);
    
    if (newTimeSlot && !timeSlots.includes(newTimeSlot)) {
      const updatedTimeSlots = [...timeSlots, newTimeSlot];
      setTimeSlots(updatedTimeSlots);
      setNewTimeSlot('');
      console.log('Updated time slots:', updatedTimeSlots);
    } else {
      console.log('Time slot not added - either empty or already exists');
    }
  };

  const removeTimeSlot = (timeSlot: string) => {
    console.log('Removing time slot:', timeSlot);
    const updatedTimeSlots = timeSlots.filter(slot => slot !== timeSlot);
    setTimeSlots(updatedTimeSlots);
    console.log('Time slots after removal:', updatedTimeSlots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION START ===');
    console.log('Event prevented default:', e.defaultPrevented);
    console.log('User:', user?.id);
    console.log('User object:', user);
    console.log('Form data:', { 
      name: name.trim(), 
      dosage: dosage.trim(), 
      frequency, 
      timeSlots: timeSlots.length,
      timeSlotsList: timeSlots,
      notes: notes.trim()
    });
    
    // Validation checks with detailed logging
    if (!user) {
      console.error('❌ VALIDATION FAILED: No user found during form submission');
      return;
    }
    
    if (!name.trim()) {
      console.error('❌ VALIDATION FAILED: Medicine name is required');
      return;
    }
    
    if (!frequency) {
      console.error('❌ VALIDATION FAILED: Frequency is required');
      return;
    }
    
    if (timeSlots.length === 0) {
      console.error('❌ VALIDATION FAILED: At least one time slot is required');
      return;
    }

    console.log('✅ All validations passed, proceeding with submission');
    setIsSubmitting(true);
    
    try {
      const medicineData = {
        name: name.trim(),
        dosage: dosage.trim() || undefined,
        frequency,
        time_slots: timeSlots,
        notes: notes.trim() || undefined,
        is_active: true
      };
      
      console.log('📤 Submitting medicine data:', medicineData);
      
      let success;
      if (editMedicine) {
        console.log('📝 Updating existing medicine:', editMedicine.id);
        success = await updateMedicine(editMedicine.id, medicineData);
      } else {
        console.log('➕ Adding new medicine');
        success = await addMedicine(medicineData);
      }

      console.log('📋 Operation result:', success);
      
      if (success) {
        console.log('✅ Medicine operation successful, closing modal');
        resetForm();
        onClose();
      } else {
        console.error('❌ Medicine operation failed');
      }
    } catch (error) {
      console.error('💥 Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
      console.log('=== FORM SUBMISSION END ===');
    }
  };

  const resetForm = () => {
    console.log('🔄 Resetting form');
    setName('');
    setDosage('');
    setFrequency('');
    setTimeSlots([]);
    setNotes('');
    setNewTimeSlot('');
  };

  const handleClose = () => {
    console.log('🚪 Modal closing');
    resetForm();
    onClose();
  };

  // Enhanced validation check
  const canSubmit = () => {
    const validation = {
      hasName: name.trim().length > 0,
      hasFrequency: frequency.length > 0,
      hasTimeSlots: timeSlots.length > 0,
      hasUser: !!user,
      isNotSubmitting: !isSubmitting
    };
    
    console.log('🔍 Form validation check:', validation);
    
    return validation.hasName && validation.hasFrequency && validation.hasTimeSlots && validation.hasUser && validation.isNotSubmitting;
  };

  const submitButtonEnabled = canSubmit();
  console.log('🔘 Submit button enabled:', submitButtonEnabled);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-pill-navy">
            {editMedicine ? 'Edit Medicine Schedule' : 'Add Medicine Schedule'}
          </DialogTitle>
          <DialogDescription>
            {editMedicine 
              ? 'Update your medicine schedule with the correct timing and dosage information.' 
              : 'Create a new medicine schedule with timing and dosage information to help you stay on track with your medication.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Medicine Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                console.log('Name changed:', e.target.value);
                setName(e.target.value);
              }}
              placeholder="Enter medicine name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => {
                console.log('Dosage changed:', e.target.value);
                setDosage(e.target.value);
              }}
              placeholder="e.g., 1 tablet, 5ml, 500mg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency *</Label>
            <Select value={frequency} onValueChange={(value) => {
              console.log('Frequency changed:', value);
              setFrequency(value);
            }} required>
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
                onChange={(e) => {
                  console.log('New time slot changed:', e.target.value);
                  setNewTimeSlot(e.target.value);
                }}
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
              onChange={(e) => {
                console.log('Notes changed:', e.target.value);
                setNotes(e.target.value);
              }}
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
              disabled={!submitButtonEnabled}
              className="flex-1 bg-pill-navy hover:bg-pill-navy/90 order-1 sm:order-2"
              onClick={(e) => {
                console.log('🔘 Submit button clicked!', {
                  submitButtonEnabled,
                  isSubmitting,
                  formData: { name, frequency, timeSlots }
                });
              }}
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
