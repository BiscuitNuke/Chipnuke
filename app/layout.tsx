import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@fontsource/silkscreen/400.css";
import "@fontsource/silkscreen/700.css";
import "../global.css";
import { SkinScript, SkinPicker, Scram } from "./components/skins";
import Counter from "./components/counter";
import Buttons from "./components/buttons";
import Dip from "./components/dip";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: { default: "chipnuke", template: "%s / chipnuke" },
    description: "Builds, breaks, prints and car stuff. The unprofessional site.",
    icons: { icon: "/brand/favicon-32.png", apple: "/brand/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#e8ebef", width: "device-width", initialScale: 1 };

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
        <html lang="en" data-skin="wafer" suppressHydrationWarning>
            <head><SkinScript /></head>
            <body>
                <a className="skip" href="#main">Skip to content</a>
                <div className="board">
                    <header className="masthead">
                        <Link href="/" className="lockup" aria-label="chipnuke home">
                            <Dip />
                            <span className="wordmark">chip<b>nuke</b></span>
                        </Link>
                        <p className="tag">builds, breaks, prints, and car stuff. best viewed at 1024x768.</p>
                        <Scram />
                    </header>

                    <div className="columns">
                        <aside className="side">
                            <nav className="panel" aria-label="Site">
                                <h2 className="ref">menu</h2>
                                <ul className="pins">
                                    {nav.map((n, i) => <li key={n.href}><span className="pin">{i + 1}</span><Link href={n.href}>{n.label}</Link></li>)}
                                </ul>
                            </nav>
                            <section className="panel">
                                <h2 className="ref">visitors</h2>
                                <Counter />
                            </section>
                            <section className="panel">
                                <h2 className="ref">skin</h2>
                                <SkinPicker />
                            </section>
                            <section className="panel">
                                <h2 className="ref">buttons</h2>
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
