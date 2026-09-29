import { useState, useEffect, useMemo } from "react";
import '../index.css';
import { supabase } from '../lib/supabaseClient';


interface GalleryImage {
    id: number;
    path: string;          // exact file path in the bucket, e.g. "hometel/hometel-1.jpg"
    category: string;
    alt: string | null;
}

const BUCKET = "gallery";
const INITIAL_COUNT = 9;
const LOAD_MORE_COUNT = 6;

// Preferred tab order. Any new category in the database is added after these automatically.
const CATEGORY_ORDER = ["Hometel", "Nakurang", "Tours", "Guests"];

// Supabase can resize images on the fly, but only on the Pro plan.
// Leave false on the free plan (otherwise images will fail to load).
const USE_TRANSFORM = false;

function imageUrl(path: string, width?: number): string {
    const options =
        USE_TRANSFORM && width
            ? { transform: { width, quality: 75 } }
            : undefined;
    return supabase.storage.from(BUCKET).getPublicUrl(path, options).data.publicUrl;
}

function Gallery(){
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [activeFilter, setActiveFilter] = useState("All");
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Fetch once; filtering happens in memory
    useEffect(() => {
        async function fetchImages() {
            const { data, error } = await supabase
                .from("gallery_images")
                .select("id, path, category, alt")
                .order("sort_order", { ascending: true })
                .order("id", { ascending: true });

            if (error) {
                console.error(error);
                setError(true);
            } else {
                setImages(data as GalleryImage[]);
            }
            setLoading(false);
        }

        void fetchImages();
    }, []);

    // Filter tabs come from the data, so a new category needs no code change
    const filters = useMemo(() => {
        if (images.length === 0) return ["All", ...CATEGORY_ORDER];
        const found = Array.from(new Set(images.map(img => img.category)));
        const rank = (c: string) => {
            const i = CATEGORY_ORDER.indexOf(c);
            return i === -1 ? CATEGORY_ORDER.length : i;
        };
        return ["All", ...found.sort((a, b) => rank(a) - rank(b))];
    }, [images]);

    const filteredImages =
        activeFilter === "All"
            ? images
            : images.filter(img => img.category === activeFilter);

    const visibleImages = filteredImages.slice(0, visibleCount);
    const hasMore = visibleCount < filteredImages.length;

    function handleFilterChange(filter: string) {
        setActiveFilter(filter);
        setVisibleCount(INITIAL_COUNT);
    }

    function handleLoadMore() {
        setVisibleCount(prev => prev + LOAD_MORE_COUNT);
    }

    function openLightbox(index: number) {
        setLightboxIndex(index);
    }

    function closeLightbox() {
        setLightboxIndex(null);
    }

    // Keyboard support: Escape to close, arrow keys to navigate
    useEffect(() => {
        if (lightboxIndex === null) return;

        const total = visibleImages.length;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowLeft")
                setLightboxIndex(i => (i === null ? null : (i - 1 + total) % total));
            if (e.key === "ArrowRight")
                setLightboxIndex(i => (i === null ? null : (i + 1) % total));
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex === null, visibleImages.length]);

    function showPrev() {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex - 1 + visibleImages.length) % visibleImages.length);
    }

    function showNext() {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex + 1) % visibleImages.length);
    }

    const current = lightboxIndex !== null ? visibleImages[lightboxIndex] : null;

    return(
        <section>
            <div className='gallery-page'>
                <div className='gallery-page-content'>
                    <div className='gallery-title page-title'>
                        <p className="section-title">GALLERY</p>
                        <h3>Moments worth the flight</h3>
                        <p className='section-description'>Browse by category or scroll through everything — from the hometel itself to the roads, hills, and sunsets just outside the door.</p>
                    </div>

                    <div className="filter-nav">
                        {filters.map(filter => (
                        <button
                            key={filter}
                            className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                            onClick={() => handleFilterChange(filter)}>
                            {filter}
                        </button>
                        ))}
                    </div>

                    {loading && (
                        <div className="gallery-page-grid">
                            {Array.from({ length: INITIAL_COUNT }).map((_, i) => (
                                <div className="gallery-page-item gallery-skeleton" key={i} />
                            ))}
                        </div>
                    )}

                    {error && (
                        <p className="gallery-message">
                            We couldn't load the gallery right now. Please refresh and try again.
                        </p>
                    )}

                    {!loading && !error && filteredImages.length === 0 && (
                        <p className="gallery-message">No photos in this category yet.</p>
                    )}

                    {!loading && !error && (
                        <div className="gallery-page-grid">
                            {visibleImages.map((img, i) => (
                            <div
                                className="gallery-page-item"
                                key={img.id}
                                onClick={() => openLightbox(i)}>
                                <img
                                    src={imageUrl(img.path, 500)}
                                    alt={img.alt ?? img.category}
                                    // first rows load right away, the rest wait until scrolled near
                                    loading={i < 3 ? "eager" : "lazy"}
                                    fetchPriority={i < 3 ? "high" : "auto"}
                                    decoding="async"
                                />
                            </div>
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <div className="load-more-wrapper">
                            <button className="load-more-btn" onClick={handleLoadMore}>
                                Load more
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {current && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button
                        className="lightbox-close"
                        onClick={closeLightbox}
                        aria-label="Close">
                        ✕
                    </button>

                    <button
                        className="lightbox-nav lightbox-prev"
                        onClick={(e) => { e.stopPropagation(); showPrev(); }}
                        aria-label="Previous image">
                        ‹
                    </button>

                    <img
                        src={imageUrl(current.path, 1600)}
                        alt={current.alt ?? current.category}
                        className="lightbox-image"
                        onClick={(e) => e.stopPropagation()}/>

                    <button
                        className="lightbox-nav lightbox-next"
                        onClick={(e) => { e.stopPropagation(); showNext(); }}
                        aria-label="Next image">
                        ›
                    </button>
                </div>
            )}
        </section>
    );
}

export default Gallery;