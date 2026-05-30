import { BarChart3, Brain, Layers, Lock, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "ML-Powered Forecasting",
    description:
      "Lasso regression pipeline with standardized numerics and one-hot encoded categoricals — matching your notebook training workflow.",
  },
  {
    icon: Layers,
    title: "Feature Engineering",
    description:
      "Automatic derivation of BMI×age, family size, and obesity flags so every prediction uses the same enriched feature space.",
  },
  {
    icon: BarChart3,
    title: "Risk & Confidence Scoring",
    description:
      "Portfolio-aware risk tiers and confidence meters help underwriting teams interpret results beyond a single dollar figure.",
  },
  {
    icon: Zap,
    title: "Sub-Second API",
    description:
      "FastAPI backend with validated payloads, designed for serverless deployment and horizontal scale on Vercel.",
  },
  {
    icon: Lock,
    title: "Production-Ready Validation",
    description:
      "Pydantic schemas enforce realistic input ranges aligned with the training dataset — reducing garbage-in failures.",
  },
];

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <h2 className="section-title">Built for modern insurance teams</h2>
        <p className="section-sub">
          From exploratory analysis in your notebook to a deployable SaaS experience —
          PremiumIQ packages your regression work into an enterprise-ready interface.
        </p>
        <div className="features-grid">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className="feature-card glass fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="feature-icon">
                <feature.icon size={22} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
