import { useRef, useState } from "react";
import type { FormEvent } from "react";
import "./inquire.css";
import "../../index.css";
import { supabase } from "@/lib/supabaseClient";
import { toLocalISO } from "@/lib/searchDates";
import { Mail, Phone, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import SEO from "@/components/SEO";


const CONTACT_INFO = {
    email: "siayanrockis.hometel@gmail.com", // confirm this address
    phones: ["+63 919 5383 911 ", " +63 967 2003 129"],
    address: "National Road, Brgy. Tuhel, Ivana, Batanes",
    mapsUrl: "https://www.google.com/maps?q=Siayanrock+Hometel,+Ivana,+Batanes",
};
const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

const phones = CONTACT_INFO.phones.filter(Boolean);
const CONTACT_ROWS = [
    {
        icon: <Mail size={18} />,
        label: "Email",
        items: [{ text: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` }],
    },
    {
        icon: <Phone size={18} />,
        label: phones.length > 1 ? "Phone numbers" : "Phone",
        items: phones.map((p) => ({ text: p, href: telHref(p) })),
    },
    {
        icon: <MapPin size={18} />,
        label: "Visit us",
        external: true,
        items: [{ text: CONTACT_INFO.address, href: CONTACT_INFO.mapsUrl }],
    },
].filter((row) => row.items.length > 0);
type Status = "idle" | "sending" | "success" | "error";
const COUNTRIES = [
    { iso: "PH", name: "Philippines", dial: "63" },
    { iso: "US", name: "United States", dial: "1" },
    { iso: "CA", name: "Canada", dial: "1" },
    { iso: "GB", name: "United Kingdom", dial: "44" },
    { iso: "AU", name: "Australia", dial: "61" },
    { iso: "NZ", name: "New Zealand", dial: "64" },
    { iso: "SG", name: "Singapore", dial: "65" },
    { iso: "MY", name: "Malaysia", dial: "60" },
    { iso: "ID", name: "Indonesia", dial: "62" },
    { iso: "TH", name: "Thailand", dial: "66" },
    { iso: "VN", name: "Vietnam", dial: "84" },
    { iso: "HK", name: "Hong Kong", dial: "852" },
    { iso: "TW", name: "Taiwan", dial: "886" },
    { iso: "CN", name: "China", dial: "86" },
    { iso: "JP", name: "Japan", dial: "81" },
    { iso: "KR", name: "South Korea", dial: "82" },
    { iso: "IN", name: "India", dial: "91" },
    { iso: "AE", name: "United Arab Emirates", dial: "971" },
    { iso: "SA", name: "Saudi Arabia", dial: "966" },
    { iso: "QA", name: "Qatar", dial: "974" },
    { iso: "KW", name: "Kuwait", dial: "965" },
    { iso: "DE", name: "Germany", dial: "49" },
    { iso: "FR", name: "France", dial: "33" },
    { iso: "ES", name: "Spain", dial: "34" },
    { iso: "IT", name: "Italy", dial: "39" },
    { iso: "NL", name: "Netherlands", dial: "31" },
    { iso: "CH", name: "Switzerland", dial: "41" },
    { iso: "SE", name: "Sweden", dial: "46" },
    { iso: "IE", name: "Ireland", dial: "353" },
    { iso: "BR", name: "Brazil", dial: "55" },
    { iso: "MX", name: "Mexico", dial: "52" },
    { iso: "ZA", name: "South Africa", dial: "27" },
];

function Inquire() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [guests, setGuests] = useState("");
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const [interest, setInterest] = useState("Accommodation only");
    const [message, setMessage] = useState("");
    const [phoneCountry, setPhoneCountry] = useState("PH");

    // Honeypot: real people never see or fill this; bots often do.
    const [website, setWebsite] = useState("");

    const [status, setStatus] = useState<Status>("idle");
    const [feedback, setFeedback] = useState("");

    const [canFallback, setCanFallback] = useState(false);
    const openedAt = useRef(Date.now());

    const today = toLocalISO(new Date());   // local date; toISOString() gives yesterday in Manila before 8 AM

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

    const selectedCountry = COUNTRIES.find((c) => c.iso === phoneCountry) ?? COUNTRIES[0];
    const phoneDigits = phone.replace(/\D/g, "");
    const fullPhone = phoneDigits ? `+${selectedCountry.dial} ${phoneDigits}` : null;

    // pasting a full international number ("+63 919...") switches the country automatically
    function handlePhoneChange(raw: string) {
        if (raw.trim().startsWith("+")) {
            const digits = raw.replace(/\D/g, "");
            const match = [...COUNTRIES]
                .sort((a, b) => b.dial.length - a.dial.length)
                .find((c) => digits.startsWith(c.dial));
            if (match) {
                setPhoneCountry(match.iso);
                setPhone(digits.slice(match.dial.length));
                return;
            }
        }
        setPhone(raw);
    }

    type Problem = { id: string; message: string };

    function validate(): Problem | null {
        if (name.trim().length < 2)
            return { id: "name", message: "Please enter your full name." };

        if (!/^\S+@\S+\.\S+$/.test(email.trim()))
            return { id: "email", message: "Please enter a valid email address." };

        if (phone.trim()) {
            if (/[^\d\s()-]/.test(phone))
                return { id: "phone", message: "Use digits only and choose your country code from the list." };

            if (phoneDigits.startsWith("0"))
                return { id: "phone", message: "Please remove the leading 0 in the phone number." };

            if (phoneDigits.length < 6 || selectedCountry.dial.length + phoneDigits.length > 15)
                return { id: "phone", message: "Please enter a valid phone number." };

            if (phoneCountry === "PH" && !/^9\d{9}$/.test(phoneDigits))
                return { id: "phone", message: "Philippine mobile numbers have 10 digits starting with 9." };
        }


        if (checkin || checkout) {
            if (!checkin || !checkout)
                return { id: checkin ? "checkout" : "checkin", message: "Please enter both check-in and check-out dates." };
            if (checkin < today)
                return { id: "checkin", message: "Check-in can't be in the past." };
            if (checkout <= checkin)
                return { id: "checkout", message: "Check-out must be after check-in." };
        }

        if (!message.trim())
            return { id: "message", message: "Please enter a message." };

        return null;
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (status === "sending") return;
        setCanFallback(false);

        // bots: honeypot filled, or submitted within 2 seconds of the page opening
        if (website || Date.now() - openedAt.current < 2000) {
            setStatus("success");
            setFeedback("Thank you! We'll get back to you soon.");
            return;
        }

        const problem = validate();
        if (problem) {
            setStatus("error");
            setFeedback(problem.message);
            document.getElementById(problem.id)?.focus();
            return;
        }

        setStatus("sending");
        setFeedback("");

        try {
            // no .select() after insert: visitors have no read permission, so it would fail
            const { error } = await supabase.from("inquiries").insert({
                name: name.trim(),
                email: email.trim(),
                phone: fullPhone,
                guests,
                check_in: checkin || null,
                check_out: checkout || null,
                interest,
                message: message.trim(),
            });

            if (error) throw error;

            setStatus("success");
            setFeedback("Thank you! Your inquiry has been sent. We'll get back to you soon.");
            resetForm();
            openedAt.current = Date.now();
        } catch (err) {
            console.error(err);
            setStatus("error");
            setCanFallback(true);
            setFeedback("We couldn't send your inquiry right now. Please try again, or");
        }
    }
    return (

        <section>
            <SEO
                title="Inquire & Book | Siayanrock Hometel, Batanes"
                description="Send an inquiry about room availability or Batanes tour packages at Siayanrock Hometel in Ivana, Batan Island. We'll get back to you."
                path="/inquire"
            />
            <div className='inquire-page' id='page'>
                <div id='inquire-body' className='page-body'>
                    <div className='inquire-page-content'>
                        <Reveal className='inquire-title page-title'>
                            <p className="section-title">INQUIRE</p>
                            <h3>Tell us about your trip</h3>
                            <p className='section-description'>Share a few details below and our team will follow up with availability, pricing, and a tailored recommendation.</p>
                        </Reveal>

                        <Reveal className="inquire-grid">
                            <aside className="contact-card" aria-label="Contact details">

                                <div className="contact-card-info">
                                    <p className="contact-card-eyebrow section-title">CONTACT</p>
                                    <p className="contact-card-title">Prefer to talk to us directly?</p>
                                    <p className="contact-card-text">
                                        Reach out any time. We're happy to help you plan your stay and your tours in Batanes.
                                    </p>

                                    <ul className="contact-card-list">
                                        {CONTACT_ROWS.map((row) => (
                                            <li key={row.label} className="contact-card-row">
                                                <span className="contact-card-icon" aria-hidden="true">{row.icon}</span>
                                                <span className="contact-card-body">
                                                    <span className="contact-card-label">{row.label}</span>
                                                    {row.items.map((item) => (
                                                        <a
                                                            key={item.href}
                                                            className="contact-card-value"
                                                            href={item.href}
                                                            {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                                                            {item.text}
                                                        </a>
                                                    ))}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="contact-card-map">
                                    <iframe
                                        src="https://www.google.com/maps?q=Siayanrock+Hometel,+Ivana,+Batanes&output=embed"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        title="Siayanrock Hometel Location"
                                    ></iframe>
                                </div>

                            </aside>


                            <div className="inquire-card">
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="input-field">
                                        <label htmlFor="name">Full name</label>
                                        <input id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            maxLength={100}
                                            required />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="email">Email address</label>
                                        <input id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="juan@email.com"
                                            maxLength={150}
                                            required />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="phone">Phone number</label>
                                        <div className="phone-group">
                                            <div className="phone-country">
                                                <span className="phone-country-value" aria-hidden="true">
                                                    {selectedCountry.iso} +{selectedCountry.dial}
                                                </span>
                                                <select
                                                    aria-label="Country code"
                                                    value={phoneCountry}
                                                    onChange={(e) => setPhoneCountry(e.target.value)}>
                                                    {COUNTRIES.map((c) => (
                                                        <option key={c.iso} value={c.iso}>
                                                            {c.name} (+{c.dial})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <input id="phone"
                                                type="tel"
                                                inputMode="tel"
                                                autoComplete="tel-national"
                                                value={phone}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                placeholder="Phone number"
                                                maxLength={20} />
                                        </div>
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
                                            onChange={(e) => setCheckin(e.target.value)} />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="checkout">Check-out</label>
                                        <input id="checkout"
                                            type="date"
                                            min={checkin || today}
                                            value={checkout}
                                            onChange={(e) => setCheckout(e.target.value)} />
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
                                            required
                                            placeholder="Tell us a bit more about your trip — dates, group size, or anything else we should know."></textarea>
                                    </div>

                                    {/* honeypot field: hidden from people, visible to bots */}
                                    <input
                                        type="text"
                                        name="company_url"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        tabIndex={-1}
                                        autoComplete="off"
                                        aria-hidden="true"
                                        style={{ position: "absolute", left: "-9999px", opacity: 0 }} />

                                    {feedback && (
                                        <div className={`inquire-status ${status}`} role={status === "error" ? "alert" : "status"}>
                                            {status === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                                            <p>
                                                {feedback}{" "}
                                                {canFallback && <a href={`mailto:${CONTACT_INFO.email}`}>email us directly.</a>}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="submit-btn page-btn"
                                        disabled={status === "sending"}>
                                        {status === "sending" ? "Sending..." : "Send inquiry"}
                                    </button>
                                </form>
                            </div>
                        </Reveal>
                    </div>
                </div>


            </div>

        </section>
    );
}

export default Inquire;