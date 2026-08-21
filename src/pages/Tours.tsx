import { section } from 'motion/react-client';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        </section>
    );
}

export default Tours;