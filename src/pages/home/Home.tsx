import "./home.css";
import "../../index.css";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown } from '@/components/animate-ui/icons/chevron-down';
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { Users } from '@/components/animate-ui/icons/users';
import { Search } from '@/components/animate-ui/icons/search';
import { CalendarDaysIcon } from '@/components/ui/calendar-days';
import Reveal from "@/components/Reveal";

/* ---------- date helpers ---------- */
const startOfToday = (): Date => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date: Date, days: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Local yyyy-MM-dd (avoids the UTC shift from toISOString)
const toLocalISO = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

type SearchErrors = {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
};
function Home() {

    const galleryImages = [
        {
            src: "/images/gallery/hometel-1.JPG",
            alt: "Siayanrock Is. Hometel",
            caption: "Siayanrock Is. Hometel",
            description: "HOMETEL",
            category: "hometel",
        },
        {
            src: "/images/gallery/nakurang-1.jpg",
            alt: "Nakurang Viewdeck",
            caption: "Nakurang Viewdeck",
            description: "PRIVATE VIEWDECK",
            category: "nakurang",
        },
        {
            src: "/images/gallery/tours-1.jpg",
            alt: "Mavien Point Travel & Tours",
            caption: "Chamantad Viewpoint",
            description: "TOURS",
            category: "tours",
        },
        {
            src: "/images/gallery/guests-1.jpg",
            alt: "Our Guests",
            caption: "Our Guests",
            description: "GUESTS",
            category: "guests",
        },
    ];
    const navigate = useNavigate();
    const [hoveredGalleryIndex, setHoveredGalleryIndex] =
        useState<number | null>(null);

    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [guests, setGuests] = useState<string>("");
    const [errors, setErrors] = useState<SearchErrors>({});

    const today = startOfToday();

    const handleCheckInChange = (date: Date | null) => {
        setCheckIn(date);
        setErrors((e) => ({ ...e, checkIn: undefined }));

        // If the new check-in is on/after the current check-out, clear check-out
        if (date && checkOut && date >= checkOut) {
            setCheckOut(null);
        }
    };

    const handleCheckOutChange = (date: Date | null) => {
        setCheckOut(date);
        setErrors((e) => ({ ...e, checkOut: undefined }));
    };

    const validate = (): SearchErrors => {
        const next: SearchErrors = {};

        if (!checkIn) next.checkIn = "Select a check-in date";
        else if (checkIn < today) next.checkIn = "Check-in can't be in the past";

        if (!checkOut) next.checkOut = "Select a check-out date";
        else if (checkIn && checkOut <= checkIn)
            next.checkOut = "Check-out must be after check-in";

        if (!guests) next.guests = "Select number of guests";

        return next;
    };

    const handleSearchRooms = () => {
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const params = new URLSearchParams({
            checkIn: toLocalISO(checkIn!),
            checkOut: toLocalISO(checkOut!),
            guests,
        });

        navigate(`/accommodation?${params.toString()}`);
    };


    return (
        <section>
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Discover Your Perfect <span className="hero-highlight">Holiday Home</span> With Us!</h1>

                    <div className="hero-search-bar">
                        <div className="date-range">
                            <div className="date-card">
                                <label className="date-card-label">
                                    <CalendarDaysIcon size={16} />
                                    <span>Check-In</span>
                                </label>
                                <DatePicker
                                    selected={checkIn}
                                    onChange={handleCheckInChange}
                                    selectsStart
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    minDate={today}
                                    maxDate={checkOut ? addDays(checkOut, -1) : undefined}
                                    placeholderText="mm-dd-yyyy"
                                    dateFormat="MM-dd-yyyy"
                                    className="date-card-value"
                                    popperPlacement="bottom-start"
                                    withPortal={false}
                                    portalId="datepicker-portal"
                                />
                                {errors.checkIn && <span className="field-error">{errors.checkIn}</span>}
                            </div>

                            <div className="date-arrow">
                                <ArrowRight size={18} />
                            </div>

                            <div className="date-card">
                                <label className="date-card-label">
                                    <CalendarDaysIcon size={16} />
                                    <span>Check-Out</span>
                                </label>
                                <DatePicker
                                    selected={checkOut}
                                    onChange={handleCheckOutChange}
                                    selectsEnd
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    minDate={addDays(checkIn ?? today, 1)}
                                    placeholderText="mm-dd-yyyy"
                                    dateFormat="MM-dd-yyyy"
                                    className="date-card-value"
                                    popperPlacement="bottom-start"
                                    withPortal={false}
                                    portalId="datepicker-portal"
                                />
                                {errors.checkOut && <span className="field-error">{errors.checkOut}</span>}
                            </div>
                        </div>

                        <div className="date-card">
                            <div className="date-card-label guests-label">
                                <Users animateOnHover size={16} />
                                <span>Guests</span>
                            </div>
                            <select
                                className="guests-select"
                                value={guests}
                                onChange={(e) => {
                                    setGuests(e.target.value);
                                    setErrors((er) => ({ ...er, guests: undefined }));
                                }}>
                                <option value="" disabled hidden>No. of guests</option>
                                <option value="1">1 guest</option>
                                <option value="2">2 guests</option>
                                <option value="3">3 guests</option>
                                <option value="4">4 guests</option>
                                <option value="5+">5+ guests</option>
                            </select>
                            {errors.guests && <span className="field-error">{errors.guests}</span>}
                        </div>

                        <div className="search-button-container">
                            <button
                                type="button"
                                className="search-btn"
                                onClick={handleSearchRooms}
                                aria-label="Search rooms">
                                <Search size={22} />
                            </button>
                        </div>
                    </div>

                    <div className="scroll-down">
                        <div className="chevron-container">
                            <ChevronDown
                                animate
                                animation="default-loop"
                                loop
                                loopDelay={400}
                                size={26}
                                strokeWidth={1} />
                        </div>
                        <p>SCROLL DOWN</p>
                    </div>
                </div>
            </div>

            <div className="about-section" id="section">
                <div className="about-content">
                    <div className="postcard postcard-front">
                        <div className="about-image">

                            <img src="/images/accommodation-bg.webp" alt="About Siayanrock Hometel" />
                        </div>
                    </div>
                    <Reveal className="postcard postcard-back">
                        <div className="about-text">

                            <div className="about-title">
                                <p className="section-title">About Us</p>
                                <h2>Siayanrock Is. Hometel</h2>
                                <p className="section-description">A place conveniently located in the heart of Batan Island. Situated in Ivana, right between North and South Batan,
                                    the hometel provides guests with a convenient starting point for exploring the island’s
                                    cultural landmarks and local attractions.</p>
                                <button className="learn-more home-btn" onClick={() => navigate("/about")}>Learn More&nbsp; <ArrowRight animateOnHover size={16} /></button>

                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className="offer-section" id="section">
                <div className="offer-content">
                    <Reveal className="offer-text">
                        <div className="offer-title">
                            <p className="section-title">Services</p>
                            <h2>Explore Batanes with us</h2>
                            <p className="section-description">Comfortable stays and memorable adventures, all in one place.</p>
                        </div>
                    </Reveal>

                    <div className="offer-cards">
                        <Reveal className="offer-card accommodation-card">
                            <div className="offer-card-content">
                                <h3>Accommodation</h3>
                                <p>Enjoy a comfortable stay in a space that feels like home, perfect for resting between adventures.</p>
                                <button className="offer-card-btn home-btn" onClick={() => navigate("/accommodation")}>
                                    <span className="offer-btn-text">View Details</span>
                                    <span className="offer-btn-icon">
                                        <ArrowRight animateOnHover size={16} />
                                    </span>
                                </button>
                            </div>
                        </Reveal>

                        <Reveal className="offer-card tourpack-card">
                            <div className="offer-card-content">
                                <h3>Tour Packages</h3>
                                <p>Discover the beauty of Batanes through breathtaking landscapes, cultural landmarks, and local destinations.</p>
                                <button className="offer-card-btn home-btn" onClick={() => navigate("/tours")}>
                                    <span className="offer-btn-text">View Details</span>
                                    <span className="offer-btn-icon"><ArrowRight animateOnHover size={16} /></span>
                                </button>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>

            <div className="gallery-section" id="section">
                <div className="gallery-content">

                    <Reveal className="gallery-text">
                        <p className="section-title">Gallery</p>
                        <h2>Postcards from Batanes</h2>
                        <p className="section-description">
                            A collection of moments from the beautiful islands of Batanes.
                        </p>
                    </Reveal>

                    <Reveal className="gallery-grid">
                        {galleryImages.map((image, index) => (
                            <motion.article
                                key={index}
                                className="gallery-item"
                                role="link"
                                tabIndex={0}
                                aria-label={`View ${image.description.toLowerCase()} photos in the gallery`}
                                onClick={() => navigate(`/gallery?category=${image.category}`)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        navigate(`/gallery?category=${image.category}`);
                                    }
                                }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                onMouseEnter={() => setHoveredGalleryIndex(index)}
                                onMouseLeave={() => setHoveredGalleryIndex(null)}
                            >
                                <div className="gallery-media">

                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        style={{
                                            filter:
                                                hoveredGalleryIndex !== null &&
                                                    hoveredGalleryIndex !== index
                                                    ? "grayscale(1)"
                                                    : "grayscale(0)",

                                            opacity:
                                                hoveredGalleryIndex !== null &&
                                                    hoveredGalleryIndex !== index
                                                    ? 0.7
                                                    : 1,
                                        }}
                                    />

                                    {/* Dark gradient from bottom to top */}
                                    <div className="gallery-wash" />

                                    <div className="gallery-caption-wrap">
                                        <p className="gallery-tag">
                                            {image.description}
                                        </p>

                                        <p className="gallery-caption">
                                            {image.caption}
                                        </p>
                                    </div>

                                </div>
                            </motion.article>
                        ))}
                    </Reveal>

                </div>
            </div>


            <div className="inquire-section" id="section">
                <Reveal className="inquire-content">
                    <div className="inquire-text">

                        <h2>Ready for your Batanes getaway?</h2>
                        <p>Need more information about our accommodations or tours?</p>
                    </div>
                    <button className="home-btn" onClick={() => navigate("/inquire")}>Inquire Now&nbsp; <ArrowRight size={16} /></button>
                </Reveal>
            </div>
        </section>
    )
}


export default Home