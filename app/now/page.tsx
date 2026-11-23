import { getNow, niceDate } from "@/lib/content";

export const metadata = { title: "now" };

export default function Now() {
    const now = getNow();
    return (
        <section className="panel">
            <h1 className="ref">C1 <span>now</span></h1>
            <div className="prose" dangerouslySetInnerHTML={{ __html: now.html }} />
            <p className="meta">updated {niceDate(now.updated)}</p>
        </section>
    );
}
