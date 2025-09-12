// src/components/common/Section.jsx
import React from "react";

export default function Section({ title, children }) {
  return (
    <section className="section">
      <h3 className="section-title">{title}</h3>
      <div className="section-content">
        {children}
      </div>
    </section>
  );
}
