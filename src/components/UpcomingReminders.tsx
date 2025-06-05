
import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Bell, Heart, Droplets, Activity } from 'lucide-react';

const UpcomingReminders = () => {
  const healthReminders = [
    { name: 'Drink Water', time: '2:00 PM', color: 'bg-blue-100', icon: Droplets },
    { name: 'Evening Exercise', time: '6:00 PM', color: 'bg-green-100', icon: Activity },
    { name: 'Health Check-in', time: '9:00 PM', color: 'bg-purple-100', icon: Heart },
  ];

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-pill-navy" />
        <h3 className="text-xl font-semibold text-pill-navy font-montserrat">
          Health Reminders
        </h3>
      </div>
      
      <div className="space-y-4">
        {healthReminders.map((reminder, index) => {
          const IconComponent = reminder.icon;
          return (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-pill-light/50 hover:bg-pill-light transition-colors duration-200"
            >
              <div className={`w-10 h-10 ${reminder.color} rounded-full flex items-center justify-center`}>
                <IconComponent className="w-5 h-5 text-pill-navy" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-pill-navy">{reminder.name}</p>
                <p className="text-sm text-pill-navy/70">{reminder.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-pill-teal/20 to-pill-gold/20 rounded-lg">
        <p className="text-sm text-pill-navy font-medium mb-2">💡 Health Tip</p>
        <p className="text-sm text-pill-navy/80">
          Stay hydrated throughout the day and track your symptoms to maintain optimal health.
        </p>
      </div>
    </Card>
  );
};

export default UpcomingReminders;
