"use client";

import { useState } from "react";

const links = [
  ["DIY Studio", "#studio"],
  ["Latte Bar", "#drinks"],
  ["Gift Shop", "#shop"],
  ["Events", "#events"],
  ["About", "#about"],
  ["Visit Us", "#contact"],
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`mobile-nav ${open ? "open" : ""}`}>
      <button
        className="hamburger-btn"
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className="mobile-menu" id="mobile-menu">
        {links.map(([label, href]) => (
          <a href={href} key={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
