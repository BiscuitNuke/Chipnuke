import Link from "next/link";
import { getAll, getNow, niceDate } from "@/lib/content";

export default function Home() {
    const posts = getAll("posts").slice(0, 5);
    const shrines = getAll("shrines");
    const now = getNow();
    return (
        <>
            <section className="panel intro">
                <p>hi. this is the other site. the clean resume one lives somewhere else. here it&apos;s half-finished builds, prints, car stuff, and whatever I fried this week.</p>
            </section>

            <section className="panel">
                <h2 className="ref">latest posts</h2>
                <ul className="list">
                    {posts.map(p => (
                        <li key={p.slug}>
                            <time dateTime={p.date}>{niceDate(p.date)}</time>
                            <Link href={`/posts/${p.slug}/`}>{p.title}</Link>
                            <span className="sum">{p.summary}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="panel">
                <h2 className="ref">shrines</h2>
                <ul className="chips">
                    {shrines.map(s => (
                        <li key={s.slug}>
                            <Link href={`/shrines/${s.slug}/`} className="ic">
                                <span className="ic-name">{s.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="panel">
                <h2 className="ref">right now</h2>
                <div className="prose" dangerouslySetInnerHTML={{ __html: now.html }} />
                <p className="meta">updated {niceDate(now.updated)}. <Link href="/now/">more</Link></p>
            </section>
        </>
    );
}
