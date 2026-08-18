import { useState } from 'react';
import "../index.css";


function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="/src/assets/logo.png" alt="Logo" className="logo-image"/>
            </div>

        <div className="navbar-links">
            <a href="/">Home</a>
            <a href="/rooms">Rooms</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </div>

        <button className="book-button">
            Book Now
        </button>
        </nav>
    );
}

export default Navbar