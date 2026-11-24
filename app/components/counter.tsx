"use client";
import { useEffect, useState } from "react";

// Counts once per browser session. The api sidecar owns the number.
export default function Counter() {
    const [n, setN] = useState<number | null>(null);
    useEffect(() => {
        let first = true;
        try { first = !sessionStorage.getItem("chipnuke.counted"); sessionStorage.setItem("chipnuke.counted", "1"); } catch { /* ignore */ }
        fetch("/api/hits", { method: first ? "POST" : "GET" })
            .then(r => (r.ok ? r.json() : Promise.reject()))
            .then(d => setN(typeof d.count === "number" ? d.count : null))
            .catch(() => setN(null));
    }, []);
    const digits = (n === null ? "------" : String(n).padStart(6, "0")).split("");
    return (
        <p className="odo" data-profile="NODE U9 // VISITORS|COUNTS:once per visitor per day|RAW IPS:none kept|TRACKERS:none" aria-label={n === null ? "Visitor counter offline" : `${n} visitors`}>
            {digits.map((d, i) => <span key={i}>{d}</span>)}
        </p>
    );
}
