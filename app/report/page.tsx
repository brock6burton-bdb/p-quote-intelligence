import Link from "next/link";

export default function SampleReport() {
  return (
    <main className="emptyState">
      <span className="eyebrow">Sample report</span>
      <h1>See the real report format.</h1>
      <p>The functional MVP now creates this report from uploaded proposals.</p>
      <div className="actions">
        <Link className="button" href="/analyze?demo=1">Try demo analysis</Link>
        <Link className="textLink" href="/">Back home</Link>
      </div>
    </main>
  );
}
