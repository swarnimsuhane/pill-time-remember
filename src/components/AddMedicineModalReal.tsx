
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Camera, Upload } from 'lucide-react';
import { useMedicines } from '@/hooks/useMedicines';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMedicineModalReal = ({ isOpen, onClose }: AddMedicineModalProps) => {
  const [medicine, setMedicine] = useState({
    name: '',
    dosage: '',
    time: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { addMedicine } = useMedicines();

  if (!isOpen) return null;

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setIsLoading(true);
      
      try {
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageBase64 = event.target?.result as string;
          
          // Call the edge function to process the image
          const response = await fetch('https://apnjcagpjdutxddnzfmu.functions.supabase.co/process-medicine-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageBase64 })
          });
          
          const result = await response.json();
          
          if (result.success && result.extractedInfo) {
            // Auto-fill form fields with extracted information
            if (result.extractedInfo.name && !medicine.name) {
              setMedicine(prev => ({ ...prev, name: result.extractedInfo.name }));
            }
            if (result.extractedInfo.dosage && !medicine.dosage) {
              setMedicine(prev => ({ ...prev, dosage: result.extractedInfo.dosage }));
            }
            
            console.log('Extracted medicine info:', result.extractedInfo);
          } else {
            console.log('Could not extract medicine information from image');
          }
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with medicine:', medicine);
    
    if (!medicine.name || !medicine.dosage || !medicine.time) {
      console.log('Missing required fields:', { 
        name: medicine.name, 
        dosage: medicine.dosage, 
        time: medicine.time 
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to add medicine...');
      await addMedicine({
        ...medicine,
        taken: false,
      });
      
      console.log('Medicine added successfully');
      // Reset form
      setMedicine({
        name: '',
        dosage: '',
        time: '',
        date: new Date().toISOString().split('T')[0],
      });
      setImageFile(null);
      onClose();
    } catch (error) {
      console.error('Error adding medicine:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-pill-navy">Add Medicine</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Capture */}
            <div className="space-y-2">
              <Label>Medicine Photo (Optional)</Label>
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageCapture}
                    className="sr-only"
                  />
                  <Button type="button" variant="outline" className="w-full" asChild>
                    <span>
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </span>
                  </Button>
                </label>
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageCapture}
                    className="sr-only"
                  />
                  <Button type="button" variant="outline" className="w-full" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </span>
                  </Button>
                </label>
              </div>
              {imageFile && (
                <p className="text-sm text-green-600">Photo selected: {imageFile.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="medicine-name">Medicine Name</Label>
              <Input
                id="medicine-name"
                value={medicine.name}
                onChange={(e) => setMedicine(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter medicine name"
                required
              />
            </div>

            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={medicine.dosage}
                onChange={(e) => setMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 1 tablet, 5ml"
                required
              />
            </div>

            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={medicine.time}
                onChange={(e) => setMedicine(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={medicine.date}
                onChange={(e) => setMedicine(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-pill-navy hover:bg-pill-navy/90"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Medicine"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AddMedicineModalReal;
