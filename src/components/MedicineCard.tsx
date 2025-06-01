
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Check, AlertCircle } from 'lucide-react';

interface MedicineCardProps {
  name: string;
  time: string;
  dosage: string;
  status: 'pending' | 'taken' | 'missed';
}

const MedicineCard = ({ name, time, dosage, status }: MedicineCardProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'taken':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'missed':
        return <AlertCircle className="w-5 h-5 text-pill-red" />;
      default:
        return <Clock className="w-5 h-5 text-pill-navy" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'taken':
        return 'bg-green-50 border-green-200';
      case 'missed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-pill-light border-pill-teal';
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 hover:scale-102 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pill-shadow">
            <div className="w-6 h-6 bg-gradient-to-t from-pill-red to-white rounded-full border border-pill-navy"></div>
          </div>
          
          <div>
            <h4 className="font-semibold text-pill-navy">{name}</h4>
            <p className="text-sm text-pill-navy/70">{dosage}</p>
            <div className="flex items-center gap-1 mt-1">
              {getStatusIcon()}
              <span className="text-sm text-pill-navy/70">{time}</span>
            </div>
          </div>
        </div>

        {status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-pill-navy hover:bg-pill-navy/90 text-white"
            >
              Take Now
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white"
            >
              Skip
            </Button>
          </div>
        )}

        {status === 'taken' && (
          <div className="text-sm text-green-600 font-medium">
            ✓ Completed
          </div>
        )}

        {status === 'missed' && (
          <div className="text-sm text-pill-red font-medium">
            ⚠ Missed
          </div>
        )}
      </div>
    </Card>
  );
};

export default MedicineCard;
