import { useState } from "react";
import '../index.css';

const FILTERS = ["All", "Hometel", "Tours", "Guests"];

const galleryImages = [
    { src: "/src/assets/images/gallery/hometel-1.jpg", category: "Hometel" },
    { src: "/src/assets/images/gallery/hometel-2.jpg", category: "Hometel" },
    { src: "/src/assets/images/gallery/hometel-3.jpg", category: "Hometel" },
    { src: "/src/assets/images/gallery/hometel-4.jpg", category: "Hometel" },
    { src: "/src/assets/images/gallery/hometel-5.jpg", category: "Hometel" },
    { src: "/src/assets/images/gallery/tours-1.jpg", category: "Tours" },
    { src: "/src/assets/images/gallery/tours-2.jpg", category: "Tours" },
    { src: "/src/assets/images/gallery/tours-3.jpg", category: "Tours" },
    { src: "/src/assets/images/gallery/tours-4.jpg", category: "Tours" },
    { src: "/src/assets/images/church.jpg", category: "Tours" },
    { src: "/src/assets/images/hills.jpg", category: "Tours" },
    { src: "/src/assets/images/roof.jpg", category: "Guests" },
    // ...more
];


function Gallery(){
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredImages =
    activeFilter === "All"
        ? galleryImages
        : galleryImages.filter(img => img.category === activeFilter);
    return(
        <section>
            <div className='gallery-page'>
                <div className='gallery-page-content'>
                    <div className='gallery-title'>
                        <p className="section-title">GALLERY</p>
                        <h3>Moments worth the flight</h3>
                        <p className='section-description'>Browse by category or scroll through everything — from the hometel itself to the roads, hills, and sunsets just outside the door.</p>
                    </div>

                <div className="filter-nav">
                    {FILTERS.map(filter => (
                    <button
                        key={filter}
                        className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                    ))}
                </div>

                <div className="gallery-page-grid">
                    {filteredImages.map((img, i) => (
                    <div className="gallery-page-item" key={i}>
                        <img src={img.src} alt={img.category} />
                    </div>
                    ))}
                </div>
            </div>
        </div>
        </section>
    );
}

export default Gallery;