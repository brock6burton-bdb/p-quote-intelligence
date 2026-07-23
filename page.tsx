"use client";

import { ArrowRight, Check, FileText, Lock, Search, Upload } from "lucide-react";
import { useRef, useState } from "react";
import Logo from "../components/Logo";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted = Array.from(list)
      .filter((file) =>
        ["application/pdf", "image/png", "image/jpeg"].includes(file.type)
      )
      .slice(0, 3 - files.length);

    setFiles((current) => [...current, ...accepted].slice(0, 3));
  }

  return (
    <main>
      <header className="header">
        <Logo />
        <nav>
          <a href="#how">How it works</a>
          <a href="#sample">Sample report</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a className="button small" href="#upload">
          Analyze quotes
        </a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Independent quote analysis</span>
          <h1>
            Know what you’re agreeing to
            <span> before you sign.</span>
          </h1>
          <p>
            Upload up to three contractor proposals. Prism compares the scope,
            flags unclear terms, and shows you what to ask before spending
            thousands.
          </p>

          <div className="hero-actions">
            <a className="button" href="#upload">
              Analyze my quotes
              <ArrowRight size={18} />
            </a>
            <a className="secondary-link" href="#sample">
              View sample report
            </a>
          </div>

          <div className="trust">
            <span><Lock size={15} /> Secure upload</span>
            <span><FileText size={15} /> Up to 3 quotes</span>
            <span><Search size={15} /> Clear comparison</span>
          </div>
        </div>

        <div className="preview" id="sample">
          <div className="preview-head">
            <Logo compact />
            <span>Proposal analysis</span>
            <em>Complete</em>
          </div>

          <div className="preview-body">
            <span className="label">Overall assessment</span>
            <h2>Most complete proposal</h2>

            <div className="winner">
              <div className="winner-badge">B</div>
              <div>
                <span>Contractor B</span>
                <strong>$14,600</strong>
              </div>
              <small>High confidence</small>
            </div>

            <p>
              Contractor B submitted the clearest and most complete proposal.
              The higher price appears tied to documented scope, permits, and
              warranty coverage.
            </p>

            <div className="metric-grid">
              <div><span>Lowest price</span><strong>A</strong></div>
              <div><span>Fewest questions</span><strong>B</strong></div>
              <div><span>Best warranty</span><strong>B</strong></div>
            </div>

            <div className="note">
              <strong>Important difference</strong>
              <span>
                Quote A does not clearly document permits or full equipment
                model numbers.
              </span>
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

      <section className="section" id="how">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>Three steps. One clear answer.</h2>
        </div>

        <div className="steps">
          <article>
            <span>01</span>
            <Upload />
            <h3>Upload your quotes</h3>
            <p>Add one to three contractor proposals as PDFs or photos.</p>
          </article>

          <article>
            <span>02</span>
            <Search />
            <h3>We compare the details</h3>
            <p>Scope, pricing, warranties, exclusions, and missing information.</p>
          </article>

          <article>
            <span>03</span>
            <FileText />
            <h3>Get your report</h3>
            <p>See the clearest proposal and the questions to ask before signing.</p>
          </article>
        </div>
      </section>

      <section className="section split" id="upload">
        <div>
          <span className="eyebrow">Start your review</span>
          <h2>Upload your contractor quotes.</h2>
          <p>
            Add up to three proposals. The upload interface is ready for Stripe,
            secure storage, and the analysis workflow to be connected next.
          </p>

          <ul>
            <li><Check size={17} /> Side-by-side comparison</li>
            <li><Check size={17} /> Missing scope flagged</li>
            <li><Check size={17} /> Questions for each contractor</li>
            <li><Check size={17} /> Downloadable report</li>
          </ul>
        </div>

        <div className="upload-card">
          <div
            className="drop-zone"
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addFiles(event.dataTransfer.files);
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
            <Upload size={28} />
            <strong>Drop quotes here</strong>
            <span>or click to browse</span>
            <small>{files.length}/3 files added</small>
          </div>

          {files.length > 0 && (
            <div className="file-list">
              {files.map((file, index) => (
                <div className="file" key={`${file.name}-${index}`}>
                  <span>{file.name}</span>
                  <button onClick={() => setFiles(files.filter((_, i) => i !== index))}>
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
              alert("Next step: connect Stripe, secure storage, and Prism analysis.")
            }
          >
            Continue
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <span className="eyebrow light">Simple pricing</span>
        <h2>$49. One report. No subscription.</h2>
        <p>Compare up to three contractor proposals.</p>
        <a className="button light-button" href="#upload">
          Analyze my quotes
          <ArrowRight size={18} />
        </a>
      </section>

      <footer>
        <Logo inverse />
        <span>Clarity before commitment.</span>
        <small>© 2026 Prism</small>
      </footer>
    </main>
  );
}
