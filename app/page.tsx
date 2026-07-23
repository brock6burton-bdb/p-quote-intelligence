"use client";

import Link from "next/link";
import { useState } from "react";

function Logo() {
  return (
    <Link href="/" className="logo">
      <span className="logoMark">◩</span>
      <span>PRISM</span>
    </Link>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", { method: "POST" });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unable to start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main>
      <header className="header">
        <div className="wrap headerInner">
          <Logo />
          <nav>
            <a href="#how">How it works</a>
            <Link href="/report">Sample report</Link>
            <a href="#pricing">Pricing</a>
          </nav>
          <button className="button small" onClick={startCheckout} disabled={loading}>
            {loading ? "Opening…" : "Analyze quotes"}
          </button>
        </div>
      </header>

      <section className="hero wrap">
        <div>
          <span className="eyebrow">Independent contractor quote analysis</span>
          <h1>Know which contractor to hire—and why.</h1>
          <p className="lead">
            Upload up to three proposals. Prism compares pricing, scope, warranties,
            exclusions, and unclear terms, then gives you a practical recommendation.
          </p>
          <div className="actions">
            <button className="button" onClick={startCheckout} disabled={loading}>
              {loading ? "Opening checkout…" : "Analyze my quotes →"}
            </button>
            <Link className="textLink" href="/report">View a sample report</Link>
          </div>
          {error && <p className="errorText">{error}</p>}
          <div className="trust">
            <span>✓ Independent</span>
            <span>✓ No contractor affiliations</span>
            <span>✓ One-time payment</span>
          </div>
        </div>

        <div className="previewCard">
          <div className="previewTop">
            <div>
              <span className="miniLabel">Prism recommendation</span>
              <h2>Contractor B is the strongest proposal.</h2>
            </div>
            <div className="score">92</div>
          </div>
          <p>Best combination of clear scope, warranty protection, and total value.</p>
          <div className="winner">
            <div><small>Recommended</small><strong>Contractor B</strong></div>
            <strong>$14,600</strong>
          </div>
          <div className="flag good">✓ Permits included</div>
          <div className="flag good">✓ 10-year labor warranty</div>
          <div className="flag warning">! Quote A omits equipment model numbers</div>
        </div>
      </section>

      <section className="darkStrip">
        <div className="wrap"><strong>Make a better $20,000 decision for $49.</strong><span>One report. No subscription.</span></div>
      </section>

      <section className="section soft" id="how">
        <div className="wrap">
          <span className="eyebrow">How it works</span>
          <h2>Three steps to a clearer decision.</h2>
          <div className="cards3">
            <article><b>01</b><h3>Pay securely</h3><p>Use Stripe Checkout for a one-time $49 purchase.</p></article>
            <article><b>02</b><h3>Upload proposals</h3><p>Add one to three PDF, JPG, or PNG contractor quotes.</p></article>
            <article><b>03</b><h3>Receive analysis</h3><p>Get a structured report with comparisons, risks, and questions.</p></article>
          </div>
        </div>
      </section>

      <section className="section wrap" id="pricing">
        <div className="pricingCard">
          <span className="eyebrow">Simple pricing</span>
          <h2>$49 per analysis.</h2>
          <p>Compare up to three contractor quotes. No subscription or contractor sales calls.</p>
          <button className="button" onClick={startCheckout} disabled={loading}>
            Start my analysis →
          </button>
        </div>
      </section>

      <footer><Logo /><span>Clarity before commitment.</span></footer>
    </main>
  );
}
