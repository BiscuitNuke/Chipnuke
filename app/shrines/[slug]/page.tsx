import { notFound } from "next/navigation";
import Link from "next/link";
import { getAll, getOne, niceDate } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() { return getAll("shrines").map(s => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const s = getOne("shrines", (await params).slug);
    return s ? { title: s.title, description: s.summary } : {};
}

export default async function Shrine({ params }: { params: Promise<{ slug: string }> }) {
    const s = getOne("shrines", (await params).slug);
    if (!s) notFound();
    return (
        <article className="panel">
            <p className="meta"><Link href="/shrines/">shrines</Link> / {s.part} / last touched <time dateTime={s.date}>{niceDate(s.date)}</time></p>
            <h1 className="title">{s.title}</h1>
            <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
            <p className="construction">this shrine is under construction</p>
        </article>
    );
}
