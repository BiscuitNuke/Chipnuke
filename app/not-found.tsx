import Link from "next/link";

export default function NotFound() {
    return (
        <section className="panel">
            <h1 className="ref">404 <span>no continuity</span></h1>
            <p>Nothing on this pin. The page moved, or it never existed.</p>
            <p><Link href="/">Go back home</Link></p>
        </section>
    );
}
