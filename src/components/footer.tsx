import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';

function Footer() {
    return (
        <footer className="footer-section">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src="/src/assets/logo.png" alt="Logo" className="logo-image"/>
                    <p className="footer-description">A cozy hometel on the edge of Batanes, built around comfort, quiet mornings, and open horizons.</p>
                    <div className="footer-socials">
                        <a href="https://www.facebook.com/siayanrockhometel" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebookF}/>
                        </a>
                        <a href="https://www.instagram.com/siayanrockhometel" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://www.email.com/siayanrockhometel" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </a>
                    </div>
                </div>
                <div className="footer-explore">
                    <p>Explore</p>
                    <a href="/">Home</a>
                    <a href="/rooms">Accommodation</a>
                    <a href="/about">Tours</a>
                    <a href="/contact">Gallery</a>
                    <a href="/contact">Inquire</a>
                </div>
                <div className="footer-company">
                    <p>Company</p>
                    <a href="/">Home</a>
                    <a href="/rooms">Accommodation</a>
                    <a href="/about">Tours</a>
                    <a href="/contact">Gallery</a>
                    <a href="/contact">Inquire</a>
                </div>
                <div className="footer-contact">
                    <p>Contact Us:</p>
                    <p>Email: info@siayanrock.com</p>
                    <p>Phone: +1 (123) 456-7890</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;