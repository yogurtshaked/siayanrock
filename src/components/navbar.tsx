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

const NAV_LINKS = [
    { to: "/", label: "Home" },
    { to: "/accommodation", label: "Accommodation" },
    { to: "/tours", label: "Tours" },
    { to: "/gallery", label: "Gallery" },
    { to: "/inquire", label: "Inquire" },
];

function getNavbarVariant(pathname: string): string {
    if (NAVBAR_VARIANTS[pathname]) return NAVBAR_VARIANTS[pathname];
    const prefixMatch = NAVBAR_PREFIX_VARIANTS.find(([prefix]) => pathname.startsWith(prefix));
    return prefixMatch?.[1] ?? "";
}

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const variant = getNavbarVariant(location.pathname);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        handleScroll(); // set the right state on first load / refresh mid-page
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close the menu after navigating to another page
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Escape closes it; going back to desktop width closes it; page can't scroll behind it
    useEffect(() => {
        if (!menuOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        const onResize = () => {
            if (window.innerWidth > 820) setMenuOpen(false);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", onResize);
        };
    }, [menuOpen]);

    const classes = [
        "navbar",
        scrolled || menuOpen ? "navbar-scrolled" : "",
        menuOpen ? "navbar-open" : "",
        variant,
    ].filter(Boolean).join(" ");

    return (
        <>
            <nav className={classes}>
                <div className="navbar-content">
                    <div className="navbar-logo">
                        <img src="/images/logo.svg" alt="Logo" className="logo-image" />
                    </div>

                    {/* Desktop links */}
                    <div className="navbar-links">
                        {NAV_LINKS.map((l) => (
                            <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
                        ))}
                    </div>

                    {/* Hamburger (mobile only) */}
                    <button
                        type="button"
                        className="navbar-toggle"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen((o) => !o)}>
                        <span className="navbar-toggle-bar" />
                        <span className="navbar-toggle-bar" />
                        <span className="navbar-toggle-bar" />
                    </button>
                </div>

                {/* Mobile dropdown panel */}
                <div
                    id="mobile-menu"
                    className={`navbar-menu${menuOpen ? " is-open" : ""}`}>
                    {NAV_LINKS.map((l) => (
                        <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>
                            {l.label}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Dim backdrop: tap outside to close */}
            <div
                className={`navbar-backdrop${menuOpen ? " is-open" : ""}`}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
            />
        </>
    );
}

export default Navbar;