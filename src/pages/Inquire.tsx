import { useState } from "react";
import type { FormEvent } from "react";
import "../index.css";
import "leaflet/dist/leaflet.css";
import { supabase } from "../lib/supabaseClient";

type Status = "idle" | "sending" | "success" | "error";

function Inquire(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [guests, setGuests] = useState("");
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const [interest, setInterest] = useState("Accommodation only");
    const [message, setMessage] = useState("");

    // Honeypot: real people never see or fill this; bots often do.
    const [website, setWebsite] = useState("");

    const [status, setStatus] = useState<Status>("idle");
    const [feedback, setFeedback] = useState("");

    const today = new Date().toISOString().split("T")[0];

    function resetForm() {
        setName("");
        setEmail("");
        setPhone("");
        setGuests("");
        setCheckin("");
        setCheckout("");
        setInterest("Accommodation only");
        setMessage("");
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (status === "sending") return;

        // Bot caught by the honeypot: pretend it worked, send nothing.
        if (website) {
            setStatus("success");
            setFeedback("Thank you! We'll get back to you soon.");
            return;
        }

        // Basic validation
        if (!name.trim() || !email.trim()) {
            setStatus("error");
            setFeedback("Please enter your name and email.");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            setStatus("error");
            setFeedback("Please enter a valid email address.");
            return;
        }
        if (checkin && checkout && checkout <= checkin) {
            setStatus("error");
            setFeedback("Check-out must be after check-in.");
            return;
        }

        setStatus("sending");
        setFeedback("");

        const { error } = await supabase.from("inquiries").insert({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
            guests: guests || null,
            check_in: checkin || null,
            check_out: checkout || null,
            interest,
            message: message.trim() || null,
        });

        if (error) {
            console.error(error);
            setStatus("error");
            setFeedback("Something went wrong sending your inquiry. Please try again, or contact us directly.");
            return;
        }

        setStatus("success");
        setFeedback("Thank you! Your inquiry has been sent. We'll get back to you soon.");
        resetForm();
    }

    return(
        <section>
            <div className='inquire-page'>
                <div className='inquire-page-content'>
                    <div className='inquire-title page-title'>
                        <p className="section-title">INQUIRE</p>
                        <h3>Tell us about your trip</h3>
                        <p className='section-description'>Share a few details below and our team will follow up with availability, pricing, and a tailored recommendation.</p>
                    </div>

                    <div className="inquire-grid">
                        <div className="inquire-card">
                            <form onSubmit={handleSubmit}>
                                <div className="input-field">
                                    <label htmlFor="name">Full name</label>
                                    <input id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        maxLength={100}
                                        required/>
                                </div>

                                <div className="input-field">
                                    <label htmlFor="email">Email address</label>
                                    <input id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="juan@email.com"
                                        maxLength={150}
                                        required/>
                                </div>

                                <div className="input-field">
                                    <label htmlFor="phone">Phone number</label>
                                    <input id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+63 9XX XXX XXXX"
                                        maxLength={30}/>
                                </div>

                                <div className="input-field">
                                    <label htmlFor="guests">Guests</label>
                                    <select id="guests"
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}>
                                        <option value="" disabled>Select guests</option>
                                        <option value="1">1 guest</option>
                                        <option value="2">2 guests</option>
                                        <option value="3-4">3–4 guests</option>
                                        <option value="5+">5+ guests</option>
                                    </select>
                                </div>

                                <div className="input-field">
                                    <label htmlFor="checkin">Check-in</label>
                                    <input id="checkin"
                                        type="date"
                                        min={today}
                                        value={checkin}
                                        onChange={(e) => setCheckin(e.target.value)}/>
                                </div>

                                <div className="input-field">
                                    <label htmlFor="checkout">Check-out</label>
                                    <input id="checkout"
                                        type="date"
                                        min={checkin || today}
                                        value={checkout}
                                        onChange={(e) => setCheckout(e.target.value)}/>
                                </div>

                                <div className="input-field full">
                                    <label htmlFor="interest">Interested in</label>
                                    <select id="interest"
                                        value={interest}
                                        onChange={(e) => setInterest(e.target.value)}>
                                        <option>Accommodation only</option>
                                        <option>Accommodation + tour package</option>
                                        <option>Tour package only</option>
                                        <option>Others</option>
                                    </select>
                                </div>

                                <div className="input-field full">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        maxLength={2000}
                                        placeholder="Tell us a bit more about your trip — dates, group size, or anything else we should know."></textarea>
                                </div>

                                {/* honeypot field: hidden from people, visible to bots */}
                                <input
                                    type="text"
                                    name="website"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                    style={{ position: "absolute", left: "-9999px", opacity: 0 }}/>

                                {feedback && (
                                    <p className={`inquire-status ${status}`} role="status">
                                        {feedback}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={status === "sending"}>
                                    {status === "sending" ? "Sending..." : "Send inquiry"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="location-section">
                <div className="location-content">

                    <div className="location-info">
                        <p className="section-title">LOCATION</p>

                        <h2>This is where your stay begins.</h2>

                        <p className="section-description">
                            National Road, Brgy. Tuhel, Ivana, Batanes
                        </p>
                    </div>

                    <div className="location-map">
                        <iframe
                            src="https://www.google.com/maps?q=Siayanrock+Hometel,+Ivana,+Batanes&output=embed"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            title="Siayanrock Hometel Location"
                        ></iframe>
                    </div>

                </div>
            </div>

        </section>
    );
}

export default Inquire;