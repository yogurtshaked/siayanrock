import "../index.css";
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";

const NAVBAR_VARIANTS: Record<string, string> = {
    "/gallery": "navbar-scrolled",
    "/inquire": "navbar-scrolled",
    "/about": "navbar-scrolled",
};

const NAVBAR_PREFIX_VARIANTS: [string, string][] = [
    ["/rooms/", "navbar-scrolled"],
    ["/book", "navbar-scrolled"],
];

function getNavbarVariant(pathname: string): string {
    if (NAVBAR_VARIANTS[pathname]) return NAVBAR_VARIANTS[pathname];
    const prefixMatch = NAVBAR_PREFIX_VARIANTS.find(([prefix]) => pathname.startsWith(prefix));
    return prefixMatch?.[1] ?? "";
}

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const variant = getNavbarVariant(location.pathname);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${variant}`.trim()}>

                
            <div className="navbar-content">
                <div className="navbar-logo">
                    <img src="/images/logo.png" alt="Logo" className="logo-image"/>
                </div>

                <div className="navbar-links">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/accommodation">Accommodation</NavLink>
                    <NavLink to="/tours">Tours</NavLink>
                    <NavLink to="/gallery">Gallery</NavLink>
                    <NavLink to="/inquire">Inquire</NavLink>
                </div>

                {/*<button className="book-button" onClick={() => navigate("/book")}>
                    Book Now
                </button>*/}
            </div>
        </nav>
    );
}

export default Navbar