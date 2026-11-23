"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";

// Cursor sparks. Off by default, never on with reduced motion.
export default function Sparks() {
    const [on, setOn] = useState(false);
    const [still, setStill] = useState(false);
    useEffect(() => {
        setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        try { setOn(localStorage.getItem("chipnuke.sparks") === "1"); } catch { /* ignore */ }
    }, []);
    useEffect(() => {
        if (!on || still) return;
        let last = 0;
        function move(e: PointerEvent) {
            if (e.pointerType !== "mouse") return;
            const now = performance.now();
            if (now - last < 28) return;
            last = now;
            const s = document.createElement("span");
            s.className = "spark";
            s.style.left = e.clientX + "px";
            s.style.top = e.clientY + "px";
            document.body.appendChild(s);
            gsap.to(s, {
                x: gsap.utils.random(-24, 24), y: gsap.utils.random(8, 40), opacity: 0, scale: 0.2,
                duration: gsap.utils.random(0.5, 0.9), ease: "power1.out", onComplete: () => s.remove(),
            });
        }
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
    }, [on, still]);
    if (still) return null;
    return (
        <label className="toggle">
            <input type="checkbox" checked={on} onChange={e => {
                setOn(e.target.checked);
                try { localStorage.setItem("chipnuke.sparks", e.target.checked ? "1" : "0"); } catch { /* ignore */ }
            }} />
            cursor sparks
        </label>
    );
}
