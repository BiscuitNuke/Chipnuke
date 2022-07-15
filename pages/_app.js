import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import '../styles/globals.css'; 
import 'bootstrap/dist/css/bootstrap.css'; 
import Head from "next/head";
import { useEffect } from 'react';
<script src="/path/to/js/typer.es6.min.js" type="text/javascript" ></script>


function MyApp({ Component, pageProps }) {
useEffect(() => {
  import("bootstrap/dist/js/bootstrap"); 
}, []); 
  return (
    <div>
      <head>
        <meta name="description" content="Welcome to Nullify.one! Our goal is to eliminate complicated network security, one computational intelligence at a time. We are currently in the process of redoing our website, so please pardon the changes!" />
      </head>
      <Head>
        <meta property="og:image" content="/brand_pkg/PNG/N1.png" />
      </Head>
        <Navbar /> 
        <Component {...pageProps} />
        <Footer />
    </div> 
  ); 
}

export default MyApp