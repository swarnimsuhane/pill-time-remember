
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Pill, Check, Trash2 } from 'lucide-react';
import { useMedicines } from '@/hooks/useMedicines';

interface MedicineCardProps {
  id: string;
  name: string;
  time: string;
  dosage: string;
  taken: boolean;
  onDelete?: () => void;
}

const MedicineCardReal = ({ id, name, time, dosage, taken, onDelete }: MedicineCardProps) => {
  const { updateMedicine } = useMedicines();

  const handleTakeNow = () => {
    updateMedicine(id, { taken: true });
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    } catch {
      return timeString;
    }
  };

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm pill-shadow hover:scale-105 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            taken ? 'bg-green-100' : 'bg-pill-light'
          }`}>
            {taken ? (
              <Check className="w-6 h-6 text-green-600" />
            ) : (
              <Pill className="w-6 h-6 text-pill-navy" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-pill-navy">{name}</h4>
            <p className="text-sm text-pill-navy/70 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(time)} • {dosage}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {taken ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✓ Completed
            </span>
          ) : (
            <Button 
              onClick={handleTakeNow}
              size="sm" 
              className="bg-pill-navy hover:bg-pill-navy/90 text-white"
            >
              Take Now
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MedicineCardReal;
