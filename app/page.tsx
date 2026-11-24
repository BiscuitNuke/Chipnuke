import Link from "next/link";
import { getAll, getNow, niceDate } from "@/lib/content";
import Win from "./components/window";

export default function Home() {
    const posts = getAll("posts").slice(0, 5);
    const shrines = getAll("shrines");
    const now = getNow();
    return (
        <>
            <Win title="readme.txt">
                <p>hi. this is the other site. the clean resume one lives somewhere else.</p>
                <p>here it's half-finished builds, prints, car stuff, and whatever I fried this week.</p>
            </Win>

            <section className="panel">
                <h2 className="ref">U1 <span>latest posts</span></h2>
                <ul className="list">
                    {posts.map(p => (
                        <li key={p.slug} data-profile={`POST // ${p.slug}|FILED:${niceDate(p.date)}|TAGS:${p.tags.join(", ") || "none"}|STATUS:live`}>
                            <time dateTime={p.date}>{niceDate(p.date)}</time>
                            <Link href={`/posts/${p.slug}/`}>{p.title}</Link>
                            <span className="sum">{p.summary}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="panel">
                <h2 className="ref">U2-U{shrines.length + 1} <span>shrines</span></h2>
                <ul className="chips">
                    {shrines.map(s => (
                        <li key={s.slug}>
                            <Link href={`/shrines/${s.slug}/`} className="ic" data-profile={`SHRINE // ${s.part}|SUBJECT:${s.title}|LAST SEEN:${niceDate(s.date)}|TAGS:${s.tags.join(", ")}|STATUS:under construction`}>
                                <span className="ic-ref">{s.part}</span>
                                <span className="ic-name">{s.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="panel">
                <h2 className="ref">C1 <span>right now</span></h2>
                <div className="prose" dangerouslySetInnerHTML={{ __html: now.html }} />
                <p className="meta">updated {niceDate(now.updated)}. <Link href="/now/">more</Link></p>
            </section>
        </>
    );
}
