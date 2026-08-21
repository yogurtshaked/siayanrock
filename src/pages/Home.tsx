import "../index.css";
import { ChevronDown } from '@/components/animate-ui/icons/chevron-down';


function Home(){
    return(
        <section>
            <div className="hero-section">
                <div className="hero-content">
                    <h1>
                        Discover Your Perfect <span className="hero-highlight">Holiday Home</span> With Us!
                    </h1>
                    <div className="scroll-down">
                        <div className="chevron-container">
                            <ChevronDown
                                animate
                                animation="default-loop"
                                loop
                                loopDelay={400}
                                size={26}
                                strokeWidth={1}
                            />
                        </div>
                        <p>SCROLL DOWN</p>
                    </div>
                </div>
            </div>

            <div className="about-section">
                <div className="about-content">
                    <div className="about-image">
                        <img src="/src/assets/siayanrock-img.jpg" alt="About Siayanrock Hometel" />
                    </div>
                    <div className="about-text">
                        <div className="about-title">
                            <p className="section-title">ABOUT US</p>
                            <h2>A Place Built Around Comfort</h2>
                        </div>
                        <p className="section-description">Siayanrock Hometel is a cozy and welcoming place that offers guests a comfortable stay. 
                            It provides a relaxing atmosphere where visitors can feel at home while enjoying their trip. 
                            The hometel is ideal for travelers looking for convenience, comfort, and a peaceful environment.</p>
                        <button className="learn-more">Learn More →</button>
                    </div>
                </div>
            </div>

            <div className="offer-section">
                <div className="offer-content">
                    <div className="offer-text">
                        <div className="offer-title">
                            <p className="section-title">WHAT WE OFFER</p>
                            <h2>Explore Batanes with us</h2>
                        </div>
                        <p>Discover curated experiences designed by locals who know the islands best.</p>
                    </div>

                    <div className="offer-cards">
                        <div className="offer-card">
                            <h3>Accommodation</h3>
                            <p>Relax in comfortable, well-appointed rooms designed to make your stay in Batanes memorable.</p>
                            <button>View Details →</button>
                        </div>
                        <div className="offer-card">
                            <h3>Tours Packages</h3>
                            <p>Experience the beauty of Batanes with our guided tours led by knowledgeable local guides.</p>
                            <button>View Details →</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="gallery-section">
                <div className="gallery-content">
                    <div className="gallery-text">
                        <div className="gallery-title">
                            <p className="section-title">GALLERY</p>
                            <h2>See Batanes through our lens.</h2>
                        </div>
                    </div>
                    <div className="gallery-grid">
                        <img src="/src/assets/siayanrock-img.jpg" alt="Gallery Image 1" />
                        <img src="/src/assets/gallery2.jpg" alt="Gallery Image 2" />
                        <img src="/src/assets/gallery3.jpg" alt="Gallery Image 3" />
                        <img src="/src/assets/gallery4.jpg" alt="Gallery Image 4" />
                    </div>
                    <button>View More →</button>
                </div>
            </div>

            <div className="inquire-section">
                <div className="inquire-content">
                    <div className="inquire-text">
                        <h2>Ready for your Batanes getaway?</h2>
                        <p>Need more information? Send us your inquiry.</p>
                    </div>
                    <button>Send an Inquiry</button>
                </div>
            </div>
        </section>
    )
}

export default Home