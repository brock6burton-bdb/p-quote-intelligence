"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Quote = {
  name: string;
  price: string;
  score: number;
  strengths: string[];
  concerns: string[];
  details: Record<string, string>;
};

type Report = {
  projectType: string;
  summary: string;
  recommendedContractor: string;
  recommendationReason: string;
  confidenceScore: number;
  quotes: Quote[];
  riskFlags: Array<{ priority: string; title: string; explanation: string; contractor: string }>;
  questionsToAsk: string[];
  negotiationIdeas: string[];
  suggestedMessage: string;
  disclaimer: string;
};

export default function ResultsPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("prismReport");
    if (raw) {
      try { setReport(JSON.parse(raw)); } catch {}
    }
  }, []);

  if (!report) {
    return (
      <main className="emptyState">
        <h1>No report found.</h1>
        <p>Complete an analysis first.</p>
        <Link className="button" href="/analyze?demo=1">Start an analysis</Link>
      </main>
    );
  }

  return (
    <main className="resultsPage">
      <header className="flowHeader">
        <Link href="/" className="logo"><span className="logoMark">◩</span><span>PRISM</span></Link>
        <button className="printButton" onClick={() => window.print()}>Print / Save PDF</button>
      </header>

      <section className="resultsHero wrap">
        <div>
          <span className="eyebrow">{report.projectType}</span>
          <h1>Your quote analysis</h1>
          <p className="lead">{report.summary}</p>
        </div>
        <div className="bigScore"><strong>{report.confidenceScore}</strong><span>confidence</span></div>
      </section>

      <section className="reportBody wrap">
        <article className="reportBlock recommendationBlock">
          <span className="miniLabel">Recommended proposal</span>
          <h2>{report.recommendedContractor}</h2>
          <p>{report.recommendationReason}</p>
        </article>

        <article className="reportBlock">
          <span className="miniLabel">Proposal comparison</span>
          <h2>How the quotes compare</h2>
          <div className="quoteGrid">
            {report.quotes.map(quote => (
              <div className={`quoteCard ${quote.name === report.recommendedContractor ? "selected" : ""}`} key={quote.name}>
                <div className="quoteCardTop">
                  <div><small>{quote.name === report.recommendedContractor ? "Recommended" : "Proposal"}</small><h3>{quote.name}</h3></div>
                  <span className="quoteScore">{quote.score}</span>
                </div>
                <strong className="price">{quote.price}</strong>
                <dl>
                  {Object.entries(quote.details).map(([key, value]) => (
                    <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
                <h4>Strengths</h4>
                <ul>{quote.strengths.map(item => <li key={item}>{item}</li>)}</ul>
                <h4>Concerns</h4>
                <ul>{quote.concerns.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </article>

        <article className="reportBlock">
          <span className="miniLabel">Risk flags</span>
          <h2>What deserves attention</h2>
          <div className="riskList">
            {report.riskFlags.map((risk, index) => (
              <div className={`risk ${risk.priority.toLowerCase()}`} key={`${risk.title}-${index}`}>
                <span>{risk.priority} · {risk.contractor}</span>
                <h3>{risk.title}</h3>
                <p>{risk.explanation}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="reportBlock">
          <span className="miniLabel">Questions to ask</span>
          <h2>Get these answered before signing</h2>
          <ol className="questions">
            {report.questionsToAsk.map((q, i) => <li key={q}><span>{i + 1}</span><p>{q}</p></li>)}
          </ol>
        </article>

        <article className="reportBlock">
          <span className="miniLabel">Negotiation</span>
          <h2>Where you may have leverage</h2>
          <ul className="ideaList">{report.negotiationIdeas.map(i => <li key={i}>{i}</li>)}</ul>
          <div className="messageBox"><strong>Suggested message</strong><p>{report.suggestedMessage}</p></div>
        </article>

        <p className="disclaimer">{report.disclaimer}</p>
      </section>
    </main>
  );
}
