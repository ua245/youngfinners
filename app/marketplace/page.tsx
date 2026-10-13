"use client";

import { useEffect, useState } from "react";
import { SAMPLE_STUDENT_ID, isValidStudentId } from "@/lib/auth";
import { DEMO_MARKETPLACE, type MarketplaceListing } from "@/lib/demo";

type View = "investor" | "founder";

const DEMO_USER_KEY = "yf-demo-student";
const DEMO_VIEW_KEY = "yf-marketplace-view";

export default function Marketplace() {
  const [studentId, setStudentId] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<View>("investor");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSignedIn(localStorage.getItem(DEMO_USER_KEY) === SAMPLE_STUDENT_ID);
    const storedView = localStorage.getItem(DEMO_VIEW_KEY);
    if (storedView === "investor" || storedView === "founder") setView(storedView);
  }, []);

  function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidStudentId(studentId)) {
      setError(`Use the sample student ID: ${SAMPLE_STUDENT_ID}`);
      return;
    }
    localStorage.setItem(DEMO_USER_KEY, SAMPLE_STUDENT_ID);
    setSignedIn(true);
    setError("");
  }

  function selectView(nextView: View) {
    setView(nextView);
    localStorage.setItem(DEMO_VIEW_KEY, nextView);
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Idea Marketplace</h1>
        <p className="text-slate">Discover student ventures or manage your own fundraising profile.</p>
      </div>

      {!signedIn ? (
        <form className="panel max-w-xl space-y-3" onSubmit={signIn}>
          <div>
            <h2 className="font-bold">Student sign in</h2>
            <p className="text-sm text-slate">Demo access is limited to a verified university student ID.</p>
          </div>
          <label className="block text-sm text-slate">
            University student ID
            <input
              className="field mt-1"
              type="email"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder={SAMPLE_STUDENT_ID}
              autoComplete="username"
            />
          </label>
          {error && <p className="text-sm text-crimson">{error}</p>}
          <button className="btn" type="submit">Sign in to marketplace</button>
        </form>
      ) : (
        <>
          <div className="panel flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-bold">Signed in as {SAMPLE_STUDENT_ID}</div>
              <div className="text-sm text-slate">Demo student account</div>
            </div>
            <div className="flex gap-2" aria-label="Marketplace view">
              <button className={view === "investor" ? "btn" : "btn-secondary"} type="button" onClick={() => selectView("investor")}>
                Investor view
              </button>
              <button className={view === "founder" ? "btn" : "btn-secondary"} type="button" onClick={() => selectView("founder")}>
                Startup founder view
              </button>
            </div>
          </div>
          {view === "investor" ? <InvestorView listings={DEMO_MARKETPLACE} /> : <FounderView />}
        </>
      )}
    </>
  );
}

function InvestorView({ listings }: { listings: MarketplaceListing[] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Student startups seeking micro-funding</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {listings.map((listing) => {
          const progress = Math.round((listing.raised / listing.fundingTarget) * 100);
          return (
            <article className="panel space-y-3" key={listing.name}>
              <div className="flex items-start justify-between gap-3">
                <div><h3 className="font-bold">{listing.name}</h3><p className="text-sm text-slate">{listing.category} · {listing.stage}</p></div>
                <span className="text-sm text-crimson">{progress}% funded</span>
              </div>
              <p className="text-sm">{listing.summary}</p>
              <p className="text-sm text-slate">Founder: {listing.founder} · {listing.traction}</p>
              <div className="h-2 overflow-hidden rounded bg-bg"><div className="h-full bg-crimson" style={{ width: `${progress}%` }} /></div>
              <div className="font-mono text-sm">${listing.raised} / ${listing.fundingTarget}</div>
              <button className="btn w-full" type="button">Review opportunity</button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FounderView() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="panel lg:col-span-2">
        <div className="mb-3 flex items-start justify-between">
          <div><h2 className="font-bold">Your startup profile</h2><p className="text-sm text-slate">Create an idea profile for the marketplace.</p></div>
          <span className="text-sm text-crimson">Draft</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-slate">Startup name<input className="field mt-1" defaultValue="CampusCart" /></label>
          <label className="text-sm text-slate">Category<input className="field mt-1" defaultValue="Campus tech" /></label>
          <label className="text-sm text-slate md:col-span-2">Idea summary<textarea className="field mt-1 min-h-24" defaultValue="A shared delivery network for student essentials across campus." /></label>
          <label className="text-sm text-slate">Funding target ($)<input className="field mt-1" type="number" defaultValue="1500" min="0" /></label>
          <label className="text-sm text-slate">Current stage<select className="field mt-1" defaultValue="Idea"><option>Idea</option><option>MVP</option><option>Pilot ready</option></select></label>
        </div>
        <button className="btn mt-4" type="button">Save marketplace draft</button>
      </div>
      <aside className="panel">
        <h2 className="font-bold">Founder checklist</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate">
          <li>1. Define the student problem</li>
          <li>2. Set a micro-funding target</li>
          <li>3. Validate your idea with Zaro</li>
          <li>4. Publish when ready</li>
        </ul>
      </aside>
    </section>
  );
}
