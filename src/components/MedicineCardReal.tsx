
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Pill, Check, Trash2 } from 'lucide-react';
import { useMedicines } from '@/hooks/useMedicines';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const handleTakeNow = async () => {
    try {
      await updateMedicine(id, { taken: true });
    } catch (error) {
      console.error('Failed to update medicine:', error);
    }
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
    <Card className={`${isMobile ? 'p-3' : 'p-4'} bg-white/90 backdrop-blur-sm pill-shadow hover:scale-105 transition-all duration-200`}>
      <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
        <div className={`flex items-center ${isMobile ? 'gap-2 w-full' : 'gap-3'}`}>
          <div className={`rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'} ${
            taken ? 'bg-green-100' : 'bg-pill-light'
          }`}>
            {taken ? (
              <Check className={`text-green-600 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            ) : (
              <Pill className={`text-pill-navy ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold text-pill-navy ${isMobile ? 'text-sm' : ''}`}>{name}</h4>
            <p className={`text-pill-navy/70 flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <Clock className="w-3 h-3" />
              {formatTime(time)} • {dosage}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center ${isMobile ? 'gap-1 w-full justify-between' : 'gap-2'}`}>
          {taken ? (
            <span className={`bg-green-100 text-green-700 rounded-full font-medium ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'}`}>
              ✓ Completed
            </span>
          ) : (
            <Button 
              onClick={handleTakeNow}
              size={isMobile ? 'sm' : 'sm'}
              className="bg-pill-navy hover:bg-pill-navy/90 text-white"
            >
              {isMobile ? 'Take' : 'Take Now'}
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
