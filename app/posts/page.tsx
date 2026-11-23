import Link from "next/link";
import { getAll, niceDate } from "@/lib/content";

export const metadata = { title: "posts" };

export default function Posts() {
    const posts = getAll("posts");
    return (
        <section className="panel">
            <h1 className="ref">U1 <span>all posts</span></h1>
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
    );
}
