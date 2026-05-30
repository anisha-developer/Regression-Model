import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner glass">
        <div>
          <strong>PremiumIQ</strong>
          <p>Medical insurance cost intelligence · FastAPI + scikit-learn</p>
        </div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#predict">Predict</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} PremiumIQ. All rights reserved.</p>
      </div>
    </footer>
  );
}
