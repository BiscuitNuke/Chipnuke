<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
import Head from "next/head";
import Image from "next/image";
import anime from 'animejs';
import { useEffect, useState } from 'react';

export default function Home() {
  return ( 
        <main className="vp-container d-flex flex-column align-items-center" style={{ padding: "10vh 15vw" }}>
            <Head>
                <title>Nullify.one - About NullifyOne</title>
                <meta
                name="Nullify.one - About NullifyOne"
                content="Welcome to Nullify.one! We are a company based in Alpharetta GA, and our mission is to develop and work on Artificial Intelligence in the field of cybersecurity. We are a team of developers, designers, and researchers, and we are working to eliminate complicated network security, one computational intelligence at a time."
                />
            </Head>
            <div className="container mt-5">


            </div> 
        </main> 
  ); 
}
