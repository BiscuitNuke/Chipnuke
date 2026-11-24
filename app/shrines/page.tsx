import Link from "next/link";
import { getAll, niceDate } from "@/lib/content";

export const metadata = { title: "shrines" };

export default function Shrines() {
    const shrines = getAll("shrines");
    return (
        <section className="panel">
            <h1 className="ref">U2+ <span>shrines</span></h1>
            <p>One page per obsession. Each one gets updated as the build goes.</p>
            <ul className="chips big">
                {shrines.map(s => (
                    <li key={s.slug}>
                        <Link href={`/shrines/${s.slug}/`} className="ic" data-profile={`SHRINE // ${s.part}|SUBJECT:${s.title}|LAST SEEN:${niceDate(s.date)}|TAGS:${s.tags.join(", ")}|STATUS:under construction`}>
                            <span className="ic-ref">{s.part}</span>
                            <span className="ic-name">{s.title}</span>
                            <span className="ic-sum">{s.summary}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
