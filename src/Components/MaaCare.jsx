import { AlertTriangle, ArrowLeft, Award, Badge, Calendar, HeartPulse, MapPin, Phone, Search, Stethoscope } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react"
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";


const doctorsData = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    age: 45,
    qualification: "MBBS, MD (Obstetrics & Gynecology)",
    specialization: "High-Risk Pregnancy Specialist",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    contact: "+91-9876543210",
    email: "priya.sharma@hospital.com",
    experience: 18,
    rating: 4.9,
    riskSpecialty: "HIGH"
  },
  {
    id: 2,
    name: "Dr. Anjali Mehta",
    age: 38,
    qualification: "MBBS, DGO, DNB",
    specialization: "Maternal-Fetal Medicine",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    contact: "+91-9876543211",
    email: "anjali.mehta@medcare.com",
    experience: 12,
    rating: 4.8,
    riskSpecialty: "HIGH"
  },
  {
    id: 3,
    name: "Dr. Sunita Reddy",
    age: 42,
    qualification: "MBBS, MS (OBG)",
    specialization: "General Obstetrics",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    contact: "+91-9876543212",
    email: "sunita.reddy@apollo.com",
    experience: 15,
    rating: 4.7,
    riskSpecialty: "MEDIUM"
  },
  {
    id: 4,
    name: "Dr. Kavya Krishnan",
    age: 35,
    qualification: "MBBS, MD",
    specialization: "Prenatal Care Specialist",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    contact: "+91-9876543213",
    email: "kavya.krishnan@manipal.com",
    experience: 10,
    rating: 4.6,
    riskSpecialty: "LOW"
  }
];

