import { useState } from 'react';
import "../index.css";


function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-logo">
                    <img src="/src/assets/logo.png" alt="Logo" className="logo-image"/>
                </div>

                <div className="navbar-links">
                    <a href="/">Home</a>
                    <a href="/rooms">Accommodation</a>
                    <a href="/about">Tours</a>
                    <a href="/contact">Gallery</a>
                    <a href="/contact">Inquire</a>
                </div>

                <button className="book-button">
                    Book Now
                </button>
            </div>
        </nav>
    );
}

export default Navbar