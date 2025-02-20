
import { HeartPulse, AlertCircle, Heart, Activity, Brain } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  age: string;
  sex: string;
  cp: string;
  trestbps: string;
  chol: string;
  fbs: string;
  restecg: string;
  thalach: string;
  exang: string;
  oldpeak: string;
  slope: string;
  ca: string;
  thal: string;
}

const InfoCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) => (
  <div className="glass p-6 rounded-2xl">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-primary/10 rounded-xl">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    age: "",
    sex: "1",
    cp: "0",
    trestbps: "",
    chol: "",
    fbs: "0",
    restecg: "0",
    thalach: "",
    exang: "0",
    oldpeak: "",
    slope: "0",
    ca: "0",
    thal: "0",
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emptyFields = Object.entries(formData).filter(([_, value]) => value === "");
    if (emptyFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields before submitting.",
      });
      return;
    }

    setLoading(true);

    // Convert categorical fields into one-hot encoding before sending
    const processedData = {
      // Numerical values (sent as-is)
      age: formData.age,
      sex: formData.sex,
      trestbps: formData.trestbps,
      chol: formData.chol,
      fbs: formData.fbs,
      thalach: formData.thalach,
      exang: formData.exang,
      oldpeak: formData.oldpeak,
      ca: formData.ca,
      // For chest pain type (cp)
      cp_1: formData.cp === "1" ? 1 : 0, // Typical Angina
      cp_2: formData.cp === "2" ? 1 : 0, // Atypical Angina
      cp_3: formData.cp === "3" ? 1 : 0, // Non-anginal Pain
      // For resting ECG (restecg)
      restecg_1: formData.restecg === "1" ? 1 : 0, // Normal
      restecg_2: formData.restecg === "2" ? 1 : 0, // ST-T Wave Abnormality
      // For slope (slope)
      slope_1: formData.slope === "1" ? 1 : 0, // Upsloping
      slope_2: formData.slope === "2" ? 1 : 0, // Flat
      // For thalassemia (thal)
      thal_1: formData.thal === "1" ? 1 : 0, // Normal
      thal_2: formData.thal === "2" ? 1 : 0, // Fixed Defect
      thal_3: formData.thal === "3" ? 1 : 0, // Reversible Defect
    };

    try {
      const response = await fetch('https://automated-ensemble-cardiometric-portal.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPrediction(data.prediction);
      
      toast({
        title: "Prediction Complete",
        description: "Your heart disease prediction has been calculated.",
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get prediction. Please ensure the model server is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <HeartPulse className="h-20 w-20 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">
              Heart Health Predictor
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding your heart health is crucial for a long and healthy life. Our AI-powered tool helps you assess your risk factors.
            </p>
            <Button
              size="lg"
              className="mt-8"
              onClick={() => setShowForm(true)}
            >
              Start Assessment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard
              icon={Heart}
              title="Heart Disease"
              description="Understand your risk factors and take control of your heart health."
            />
            <InfoCard
              icon={Activity}
              title="Early Detection"
              description="Identify potential issues early through our advanced prediction model."
            />
            <InfoCard
              icon={Brain}
              title="AI-Powered"
              description="Leveraging machine learning for accurate health assessments."
            />
            <InfoCard
              icon={HeartPulse}
              title="Comprehensive"
              description="Consider multiple health factors for a thorough evaluation."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <Button
          variant="ghost"
          onClick={() => setShowForm(false)}
          className="mb-4"
        >
          ← Back to Home
        </Button>

        <div className="glass rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="age">Age</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter your age in years</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <input
                  type="number"
                  id="age"
                  required
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter your age"
                />
              </div>

              {/* Sex */}
              <div className="space-y-2">
                <Label>Sex</Label>
                <RadioGroup
                  value={formData.sex}
                  onValueChange={(value) => handleInputChange("sex", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Chest Pain Type */}
              <div className="space-y-2 col-span-2">
                <div className="flex items-center gap-2">
                  <Label>Chest Pain Type</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Type of chest pain(cp) experienced</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={formData.cp}
                  onValueChange={(value) => handleInputChange("cp", value)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="cp-1" />
                    <Label htmlFor="cp-1">Typical Angina</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="cp-2" />
                    <Label htmlFor="cp-2">Atypical Angina</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="cp-3" />
                    <Label htmlFor="cp-3">Non-anginal Pain</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Resting Blood Pressure */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="trestbps">Resting Blood Pressure</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Blood pressure (mm Hg) at rest. Normal range: 90-120</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <input
                  type="number"
                  id="trestbps"
                  required
                  value={formData.trestbps}
                  onChange={(e) => handleInputChange("trestbps", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter resting blood pressure"
                />
              </div>

              {/* Serum Cholesterol */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="chol">Serum Cholesterol</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cholesterol in mg/dl. Normal range: 125-200</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <input
                  type="number"
                  id="chol"
                  required
                  value={formData.chol}
                  onChange={(e) => handleInputChange("chol", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter cholesterol level"
                />
              </div>

              {/* Fasting Blood Sugar */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Fasting Blood Sugar</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Is fasting blood sugar greater than 120 mg/dl?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={formData.fbs}
                  onValueChange={(value) => handleInputChange("fbs", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="fbs-0" />
                    <Label htmlFor="fbs-0">No (≤120 mg/dl)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="fbs-1" />
                    <Label htmlFor="fbs-1">Yes (greater than 120 mg/dl)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Resting ECG Results */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Resting ECG Results</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Resting electrocardiographic results</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={formData.restecg}
                  onValueChange={(value) => handleInputChange("restecg", value)}
                  className="grid gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="restecg-1" />
                    <Label htmlFor="restecg-1">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="restecg-2" />
                    <Label htmlFor="restecg-2">ST-T Wave Abnormality</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Maximum Heart Rate */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="thalach">Maximum Heart Rate</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Maximum heart rate achieved (ThalACH) (60-100 bpm normal range)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <input
                  type="number"
                  id="thalach"
                  required
                  value={formData.thalach}
                  onChange={(e) => handleInputChange("thalach", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter maximum heart rate"
                />
              </div>

              {/* Exercise Induced Angina */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Exercise Induced Angina</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Does exercise cause chest pain?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={formData.exang}
                  onValueChange={(value) => handleInputChange("exang", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="exang-0" />
                    <Label htmlFor="exang-0">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="exang-1" />
                    <Label htmlFor="exang-1">Yes</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* ST Depression */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="oldpeak">ST Depression</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>ST depression (OldPeak) induced by exercise relative to rest</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <input
                  type="number"
                  step="0.1"
                  id="oldpeak"
                  required
                  value={formData.oldpeak}
                  onChange={(e) => handleInputChange("oldpeak", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter ST depression value"
                />
              </div>

              {/* ST Segment Slope */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>ST Segment Slope</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Slope of the peak exercise ST segment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={formData.slope}
                  onValueChange={(value) => handleInputChange("slope", value)}
                  className="grid gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="slope-1" />
                    <Label htmlFor="slope-1">Upsloping</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="slope-2" />
                    <Label htmlFor="slope-2">Flat</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Number of Vessels */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Number of Vessels</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of major vessels - Coronary Arteries(CA) colored by fluoroscopy (0-3)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={formData.ca}
                  onValueChange={(value) => handleInputChange("ca", value)}
                  className="grid grid-cols-2 gap-4"
                >
                  {[0, 1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center space-x-2">
                      <RadioGroupItem value={num.toString()} id={`ca-${num}`} />
                      <Label htmlFor={`ca-${num}`}>{num} Vessel{num !== 1 ? 's' : ''}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Thalassemia */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Thalassemia</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Blood disorder type affecting heart</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={formData.thal}
                  onValueChange={(value) => handleInputChange("thal", value)}
                  className="grid gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="thal-1" />
                    <Label htmlFor="thal-1">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="thal-2" />
                    <Label htmlFor="thal-2">Fixed Defect</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="thal-3" />
                    <Label htmlFor="thal-3">Reversible Defect</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="w-full sm:w-auto px-8"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Get Prediction"}
              </Button>
            </div>
          </form>
        </div>

        {prediction !== null && (
          <div className="glass rounded-2xl p-6 text-center animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Prediction Result</h2>
            <div className={`text-xl font-semibold ${prediction === 1 ? 'text-red-500' : 'text-green-500'}`}>
              {prediction === 1 ? 'High Risk of Heart Disease' : 'Low Risk of Heart Disease'}
            </div>
            <p className="mt-4 text-gray-600">
              This is a preliminary assessment. Please consult with a healthcare professional for a proper diagnosis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
