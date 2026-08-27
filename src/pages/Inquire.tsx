import { useState } from "react";
import "../index.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

function Inquire(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [guests, setGuests] = useState("");
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const position: LatLngExpression = [
        20.37135722099695,
        121.9147227008337
    ];

    return(
        <section>
            <div className='inquire-page'>
                <div className='inquire-page-content'>
                    <div className='inquire-title'>
                        <p className="section-title">INQUIRE</p>
                        <h3>Tell us about your trip</h3>
                        <p className='section-description'>Share a few details below and our team will follow up with availability, pricing, and a tailored recommendation.</p>
                    </div>

                    <div className="inquire-grid">
                        <div className="inquire-card">
                            <form>
                                <div className="input-field">
                                    <label>Full name</label>
                                    <input id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} 
                                        placeholder="Your full name"/>
                                </div>

                                <div className="input-field">
                                    <label>Email address</label>
                                    <input id="email"
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}  
                                        placeholder="juan@email.com"/>
                                </div>
                                <div className="input-field">
                                    <label>Phone number</label>
                                    <input id="phone"
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}  
                                        placeholder="+63 9XX XXX XXXX"/>
                                </div>
                                <div className="input-field">
                                    <label>Guests</label>
                                    <select
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}>
                                        <option value="" disabled>
                                            Select guests
                                        </option>
                                        <option value="1">1 guest</option>
                                        <option value="2">2 guests</option>
                                        <option value="3-4">3–4 guests</option>
                                        <option value="5+">5+ guests</option>
                                    </select>
                                </div>
                                
                                <div className="input-field">
                                    <label>Check-in</label>
                                    <input type="date"
                                        value={checkin}
                                        onChange={(e) => setCheckin(e.target.value)}>
                                    </input>
                                </div>
                                <div className="input-field">
                                    <label>Check-out</label>
                                    <input type="date"
                                        value={checkout}
                                        onChange={(e) => setCheckout(e.target.value)}>      
                                    </input>
                                </div>
                                <div className="input-field full">
                                    <label>Interested in</label>
                                    <select>
                                        <option>Accommodation only</option>
                                        <option>Accommodation + tour package</option>
                                        <option>Tour package only</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div className="input-field full">
                                    <label>Message</label>
                                    <textarea placeholder="Tell us a bit more about your trip — dates, group size, or anything else we should know."></textarea>
                                </div>
                                <button type="submit" className="submit-btn">Send inquiry</button>
                            </form>
                        </div>
                    
                        {/*<div className="side-col">
                            <div className="info-card">
                                <h3 className="serif">Reach us directly</h3>
                                <div className="info-row">
                                <div className="icon">☎</div>
                                <div className="txt"><span>Phone</span>+63 961 394 5607</div>
                                </div>
                                <div className="info-row">
                                <div className="icon">✉</div>
                                <div className="txt"><span>Email</span>siayanrockis.hometel@gmail.com</div>
                                </div>
                                <div className="info-row">
                                <div className="icon">📍</div>
                                <div className="txt"><span>Address</span>Nat. road, Brgy. Tuhel, Ivana, Batanes</div>
                                </div>
                                <div className="info-row">
                                <div className="icon">⏱</div>
                                <div className="txt"><span>Response time</span>Usually within 24 hours</div>
                                </div>
                            </div>
                    
                             <div className="map-card">
                                <MapContainer
                                    center={position}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    <Marker position={position}>
                                        <Popup>
                                            <strong>Siayanrock Hometel</strong>
                                            <br />
                                            Nat. Road, Brgy. Tuhel
                                            <br />
                                            Ivana, Batanes
                                        </Popup>
                                    </Marker>

                                </MapContainer>
                            </div> 
                        </div>*/}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Inquire;