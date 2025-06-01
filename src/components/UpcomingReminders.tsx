
import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Bell } from 'lucide-react';

const UpcomingReminders = () => {
  const upcomingMeds = [
    { name: 'Calcium', time: '8:00 PM', color: 'bg-blue-100' },
    { name: 'Vitamin D3', time: '9:00 AM (Tomorrow)', color: 'bg-yellow-100' },
    { name: 'Iron', time: '12:00 PM (Tomorrow)', color: 'bg-red-100' },
  ];

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-pill-navy" />
        <h3 className="text-xl font-semibold text-pill-navy font-montserrat">
          Upcoming Reminders
        </h3>
      </div>
      
      <div className="space-y-4">
        {upcomingMeds.map((med, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-pill-light/50 hover:bg-pill-light transition-colors duration-200"
          >
            <div className={`w-10 h-10 ${med.color} rounded-full flex items-center justify-center`}>
              <Clock className="w-5 h-5 text-pill-navy" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-pill-navy">{med.name}</p>
              <p className="text-sm text-pill-navy/70">{med.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-pill-teal/20 to-pill-gold/20 rounded-lg">
        <p className="text-sm text-pill-navy font-medium mb-2">💡 Health Tip</p>
        <p className="text-sm text-pill-navy/80">
          Take your medicines with water to improve absorption and reduce stomach irritation.
        </p>
      </div>
    </Card>
  );
};

export default UpcomingReminders;
