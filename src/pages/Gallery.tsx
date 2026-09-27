import { useState, useEffect } from "react";
import '../index.css';

const FILTERS = ["All", "Hometel",  "Nakurang", "Tours", "Guests"];
const INITIAL_COUNT = 9;
const LOAD_MORE_COUNT = 6;

const galleryImages = [
    { src: "images/gallery/hometel-1.JPG", category: "Hometel" },
    { src: "images/gallery/hometel-2.JPG", category: "Hometel" },
    { src: "images/gallery/hometel-3.JPG", category: "Hometel" },
    { src: "images/gallery/hometel-4.JPG", category: "Hometel" },
    { src: "images/gallery/hometel-5.JPG", category: "Hometel" },
    { src: "images/gallery/hometel-6.JPG", category: "Hometel" },
    { src: "images/gallery/hometel-7.JPG", category: "Hometel" },
    { src: "images/gallery/tours-1.jpg", category: "Tours" },
    { src: "images/gallery/tours-2.jpg", category: "Tours" },
    { src: "images/gallery/tours-3.JPG", category: "Tours" },
    { src: "images/gallery/tours-4.JPG", category: "Tours" },
    { src: "images/gallery/tours-5.JPG", category: "Tours" },
    { src: "images/gallery/nakurang-1.jpg", category: "Nakurang" },
    { src: "images/gallery/nakurang-2.jpg", category: "Nakurang" },
    { src: "images/gallery/guests-1.jpg", category: "Guests" },
    { src: "images/gallery/guests-2.jpg", category: "Guests" },
    { src: "images/gallery/guests-3.jpg", category: "Guests" },
];

function Gallery(){
    const [activeFilter, setActiveFilter] = useState("All");
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const filteredImages =
        activeFilter === "All"
            ? galleryImages
            : galleryImages.filter(img => img.category === activeFilter);

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

    function showPrev() {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex - 1 + visibleImages.length) % visibleImages.length);
    }

    function showNext() {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex + 1) % visibleImages.length);
    }

    // Keyboard support: Escape to close, arrow keys to navigate
    useEffect(() => {
        if (lightboxIndex === null) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "ArrowRight") showNext();
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, visibleImages.length]);

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
                        {FILTERS.map(filter => (
                        <button
                            key={filter}
                            className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                            onClick={() => handleFilterChange(filter)}>
                            {filter}
                        </button>
                        ))}
                    </div>

                    <div className="gallery-page-grid">
                        {visibleImages.map((img, i) => (
                        <div
                            className="gallery-page-item"
                            key={i}
                            onClick={() => openLightbox(i)}>
                            <img src={img.src} alt={img.category} />
                        </div>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="load-more-wrapper">
                            <button className="load-more-btn" onClick={handleLoadMore}>
                                Load more
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {lightboxIndex !== null && (
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
                        src={visibleImages[lightboxIndex].src}
                        alt={visibleImages[lightboxIndex].category}
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