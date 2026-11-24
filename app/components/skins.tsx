"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";

const SKINS = [
    { id: "wafer", label: "cleanroom" },
    { id: "fab", label: "fab at night" },
    { id: "kapton", label: "kapton tape" },
    { id: "grid", label: "cn.OS" },
] as const;

const KEY = "chipnuke.skin";

// Runs before paint so the saved skin never flashes.
export function SkinScript() {
    const js = `try{var s=localStorage.getItem("${KEY}");if(s==="wafer"||s==="fab"||s==="kapton"||s==="grid")document.documentElement.dataset.skin=s}catch(e){}`;
    return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

export function SkinPicker() {
    const [skin, setSkin] = useState("wafer");
    useEffect(() => { setSkin(document.documentElement.dataset.skin || "wafer"); }, []);
    function pick(id: string) {
        setSkin(id);
        document.documentElement.dataset.skin = id;
        try { localStorage.setItem(KEY, id); } catch { /* storage blocked */ }
        if (id === "grid") window.dispatchEvent(new Event("cnos:boot"));
    }
    return (
        <fieldset className="skins">
            <legend className="sr">Site skin</legend>
            {SKINS.map(s => (
                <label key={s.id}>
                    <input type="radio" name="skin" value={s.id} checked={skin === s.id} onChange={() => pick(s.id)} />
                    <span className={`swatch sw-${s.id}`} aria-hidden="true" />{s.label}
                </label>
            ))}
        </fieldset>
    );
}

// The one big toy: SCRAM floods the page with UV, like erasing an EPROM.
export function Scram() {
    const [hot, setHot] = useState(false);
    function toggle() {
        const next = !hot;
        setHot(next);
        const root = document.documentElement;
        root.classList.toggle("meltdown", next);
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const mark = document.querySelector(".masthead .dip");
        if (still) return;
        if (next) {
            gsap.fromTo(".board", { x: 0 }, { x: 6, duration: 0.05, repeat: 11, yoyo: true, ease: "none", clearProps: "x" });
            if (mark) gsap.fromTo(mark, { rotation: 0 }, { rotation: 3, duration: 0.06, repeat: 15, yoyo: true, ease: "none" });
        } else if (mark) {
            gsap.to(mark, { rotation: 0, duration: 0.3 });
        }
    }
    return (
        <button type="button" className="scram" aria-pressed={hot} onClick={toggle}>
            <span className="scram-cap">{hot ? "reset" : "scram"}</span>
        </button>
    );
}
