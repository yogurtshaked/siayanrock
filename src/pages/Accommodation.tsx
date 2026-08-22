import { section } from 'motion/react-client';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons/faBed';
import { faCheck, faUserGroup } from '@fortawesome/free-solid-svg-icons';

function Accommodation(){
    return(
        <section>
            <div className='accommodation-hero-section'>
                <div className='accommodation-content'>
                    <div className='accommodation-text'>
                        <h2>Siayanrock Is. Hometel</h2>
                        <p>Discover iconic tourist spots, rolling hills, stone houses, and coastal views through thoughtfully curated itineraries.</p>
                    </div>
                </div>
            </div>

            <div className='accommodation-rooms'>
                <div className='accommodation-rooms-title'>
                    <p>OUR ROOMS</p>
                    <h3>Find your perfect room</h3>
                </div>
                
                <div className='accommodation-rooms-content'>
                    <div className='accommodation-room-cards'>
                        
                        <div className='room-card'>
                            <div className='room-img'>
                                <img src="/src/assets/images/room 2.jpg" alt="About Siayanrock Hometel" />
                            </div>
                            <div className='room-contents'>
                                <div>
                                    <h3>Siayan Room</h3>
                                    <div className="room-pax">
                                        <div className="pax-item">
                                            <FontAwesomeIcon icon={faBed} />
                                            <p>2 beds</p>
                                        </div>
                                        <div className="pax-item">
                                            <FontAwesomeIcon icon={faUserGroup} />
                                            <p>3 people</p>
                                        </div>
                                    </div>
                                </div>

                                <p>The spacious twin/double room offers air conditioning, a seating area, a balcony with a quiet street view as well as a private bathroom boasting a bath. The unit has 2 beds.</p>
                                
                                <div className="room-amenities">
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Balcony</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Street View</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Private Bathroom</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Flat-Screen TV</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Free Wifi</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Air Conditioning</p>
                                    </div>
                                </div>

                                <div className='room-price'>
                                    <p>From <span className="price-highlight">₱1400</span>/night</p>
                                    <div className='room-buttons'>
                                        <button className='view-details'>View Details</button>
                                        <button className='book-room'>Book Room</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='room-card'>
                            <div className='room-img'>
                                <img src="/src/assets/images/room 2.jpg" alt="About Siayanrock Hometel" />
                            </div>
                            <div className='room-contents'>
                                <div>
                                    <h3>Siayan Room</h3>
                                    <div className="room-pax">
                                        <div className="pax-item">
                                            <FontAwesomeIcon icon={faBed} />
                                            <p>2 beds</p>
                                        </div>
                                        <div className="pax-item">
                                            <FontAwesomeIcon icon={faUserGroup} />
                                            <p>3 people</p>
                                        </div>
                                    </div>
                                </div>

                                <p>The spacious twin/double room offers air conditioning, a seating area, a balcony with a quiet street view as well as a private bathroom boasting a bath. The unit has 2 beds.</p>
                                
                                <div className="room-amenities">
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Balcony</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Street View</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Private Bathroom</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Flat-Screen TV</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Free Wifi</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Air Conditioning</p>
                                    </div>
                                </div>

                                <div className='room-price'>
                                    <p>From <span className="price-highlight">₱1400</span>/night</p>
                                    <div className='room-buttons'>
                                        <button className='view-details'>View Details</button>
                                        <button className='book-room'>Book Room</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='room-card'>
                            <div className='room-img'>
                                <img src="/src/assets/images/room 2.jpg" alt="About Siayanrock Hometel" />
                            </div>
                            <div className='room-contents'>
                                <div>
                                    <h3>Siayan Room</h3>
                                    <div className="room-pax">
                                        <div className="pax-item">
                                            <FontAwesomeIcon icon={faBed} />
                                            <p>2 beds</p>
                                        </div>
                                        <div className="pax-item">
                                            <FontAwesomeIcon icon={faUserGroup} />
                                            <p>3 people</p>
                                        </div>
                                    </div>
                                </div>

                                <p>The spacious twin/double room offers air conditioning, a seating area, a balcony with a quiet street view as well as a private bathroom boasting a bath. The unit has 2 beds.</p>
                                
                                <div className="room-amenities">
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Balcony</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Street View</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Private Bathroom</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Flat-Screen TV</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Free Wifi</p>
                                    </div>
                                    <div className="amenity">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <p>Air Conditioning</p>
                                    </div>
                                </div>

                                <div className='room-price'>
                                    <p>From <span className="price-highlight">₱1400</span>/night</p>
                                    <div className='room-buttons'>
                                        <button className='view-details'>View Details</button>
                                        <button className='book-room'>Book Room</button>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </section>
    );
}

export default Accommodation;