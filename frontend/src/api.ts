import type { FormState, ModelInfo, PredictionResult } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function fetchModelInfo(): Promise<ModelInfo> {
  const res = await fetch(`${API_BASE}/api/model-info`);
  if (!res.ok) throw new Error("Unable to load model metadata.");
  return res.json();
}

export async function predictCost(form: FormState): Promise<PredictionResult> {
  const body = {
    age: Number(form.age),
    sex: form.sex,
    bmi: Number(form.bmi),
    children: Number(form.children),
    smoker: form.smoker,
    region: form.region,
    exercise_frequency: form.exercise_frequency,
    chronic_disease: form.chronic_disease,
    annual_income: Number(form.annual_income),
  };

  const res = await fetch(`${API_BASE}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const message =
      typeof detail.detail === "string"
        ? detail.detail
        : "Prediction request failed. Check your inputs.";
    throw new Error(message);
  }

  return res.json();
}

export function validateForm(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {};
  const age = Number(form.age);
  const bmi = Number(form.bmi);
  const children = Number(form.children);
  const income = Number(form.annual_income);

  if (!form.age || Number.isNaN(age) || age < 18 || age > 64) {
    errors.age = "Age must be between 18 and 64.";
  }
  if (!form.bmi || Number.isNaN(bmi) || bmi < 15 || bmi > 53) {
    errors.bmi = "BMI must be between 15 and 53.";
  }
  if (form.children === "" || Number.isNaN(children) || children < 0 || children > 5) {
    errors.children = "Dependents must be between 0 and 5.";
  }
  if (!form.annual_income || Number.isNaN(income) || income < 10000 || income > 150000) {
    errors.annual_income = "Annual income must be between $10,000 and $150,000.";
  }
  return errors;
}
