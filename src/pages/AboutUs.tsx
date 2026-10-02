import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { supabase } from '../lib/supabaseClient';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import '../index.css';

type Spot = {
    name: string;
    description: string;
    imagePath: string;
    distance: string;
    bikeTime: string;
    featured?: boolean;
};

const SITE_IMAGES_BUCKET = "gallery";

const SPOTS: Spot[] = [
    {
        name: "Spanish Bridge",
        description: "Hilltop views over Basco and the sea.",
        imagePath: "tours/tours-6.webp",
        distance: "5 meters",
        bikeTime: "[XX] min",
    },
    {
        name: "Dakay House",
        description:
        "Windswept green slopes, sea cliffs, and grazing cattle. The postcard view of Batanes.",
        imagePath: "tours/tours-9.webp",
        distance: "59 meters",
        bikeTime: "[XX] min",
        featured: true,
    },
    {
        name: "Honesty Coffee Shop",
        description: "A shoreline of smooth boulders shaped by the sea.",
        imagePath: "tours/tours-7.webp",
        distance: "650 meters",
        bikeTime: "[XX] min",
    },
    {
        name: "Ivana Lighthouse",
        description: "A calm coastal deck with a sea-facing sunset.",
        imagePath: "tours/tours-10.webp",
        distance: "650 meters",
        bikeTime: "[XX] min",
    },
    {
        name: "San Jose Church",
        description: "Open meadows and ocean views, best at golden hour.",
        imagePath: "tours/tours-8.webp",
        distance: "600 meters",
        bikeTime: "[XX] min",
    },
    {
        name: "Nakurang Viewdeck",
        description: "A calm coastal deck with a sea-facing sunset.",
        imagePath: "nakurang/nakurang-2.webp",
        distance: "1.8 km",
        bikeTime: "[XX] min",
    },
];
function getPublicImageUrl(path: string): string {
    const { data } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}


