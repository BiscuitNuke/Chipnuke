"use client";
import { useEffect, useState } from "react";

type Entry = { id: number; name: string; message: string; website: string; created: string };

function safeUrl(u: string) {
    try { const x = new URL(u); return x.protocol === "https:" || x.protocol === "http:" ? x.href : ""; } catch { return ""; }
}

export default function Guestbook() {
    const [entries, setEntries] = useState<Entry[] | null>(null);
    const [offline, setOffline] = useState(false);
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/guestbook")
            .then(r => (r.ok ? r.json() : Promise.reject()))
            .then(d => setEntries(Array.isArray(d.entries) ? d.entries : []))
            .catch(() => setOffline(true));
    }, []);

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setState("sending");
        try {
            const r = await fetch("/api/guestbook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: f.get("name"), message: f.get("message"),
                    website: f.get("website"), fax: f.get("fax"),
                }),
            });
            if (r.ok) { setState("sent"); (e.target as HTMLFormElement).reset(); return; }
            const d = await r.json().catch(() => ({}));
            setError(d.error || "The guestbook didn't take that. Try again in a bit.");
            setState("error");
        } catch {
            setError("Can't reach the guestbook right now. Try again later.");
            setState("error");
        }
    }

    return (
        <>
            <form className="gb-form" onSubmit={submit}>
                <label>name <input name="name" required maxLength={40} autoComplete="nickname" /></label>
                <label>your site (optional) <input name="website" type="url" maxLength={200} placeholder="https://" /></label>
                <label>message <textarea name="message" required maxLength={500} rows={4} /></label>
                <label className="hp" aria-hidden="true">fax <input name="fax" tabIndex={-1} autoComplete="off" /></label>
                <button type="submit" disabled={state === "sending"}>{state === "sending" ? "signing..." : "Sign the guestbook"}</button>
                <p className="gb-status" role="status">
                    {state === "sent" && "Signed. It shows up after I approve it."}
                    {state === "error" && error}
                </p>
            </form>

            <h2 className="ref">signatures</h2>
            {offline && <p className="meta">The guestbook is offline right now. Signatures will be back soon.</p>}
            {entries && entries.length === 0 && <p className="meta">No signatures yet. Be the first.</p>}
            {entries && entries.length > 0 && (
                <ol className="gb-list">
                    {entries.map(en => {
                        const url = safeUrl(en.website);
                        return (
                            <li key={en.id}>
                                <p className="gb-who">
                                    {url ? <a href={url} rel="nofollow ugc noopener" target="_blank">{en.name}</a> : en.name}
                                    <time dateTime={en.created}>{en.created.slice(0, 10)}</time>
                                </p>
                                <p className="gb-msg">{en.message}</p>
                            </li>
                        );
                    })}
                </ol>
            )}
        </>
    );
}
