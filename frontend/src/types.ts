export type RiskLevel = "low" | "moderate" | "high" | "very_high";

export interface FormState {
  age: string;
  sex: "male" | "female";
  bmi: string;
  children: string;
  smoker: "yes" | "no";
  region: "northeast" | "northwest" | "southeast" | "southwest";
  exercise_frequency: "none" | "low" | "medium" | "high";
  chronic_disease: "none" | "hypertension" | "diabetes" | "heart disease";
  annual_income: string;
}

export interface PredictionResult {
  predicted_cost: number;
  formatted_cost: string;
  risk_level: RiskLevel;
  risk_label: string;
  confidence_score: number;
  confidence_label: string;
  model_name: string;
  model_r2: number;
  factors: string[];
}

export interface ModelInfo {
  model_name: string;
  r2: number;
  mae: number;
  rmse: number;
  features: string[];
  dataset_size: number;
}

export interface FormErrors {
  [key: string]: string | undefined;
}
