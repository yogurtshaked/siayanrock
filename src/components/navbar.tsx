import "../index.css";
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"


function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isGallery = location.pathname === "/gallery";
    const isInquire = location.pathname === "/inquire";
    const isRoomDetails = location.pathname.startsWith("/rooms/");
    const isBookRoom = location.pathname.startsWith("/book")

    const navigate = useNavigate();

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
        <nav className={`navbar 
            ${scrolled ? "navbar-scrolled" : ""} 
            ${isGallery ? "navbar-gallery" : ""}
            ${isInquire ? "navbar-inquire" : ""}
            ${isBookRoom ? "navbar-inquire" : ""}
            ${isRoomDetails ? "navbar-inquire" : ""}`}>
                
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

                <button className="book-button" onClick={() => navigate("/book")}>
                    Book Now
                </button>
            </div>
        </nav>
    );
}

export default Navbar