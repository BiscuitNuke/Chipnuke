import { useEffect } from 'react'; 
import anime from 'animejs'; 
import Head from "next/head";

export default function Custom404() {
    useEffect(() => {
        anime
          .timeline()
          .add({
                targets: '#gradtext',
                rotate: 10, 
                easing: 'linear', 
                duration: 1, 
                // loop: true, 
                complete: (anim) => {
                    anim.restart(); 
                }
          }); 

        anime
          .timeline()
          .add({
                targets: '#gradtext',
                opacity: [0, 1],
                easing: 'easeInOutQuad',
                duration: 10,
                delay: 1, 
        }); 
    }, []); 

    return (
        <main className="d-flex flex-column justify-content-center align-items-center" style={{ width: "100vw", height: "100vh" }}>
        <Head>
            <title>Nullify.one - 404 Not Found</title>
            <meta
            name="Nullify.one - 404 Not Found"
            content="Welcome to Nullify.one! Our team is working to eliminate complicated network security, one computational intelligence at a time. Page not found."
            />
        </Head>
            <h1 id="gradtext" className="">Get lost.</h1>
        </main>
    ); 
} 