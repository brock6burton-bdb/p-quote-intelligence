"use client";

import Link from "next/link";
import { useRef, useState } from "react";

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="logo">
      <svg width="38" height="38" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M13 11L45 32L13 53V11Z" fill={inverse ? "#ffffff" : "#171717"} />
        <path d="M45 32L54 38V52L34 39L45 32Z" fill={inverse ? "#d9d9d9" : "#b8b8b8"} />
      </svg>
      <span>PRISM</span>
    </div>
  );
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted = Array.from(list)
      .filter((file) =>
        ["application/pdf", "image/png", "image/jpeg"].includes(file.type)
      )
      .slice(0, Math.max(0, 3 - files.length));

    setFiles((current) => [...current, ...accepted].slice(0, 3));
  }

  return (
    <main>
      <header className="header">
        <div className="wrap headerInner">
          <a href="#top"><Logo /></a>
          <nav>
            <a href="#how">How it works</a>
            <Link href="/report">Sample report</Link>
            <a href="#pricing">Pricing</a>
          </nav>
          <a className="button small" href="#upload">Analyze quotes</a>
        </div>
      </header>

      <section className="hero wrap" id="top">
        <div className="heroCopy">
          <span className="eyebrow">Independent contractor quote analysis</span>
          <h1>Don’t let a bad contractor decision cost you thousands.</h1>
          <p>
            Upload up to three contractor quotes. Prism compares pricing, scope,
            warranties, exclusions, and unclear terms—then tells you what to ask before signing.
          </p>

          <div className="heroActions">
            <a className="button" href="#upload">Analyze my quotes →</a>
            <Link className="secondaryLink" href="/report">Open the full sample report</Link>
          </div>

          <div className="trust">
            <span>✓ Independent</span>
            <span>✓ No contractor affiliations</span>
            <span>✓ One-time payment</span>
          </div>
        </div>

        <div className="heroReport">
          <div className="reportTop">
            <div>
              <span className="miniLabel">Prism recommendation</span>
              <h2>Contractor B is the strongest proposal.</h2>
            </div>
            <div className="score">92</div>
          </div>

          <p>
            Contractor B is not the cheapest, but it offers the clearest scope,
            strongest warranty, and fewest unanswered questions.
          </p>

          <div className="recommendation">
            <div>
              <span>Recommended</span>
              <strong>Contractor B</strong>
            </div>
            <strong>$14,600</strong>
          </div>

          <div className="flags">
            <div className="good">✓ Permits included</div>
            <div className="good">✓ 10-year labor warranty</div>
            <div className="warn">! Quote A omits equipment model numbers</div>
          </div>

          <Link className="reportLink" href="/report">View full sample report →</Link>
        </div>
      </section>

      <section className="valueStrip">
        <div className="wrap valueStripInner">
          <strong>Make a better $20,000 decision for $49.</strong>
          <span>One report. No subscription. No sales pitch.</span>
        </div>
      </section>

      <section className="section soft" id="how">
        <div className="wrap">
          <div className="sectionHeader">
            <span className="eyebrow">How it works</span>
            <h2>Three steps. One confident decision.</h2>
          </div>

          <div className="steps">
            <article>
              <span>01</span>
              <h3>Upload your quotes</h3>
              <p>Add one to three proposals as PDFs or photos.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Prism compares the details</h3>
              <p>We review scope, pricing, warranties, exclusions, and missing information.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Get your report</h3>
              <p>See the best proposal, the risks, and the exact questions to ask.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section split wrap" id="upload">
        <div className="sectionCopy">
          <span className="eyebrow">Start your review</span>
          <h2>Upload your contractor quotes.</h2>
          <p>
            Add up to three proposals. Prism will compare the details that are easy to miss when every contractor formats quotes differently.
          </p>

          <ul className="checkList">
            <li>Side-by-side quote comparison</li>
            <li>Missing scope and exclusions flagged</li>
            <li>Questions tailored to each contractor</li>
            <li>Clear overall recommendation</li>
          </ul>
        </div>

        <div className="uploadCard">
          <div
            className="dropZone"
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addFiles(event.dataTransfer.files);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                inputRef.current?.click();
              }
            }}
          >
            <input
              ref={inputRef}
              type="file"
              hidden
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) => addFiles(event.target.files)}
            />
            <div className="uploadArrow">↑</div>
            <strong>Drop your quotes here</strong>
            <span>or click to browse</span>
            <small>PDF, PNG, or JPG · Up to 3 files</small>
          </div>

          {files.length > 0 && (
            <div className="fileList">
              {files.map((file, index) => (
                <div className="file" key={`${file.name}-${index}`}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFiles((current) => current.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            className="button full"
            disabled={files.length === 0}
            onClick={() => alert("Next step: connect secure upload and analysis.")}
          >
            Continue with {files.length || 0} {files.length === 1 ? "quote" : "quotes"} →
          </button>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="pricingCard">
          <span className="eyebrow light">Simple pricing</span>
          <h2>Make a better $20,000 decision for $49.</h2>
          <p>Compare up to three contractor proposals. One-time payment. No subscription.</p>
          <a className="button lightButton" href="#upload">Analyze my quotes →</a>
        </div>
      </section>

      <footer>
        <Logo inverse />
        <span>Clarity before commitment.</span>
        <small>© 2026 Prism</small>
      </footer>
    </main>
  );
}
