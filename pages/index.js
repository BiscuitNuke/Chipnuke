<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
import styles from '../styles/Home.module.css'; 
import Head from "next/head";


export default function Home() {
  return ( 
        <main className="d-flex flex-column justify-content-around align-items-center">
            <Head>
                <title>Chipnuke.com -- Homepage</title>
            </Head>
            <div className="d-flex flex-column justify-content-center align-items-center homepage-head" style={{ width: '100vw', height: '100vh' }}> 
                <div className="container">
                    <h1 className="px-5 mb-3" style={{fontWeight: 250}}>Welcome to <span id="headtext" style={{ fontWeight: 650 }}>Chipnuke.com!</span></h1>
                    <p className="px-5 mb-3 text-light lead"  style={{fontWeight: 200, width: "60%"}}>This site is used for <span id="gradtext" style={{ fontWeight: 650 }}>personal projects and general information.</span></p>
                </div> 
            </div> 
            {/* <div className="container p-5">
            </div> */}
        </main> 
  ); 
}
