// 88x31 button wall. Add a button: drop the gif/png in public/buttons/ and add a row here.
const BUTTONS: { src: string; alt: string; href?: string }[] = [
    { src: "/brand/button-88x31.png", alt: "chipnuke", href: "/" },
];

export default function Buttons({ compact = false }: { compact?: boolean }) {
    return (
        <ul className={compact ? "buttons compact" : "buttons"}>
            {BUTTONS.map(b => {
                const img = <img src={b.src} alt={b.alt} width={88} height={31} className="px" loading="lazy" />;
                return <li key={b.src}>{b.href ? <a href={b.href} rel={b.href.startsWith("http") ? "noopener" : undefined}>{img}</a> : img}</li>;
            })}
        </ul>
    );
}
