import Guestbook from "../components/guestbook";

export const metadata = { title: "guestbook" };

export default function Page() {
    return (
        <section className="panel">
            <h1 className="ref">guestbook</h1>
            <p>Leave a note. I approve each one by hand, so it won&apos;t show up right away.</p>
            <Guestbook />
        </section>
    );
}
