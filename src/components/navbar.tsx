import "../index.css";
import { NavLink } from 'react-router-dom';
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
                    <img src="/src/assets/images/logo.png" alt="Logo" className="logo-image"/>
                </div>

                <div className="navbar-links">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/accommodation">Accommodation</NavLink>
                    <NavLink to="/tours">Tours</NavLink>
                    <NavLink to="/gallery">Gallery</NavLink>
                    <NavLink to="/inquire">Inquire</NavLink>
                </div>

                <button className="book-button">
                    Book Now
                </button>
            </div>
        </nav>
    );
}

export default Navbar