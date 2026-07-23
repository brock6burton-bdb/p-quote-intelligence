"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useRef, useState } from "react";

function AnalyzeForm() {
  const params = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [projectType, setProjectType] = useState("HVAC replacement");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const sessionId = params.get("session_id") || "";
  const demo = params.get("demo") === "1";

  function addFiles(list: FileList | null) {
    if (!list) return;
    const acceptedTypes = ["application/pdf", "image/png", "image/jpeg"];
    const incoming = Array.from(list).filter(
      file => acceptedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    setFiles(current => [...current, ...incoming].slice(0, 3));
  }

  async function analyze() {
    if (!files.length) {
      setError("Please add at least one quote.");
      return;
    }

    setError("");
    setStatus("Uploading your quotes…");

    const body = new FormData();
    files.forEach(file => body.append("files", file));
    body.append("projectType", projectType);
    body.append("notes", notes);
    body.append("sessionId", sessionId);
    body.append("demo", demo ? "1" : "0");

    try {
      setStatus("Prism is comparing scope, pricing, and risk…");
      const response = await fetch("/api/analyze", { method: "POST", body });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Analysis failed.");

      localStorage.setItem("prismReport", JSON.stringify(data.report));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
      setStatus("");
    }
  }

  return (
    <main className="flowPage">
      <header className="flowHeader">
        <Link href="/" className="logo"><span className="logoMark">◩</span><span>PRISM</span></Link>
        <span>{demo ? "Demo mode" : "Payment confirmed"}</span>
      </header>

      <section className="flowWrap">
        <div className="flowIntro">
          <span className="eyebrow">Quote analysis</span>
          <h1>Upload your proposals.</h1>
          <p>PDF, JPG, or PNG. Up to three files, 10 MB each.</p>
        </div>

        <div className="formCard">
          <label>
            Project type
            <select value={projectType} onChange={e => setProjectType(e.target.value)}>
              <option>HVAC replacement</option>
              <option>Roof replacement</option>
              <option>Plumbing project</option>
              <option>Electrical project</option>
              <option>Windows or doors</option>
              <option>Remodeling project</option>
              <option>Other home project</option>
            </select>
          </label>

          <div
            className="dropZone"
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
          >
            <input
              ref={inputRef}
              hidden
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => addFiles(e.target.files)}
            />
            <strong>Drop quotes here</strong>
            <span>or click to browse</span>
          </div>

          {files.map((file, index) => (
            <div className="fileRow" key={`${file.name}-${index}`}>
              <span>{file.name}</span>
              <button onClick={() => setFiles(current => current.filter((_, i) => i !== index))}>Remove</button>
            </div>
          ))}

          <label>
            Anything Prism should know? <small>Optional</small>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Example: We care most about warranty and avoiding surprise charges."
            />
          </label>

          <button className="button full" onClick={analyze} disabled={!!status || !files.length}>
            {status || `Analyze ${files.length || 0} quote${files.length === 1 ? "" : "s"} →`}
          </button>
          {error && <p className="errorText">{error}</p>}
          <p className="finePrint">Prism provides decision support, not legal, engineering, or contractor licensing advice.</p>
        </div>
      </section>
    </main>
  );
}

export default function AnalyzePage() {
  return <Suspense fallback={<main className="flowPage"><p>Loading…</p></main>}><AnalyzeForm /></Suspense>;
}
