import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

// Markdown files with a small front matter block. Read at build time only.
const root = path.join(process.cwd(), "content");

function parse(file: string) {
    const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const meta: Record<string, string> = {};
    (m ? m[1] : "").split("\n").forEach(line => {
        const i = line.indexOf(":");
        if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    });
    return { meta, html: marked.parse(m ? m[2] : raw, { async: false }) as string };
}

export type Entry = {
    slug: string; title: string; date: string; summary: string;
    tags: string[]; part: string; html: string;
};

export type Kind = "posts" | "shrines";

export function getAll(kind: Kind): Entry[] {
    const dir = path.join(root, kind);
    return fs.readdirSync(dir).filter(f => f.endsWith(".md")).map(f => {
        const { meta, html } = parse(path.join(dir, f));
        return {
            slug: f.replace(/\.md$/, ""),
            title: meta.title || f,
            date: meta.date || "",
            summary: meta.summary || "",
            tags: (meta.tags || "").split(",").map(t => t.trim()).filter(Boolean),
            part: meta.part || "",
            html,
        };
    }).sort((a, b) => kind === "shrines"
        ? a.part.localeCompare(b.part, "en", { numeric: true })
        : b.date.localeCompare(a.date));
}

export function getOne(kind: Kind, slug: string) {
    return getAll(kind).find(e => e.slug === slug);
}

export function getNow() {
    const { meta, html } = parse(path.join(root, "now.md"));
    return { updated: meta.updated || "", html };
}

export function niceDate(d: string) {
    if (!d) return "";
    return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
