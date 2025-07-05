
import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Bell, Heart, Droplets, Activity, Pill } from 'lucide-react';
import { useMedicines } from '@/hooks/useMedicines';

const UpcomingReminders = () => {
  const { medicines, loading } = useMedicines();

  console.log('UpcomingReminders render - medicines:', medicines?.length || 0, 'loading:', loading);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const getUpcomingMedicines = () => {
    if (loading || !medicines?.length) {
      console.log('No medicines available or still loading');
      return [];
    }

    const currentTimeMinutes = getCurrentTime();
    const upcomingMedicines: Array<{ name: string; time: string; color: string; icon: any; medicine: string }> = [];

    medicines.forEach(medicine => {
      medicine.time_slots.forEach(timeSlot => {
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const medicineTimeMinutes = hours * 60 + minutes;
        
        // Show medicines for the next 4 hours
        if (medicineTimeMinutes >= currentTimeMinutes && medicineTimeMinutes <= currentTimeMinutes + 240) {
          upcomingMedicines.push({
            name: medicine.name,
            time: formatTime(timeSlot),
            color: 'bg-pill-teal/20',
            icon: Pill,
            medicine: medicine.dosage || 'Take as prescribed'
          });
        }
      });
    });

    console.log('Upcoming medicines calculated:', upcomingMedicines.length);
    return upcomingMedicines.slice(0, 3);
  };

  const upcomingMedicines = getUpcomingMedicines();

  // Default health reminders when no medicines are upcoming
  const defaultReminders = [
    { name: 'Drink Water', time: '2:00 PM', color: 'bg-blue-100', icon: Droplets, medicine: 'Stay hydrated' },
    { name: 'Evening Exercise', time: '6:00 PM', color: 'bg-green-100', icon: Activity, medicine: 'Light activity' },
    { name: 'Health Check-in', time: '9:00 PM', color: 'bg-purple-100', icon: Heart, medicine: 'Review symptoms' },
  ];

  const reminders = upcomingMedicines.length > 0 ? upcomingMedicines : defaultReminders;

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-pill-navy" />
        <h3 className="text-xl font-semibold text-pill-navy font-montserrat">
          Health Reminders
        </h3>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-pill-navy border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder, index) => {
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
                  <p className="text-xs text-pill-navy/60">{reminder.medicine}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-pill-teal/20 to-pill-gold/20 rounded-lg">
        <p className="text-sm text-pill-navy font-medium mb-2">💡 Health Tip</p>
        <p className="text-sm text-pill-navy/80">
          {upcomingMedicines.length > 0 
            ? `You have ${upcomingMedicines.length} medicine reminder${upcomingMedicines.length > 1 ? 's' : ''} coming up. Stay consistent with your medication schedule.`
            : 'Stay hydrated throughout the day and track your symptoms to maintain optimal health.'
          }
        </p>
      </div>
    </Card>
  );
};

export default UpcomingReminders;
