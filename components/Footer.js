import Link from 'next/link'; 
import Image from 'next/image'; 
import anime from 'animejs';
import { useEffect, useState } from 'react';

export default function Footer() {
    return (
        <footer className="footer">
        <hr />
            <div className="inner_footer">
                <div className="logo_container">
                    <img src="/brand_pkg/SVG/null.svg"/>
                    <p>Chipnuke © 2020-2022 </p>
                </div>

                <div className="footer_third">
                    <h1> Need help?</h1>
                    <a href="mailto:kieran@nullify.one">Email us</a>
                </div>

                <div className="footer_third">
                    <h1> Development</h1>
                    <a href="/AI">AI Development</a>
                    <a href="/Cybersec">Cybersecurity</a>
                    <a href="/Devup">Development Updates</a>
                    <a href="/Hardware">Hardware Development</a>
                </div>

                <div className="footer_third">
                    <h1> Legal</h1>
                    <a href="/ToS">Terms & Conditions</a>
                    <a href="/Privacy">Privacy Policy</a>
                    <a href="/Legal">Legal Information</a>
                </div>

                <div className="footer_third">
                    <h1> Other</h1>
                    <a href="/About">About NullifyOne</a>
                    <a href="/Contact">Contact Us</a>
                    <li><a href="https://github.com/NullifyOne"><img src="/Icons/GitHub.svg" height="35" width="35" /></a></li>
                    <li><a href="https://chipnuke.com"><img src="/Icons/Chip.svg" height="35" width="35" /></a></li>
                </div>

            </div>
        </footer> 
    ); 
}
