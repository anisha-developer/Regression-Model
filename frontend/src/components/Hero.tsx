import { ArrowRight, Sparkles, Shield } from "lucide-react";
import type { ModelInfo } from "../types";

interface HeroProps {
  modelInfo: ModelInfo | null;
}

export default function Hero({ modelInfo }: HeroProps) {
  const r2 = modelInfo ? (modelInfo.r2 * 100).toFixed(1) : "95.7";

  return (
    <section className="hero section">
      <div className="container hero-grid">
        <div className="hero-copy fade-in">
          <div className="hero-badge glass">
            <Sparkles size={14} />
            <span>AI-Powered Underwriting Intelligence</span>
          </div>
          <h1>
            Forecast medical insurance premiums with{" "}
            <span className="gradient-text">clinical-grade precision</span>
          </h1>
          <p className="hero-desc">
            PremiumIQ transforms demographic, lifestyle, and health signals into
            accurate annual premium estimates — built on a Lasso regression model
            trained on 2,000+ real-world policy profiles.
          </p>
          <div className="hero-actions">
            <a href="#predict" className="btn btn-primary">
              Run prediction
              <ArrowRight size={18} />
            </a>
            <a href="#features" className="btn btn-ghost">
              Explore platform
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat glass">
              <strong>{r2}%</strong>
              <span>Model R² score</span>
            </div>
            <div className="stat glass">
              <strong>12</strong>
              <span>Engineered features</span>
            </div>
            <div className="stat glass">
              <strong>&lt;1s</strong>
              <span>Inference latency</span>
            </div>
          </div>
        </div>

        <div className="hero-visual fade-in">
          <div className="hero-card glass">
            <div className="hero-card-header">
              <Shield size={18} />
              <span>Live risk dashboard</span>
            </div>
            <div className="hero-metric">
              <span className="label">Sample forecast</span>
              <span className="value gradient-text">$9,842.50</span>
            </div>
            <div className="hero-bars">
              <div className="bar-row">
                <span>Confidence</span>
                <div className="bar-track">
                  <div className="bar-fill cyan" style={{ width: "94%" }} />
                </div>
              </div>
              <div className="bar-row">
                <span>Risk index</span>
                <div className="bar-track">
                  <div className="bar-fill purple" style={{ width: "62%" }} />
                </div>
              </div>
            </div>
            <p className="hero-card-foot">
              Smoker status, BMI, chronic conditions, and regional factors weighted
              in real time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
