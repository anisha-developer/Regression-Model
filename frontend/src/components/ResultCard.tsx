import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import type { PredictionResult, RiskLevel } from "../types";

interface ResultCardProps {
  result: PredictionResult;
}

const riskColors: Record<RiskLevel, string> = {
  low: "var(--success)",
  moderate: "var(--warning)",
  high: "#fb923c",
  very_high: "var(--danger)",
};

export default function ResultCard({ result }: ResultCardProps) {
  const riskColor = riskColors[result.risk_level];

  return (
    <div className="result-card glass fade-in">
      <div className="result-header">
        <div className="result-icon">
          <TrendingUp size={22} />
        </div>
        <div>
          <p className="result-label">Predicted annual premium</p>
          <h3 className="result-price">{result.formatted_cost}</h3>
        </div>
      </div>

      <div className="result-pill" style={{ borderColor: riskColor, color: riskColor }}>
        {result.risk_label}
      </div>

      <div className="meter-block">
        <div className="meter-head">
          <span>Model confidence</span>
          <strong>{result.confidence_score}%</strong>
        </div>
        <div className="bar-track large">
          <div
            className="bar-fill cyan animated-bar"
            style={{ width: `${result.confidence_score}%` }}
          />
        </div>
        <p className="meter-caption">{result.confidence_label}</p>
      </div>

      <div className="meter-block">
        <div className="meter-head">
          <span>Risk index</span>
          <strong>{riskPercent(result.risk_level)}%</strong>
        </div>
        <div className="bar-track large">
          <div
            className="bar-fill purple animated-bar"
            style={{
              width: `${riskPercent(result.risk_level)}%`,
              background: riskColor,
            }}
          />
        </div>
      </div>

      <div className="result-meta">
        <span>
          <CheckCircle2 size={14} />
          {result.model_name} · R² {result.model_r2}
        </span>
      </div>

      <ul className="factor-list">
        {result.factors.map((factor) => (
          <li key={factor}>
            <AlertCircle size={14} />
            {factor}
          </li>
        ))}
      </ul>
    </div>
  );
}

function riskPercent(level: RiskLevel): number {
  const map: Record<RiskLevel, number> = {
    low: 28,
    moderate: 52,
    high: 74,
    very_high: 92,
  };
  return map[level];
}
