import { Loader2, Send } from "lucide-react";
import type { FormErrors, FormState } from "../types";

interface PredictionFormProps {
  form: FormState;
  errors: FormErrors;
  loading: boolean;
  onChange: (field: keyof FormState, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PredictionForm({
  form,
  errors,
  loading,
  onChange,
  onSubmit,
}: PredictionFormProps) {
  return (
    <form className="predict-form glass" onSubmit={onSubmit} noValidate>
      <div className="form-header">
        <h3>Premium forecast</h3>
        <p>All fields validated against training data ranges.</p>
      </div>

      <div className="form-grid">
        <Field label="Age" error={errors.age}>
          <input
            type="number"
            min={18}
            max={64}
            value={form.age}
            onChange={(e) => onChange("age", e.target.value)}
            placeholder="e.g. 42"
          />
        </Field>

        <Field label="Sex" error={errors.sex}>
          <select value={form.sex} onChange={(e) => onChange("sex", e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>

        <Field label="BMI" error={errors.bmi}>
          <input
            type="number"
            step="0.1"
            min={15}
            max={53}
            value={form.bmi}
            onChange={(e) => onChange("bmi", e.target.value)}
            placeholder="e.g. 28.5"
          />
        </Field>

        <Field label="Dependents" error={errors.children}>
          <input
            type="number"
            min={0}
            max={5}
            value={form.children}
            onChange={(e) => onChange("children", e.target.value)}
            placeholder="0–5"
          />
        </Field>

        <Field label="Smoker" error={errors.smoker}>
          <select value={form.smoker} onChange={(e) => onChange("smoker", e.target.value)}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </Field>

        <Field label="Region" error={errors.region}>
          <select value={form.region} onChange={(e) => onChange("region", e.target.value)}>
            <option value="northeast">Northeast</option>
            <option value="northwest">Northwest</option>
            <option value="southeast">Southeast</option>
            <option value="southwest">Southwest</option>
          </select>
        </Field>

        <Field label="Exercise frequency" error={errors.exercise_frequency}>
          <select
            value={form.exercise_frequency}
            onChange={(e) => onChange("exercise_frequency", e.target.value)}
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </Field>

        <Field label="Chronic disease" error={errors.chronic_disease}>
          <select
            value={form.chronic_disease}
            onChange={(e) => onChange("chronic_disease", e.target.value)}
          >
            <option value="none">None</option>
            <option value="hypertension">Hypertension</option>
            <option value="diabetes">Diabetes</option>
            <option value="heart disease">Heart disease</option>
          </select>
        </Field>

        <Field label="Annual income ($)" error={errors.annual_income} className="full">
          <input
            type="number"
            min={10000}
            max={150000}
            step={1000}
            value={form.annual_income}
            onChange={(e) => onChange("annual_income", e.target.value)}
            placeholder="e.g. 85000"
          />
        </Field>
      </div>

      <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
        {loading ? (
          <>
            <Loader2 size={18} className="spin" />
            Analyzing profile…
          </>
        ) : (
          <>
            <Send size={18} />
            Generate forecast
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`field ${className} ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <em>{error}</em>}
    </label>
  );
}
