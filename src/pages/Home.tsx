import { useState } from 'react';
import "../index.css";


function Home(){
    return(
        <section>
            <div className="hero-section">
                <div className="hero-content">
                    <h1>
                        Discover Your Perfect <span className="hero-highlight">Holiday Home</span> With Us!
                    </h1>
                </div>
            </div>

            <div className="about-section">
                <h2>About Us</h2>
                <p>Welcome to our holiday home rental service! We specialize in providing the perfect getaway for your next vacation.</p>
            </div>
        </section>
    )
}

export default Home