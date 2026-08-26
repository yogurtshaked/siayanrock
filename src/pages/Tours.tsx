import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { MoveUpRight } from 'lucide-react';

function Tours(){
    return(
        <section>
            <div className='tours-hero-section'>
                <div className='tours-content'>
                    <div className='tours-text'>
                        <h2>Mavien Point Travel & Tour</h2>
                        <p>Discover iconic tourist spots, rolling hills, stone houses, and coastal views through thoughtfully curated itineraries.</p>
                    </div>
                </div>
            </div>

            <div className='tours-packages'>
                <div className='tours-packages-title'>
                    <p className="section-title">OUR TOURS</p>
                    <h3>Curated Batanes itineraries</h3>
                </div>

                <div className='tours-cards'>
                    <div className='tour-card'>
                        <h3>Tour Package 1</h3>
                        <div className="duration-item">
                            <FontAwesomeIcon icon={faClock} />
                            <p>2 Days | 3 Nights</p>
                        </div>

                        <div className='tour-card-description'>
                            <p>Discover iconic tourist spots, rolling hills, stone houses, and coastal views through thoughtfully curated itineraries.</p>
                        </div>
                        <button>
                            View Details <MoveUpRight  strokeWidth={1.5}/>
                        </button>
                    </div> 

                    <div className='tour-card'>
                        <h3>Tour Package 1</h3>
                        <div className="duration-item">
                            <FontAwesomeIcon icon={faClock} />
                            <p>2 Days | 3 Nights</p>
                        </div>

                        <div className='tour-card-description'>
                            <p>Discover iconic tourist spots, rolling hills, stone houses, and coastal views through thoughtfully curated itineraries.</p>
                        </div>
                        <button>
                            View Details <MoveUpRight  strokeWidth={1.5}/>
                        </button>
                    </div> 

                    <div className='tour-card'>
                        <h3>Tour Package 1</h3>
                        <div className="duration-item">
                            <FontAwesomeIcon icon={faClock} />
                            <p>2 Days | 3 Nights</p>
                        </div>

                        <div className='tour-card-description'>
                            <p>Discover iconic tourist spots, rolling hills, stone houses, and coastal views through thoughtfully curated itineraries.</p>
                        </div>
                        <button>
                            View Details <MoveUpRight  strokeWidth={1.5}/>
                        </button>
                    </div> 
                </div>
            </div>
        </section>
    );
}

export default Tours;