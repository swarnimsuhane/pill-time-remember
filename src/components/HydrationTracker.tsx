
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Droplets, Plus } from 'lucide-react';
import { useHydration } from '@/hooks/useHydration';

interface HydrationTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

const HydrationTracker = ({ isOpen, onClose }: HydrationTrackerProps) => {
  const [amount, setAmount] = useState('0.25');
  const { logs, addLog } = useHydration();

  if (!isOpen) return null;

  const todaysLog = logs.find(log => log.date === new Date().toISOString().split('T')[0]);
  const todaysTotal = todaysLog?.liters || 0;
  const dailyGoal = 3; // 3 liters daily goal

  const quickAmounts = [0.25, 0.5, 1, 1.5];

  const handleAddWater = async (liters: number) => {
    await addLog(liters);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pill-navy">Hydration Tracker</h3>
              <p className="text-sm text-pill-navy/70">Track your daily water intake</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{todaysTotal.toFixed(1)}L</div>
            <div className="text-sm text-pill-navy/70">of {dailyGoal}L daily goal</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((todaysTotal / dailyGoal) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-pill-navy/50 mt-1">
              {Math.round((todaysTotal / dailyGoal) * 100)}% complete
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div>
            <h4 className="font-semibold text-pill-navy mb-3">Quick Add</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleAddWater(amount)}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {amount}L
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <h4 className="font-semibold text-pill-navy mb-3">Custom Amount</h4>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Liters"
                className="flex-1"
              />
              <Button 
                onClick={() => {
                  const liters = parseFloat(amount);
                  if (liters > 0) {
                    handleAddWater(liters);
                    setAmount('0.25');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Recent Logs */}
          {logs.length > 0 && (
            <div>
              <h4 className="font-semibold text-pill-navy mb-3">Recent Logs</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex justify-between text-sm">
                    <span className="text-pill-navy/70">{log.date}</span>
                    <span className="font-medium text-blue-600">{log.liters}L</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HydrationTracker;
