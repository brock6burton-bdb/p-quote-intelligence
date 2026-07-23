import Link from "next/link";

const comparisonRows = [
  ["Total price", "$13,200", "$14,600", "$12,900"],
  ["Permit costs", "Not stated", "Included", "Excluded"],
  ["Equipment models", "Partial", "Complete", "Not stated"],
  ["Labor warranty", "2 years", "10 years", "1 year"],
  ["Workmanship coverage", "Unclear", "Clearly defined", "Limited"],
  ["Change-order process", "Not defined", "Written approval required", "Not defined"],
  ["Estimated timeline", "2–3 days", "3 days", "Not stated"]
];

const questions = [
  "Are permit fees included in the total contract price?",
  "Which exact equipment model numbers will be installed?",
  "What conditions could trigger a change order?",
  "Who is responsible for disposal and haul-away?",
  "Does the labor warranty transfer to a future homeowner?"
];

export default function ReportPage() {
  return (
    <main className="reportPage">
      <header className="reportNav">
        <div className="wrap reportNavInner">
          <Link className="backLink" href="/">← Back to Prism</Link>
          <span>Sample HVAC Quote Analysis</span>
          <a className="button small" href="/#upload">Analyze my quotes</a>
        </div>
      </header>

      <section className="reportHero wrap">
        <div>
          <span className="eyebrow">Sample report</span>
          <h1>Your contractor quote analysis</h1>
          <p>
            Three HVAC replacement proposals reviewed for pricing, scope clarity,
            warranty coverage, hidden risk, and unanswered questions.
          </p>
        </div>

        <div className="reportMeta">
          <span>Project</span>
          <strong>3-ton HVAC replacement</strong>
          <span>Quotes reviewed</span>
          <strong>3</strong>
          <span>Estimated project range</span>
          <strong>$12,900–$14,600</strong>
        </div>
      </section>

      <section className="wrap reportLayout">
        <aside className="reportSidebar">
          <a href="#recommendation">Recommendation</a>
          <a href="#comparison">Comparison</a>
          <a href="#risks">Risk flags</a>
          <a href="#questions">Questions to ask</a>
          <a href="#negotiation">Negotiation notes</a>
        </aside>

        <div className="reportContent">
          <section className="reportSection" id="recommendation">
            <div className="recommendationHeader">
              <div>
                <span className="miniLabel">Overall recommendation</span>
                <h2>Choose Contractor B—after confirming two final details.</h2>
              </div>
              <div className="largeScore">
                <strong>92</strong>
                <span>out of 100</span>
              </div>
            </div>

            <p className="lead">
              Contractor B presents the strongest overall value. It is $1,400 more than the lowest bid,
              but the proposal provides the clearest equipment details, strongest labor warranty,
              permit coverage, and the most defined change-order process.
            </p>

            <div className="summaryGrid">
              <article>
                <span>Best overall</span>
                <strong>Contractor B</strong>
                <small>Strongest combination of scope and protection</small>
              </article>
              <article>
                <span>Lowest price</span>
                <strong>Contractor C</strong>
                <small>Lowest cost, but highest uncertainty</small>
              </article>
              <article>
                <span>Price difference</span>
                <strong>$1,700</strong>
                <small>Between highest and lowest proposals</small>
              </article>
            </div>

            <div className="finalChecks">
              <strong>Confirm before signing:</strong>
              <ul>
                <li>Verify the exact thermostat model included.</li>
                <li>Confirm whether crane access or unusual electrical work could add cost.</li>
              </ul>
            </div>
          </section>

          <section className="reportSection" id="comparison">
            <span className="miniLabel">Side-by-side comparison</span>
            <h2>What each proposal actually includes</h2>

            <div className="comparisonCard reportComparison">
              <div className="comparisonHeader">
                <div></div>
                <div>Contractor A</div>
                <div className="recommendedCol">Contractor B <span>Recommended</span></div>
                <div>Contractor C</div>
              </div>

              {comparisonRows.map((row) => (
                <div className="comparisonRow" key={row[0]}>
                  <div>{row[0]}</div>
                  <div>{row[1]}</div>
                  <div className="recommendedCol">{row[2]}</div>
                  <div>{row[3]}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="reportSection" id="risks">
            <span className="miniLabel">Risk flags</span>
            <h2>What deserves more attention</h2>

            <div className="riskList">
              <article className="riskHigh">
                <span>High priority</span>
                <h3>Contractor C excludes permits.</h3>
                <p>
                  The lowest quote may become more expensive once permit costs are added.
                  Ask for the exact permit amount before comparing final prices.
                </p>
              </article>

              <article className="riskMedium">
                <span>Medium priority</span>
                <h3>Contractor A lists incomplete equipment details.</h3>
                <p>
                  Without full model numbers, it is difficult to verify efficiency ratings,
                  warranty eligibility, and whether the equipment matches what was discussed.
                </p>
              </article>

              <article className="riskMedium">
                <span>Medium priority</span>
                <h3>Contractor C does not define the project timeline.</h3>
                <p>
                  Request a written start date, expected completion date, and explanation of
                  what happens if equipment delivery is delayed.
                </p>
              </article>
            </div>
          </section>

          <section className="reportSection" id="questions">
            <span className="miniLabel">Questions to ask</span>
            <h2>Send these before making your decision</h2>

            <ol className="questionList">
              {questions.map((question, index) => (
                <li key={question}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{question}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="reportSection" id="negotiation">
            <span className="miniLabel">Negotiation notes</span>
            <h2>Where you may have leverage</h2>

            <div className="negotiationBox">
              <p>
                Contractor B appears strongest, but its price is $1,400 above Contractor A.
                Rather than asking for a broad discount, request one of the following:
              </p>
              <ul>
                <li>Match Contractor A’s price more closely.</li>
                <li>Include an upgraded thermostat at no additional charge.</li>
                <li>Add one year of maintenance or extend workmanship coverage.</li>
              </ul>
              <div className="messageTemplate">
                <strong>Suggested message</strong>
                <p>
                  “Your proposal is currently our preferred option because the scope and warranty are
                  clearer. We do have another comparable quote that is $1,400 lower. Is there any flexibility
                  in the price, or could you include an upgraded thermostat or maintenance coverage?”
                </p>
              </div>
            </div>
          </section>

          <section className="reportCta">
            <span className="eyebrow light">Ready for your own report?</span>
            <h2>Know what you’re agreeing to before you sign.</h2>
            <p>Upload up to three contractor proposals and get a clear comparison for $49.</p>
            <Link className="button lightButton" href="/#upload">Analyze my quotes →</Link>
          </section>
        </div>
      </section>
    </main>
  );
}
