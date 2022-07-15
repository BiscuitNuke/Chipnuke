import {Html, Head, Main, NextScript } from 'next/document';

export default function Document() {

return (
    <Html lang="en">
        <body>
            <Head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css"/>
                <script src="https://your-site-or-cdn.com/fontawesome/v6.1.1/js/all.js" data-auto-replace-svg="nest"></script>
            </Head>
            <Main />
            <NextScript />
        </body>
    </Html>
    )
}


