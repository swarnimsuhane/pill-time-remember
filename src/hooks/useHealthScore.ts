import { useMemo } from 'react';
import { useHydration } from './useHydration';
import { useSymptoms } from './useSymptoms';
import { useMedicines } from './useMedicines';

interface HealthScore {
  score: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  color: string;
  factors: {
    hydration: number;
    medicineAdherence: number;
    symptomFrequency: number;
  };
}

export const useHealthScore = (): HealthScore => {
  const { logs: hydrationLogs } = useHydration();
  const { logs: symptomLogs } = useSymptoms();
  const { medicines } = useMedicines();

  const healthScore = useMemo(() => {
    // Calculate hydration score (0-40 points)
    const today = new Date().toISOString().split('T')[0];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const hydrationScore = (() => {
      const recentHydrationLogs = hydrationLogs.filter(log => 
        last7Days.includes(log.date || '')
      );
      
      if (recentHydrationLogs.length === 0) return 20; // Neutral score if no data
      
      const dailyGoal = 3; // 3L per day
      const averageIntake = recentHydrationLogs.reduce((sum, log) => 
        sum + (log.liters || 0), 0
      ) / recentHydrationLogs.length;
      
      const hydrationPercentage = Math.min(averageIntake / dailyGoal, 1);
      return Math.round(hydrationPercentage * 40);
    })();

    // Calculate medicine adherence score (0-30 points)
    const medicineScore = (() => {
      if (medicines.length === 0) return 30; // Full score if no medicines to track
      
      // For now, assume good adherence if medicines are active
      // In a real app, you'd track actual medicine taking vs scheduled times
      const activeMedicines = medicines.filter(med => med.is_active);
      const adherenceRate = activeMedicines.length / medicines.length;
      return Math.round(adherenceRate * 30);
    })();

    // Calculate symptom frequency score (0-30 points)
    const symptomScore = (() => {
      const recentSymptoms = symptomLogs.filter(log => 
        last7Days.includes(log.date || '')
      );
      
      if (recentSymptoms.length === 0) return 30; // Full score if no symptoms
      
      // More symptoms = lower score
      const symptomsPerWeek = recentSymptoms.length;
      if (symptomsPerWeek === 0) return 30;
      if (symptomsPerWeek <= 2) return 25;
      if (symptomsPerWeek <= 4) return 15;
      if (symptomsPerWeek <= 6) return 10;
      return 5;
    })();

    const totalScore = hydrationScore + medicineScore + symptomScore;

    // Determine rating and color based on total score
    let rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    let color: string;

    if (totalScore >= 85) {
      rating = 'Excellent';
      color = 'text-green-600';
    } else if (totalScore >= 70) {
      rating = 'Good';
      color = 'text-blue-600';
    } else if (totalScore >= 50) {
      rating = 'Fair';
      color = 'text-yellow-600';
    } else {
      rating = 'Poor';
      color = 'text-red-600';
    }

    return {
      score: totalScore,
      rating,
      color,
      factors: {
        hydration: hydrationScore,
        medicineAdherence: medicineScore,
        symptomFrequency: symptomScore,
      },
    };
  }, [hydrationLogs, symptomLogs, medicines]);

  return healthScore;
};