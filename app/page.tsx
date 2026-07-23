"use client";

import { useRef, useState } from "react";

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="logo" aria-label="Prism">
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
          <a href="#top">
            <Logo />
          </a>

          <nav>
            <a href="#how">How it works</a>
            <a href="#sample">Sample report</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <a className="button small" href="#upload">
            Analyze quotes
          </a>
        </div>
      </header>

      <section className="hero wrap" id="top">
        <div className="heroCopy">
          <span className="eyebrow">Independent quote analysis</span>
          <h1>
            Know what you’re agreeing to <span>before you sign.</span>
          </h1>
          <p>
            Upload up to three contractor proposals. Prism compares the scope,
            flags unclear terms, and shows you what to ask before spending thousands.
          </p>

          <div className="heroActions">
            <a className="button" href="#upload">Analyze my quotes →</a>
            <a className="secondaryLink" href="#sample">View sample report</a>
          </div>

          <div className="trust">
            <span>Secure upload</span>
            <span>Up to 3 quotes</span>
            <span>Clear comparison</span>
          </div>
        </div>

        <div className="preview" id="sample">
          <div className="previewHead">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <path d="M13 11L45 32L13 53V11Z" fill="#171717" />
              <path d="M45 32L54 38V52L34 39L45 32Z" fill="#b8b8b8" />
            </svg>
            <span>Proposal analysis</span>
            <em>Complete</em>
          </div>

          <div className="previewBody">
            <span className="label">Overall assessment</span>
            <h2>Most complete proposal</h2>

            <div className="winner">
              <div className="winnerBadge">B</div>
              <div className="winnerInfo">
                <span>Contractor B</span>
                <strong>$14,600</strong>
              </div>
              <small>High confidence</small>
            </div>

            <p>
              Contractor B submitted the clearest and most complete proposal.
              The higher price appears tied to documented scope, permits, and warranty coverage.
            </p>

            <div className="metricGrid">
              <div><span>Lowest price</span><strong>A</strong></div>
              <div><span>Fewest questions</span><strong>B</strong></div>
              <div><span>Best warranty</span><strong>B</strong></div>
            </div>

            <div className="note">
              <strong>Important difference</strong>
              <span>Quote A does not clearly document permits or full equipment model numbers.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="strip">
        <span>Built for major home projects</span>
        <div>
          <strong>HVAC</strong>
          <strong>Roofing</strong>
          <strong>Plumbing</strong>
          <strong>Electrical</strong>
          <strong>Remodeling</strong>
        </div>
      </section>

      <section className="section wrap" id="how">
        <div className="sectionCopy">
          <span className="eyebrow">How it works</span>
          <h2>Three steps. One clear answer.</h2>
        </div>

        <div className="steps">
          <article>
            <span>01</span>
            <div className="icon">⇧</div>
            <h3>Upload your quotes</h3>
            <p>Add one to three contractor proposals as PDFs or photos.</p>
          </article>

          <article>
            <span>02</span>
            <div className="icon">⌕</div>
            <h3>We compare the details</h3>
            <p>Scope, pricing, warranties, exclusions, and missing information.</p>
          </article>

          <article>
            <span>03</span>
            <div className="icon">▤</div>
            <h3>Get your report</h3>
            <p>See the clearest proposal and the questions to ask before signing.</p>
          </article>
        </div>
      </section>

      <section className="section split wrap" id="upload">
        <div className="sectionCopy">
          <span className="eyebrow">Start your review</span>
          <h2>Upload your contractor quotes.</h2>
          <p>
            Add up to three proposals. This version is ready for Stripe,
            secure storage, and the analysis workflow to be connected next.
          </p>

          <ul className="checkList">
            <li>Side-by-side comparison</li>
            <li>Missing scope flagged</li>
            <li>Questions for each contractor</li>
            <li>Downloadable report</li>
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
            <strong>Drop quotes here</strong>
            <span>or click to browse</span>
            <small>{files.length}/3 files added</small>
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
            onClick={() =>
              alert("Next step: connect payment, secure storage, and Prism analysis.")
            }
          >
            Continue →
          </button>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <span className="eyebrow light">Simple pricing</span>
        <h2>$49. One report. No subscription.</h2>
        <p>Compare up to three contractor proposals.</p>
        <a className="button lightButton" href="#upload">Analyze my quotes →</a>
      </section>

      <footer>
        <Logo inverse />
        <span>Clarity before commitment.</span>
        <small>© 2026 Prism</small>
      </footer>
    </main>
  );
}
