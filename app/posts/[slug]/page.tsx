import { notFound } from "next/navigation";
import Link from "next/link";
import { getAll, getOne, niceDate } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() { return getAll("posts").map(p => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const p = getOne("posts", (await params).slug);
    return p ? { title: p.title, description: p.summary } : {};
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
    const p = getOne("posts", (await params).slug);
    if (!p) notFound();
    return (
        <article className="panel">
            <p className="meta"><Link href="/posts/">posts</Link> / <time dateTime={p.date}>{niceDate(p.date)}</time>{p.tags.length > 0 && <> / {p.tags.join(", ")}</>}</p>
            <h1 className="title">{p.title}</h1>
            <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />
        </article>
    );
}
