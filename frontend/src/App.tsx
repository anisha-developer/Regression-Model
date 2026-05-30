import { useCallback, useEffect, useState } from "react";
import { fetchModelInfo, predictCost, validateForm } from "./api";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import LoadingOverlay from "./components/LoadingOverlay";
import Navbar from "./components/Navbar";
import PredictionForm from "./components/PredictionForm";
import ResultCard from "./components/ResultCard";
import type { FormErrors, FormState, ModelInfo, PredictionResult } from "./types";
import "./styles/app.css";

const initialForm: FormState = {
  age: "39",
  sex: "male",
  bmi: "28.5",
  children: "2",
  smoker: "no",
  region: "northeast",
  exercise_frequency: "medium",
  chronic_disease: "none",
  annual_income: "75000",
};

export default function App() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  useEffect(() => {
    fetchModelInfo()
      .then(setModelInfo)
      .catch(() => undefined);
  }, []);

  const handleChange = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setResult(null);
      return;
    }

    setLoading(true);
    setApiError(null);
    setResult(null);

    try {
      const prediction = await predictCost(form);
      setResult(prediction);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Navbar />
      <main>
        <Hero modelInfo={modelInfo} />
        <Features />
        <HowItWorks />

        <section id="predict" className="section predict-section">
          <div className="container">
            <h2 className="section-title">Premium prediction studio</h2>
            <p className="section-sub">
              Submit an applicant profile to receive an AI-generated annual insurance
              cost estimate with risk and confidence scoring.
            </p>

            <div className="predict-layout">
              <PredictionForm
                form={form}
                errors={errors}
                loading={loading}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />

              <aside className="predict-aside">
                {loading && <LoadingOverlay />}
                {!loading && apiError && (
                  <div className="error-banner glass fade-in" role="alert">
                    <p>{apiError}</p>
                    <small>Ensure the API is running locally or deployed on Vercel.</small>
                  </div>
                )}
                {!loading && result && <ResultCard result={result} />}
                {!loading && !result && !apiError && (
                  <div className="placeholder glass fade-in">
                    <h4>Ready for inference</h4>
                    <p>
                      Complete the form and click <strong>Generate forecast</strong> to
                      see predicted premiums, risk tier, and model confidence.
                    </p>
                    {modelInfo && (
                      <dl className="model-dl">
                        <div>
                          <dt>Model</dt>
                          <dd>{modelInfo.model_name}</dd>
                        </div>
                        <div>
                          <dt>Training rows</dt>
                          <dd>{modelInfo.dataset_size.toLocaleString()}</dd>
                        </div>
                        <div>
                          <dt>RMSE</dt>
                          <dd>${modelInfo.rmse.toLocaleString(undefined, { maximumFractionDigits: 0 })}</dd>
                        </div>
                      </dl>
                    )}
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
