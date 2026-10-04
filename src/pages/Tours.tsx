import '../index.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import ScrollHint from '../components/Scrollhint'
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import {
    INCLUSIONS,
    PACKAGES,
    type Day,
    type PackageId,
    type TourPackage,
} from './tourPackages';
import ReserveModal from '../components/ReserveModal';


const dayLabel = (index: number): string =>
    `Day ${index + 1}`;

interface DayCardProps {
    day: Day;
    label: string;
    open: boolean;
    onToggle: () => void;
}

function DayCard({ day, label, open, onToggle }: DayCardProps) {
    const columns = day.stops.length > 6 ? 2 : 1;
    const rows = Math.ceil(day.stops.length / columns);

    return (
        <section className="tours-packages-day">
            <button
                className="tours-packages-day-head"
                type="button"
                aria-expanded={open}
                onClick={onToggle}
            >
                <span className="tours-packages-day-heading">
                    <span className="tours-packages-day-n">{label}</span>
                    <span className="tours-packages-day-title">{day.title}</span>
                </span>

                <svg
                    className="tours-packages-chev"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path
                        d="m4 7 6 6 6-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    />
                </svg>
            </button>

            {open && (
                <div className="tours-packages-day-content">
                    <ul
                    className="tours-packages-stops"
                    style={{
                        gridTemplateRows: `repeat(${rows}, auto)`,
                    }}
                    >
                        {day.stops.map((stop, index) => (
                            <li
                                key={`${stop.n}-${index}`}
                                className={`tours-packages-stop${
                                    stop.t ? ' tours-packages-timed' : ''
                                }`}
                            >
                                {stop.t && (
                                    <span className="tours-packages-time">
                                        <FontAwesomeIcon
                                            icon={faClock}
                                            aria-hidden="true"
                                        />
                                        {stop.t}
                                    </span>
                                )}

                                <span>{stop.n}</span>
                            </li>
                        ))}
                    </ul>

                    {day.sample && (
                        <p className="tours-packages-note">
                            Sample day — edit these stops in your tour package data.
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}


function Itinerary({ pkg }: { pkg: TourPackage }) {
    const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));

    const toggleDay = (index: number) => {
        setOpenDays((current) => {
            const next = new Set(current);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    return (
        <div className="tours-packages-days">
            {pkg.plan.map((day, index) => (
                <DayCard
                    key={`${pkg.id}-${index}`}
                    day={day}
                    label={dayLabel(index)}
                    open={openDays.has(index)}
                    onToggle={() => toggleDay(index)}
                />
            ))}
        </div>
    );
}

function Tours() {
    const [inquireOpen, setInquireOpen] = useState(false);
    const [id, setId] = useState<PackageId>('3d2n');
    const pkg = PACKAGES.find((item) => item.id === id) ?? PACKAGES[0];

    return (
        <section>
            <div className='tours-page' id='page'> 
                <div className='tours-hero-section'>
                    <div className='tours-content page-content'>
                        <div className='tours-text page-header'>
                            <h2>Mavien Point Travel & Tour</h2>
                            <p>Discover iconic tourist spots, rolling hills, stone houses, and coastal views through thoughtfully curated itineraries.</p>
                            <ScrollHint targetId='tours-packages-body' />
                        </div>
                    </div>
                </div>

            <div id='tours-packages-body' className='tours-packages page-body'>
                <div className='tours-content page-content'>
                
            <div className="tours-packages-inner">
                <div className="tours-packages-switcher" role="tablist" aria-label="Choose a tour package">
                    {PACKAGES.map((item) => (
                        <button
                            key={item.id}
                            id={`tour-tab-${item.id}`}
                            className="tours-packages-pill"
                            type="button"
                            role="tab"
                            aria-selected={item.id === id}
                            aria-controls={`tour-panel-${item.id}`}
                            onClick={() => setId(item.id)}
                        >
                            <span className="tours-packages-pill-label">{item.label}</span>
                            <span className="tours-packages-pill-meta">{item.days} days · {item.nights} nights</span>
                        </button>
                    ))}
                </div>

                <div
                    className="tours-packages-panel-layout"
                    id={`tour-panel-${pkg.id}`}
                    role="tabpanel"
                    aria-labelledby={`tour-tab-${pkg.id}`}
                    tabIndex={0}
                >
                    <div className="tours-packages-main-column">
                        <header className="tours-packages-heading">
                            <div><h3 id="tours-packages-heading">{pkg.label} Batanes Tour Package</h3></div>
                        </header>

                        <section className="tours-packages-itinerary" aria-label="Day-by-day tour itinerary">
                            <Itinerary key={pkg.id} pkg={pkg} />
                        </section>
                    </div>

                    <aside className="tours-packages-aside">
                        <div className="tours-packages-booking-card">
                            <h3>{pkg.label} Batanes</h3>
                            <p className="tours-packages-price">{pkg.price}</p>
                            <div className="tours-packages-booking-rule" />

                            <h4>All Packages Include:</h4>
                            <ul className="tours-packages-highlights">
                                {INCLUSIONS.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>

                            <button type='button' className='tours-packages-btn' onClick={() => setInquireOpen(true)}>
                                Inquire about {pkg.label} <ArrowRight size={16} />
                            </button>
                        </div>               
                    <p className="tours-packages-footnote">Tour timing and stops may change with weather, sea conditions, and local schedules.</p>
                                
                    </aside>
                    
                </div>
                </div>
                </div>
            </div>
            </div>
            <ReserveModal
                open={inquireOpen}
                onClose={() => setInquireOpen(false)}
                tourPackage={`${pkg.label} Batanes`}
                tourDetail={`${pkg.days} days, ${pkg.days - 1} nights`}
            />
        </section>
    );
}

export default Tours;
