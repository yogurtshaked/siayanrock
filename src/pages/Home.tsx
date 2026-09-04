import "../index.css";
import { motion } from "framer-motion";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown } from '@/components/animate-ui/icons/chevron-down';
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { Users } from '@/components/animate-ui/icons/users';
import { Search } from '@/components/animate-ui/icons/search';
import { CalendarDaysIcon } from '@/components/ui/calendar-days';


function Home(){
    const [hoveredGalleryIndex, setHoveredGalleryIndex] =
    useState<number | null>(null);

    const galleryImages = [
        {
            src: "/images/siayanrock-img.jpg",
            alt: "Siayanrock Is. Hometel",
            caption: "Siayanrock Is. Hometel",
            description:
                "HOMETEL",
        },
        {
            src: "/images/gallery2.jpg",
            alt: "Mavien Point Travel & Tours",
            caption: "Malboro Hills",
            description:
                "TOURS",
        },
        {
            src: "/images/gallery3.jpg",
            alt: "Mavien Viewdeck",
            caption: "Mavien Viewdeck",
            description:
                "PRIVATE VIEWDECK",
        },
        {
            src: "/images/gallery4.jpg",
            alt: "Our Guests",
            caption: "Our Guests",
            description:
                "GUESTS",
        },
    ];

    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [guests, setGuests] = useState<string>("");

    return(
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
                                    onChange={(date: Date | null) => {
                                        if (date && checkOut && date >= checkOut) {
                                            return;
                                        }

                                        setCheckIn(date);
                                    }}
                                    selectsStart
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    minDate={new Date()}
                                    maxDate={checkOut || undefined}
                                    placeholderText="mm-dd-yyyy"
                                    dateFormat="MM-dd-yyyy"
                                    className="date-card-value"
                                    popperPlacement="bottom-start"
                                    withPortal={false}
                                    portalId="datepicker-portal"
                                />
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
                                    onChange={(date: Date | null) => setCheckOut(date)}
                                    selectsEnd
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    minDate={checkIn
                                            ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000)
                                            : new Date()
                                    } 
                                    placeholderText="mm-dd-yyyy"
                                    dateFormat="MM-dd-yyyy"
                                    className="date-card-value"
                                    popperPlacement="bottom-start"
                                    withPortal={false}
                                    portalId="datepicker-portal"
                                />
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
                                onChange={(e) => setGuests(e.target.value)}>
                                <option value="" disabled hidden>No. of guests</option>
                                <option value="1">1 guest</option>
                                <option value="2">2 guests</option>
                                <option value="3">3 guests</option>
                                <option value="4">4 guests</option>
                                <option value="5+">5+ guests</option>
                            </select>
                        </div>
                        
                        <div className="search-button-container">
                            <button className="search-btn"><Search size={22}/></button>
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
                                strokeWidth={1}/>
                        </div>
                        <p>SCROLL DOWN</p>
                    </div>
                </div>
            </div>

            <div className="about-section" id="section">
                <div className="about-content">
                    <div className="about-image">
                        <img src="/public/images/siayanrock-img.jpg" alt="About Siayanrock Hometel" />
                    </div>
                    <div className="about-text">
                        <div className="about-title">
                            <p className="section-title">About Us</p>
                            <h2>Siayanrock Is. Hometel</h2>
                            <p className="section-description">Siayanrock Hometel is a welcoming place that offers guests a comfortable stay. 
                            It provides a relaxing atmosphere where visitors can feel at home while enjoying their trip. 
                            The hometel is ideal for travelers looking for convenience, comfort, and a peaceful environment.</p>
                        </div>
                        <button className="learn-more landing-page-btn">Learn More&nbsp; <ArrowRight animateOnHover size={16} /></button>
                    </div>
                </div>
            </div>

            <div className="offer-section" id="section">
                <div className="offer-content">
                    <div className="offer-text">
                        <div className="offer-title">
                            <p className="section-title">Services</p>
                            <h2>Explore Batanes with us</h2>
                            <p className="section-description">Discover curated experiences designed by locals who know the islands best.</p>
                        </div>
                    </div>

                    <div className="offer-cards">
                        <div className="offer-card accommodation-card">
                            <div className="offer-card-content">
                                <h3>Accommodation</h3>
                                <p>Relax in comfortable, well-appointed rooms designed to make your stay
                                    in Batanes memorable.</p>
                                <button className="offer-card-btn landing-page-btn">
                                    <span className="offer-btn-text">View Details</span>
                                    <span className="offer-btn-icon"><ArrowRight animateOnHover size={16} /></span>
                                </button>
                            </div>
                        </div>

                        <div className="offer-card tourpack-card">
                            <div className="offer-card-content">
                                <h3>Tour Packages</h3>
                                <p>Experience the beauty of Batanes with our guided tours led by
                                    knowledgeable local guides.</p>
                                <button className="offer-card-btn landing-page-btn">
                                    <span className="offer-btn-text">View Details</span>
                                    <span className="offer-btn-icon"><ArrowRight animateOnHover size={16} /></span>
                                </button>
                            </div>
                        </div>
                        </div>
                </div>
            </div>

            <div className="gallery-section" id="section">
                <div className="gallery-content">
                    <div className="gallery-text">
                        <div className="gallery-section-title">
                            <p className="section-title">Gallery</p>
                            <h2>See Batanes through our lens.</h2>
                        </div>
                        <p className="section-description">Discover curated experiences designed by locals who know the islands best</p>
                        {/*<button className="landing-page-btn">View More&nbsp; <ArrowRight animateOnHover size={16} /></button>*/}
                    </div>

                    <div className="gallery-grid">
                    {galleryImages.map((image, index) => (
                        <motion.article
                            key={index}
                            className="gallery-item"
                            initial={{ flex: 1 }}
                            animate={{
                                flex:
                                    hoveredGalleryIndex === null
                                        ? 1
                                        : hoveredGalleryIndex === index
                                            ? 1
                                            : 0.6,
                            }}
                                        
                            transition={{
                                duration: 0.5,
                                ease: "easeInOut",
                            }}

                            onMouseEnter={() =>
                                setHoveredGalleryIndex(index)
                            }

                            onMouseLeave={() =>
                                setHoveredGalleryIndex(null)
                            }
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

                                <div className="gallery-wash" />
                            </div>

                            <div className="gallery-caption-wrap">
                                <p className="gallery-tag">
                                    {image.description}
                                </p>

                                <div className="gallery-name-row">
                                    <p className="gallery-caption">
                                        {image.caption}
                                    </p>

                                
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                </div>
            </div>

            <div className="inquire-section" id="section">
                <div className="inquire-content">
                    <div className="inquire-text">
                        
                        <h2>Ready for your Batanes getaway?</h2>
                        <p>Need more information about our accommodations or tours?</p>
                    </div>
                    <button className="landing-page-btn">Inquire Now&nbsp; <ArrowRight size={16} /></button>
                </div>
            </div>
        </section>
    )
}


export default Home