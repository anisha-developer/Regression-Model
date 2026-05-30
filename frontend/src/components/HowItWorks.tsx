const steps = [
  {
    step: "01",
    title: "Enter applicant profile",
    text: "Capture demographics, lifestyle, region, and chronic health indicators through a validated form.",
  },
  {
    step: "02",
    title: "Engineer & infer",
    text: "The API enriches inputs and runs your trained scikit-learn pipeline for instant premium estimates.",
  },
  {
    step: "03",
    title: "Act on insights",
    text: "Review predicted cost, risk tier, confidence meter, and factor explanations in a unified dashboard card.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <h2 className="section-title">How PremiumIQ works</h2>
        <p className="section-sub">
          Three steps from raw applicant data to actionable underwriting intelligence.
        </p>
        <div className="steps-row">
          {steps.map((item) => (
            <div key={item.step} className="step-card glass">
              <span className="step-num">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
