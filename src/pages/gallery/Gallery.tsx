import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./gallery.css";
import "../../index.css";
import { supabase } from '@/lib/supabaseClient';
import Reveal from "@/components/Reveal";

interface GalleryImage {
    path: string;          // full path in the bucket, e.g. "Hometel/hometel-1.webp"
    category: string;
    alt: string;
}

const BUCKET = "gallery";
const INITIAL_COUNT = 9;
const LOAD_MORE_COUNT = 6;

// Folder names in the bucket, in the order tabs should appear.
const CATEGORIES = ["hometel", "nakurang", "tours", "guests"];

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

function isThumbnail(filename: string): boolean {
    return filename.includes("-thumb");
}

function formatCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

function Gallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [params, setParams] = useSearchParams();

    // "?category=nakurang" -> "nakurang"; anything missing or unknown falls back to "All"
    const categoryParam = params.get("category")?.toLowerCase() ?? "";
    const activeFilter = CATEGORIES.includes(categoryParam) ? categoryParam : "All";
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Filter tabs render immediately from the known category list, so they
    // never wait on the storage fetch to appear.
    const filters = ["All", ...CATEGORIES];

    // Fetch once; list every category folder in parallel, skip thumbnails
    useEffect(() => {
        async function fetchImages() {
            const results = await Promise.all(
                CATEGORIES.map(async (category) => {
                    const { data, error } = await supabase.storage
                        .from(BUCKET)
                        .list(category, { sortBy: { column: "name", order: "asc" } });

                    if (error) {
                        console.error(`Failed to list ${category}:`, error);
                        return [];
                    }

                    return (data ?? [])
                        .filter((file) => file.name && !file.name.startsWith(".") && !isThumbnail(file.name))
                        .map((file) => ({
                            path: `${category}/${file.name}`,
                            category,
                            alt: `${category} photo`,
                        }));
                })
            );

            const allImages = results.flat();

            if (allImages.length === 0) {
                setError(true);
            } else {
                setImages(allImages);
            }
            setLoading(false);
        }

        void fetchImages();
    }, []);

    useEffect(() => {
        setVisibleCount(INITIAL_COUNT);
        setLightboxIndex(null);
    }, [activeFilter]);

    const filteredImages =
        activeFilter === "All"
            ? images
            : images.filter(img => img.category === activeFilter);

    const visibleImages = filteredImages.slice(0, visibleCount);
    const hasMore = visibleCount < filteredImages.length;

    function handleFilterChange(filter: string) {
        if (filter === "All") setParams({}, { replace: true });
        else setParams({ category: filter }, { replace: true });
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

    return (
        <section>
            <div className='gallery-page' id='page'>
                <div id='gallery-body' className='page-body'>
                    <div className='gallery-page-content page-content'>
                        <Reveal className='gallery-title page-title'>
                            <p className="section-title">GALLERY</p>
                            <h3>Moments worth the flight</h3>
                            <p className='section-description'>Browse by category or scroll through everything — from the hometel itself to the roads, hills, and sunsets just outside the door.</p>
                        </Reveal>

                        <Reveal className="filter-nav">
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                                    onClick={() => handleFilterChange(filter)}
                                >
                                    {filter === "All" ? "All" : formatCategory(filter)}
                                </button>
                            ))}
                        </Reveal>

                        {loading && (
                            <div className="gallery-page-grid">
                                {Array.from({ length: INITIAL_COUNT }).map((_, i) => (
                                    <div className="gallery-page-item gallery-skeleton" key={i} />
                                ))}
                            </div>
                        )}

                        {error && !loading && (
                            <p className="gallery-message">
                                We couldn't load the gallery right now. Please refresh and try again.
                            </p>
                        )}

                        {!loading && !error && filteredImages.length === 0 && (
                            <p className="gallery-message">No photos in this category yet.</p>
                        )}

                        {!loading && !error && (
                            <Reveal className="gallery-page-grid">
                                {visibleImages.map((img, i) => (
                                    <div
                                        className="gallery-page-item"
                                        key={img.path}
                                        onClick={() => openLightbox(i)}>
                                        <img
                                            src={imageUrl(img.path, 500)}
                                            alt={img.alt}
                                            // first rows load right away, the rest wait until scrolled near
                                            loading={i < 3 ? "eager" : "lazy"}
                                            fetchPriority={i < 3 ? "high" : "auto"}
                                            decoding="async"
                                        />
                                    </div>
                                ))}
                            </Reveal>
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
                        alt={current.alt}
                        className="lightbox-image"
                        onClick={(e) => e.stopPropagation()} />

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