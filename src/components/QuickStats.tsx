
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Calendar, Clock, Heart } from 'lucide-react';

const QuickStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pill-teal rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-pill-navy" />
          </div>
          <div>
            <p className="text-sm text-pill-navy/70">Today</p>
            <p className="text-2xl font-bold text-pill-navy">3/4</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-pill-navy/70">This Week</p>
            <p className="text-2xl font-bold text-pill-navy">85%</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-pill-navy/70">Next Dose</p>
            <p className="text-2xl font-bold text-pill-navy">8PM</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pill-red/20 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-pill-red" />
          </div>
          <div>
            <p className="text-sm text-pill-navy/70">Streak</p>
            <p className="text-2xl font-bold text-pill-navy">7d</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickStats;
