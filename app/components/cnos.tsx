"use client";
import { useEffect, useRef, useState } from "react";

/* cn.OS: the surveillance-OS skin. Inspired by city-OS ads, all original.
   - Network: nodes and links behind the page, with pulses running along the links.
   - Handshake: a short boot overlay when the skin turns on.
   - Profiler: hover anything with data-profile and a scan card follows the cursor.
   All of it runs only while data-skin="grid", and reduced motion turns the motion off. */

const isGrid = () => document.documentElement.dataset.skin === "grid";
const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useGrid() {
    const [on, setOn] = useState(false);
    useEffect(() => {
        setOn(isGrid());
        const mo = new MutationObserver(() => setOn(isGrid()));
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });
        return () => mo.disconnect();
    }, []);
    return on;
}

type Node = { x: number; y: number; vx: number; vy: number };
type Pulse = { a: number; b: number; t: number };

export function Network() {
    const on = useGrid();
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const cv = ref.current;
        if (!on || !cv) return;
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0, h = 0, raf = 0, nodes: Node[] = [], pulses: Pulse[] = [];
        const LINK = 170;
        const size = () => {
            w = window.innerWidth; h = window.innerHeight;
            cv.width = w * dpr; cv.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.round(Math.min(70, (w * h) / 22000));
            nodes = Array.from({ length: count }, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
            }));
        };
        const draw = (moving: boolean) => {
            ctx.clearRect(0, 0, w, h);
            if (moving) for (const n of nodes) {
                n.x += n.vx; n.y += n.vy;
                if (n.x < -20 || n.x > w + 20) n.vx *= -1;
                if (n.y < -20 || n.y > h + 20) n.vy *= -1;
            }
            const links: [number, number][] = [];
            for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                const d = Math.hypot(dx, dy);
                if (d < LINK) {
                    links.push([i, j]);
                    ctx.strokeStyle = `rgba(110, 200, 255, ${0.16 * (1 - d / LINK)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
                }
            }
            for (const n of nodes) {
                ctx.fillStyle = "rgba(170, 225, 255, 0.55)";
                ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3);
            }
            if (!moving) return;
            if (links.length && pulses.length < 6 && Math.random() < 0.04) {
                const [a, b] = links[Math.floor(Math.random() * links.length)];
                pulses.push({ a, b, t: 0 });
            }
            pulses = pulses.filter(p => p.t <= 1);
            for (const p of pulses) {
                p.t += 0.012;
                const A = nodes[p.a], B = nodes[p.b];
                const x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t;
                ctx.fillStyle = "rgba(76, 194, 255, 0.95)";
                ctx.shadowColor = "rgba(76, 194, 255, 0.9)"; ctx.shadowBlur = 8;
                ctx.fillRect(x - 2, y - 2, 4, 4);
                ctx.shadowBlur = 0;
            }
        };
        size();
        const loop = () => { draw(true); raf = requestAnimationFrame(loop); };
        if (still()) draw(false); else loop();
        const onResize = () => { size(); if (still()) draw(false); };
        const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden && !still()) loop(); };
        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", onVis);
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); document.removeEventListener("visibilitychange", onVis); };
    }, [on]);
    if (!on) return null;
    return <canvas ref={ref} className="cnos-net" aria-hidden="true" />;
}

const BOOT = [
    "cn.OS 2.0 // node handshake",
    "linking ......... 47 nodes",
    "visitor ......... profiled",
    "threat level .... low",
    "access granted",
];

export function Handshake() {
    const [n, setN] = useState(-1);
    useEffect(() => {
        let timers: ReturnType<typeof setTimeout>[] = [];
        const run = () => {
            try { sessionStorage.setItem("cnos.booted", "1"); } catch { /* storage blocked */ }
            if (still()) return;
            timers.forEach(clearTimeout);
            setN(0);
            timers = BOOT.map((_, i) => setTimeout(() => setN(i + 1), 90 + i * 150));
            timers.push(setTimeout(() => setN(-1), 1350));
        };
        window.addEventListener("cnos:boot", run);
        // Once per visit when the saved skin is already cn.OS.
        try {
            if (isGrid() && !sessionStorage.getItem("cnos.booted")) run();
        } catch { /* storage blocked */ }
        return () => { window.removeEventListener("cnos:boot", run); timers.forEach(clearTimeout); };
    }, []);
    if (n < 0) return null;
    return (
        <div className={"cnos-boot" + (n >= BOOT.length ? " out" : "")} onClick={() => setN(-1)} aria-hidden="true">
            <svg className="cnos-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" /><circle cx="50" cy="50" r="31" /><path d="M50 0v14M50 86v14M0 50h14M86 50h14" /></svg>
            <pre>{BOOT.slice(0, n).map(l => "> " + l).join("\n")}<span className="cnos-caret">▌</span></pre>
        </div>
    );
}

type Card = { x: number; y: number; title: string; rows: [string, string][]; id: number };

export function Profiler() {
    const on = useGrid();
    const [card, setCard] = useState<Card | null>(null);
    const seq = useRef(0);
    useEffect(() => {
        setCard(null);
        if (!on || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || still()) return;
        let current: Element | null = null;
        const over = (e: MouseEvent) => {
            const el = (e.target as Element).closest?.("[data-profile]") ?? null;
            if (el === current) return;
            current = el;
            if (!el) { setCard(null); return; }
            const [title, ...rest] = (el.getAttribute("data-profile") || "").split("|");
            const rows = rest.map(r => { const i = r.indexOf(":"); return [r.slice(0, i), r.slice(i + 1)] as [string, string]; });
            setCard({ x: e.clientX, y: e.clientY, title, rows, id: ++seq.current });
        };
        const move = (e: MouseEvent) => { if (current) setCard(c => c && { ...c, x: e.clientX, y: e.clientY }); };
        document.addEventListener("mouseover", over);
        document.addEventListener("mousemove", move, { passive: true });
        return () => { document.removeEventListener("mouseover", over); document.removeEventListener("mousemove", move); };
    }, [on]);
    if (!card) return null;
    const flip = card.x > window.innerWidth - 300;
    return (
        <div key={card.id} className={"cnos-pf" + (flip ? " flip" : "")} style={{ left: card.x, top: card.y }} aria-hidden="true">
            <span className="cnos-pf-scan" />
            <p className="cnos-pf-title"><i />{card.title}</p>
            <dl>{card.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className={/low|online|live|none/i.test(v) ? "ok" : ""}>{v}</dd></div>)}</dl>
        </div>
    );
}
