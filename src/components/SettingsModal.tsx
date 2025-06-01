
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Bell, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'notifications' | 'timezone';
}

const SettingsModal = ({ isOpen, onClose, type }: SettingsModalProps) => {
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [reminderSound, setReminderSound] = useState('default');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSave = () => {
    if (type === 'notifications') {
      // Save notification preferences
      localStorage.setItem('pilltime_notifications', JSON.stringify({
        time: notificationTime,
        sound: reminderSound,
        enabled: true
      }));
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      });
    } else {
      // Save timezone preferences
      localStorage.setItem('pilltime_timezone', timezone);
      toast({
        title: "Timezone Updated",
        description: `Timezone set to ${timezone}`,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-pill-navy">
            {type === 'notifications' ? 'Notification Settings' : 'Timezone Settings'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {type === 'notifications' ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="reminder-time">Default Reminder Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="reminder-sound">Reminder Sound</Label>
              <select
                id="reminder-sound"
                value={reminderSound}
                onChange={(e) => setReminderSound(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="default">Default</option>
                <option value="gentle">Gentle Bell</option>
                <option value="chime">Soft Chime</option>
                <option value="tone">Alert Tone</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="timezone">Select Timezone</Label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="UTC">UTC</option>
                <option value="Asia/Dubai">UAE Time</option>
                <option value="Europe/London">GMT</option>
                <option value="America/New_York">Eastern Time</option>
              </select>
            </div>
            <p className="text-sm text-gray-600">
              Current time in selected timezone: {new Date().toLocaleString('en-US', { timeZone: timezone })}
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-pill-navy hover:bg-pill-navy/90">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsModal;
