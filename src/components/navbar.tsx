import "../index.css";
import { useEffect, useState } from "react";


function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
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