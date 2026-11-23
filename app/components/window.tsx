"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

// A little desktop window. Drag it by the title bar, close it with the x.
export default function Win({ title, children }: { title: string; children: React.ReactNode }) {
    const box = useRef<HTMLDivElement>(null);
    const bar = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(true);
    useEffect(() => {
        if (!box.current || !bar.current) return;
        gsap.registerPlugin(Draggable);
        const [d] = Draggable.create(box.current, { trigger: bar.current, bounds: ".main", type: "x,y" });
        return () => { d.kill(); };
    }, []);
    if (!open) return <button type="button" className="reopen" onClick={() => setOpen(true)}>open {title}</button>;
    return (
        <div className="win" ref={box} role="dialog" aria-label={title}>
            <div className="win-bar" ref={bar}>
                <span>{title}</span>
                <button type="button" aria-label={`Close ${title}`} onClick={() => setOpen(false)}>x</button>
            </div>
            <div className="win-body">{children}</div>
        </div>
    );
}
