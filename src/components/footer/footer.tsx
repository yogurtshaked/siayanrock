import './footer.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';

function Footer() {
    return (
        <footer className="footer-section">
            <div className="footer-content">
                <div className="footer-logo">
                    <div className='footer-logo-text'>
                        <img src="/images/logo.svg" alt="Logo" className="logo-image"/>
                        <p className="footer-description">A cozy hometel on the edge of Batanes, built around comfort, quiet mornings, and open horizons.</p>
                    </div>
                    <div className="footer-socials">
                        <a href="https://www.facebook.com/profile.php?id=61566843206345" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="https://www.instagram.com/siayanrock_batanes" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="mailto:siayanrockis.hometel@gmail.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </a>
                    </div>
                </div>
                <div className="footer-explore">
                    <h3>EXPLORE</h3>
                    <div className='footer-explore-links'>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/accommodation">Accommodation</NavLink>
                        <NavLink to="/tours">Tours</NavLink>
                        <NavLink to="/gallery">Gallery</NavLink>
                    </div>
                </div>
                <div className="footer-company">
                    <h3>COMPANY</h3>
                    <div className='footer-company-links'>
                        <a href="/about">About Us</a>
                        <a href="/rooms">Reviews</a>
                        <a href="/about">FAQs</a>
                        <a href="/inquire">Inquire</a>
                    </div>
                </div>
                <div className="footer-contact">
                    <h3>REACH US</h3>
                    <div className="footer-contact-content">
                        <div className="footer-email">
                            <FontAwesomeIcon icon={faEnvelope} style={{color: "#F7F2E8",}} />
                            <div className="footer-email-text">
                                <p>Email:</p>
                                <p>siayanrockis.hometel@gmail.com</p>
                            </div>
                        </div>
                        <div className="footer-phone">
                            <FontAwesomeIcon icon={faPhone} style={{color: "#F7F2E8",}} />
                            <div className="footer-phone-text">
                                <p>Phone:</p>
                                <p>+(63) 967 2003 129</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                    <p>© 2026 Siayanrock Hometel. All rights reserved.</p>
                </div>
        </footer>
    );
}

export default Footer;