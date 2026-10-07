import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { supabase } from '../lib/supabaseClient';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import SEO from "@/components/SEO";

import '../index.css';
import Reveal from "@/components/Reveal";

// Replace these placeholders with real guest reviews (with the guest's permission)
;
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
        description: "Located beside Siayanrock Hometel, this bridge is a remnant of the Spanish colonial era.",
        imagePath: "tours/tours-6.webp",
        distance: "5 meters",
        bikeTime: "[XX] min",
    },
    {
        name: "Dakay House",
        description:
            "The oldest surviving traditional stone house on the island, built in the 1800s.",
        imagePath: "tours/tours-9.webp",
        distance: "59 meters",
        bikeTime: "[XX] min",
        featured: true,
    },
    {
        name: "Honesty Coffee Shop",
        description: "A quaint coffee shop where you can enjoy a cup of coffee while taking in the serene surroundings.",
        imagePath: "tours/tours-7.webp",
        distance: "650 meters",
        bikeTime: "[XX] min",
    },
    {
        name: "Ivana Lighthouse",
        description: "A lighthouse offering views of the surrounding landscape and the sea.",
        imagePath: "tours/tours-10.webp",
        distance: "650 meters",
        bikeTime: "[XX] min",
    },
    {
        name: "San Jose Church",
        description: "A historic church with a rich cultural heritage.",
        imagePath: "tours/tours-8.webp",
        distance: "600 meters",
        bikeTime: "[XX] min",
    },
    {
        name: "Nakurang Viewdeck",
        description: "A private viewdeck reserved for our guests. Come for the sunrise, stay for the open sky and the sea beyond.",
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
        <div className="about-us" id='page'>
            <SEO
                title="About Us | Siayanrock Hometel & Mavien Point Tours"
                description="Meet Robert Gabas and Ofelia Gabas, the owners of Siayanrock Is. Hometel and Mavien Point Travel and Tours in Ivana, Batanes."
                path="/about"
            />
            {/* ===== Story ===== */}
            <section className="about-us-story" id="about">
                <Reveal className="about-us-story-overlay">
                    <div className="about-us-text">
                        <p className="section-title">About Us</p>

                        <h2 className="about-us-h2">
                            A home on the edge of the <em>Batanes</em> horizon.
                        </h2>

                        <p className="about-us-lead">
                            Siayanrock Is. Hometel is owned and run by{" "}
                            <span className="about-us-lead-highlight">Robert Gabas and Ofelia Gabas</span>
                            , a couple who wanted travelers to feel the warmth of a Batanes home, not just
                            book a room. Every stay here comes with quiet mornings, open views, and
                            hosts who treat you like family.
                        </p>

                    </div>
                </Reveal>
            </section>

            {/* ===== Two businesses ===== */}
            <section className="about-us-family">
                <Reveal className="about-us-wrap about-us-family-grid">
                    <div className="about-us-biz">
                        <p className="about-us-tag section-title">Stay</p>
                        <h3 className="about-us-h3">Siayanrock Is. Hometel</h3>
                        <p className="section-description">
                            A comfortable, peaceful place to rest between adventures, with
                            the feel of a real home and the convenience travelers need right in the heart of Ivana.
                        </p>
                        <Link className="about-us-btn" to="/accommodation">
                            See our hometel <ArrowRight animateOnHover size={16} />
                        </Link>
                    </div>

                    <div className="about-us-divider" />

                    <div className="about-us-biz">
                        <p className="about-us-tag section-title">Explore</p>
                        <h3 className="about-us-h3">Mavien Point Travel and Tours</h3>
                        <p className="section-description">
                            Our own travel agency, run by the same owners. Book your room and
                            your island tours together, guided by people who know Batanes
                            best.
                        </p>
                        <Link className="about-us-btn" to="/tours">
                            See our tours <ArrowRight animateOnHover size={16} />
                        </Link>
                    </div>
                </Reveal>
                {/*<p className="about-us-wrap about-us-owners-line">
                One family. One roof. Two ways to enjoy Batanes.
                </p>*/}
            </section>

            {/* ===== Perks ===== */}
            <section className="about-us-perks">
                <Reveal className="about-us-wrap">
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
                            <p className="about-us-viewdeck-tag section-title">Private Viewdeck</p>
                            <h3 className="about-us-h3">Nakurang Viewdeck</h3>
                            <p className="section-description">
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
                </Reveal>
            </section>

            {/* ===== Five nearby spots ===== */}
            <section className="about-us-nearby">
                <div className="about-us-wrap">
                    <Reveal className="about-us-nearby-text">
                        <div>
                            <p className="about-us-eyebrow section-title">Nearby</p>
                            <h2>Six places worth the pedal.</h2>
                            <p className="about-us-lead">
                                Close to the hometel, and easy to reach on our free bikes or with
                                Mavien Point Travel and Tours.
                            </p>
                        </div>

                    </Reveal>

                    <Reveal className="about-us-bento">
                        {SPOTS.map((spot, i) => (
                            <article
                                key={spot.name}
                                className="about-us-spot"
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
                    </Reveal>
                </div>
            </section>


        </div>
    );
}