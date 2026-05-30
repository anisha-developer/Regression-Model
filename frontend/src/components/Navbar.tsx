import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#predict", label: "Predict" },
  { href: "#how-it-works", label: "How it works" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner glass">
        <a href="#" className="brand">
          <span className="brand-icon">
            <Activity size={20} />
          </span>
          <span>
            Premium<span className="brand-accent">IQ</span>
          </span>
        </a>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#predict" className="btn btn-primary nav-cta" onClick={() => setOpen(false)}>
            Get forecast
          </a>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
