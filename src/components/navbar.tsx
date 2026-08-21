import "../index.css";
import { Link } from 'react-router-dom';
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
                    <Link to="/">Home</Link>
                    <Link to="/accommodation">Accommodation</Link>
                    <Link to="/tours">Tours</Link>
                    <Link to="/gallery">Gallery</Link>
                    <Link to="/inquire">Inquire</Link>
                </div>

                <button className="book-button">
                    Book Now
                </button>
            </div>
        </nav>
    );
}

export default Navbar