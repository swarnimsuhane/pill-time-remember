
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { useSymptoms } from '@/hooks/useSymptoms';

interface SymptomCheckerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SymptomChecker = ({ isOpen, onClose }: SymptomCheckerProps) => {
  const [symptoms, setSymptoms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logs, addLog } = useSymptoms();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!symptoms.trim()) return;

    setIsSubmitting(true);
    await addLog(symptoms);
    setSymptoms('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-2xl bg-white max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-pill-navy truncate">Symptom Checker</h3>
              <p className="text-xs sm:text-sm text-pill-navy/70 hidden sm:block">Track and get suggestions for your symptoms</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Add New Symptom */}
          <div>
            <h4 className="font-semibold text-pill-navy mb-3">Describe Your Symptoms</h4>
            <Textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe how you're feeling... (e.g., headache, fever, cough, stomach pain)"
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleSubmit}
              disabled={!symptoms.trim() || isSubmitting}
              className="mt-3 bg-pill-navy hover:bg-pill-navy/90"
            >
              {isSubmitting ? 'Analyzing...' : 'Get Suggestions'}
            </Button>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Important Notice</p>
                <p className="text-yellow-700 mt-1">
                  This tool provides basic suggestions only. For serious symptoms or medical emergencies, 
                  please consult a healthcare professional immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Symptom Logs */}
          {logs.length > 0 && (
            <div>
              <h4 className="font-semibold text-pill-navy mb-3">Recent Symptom Logs</h4>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="text-sm text-pill-navy/70">{log.date}</div>
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    </div>
                    <div className="mb-3">
                      <p className="font-medium text-pill-navy mb-1">Symptoms:</p>
                      <p className="text-sm text-pill-navy/80">{log.symptoms}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="font-medium text-green-800 text-sm mb-1">Suggestions:</p>
                      <p className="text-sm text-green-700">{log.suggestions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {logs.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-pill-navy/30 mx-auto mb-3" />
              <p className="text-pill-navy/70">No symptom logs yet</p>
              <p className="text-sm text-pill-navy/50">Start by describing your symptoms above</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SymptomChecker;