export default function AboutUs() {
    const [slide, setSlide] = useState(0);
    const [paused, setPaused] = useState(false);
    const [nakurangImages, setNakurangImages] = useState<string[]>([]);
    const total = nakurangImages.length;

    const goTo = (i: number) => setSlide((i + total) % total);

    useEffect(() => {
        async function fetchNakurangImages() {
            const { data, error } = await supabase.storage
                .from(SITE_IMAGES_BUCKET)
                .list("nakurang", { sortBy: { column: "name", order: "asc" } });

            if (error) {
                console.error(error);
                return;
            }

            const urls = (data ?? [])
                .filter((file) => file.name && !file.name.startsWith(".") && !file.name.includes("-thumb"))
                .map((file) => getPublicImageUrl(`nakurang/${file.name}`));
            setNakurangImages(urls);
        }

        fetchNakurangImages();
    }, []);

    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (total < 2 || paused || reduceMotion) return;
        const id = setInterval(() => setSlide((s) => (s + 1) % total), 5000);
        return () => clearInterval(id);
    }, [total, paused]);
    
    return (
        <div className="about-us">
        {/* ===== Story ===== */}
            <section className="about-us-story" id="about">
                <div className="about-us-story-overlay">
                    <div className="about-us-text">
                        <p className="section-title">About Us</p>

                        <h2 className="about-us-h2">
                            A home on the edge of the <em>Batanes</em> horizon.
                        </h2>

                        <p className="about-us-lead">
                            Siayanrock Is. Hometel is owned and run by <strong>Robert Gabas and Ofelia Gabas</strong>,
                            a couple who wanted travelers to feel the warmth of a Batanes home, not just
                            book a room. Every stay here comes with quiet mornings, open views, and
                            hosts who treat you like family.
                        </p>

                    </div>
                </div>
            </section>

            {/* ===== Two businesses ===== */}
            <section className="about-us-family">
                <div className="about-us-wrap about-us-family-grid">
                    <div className="about-us-biz">
                        <p className="about-us-tag">Stay</p>
                        <h3 className="about-us-h3">Siayanrock Is. Hometel</h3>
                        <p>
                            A comfortable, peaceful place to rest between adventures, with
                            the feel of a real home and the convenience travelers need right in the heart of Ivana.
                        </p>
                        <Link className="about-us-btn" to="/accommodation">
                            See our hometel <ArrowRight animateOnHover size={16} />
                        </Link>
                    </div>

                    <div className="about-us-divider" />

                    <div className="about-us-biz">
                        <p className="about-us-tag">Explore</p>
                        <h3 className="about-us-h3">Mavien Point Travel and Tours</h3>
                        <p>
                            Our own travel agency, run by the same owners. Book your room and
                            your island tours together, guided by people who know Batanes
                            best.
                        </p>
                        <Link className="about-us-btn" to="/tours">
                            See our tours <ArrowRight animateOnHover size={16} />
                        </Link>
                    </div>
                </div>
                {/*<p className="about-us-wrap about-us-owners-line">
                One family. One roof. Two ways to enjoy Batanes.
                </p>*/}
            </section>

            {/* ===== Perks ===== */}
            <section className="about-us-perks">
                <div className="about-us-wrap">
                    <div
                        className="about-us-viewdeck"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                        aria-roledescription="carousel"
                        aria-label="Nakurang Viewdeck photos"
                        >
                        {nakurangImages.map((src, i) => (
                            <img
                            key={src}
                            src={src}
                            alt={`Nakurang Viewdeck photo ${i + 1}`}
                            className={`about-us-viewdeck-slide${i === slide ? " is-active" : ""}`}
                            aria-hidden={i !== slide}
                            />
                        ))}

                        <div className="about-us-viewdeck-shade" />

                        <div className="about-us-viewdeck-copy">
                            <p className="about-us-viewdeck-tag">Private Viewdeck</p>
                            <h3 className="about-us-h3">Nakurang Viewdeck</h3>
                            <p>
                            A private viewdeck reserved for our guests, far from the crowds.
                            Come for the sunrise, stay for the open sky and the sea beyond.
                            </p>
                        </div>

                        {total > 1 && (
                            <>
                            <button
                                className="about-us-viewdeck-arrow about-us-viewdeck-arrow--prev"
                                onClick={() => goTo(slide - 1)}
                                aria-label="Previous photo"
                            >
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </button>
                            <button
                                className="about-us-viewdeck-arrow about-us-viewdeck-arrow--next"
                                onClick={() => goTo(slide + 1)}
                                aria-label="Next photo"
                            >
                                <FontAwesomeIcon icon={faAngleRight} />
                            </button>

                            <div className="about-us-viewdeck-dots">
                                {nakurangImages.map((src, i) => (
                                <button
                                    key={src}
                                    className={i === slide ? "is-active" : ""}
                                    onClick={() => goTo(i)}
                                    aria-label={`Go to photo ${i + 1}`}
                                />
                                ))}
                            </div>
                            </>
                        )}
                    </div>

                    {/*
                    <div className="about-us-bikes">
                        <span className="about-us-bikes-free">Free</span>
                        <div>
                        <h3 className="about-us-h3">Bicycles for every guest</h3>
                        <p>
                            Borrow a bike at no charge and pedal to the nearby sights at
                            your own pace. Just ask our front desk.
                        </p>
                        </div>
                    </div>
                    */}
                </div>
            </section>

            {/* ===== Five nearby spots ===== */}
            <section className="about-us-nearby">
                <div className="about-us-wrap">
                    <div className="about-us-nearby-text">
                        <div>
                        <p className="about-us-eyebrow section-title">Nearby</p>
                        <h2>Six places worth the pedal.</h2>
                        </div>
                        <p className="about-us-lead">
                            Close to the hometel, and easy to reach on our free bikes or with
                            Mavien Point Travel and Tours.
                        </p>
                    </div>

                    <div className="about-us-bento">
                        {SPOTS.map((spot, i) => (
                        <article
                            key={spot.name}
                            className={`about-us-spot${spot.featured ? " about-us-spot--feature" : ""}`}
                        >
                            <img
                            src={getPublicImageUrl(spot.imagePath)}
                            alt={spot.name}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                            />
                            <div className="about-us-spot-wash" />

                            <span className="about-us-spot-num">
                                {String(i + 1).padStart(2, "0")}
                            </span>

                            {/*
                            <span className="about-us-spot-distance">
                                {spot.distance} from hometel
                            </span>
                            */}

                            <div className="about-us-spot-caption">
                                <h3 className="about-us-h3">{spot.name}</h3>
                                <p className="about-us-spot-desc">{spot.description}</p>
                                <p className="about-us-spot-distance">{spot.distance} from hometel</p>
                            </div>
                        </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}