export default function MaaCare() {
  const [formData, setFormData] = useState({
    age: "",
    systolicBP: "",
    diastolicBP: "",
    bloodSugar: "",
    heartRate: "",
    temperature: "",
  });

  const [step, setStep] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const buzzerRef = useRef(null);
  const [predictionHistory, setPredictionHistory] = useState([]);

  useEffect(() => {
    if (prediction?.risk === "HIGH" && buzzerRef.current) {
      buzzerRef.current.play().catch((err) => console.error("Audio play error:", err));
      const timer = setTimeout(() => {
        if (buzzerRef.current) {
          buzzerRef.current.pause();
          buzzerRef.current.currentTime = 0;
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [prediction]);

  useEffect(() => {
    if (step === 2 && prediction) {
      const relevantDoctors = doctorsData.filter(
        doctor => doctor.riskSpecialty === prediction.risk || doctor.riskSpecialty === "ALL"
      );
      setFilteredDoctors(relevantDoctors);
    }
  }, [step, prediction]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (prediction) {
      let doctors = doctorsData.filter(
        doctor => doctor.riskSpecialty === prediction.risk || doctor.riskSpecialty === "ALL"
      );

      if (term) {
        doctors = doctors.filter(doctor =>
          doctor.name.toLowerCase().includes(term) ||
          doctor.city.toLowerCase().includes(term) ||
          doctor.specialization.toLowerCase().includes(term)
        );
      }

      setFilteredDoctors(doctors);
    }
  };

  const validateInputs = () => {
    return Object.values(formData).every((val) => val !== "");
  };

  const handleSubmit = async () => {
    setError(null);
    setPrediction(null);

    if (!validateInputs()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const formattedData = {
        Age: Number(formData.age),
        SystolicBP: Number(formData.systolicBP),
        DiastolicBP: Number(formData.diastolicBP),
        BloodSugar: Number(formData.bloodSugar),
        HeartRate: Number(formData.heartRate),
        Temperature: Number(formData.temperature),
      };

      let risk = "LOW";
      let confidence = 85;

      if (
        formattedData.SystolicBP > 140 ||
        formattedData.DiastolicBP > 90 ||
        formattedData.BloodSugar > 180 ||
        formattedData.HeartRate > 110 ||
        formattedData.Temperature > 100.4
      ) {
        risk = "HIGH";
        confidence = 95;
      } else if (
        formattedData.SystolicBP > 130 ||
        formattedData.DiastolicBP > 85 ||
        formattedData.BloodSugar > 140 ||
        formattedData.HeartRate > 100
      ) {
        risk = "MEDIUM";
        confidence = 90;
      }

      const result = { ...formattedData, risk, confidence };
      setPrediction({ risk, confidence });
      setPredictionHistory((prev) => [...prev, result]);

      setTimeout(() => setStep(2), 1500);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("An error occurred while predicting risk.");
    }
  };

  const DoctorCard = ({ doctor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-maternal-purple line-clamp-2">{doctor.name}</h3>
          <p className="text-muted-foreground">Age: {doctor.age} years</p>
        </div>
        <Badge variant="secondary" className="bg-pink-100 text-maternal-purple flex-shrink-0">
          ⭐ {doctor.rating}
        </Badge>
      </div>
      <div className="space-y-3 flex-1">
        <div className="flex items-start gap-2">
          <Award className="h-4 w-4 text-maternal-purple mt-1 flex-shrink-0" />
          <div className="flex-1 min-h-[3rem]">
            <p className="font-medium text-sm line-clamp-2">{doctor.qualification}</p>
            <p className="text-maternal-purple text-sm line-clamp-1">{doctor.specialization}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 min-h-[1.5rem]">
          <MapPin className="h-4 w-4 text-maternal-purple flex-shrink-0" />
          <p className="text-sm line-clamp-1">{doctor.city}, {doctor.state}, {doctor.country}</p>
        </div>
        <div className="flex items-center gap-2 min-h-[1.5rem]">
          <Calendar className="h-4 w-4 text-maternal-purple flex-shrink-0" />
          <p className="text-sm">{doctor.experience} years experience</p>
        </div>
        <div className="pt-3 border-t border-border mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-maternal-purple" />
            <p className="text-sm font-medium line-clamp-1">{doctor.contact}</p>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{doctor.email}</p>
        </div>
        <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white mt-4">
          Contact Doctor
        </Button>
      </div>
    </motion.div>
  );

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {step === 0 && (
        <motion.div
          className="relative flex flex-col items-center justify-center h-screen text-center p-10 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 animate-gradient bg-[length:400%_400%]"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute top-10 left-10 text-pink-400"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <HeartPulse size={60} />
          </motion.div>
          <motion.div
            className="absolute bottom-10 right-10 text-purple-400"
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Stethoscope size={60} />
          </motion.div>
          <div className="backdrop-blur-lg bg-white/40 shadow-xl rounded-3xl p-10 max-w-2xl mx-auto border border-white/30">
            <h1 className="text-6xl font-bold text-pink-600 drop-shadow-lg">MaaCare</h1>
            <p className="text-2xl mt-4 font-semibold text-gray-700">
              Welcome to MaaCare
            </p>
            <p className="text-lg text-gray-600 mt-2 italic">
              "Because Every Mother Deserves the Best."
            </p>
            <Button
              className="mt-8 bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
              onClick={() => setStep(1)}
            >
              Start Assessment
            </Button>
          </div>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div
          className="p-10 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-5xl font-extrabold text-gray-700">
              MaaCare - Maternal Risk Assessment
            </h1>
            <Button
              onClick={() => setStep(0)}
              variant="outline"
              className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          <motion.div
            className="max-w-xl mx-auto shadow-xl rounded-3xl backdrop-blur-md bg-white/90"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0">
              <CardHeader className="text-2xl font-bold text-center text-gray-700">
                Patient Risk Assessment Form
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {[
                  { field: "age", label: "Age (years)", placeholder: "Enter age" },
                  { field: "systolicBP", label: "Systolic Blood Pressure", placeholder: "Enter systolic BP" },
                  { field: "diastolicBP", label: "Diastolic Blood Pressure", placeholder: "Enter diastolic BP" },
                  { field: "bloodSugar", label: "Blood Sugar Level", placeholder: "Enter blood sugar" },
                  { field: "heartRate", label: "Heart Rate (bpm)", placeholder: "Enter heart rate" },
                  { field: "temperature", label: "Body Temperature (°F)", placeholder: "Enter temperature" }
                ].map(({ field, label, placeholder }) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-md font-medium mb-1 text-gray-700">
                      {label}
                    </label>
                    <Input
                      placeholder={placeholder}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      type="number"
                      className="focus:ring-pink-400 focus:border-pink-400"
                    />
                  </div>
                ))}
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3"
                >
                  Predict Risk
                </Button>
                {error && (
                  <div className="mt-4 text-center text-red-500 font-medium">{error}</div>
                )}
                {prediction && (
                  <motion.div
                    className={`mt-4 text-lg font-semibold text-center px-4 py-3 rounded-xl shadow-md text-white ${
                      prediction.risk === "HIGH"
                        ? "bg-red-500 animate-pulse"
                        : prediction.risk === "MEDIUM"
                        ? "bg-yellow-400"
                        : "bg-green-400"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    Risk Level: {prediction.risk} (Confidence: {prediction.confidence}%)
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          {predictionHistory.length > 0 && (
            <motion.div
              className="mt-12 max-w-2xl mx-auto bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Assessment History</h2>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {predictionHistory.map((entry, index) => (
                  <li key={index} className="text-sm border-b border-gray-200 pb-2">
                    <strong>Assessment {index + 1}:</strong> Age: {entry.Age}, BP: {entry.SystolicBP}/{entry.DiastolicBP}, Sugar: {entry.BloodSugar}, HR: {entry.HeartRate}, Temp: {entry.Temperature} →
                    <Badge
                      variant="secondary"
                      className={`ml-2 text-white ${
                        entry.risk === "HIGH" ? "bg-red-500" :
                        entry.risk === "MEDIUM" ? "bg-yellow-400" : "bg-green-400"
                      }`}
                    >
                      {entry.risk}
                    </Badge>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}

      {step === 2 && prediction && (
        <motion.div
          className="p-10 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-extrabold text-gray-700 mb-2">
                Recommended Doctors
              </h1>
              <p className="text-lg text-gray-500">
                Based on your {prediction.risk} risk assessment
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 w-64 focus:ring-pink-400 focus:border-pink-400"
                />
              </div>
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Assessment
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <Badge
              variant="secondary"
              className={`text-white text-lg px-4 py-2 ${
                prediction.risk === "HIGH" ? "bg-red-500" :
                prediction.risk === "MEDIUM" ? "bg-yellow-400" : "bg-green-400"
              }`}
            >
              Risk Level: {prediction.risk} ({prediction.confidence}% confidence)
            </Badge>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DoctorCard doctor={doctor} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-500">
                  No doctors found matching your criteria.
                </p>
              </div>
            )}
          </motion.div>
          {filteredDoctors.length > 0 && (
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-500">
                Showing {filteredDoctors.length} doctor(s) specialized in {prediction.risk.toLowerCase()} risk cases
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      <audio ref={buzzerRef} preload="auto">
        <source src="/danger-alarm-1.mp3" type="audio/mpeg" />
        <source src="/alarm_buzzer_1999.mp3" type="audio/mpeg" />
      </audio>
    </motion.div>
  );
}
