import "../index.css";
import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown } from '@/components/animate-ui/icons/chevron-down';
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { Users } from '@/components/animate-ui/icons/users';
import { CalendarDaysIcon } from '@/components/ui/calendar-days';

function Home(){
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [guests, setGuests] = useState<string>("");

    const checkInRef = useRef<DatePicker>(null);
    const checkOutRef = useRef<DatePicker>(null);

    return(
        <section>
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Discover Your Perfect <span className="hero-highlight">Holiday Home</span> With Us!</h1>
                    
                    <div className="hero-search-bar">
                        <div className="date-field">
                            <button
                                type="button"
                                className="date-field-trigger"
                                onClick={() => checkInRef.current?.setFocus()}
                            >
                                <CalendarDaysIcon size={18} />
                                <span>{checkIn ? checkIn.toLocaleDateString() : "Check-In"}</span>
                            </button>
                            <DatePicker
                                ref={checkInRef}
                                selected={checkIn}
                                onChange={(date: Date | null) => setCheckIn(date)}
                                selectsStart
                                startDate={checkIn}
                                endDate={checkOut}
                                minDate={new Date()}
                                customInput={<HiddenInput />}
                            />
                        </div>

                        <div className="date-field">
                            <button
                                type="button"
                                className="date-field-trigger"
                                onClick={() => checkOutRef.current?.setFocus()}>
                                <CalendarDaysIcon size={18} />
                                <span>{checkOut ? checkOut.toLocaleDateString() : "Check-Out"}</span>
                            </button>
                            <DatePicker
                                ref={checkOutRef}
                                selected={checkOut}
                                onChange={(date: Date | null) => setCheckOut(date)}
                                selectsEnd
                                startDate={checkIn}
                                endDate={checkOut}
                                minDate={checkIn || new Date()}
                                customInput={<HiddenInput />}
                            />
                        </div>

                        <div className="date-field">
                            <div className="date-field-trigger guests-select-wrapper">
                                <Users size={18} />
                                <select
                                    className={`guests-select ${guests === "" ? "placeholder-selected" : ""}`}
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                >
                                    <option value="" disabled hidden>Guests</option>
                                    <option value="1">1 guest</option>
                                    <option value="2">2 guests</option>
                                    <option value="3">3 guests</option>
                                    <option value="4">4 guests</option>
                                    <option value="5+">5+ guests</option>
                                </select>
                            </div>
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
                        <img src="/src/assets/images/siayanrock-img.jpg" alt="About Siayanrock Hometel" />
                    </div>
                    <div className="about-text">
                        <div className="about-title">
                            <p className="section-title">ABOUT US</p>
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
                            <p className="section-title">WHAT WE OFFER</p>
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
                        <div className="gallery-title">
                            <p className="section-title">GALLERY</p>
                            <h2>See Batanes through our lens.</h2>
                        </div>
                        <button className="landing-page-btn">View More&nbsp; <ArrowRight animateOnHover size={16} /></button>
                    </div>

                    <div className="gallery-grid">
                        <div className="gallery-item">
                            <img src="/src/assets/images/siayanrock-img.jpg" alt="Gallery Image 1" />
                            <p className="gallery-caption">Our Hometel</p>
                        </div>
                        <div className="gallery-item">
                            <img src="/src/assets/images/gallery2.jpg" alt="Gallery Image 2" />
                            <p className="gallery-caption">Our Tours</p>
                        </div>
                        <div className="gallery-item">
                            <img src="/src/assets/images/gallery3.jpg" alt="Gallery Image 3" />
                            <p className="gallery-caption">Our Private Viewdeck</p>
                        </div>
                        <div className="gallery-item">
                            <img src="/src/assets/images/gallery4.jpg" alt="Gallery Image 4" />
                            <p className="gallery-caption">Our Guests</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="inquire-section" id="section">
                <div className="inquire-content">
                    <div className="inquire-text">
                        <h2>Ready for your Batanes getaway?</h2>
                        <p>Need more information? Send us your inquiry.</p>
                    </div>
                    <button className="landing-page-btn">Send an Inquiry</button>
                </div>
            </div>
        </section>
    )
}

const HiddenInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => (
        <input
            {...props}
            ref={ref}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        />
    )
);

HiddenInput.displayName = "HiddenInput"; 

export default Home