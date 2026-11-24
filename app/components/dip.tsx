// Vintage ceramic DIP-40 with a gold lid. Drawn in SVG, no images.
export default function Dip() {
    return (
        <svg className="dip" viewBox="0 0 268 110" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id="dip-ceramic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#6c5a96" />
                    <stop offset="1" stopColor="#4a3c6e" />
                </linearGradient>
                <linearGradient id="dip-gold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#f1d78c" />
                    <stop offset=".55" stopColor="#c99d3e" />
                    <stop offset="1" stopColor="#a87d27" />
                </linearGradient>
            </defs>
            <g className="dip-pins"><rect x="17" y="2" width="6" height="14" rx="1" /><rect x="17" y="94" width="6" height="14" rx="1" /><rect x="29" y="2" width="6" height="14" rx="1" /><rect x="29" y="94" width="6" height="14" rx="1" /><rect x="41" y="2" width="6" height="14" rx="1" /><rect x="41" y="94" width="6" height="14" rx="1" /><rect x="53" y="2" width="6" height="14" rx="1" /><rect x="53" y="94" width="6" height="14" rx="1" /><rect x="65" y="2" width="6" height="14" rx="1" /><rect x="65" y="94" width="6" height="14" rx="1" /><rect x="77" y="2" width="6" height="14" rx="1" /><rect x="77" y="94" width="6" height="14" rx="1" /><rect x="89" y="2" width="6" height="14" rx="1" /><rect x="89" y="94" width="6" height="14" rx="1" /><rect x="101" y="2" width="6" height="14" rx="1" /><rect x="101" y="94" width="6" height="14" rx="1" /><rect x="113" y="2" width="6" height="14" rx="1" /><rect x="113" y="94" width="6" height="14" rx="1" /><rect x="125" y="2" width="6" height="14" rx="1" /><rect x="125" y="94" width="6" height="14" rx="1" /><rect x="137" y="2" width="6" height="14" rx="1" /><rect x="137" y="94" width="6" height="14" rx="1" /><rect x="149" y="2" width="6" height="14" rx="1" /><rect x="149" y="94" width="6" height="14" rx="1" /><rect x="161" y="2" width="6" height="14" rx="1" /><rect x="161" y="94" width="6" height="14" rx="1" /><rect x="173" y="2" width="6" height="14" rx="1" /><rect x="173" y="94" width="6" height="14" rx="1" /><rect x="185" y="2" width="6" height="14" rx="1" /><rect x="185" y="94" width="6" height="14" rx="1" /><rect x="197" y="2" width="6" height="14" rx="1" /><rect x="197" y="94" width="6" height="14" rx="1" /><rect x="209" y="2" width="6" height="14" rx="1" /><rect x="209" y="94" width="6" height="14" rx="1" /><rect x="221" y="2" width="6" height="14" rx="1" /><rect x="221" y="94" width="6" height="14" rx="1" /><rect x="233" y="2" width="6" height="14" rx="1" /><rect x="233" y="94" width="6" height="14" rx="1" /><rect x="245" y="2" width="6" height="14" rx="1" /><rect x="245" y="94" width="6" height="14" rx="1" /></g>
            <rect className="dip-body" x="6" y="13" width="256" height="84" rx="5" fill="url(#dip-ceramic)" />
            <rect className="dip-edge" x="6" y="13" width="256" height="84" rx="5" fill="none" stroke="#2c2344" strokeWidth="2" />
            <circle className="dip-notch" cx="6" cy="55" r="9" />
            <circle className="dip-dot" cx="24" cy="85" r="3" fill="#3a2f58" />
            <rect className="dip-lid" x="102" y="21" width="68" height="68" rx="4" fill="url(#dip-gold)" stroke="#8a6620" strokeWidth="1.5" />
            <rect className="dip-lid-in" x="107" y="26" width="58" height="58" rx="2" fill="none" stroke="#f6e3a8" strokeOpacity=".6" />
            <path className="dip-trefoil" fill="#1a1e27" d="M140.60,55.00A4.60,4.60 0 1 0 131.40,55.00A4.60,4.60 0 1 0 140.60,55.00ZM147.50,74.92A23.00,23.00 0 0 1 124.50,74.92L132.55,60.98A6.90,6.90 0 0 0 139.45,60.98ZM113.00,55.00A23.00,23.00 0 0 1 124.50,35.08L132.55,49.02A6.90,6.90 0 0 0 129.10,55.00ZM147.50,35.08A23.00,23.00 0 0 1 159.00,55.00L142.90,55.00A6.90,6.90 0 0 0 139.45,49.02Z" />
            <text x="28" y="44" className="dip-etch">CN8026</text>
            <text x="28" y="58" className="dip-etch">rev 2.0</text>
            <text x="186" y="44" className="dip-etch">ROC NY</text>
            <text x="186" y="58" className="dip-etch">(c) 26</text>
        </svg>
    );
}
