import Buttons from "../components/buttons";
import { SITE_URL } from "@/lib/site";

export const metadata = { title: "links" };

export default function Links() {
    return (
        <>
            <section className="panel">
                <h1 className="ref">button wall</h1>
                <p>Want to link here? Grab my button. Hotlink it or copy it, I don't care.</p>
                <Buttons />
                <pre className="code">{`<a href="${SITE_URL}/"><img src="${SITE_URL}/brand/button-88x31.png" width="88" height="31" alt="chipnuke"></a>`}</pre>
            </section>
            <section className="panel">
                <h2 className="ref">webrings</h2>
                <p>Not in any yet. Got one? Tell me in the guestbook.</p>
            </section>
        </>
    );
}
