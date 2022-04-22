import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import '../styles/globals.css'; 
import 'bootstrap/dist/css/bootstrap.css'; 
import Head from "next/head";
import { useEffect } from 'react';
import $ from 'jquery';

function MyApp({ Component, pageProps }) {
useEffect(() => {
  import("bootstrap/dist/js/bootstrap"); 
}, []); 
  return (
    <div>
      <head>
        <meta name="description" content="Hello! Welcome to Chipnuke.com! This is a portfolio and information site, so be sure to drop by and check stuff out!" />
      </head>
      <Head>
        <meta property="og:image" content="/brand_pkg/PNG/Chipnuke.png" />
      </Head>
        <Navbar /> 
        <Component {...pageProps} />
        {/* <Footer /> */}
    </div> 
  ); 
}

export default MyApp