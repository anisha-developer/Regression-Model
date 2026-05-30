export default function LoadingOverlay() {
  return (
    <div className="loading-panel glass fade-in" aria-live="polite">
      <div className="loader-rings">
        <span />
        <span />
        <span />
      </div>
      <p>Running inference pipeline…</p>
      <small>Engineering features · Standardizing · Predicting</small>
    </div>
  );
}
