import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@fontsource/silkscreen/400.css";
import "@fontsource/silkscreen/700.css";
import "../global.css";
import { SkinScript, SkinPicker, Scram } from "./components/skins";
import Counter from "./components/counter";
import Sparks from "./components/sparks";
import Buttons from "./components/buttons";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: { default: "chipnuke", template: "%s / chipnuke" },
    description: "Builds, breaks, prints and car stuff. The unprofessional site.",
    icons: { icon: "/brand/favicon-32.png", apple: "/brand/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#0e3b26", width: "device-width", initialScale: 1 };

const nav = [
    { href: "/", label: "home" },
    { href: "/posts/", label: "posts" },
    { href: "/shrines/", label: "shrines" },
    { href: "/now/", label: "now" },
    { href: "/guestbook/", label: "guestbook" },
    { href: "/links/", label: "links" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-skin="mask" suppressHydrationWarning>
            <head><SkinScript /></head>
            <body>
                <a className="skip" href="#main">Skip to content</a>
                <div className="board">
                    <header className="masthead">
                        <Link href="/" className="lockup" aria-label="chipnuke home">
                            <img src="/brand/mark.svg" alt="" width={96} height={96} className="mark" />
                            <span className="wordmark">chip<b>nuke</b></span>
                        </Link>
                        <p className="tag">builds, breaks, prints, and car stuff. best viewed at 1024x768.</p>
                        <Scram />
                    </header>

                    <div className="ticker" aria-hidden="true">
                        <div className="ticker-run">
                            <span>welcome to chipnuke</span><span>sign the guestbook</span><span>this site is under construction forever</span><span>no cookies, no tracking, one hit counter</span><span>do not press the red button</span>
                            <span>welcome to chipnuke</span><span>sign the guestbook</span><span>this site is under construction forever</span><span>no cookies, no tracking, one hit counter</span><span>do not press the red button</span>
                        </div>
                    </div>

                    <div className="columns">
                        <aside className="side">
                            <nav className="panel" aria-label="Site">
                                <h2 className="ref">J1 <span>nav</span></h2>
                                <ul className="pins">
                                    {nav.map((n, i) => <li key={n.href}><span className="pin">{i + 1}</span><Link href={n.href}>{n.label}</Link></li>)}
                                </ul>
                            </nav>
                            <section className="panel">
                                <h2 className="ref">U9 <span>visitors</span></h2>
                                <Counter />
                            </section>
                            <section className="panel">
                                <h2 className="ref">SW1 <span>skin</span></h2>
                                <SkinPicker />
                                <Sparks />
                            </section>
                            <section className="panel">
                                <h2 className="ref">J2 <span>buttons</span></h2>
                                <Buttons compact />
                            </section>
                        </aside>
                        <main id="main" className="main">{children}</main>
                    </div>

                    <footer className="foot">
                        <p>chipnuke rev 2.0. hand-soldered in Rochester, NY. no cookies. no tracking.</p>
                        <p><img src="/brand/button-88x31.png" alt="chipnuke 88x31 button" width={88} height={31} className="px" /></p>
                    </footer>
                </div>
            </body>
        </html>
    );
}
