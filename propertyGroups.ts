// Define property groups to categorize the health data
export const propertyGroups: {
  [key: string]: string[];
} = {
  VitalSigns: [
    "HeartRate",
    "BloodPressureDiastolic",
    "BodyTemperature",
    "RespiratoryRate",
    "OxygenSaturation",
    "RestingHeartRate",
  ],
  Nutrition: ["EnergyConsumed", "FatTotal", "Water"],
  Fitness: ["StepCount", "BodyMass", "BodyFatPercentage", "Height", "Weight"],
  Other: ["BloodGlucose", "SleepAnalysis", "BloodType", "Electrocardiogram"],
};
