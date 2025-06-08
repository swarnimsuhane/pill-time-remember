import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Pill, Trash2, Edit } from 'lucide-react';
import { Medicine } from '@/hooks/useMedicines';

interface MedicineCardProps {
  medicine: Medicine;
  onEdit?: (medicine: Medicine) => void;
  onDelete?: (id: string) => void;
}

const MedicineCard = ({ medicine, onEdit, onDelete }: MedicineCardProps) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm pill-shadow hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pill-teal rounded-full flex items-center justify-center">
            <Pill className="w-5 h-5 text-pill-navy" />
          </div>
          <div>
            <h3 className="font-semibold text-pill-navy text-lg">{medicine.name}</h3>
            {medicine.dosage && (
              <p className="text-pill-navy/70 text-sm">{medicine.dosage}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(medicine)}
              className="text-pill-navy hover:bg-pill-light"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(medicine.id)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Badge variant="outline" className="mb-2">
            {medicine.frequency}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-pill-navy/80">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Schedule:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {medicine.time_slots.map((timeSlot, index) => (
              <Badge
                key={index}
                className="bg-pill-light text-pill-navy hover:bg-pill-light/80"
              >
                {formatTime(timeSlot)}
              </Badge>
            ))}
          </div>
        </div>

        {medicine.notes && (
          <div className="mt-3 p-3 bg-pill-light/30 rounded-lg">
            <p className="text-sm text-pill-navy/80">
              <span className="font-medium">Notes:</span> {medicine.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MedicineCard;