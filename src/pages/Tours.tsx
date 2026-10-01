import '../index.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { MoveUpRight } from 'lucide-react';
import {
    CONTACT,
    EXCLUSIONS,
    INCLUSIONS,
    PACKAGES,
    type Day,
    type PackageId,
    type TourPackage,
} from './tourPackages';

const countStops = (pkg: TourPackage): number =>
    pkg.plan.reduce((total, day) => total + day.stops.length, 0);

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
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
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
    const [id, setId] = useState<PackageId>('3d2n');
    const pkg = PACKAGES.find((item) => item.id === id) ?? PACKAGES[0];

    return (
        <section>
            <div className='tours-hero-section'>
                <div className='tours-content page-content'>
                    <div className='tours-text page-header'>
                        <h2>Mavien Point Travel & Tour</h2>
                        <p>Discover iconic tourist spots, rolling hills, stone houses, and coastal views through thoughtfully curated itineraries.</p>
                    </div>
                </div>
            </div>

            <div className='tours-packages page-body'>
                <div className='tours-packages-title page-title'>
                    <p className="section-title">OUR TOURS</p>
                    <h3>Curated Batanes itineraries</h3>
                </div>
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
                            <div>
                                <h3 id="tours-packages-heading">{pkg.label} Batanes itinerary</h3>
                            </div>
                            <span className="tours-packages-stop-count">{countStops(pkg)} itinerary stops</span>
                        </header>

                        {/*
                        <div className="tours-packages-facts" aria-label="Package summary">
                            <div className="tours-packages-fact"><span>Duration</span><strong>{pkg.days} days, {pkg.nights} nights</strong></div>
                            <div className="tours-packages-fact"><span>Island coverage</span><strong>North · South · Sabtang</strong></div>
                            <div className="tours-packages-fact"><span>Accommodation</span><strong>Private AC room</strong></div>
                        </div>
                        */}

                        <section className="tours-packages-itinerary" aria-label="Day-by-day tour itinerary">
                            <div className="tours-packages-section-heading">
                                <div>
                                    <h3>Day-by-day itinerary</h3>
                                </div>
                                <span>Open a day to see its stops</span>
                            </div>
                            <Itinerary key={pkg.id} pkg={pkg} />
                        </section>

                        <div className="tours-packages-details">
                            <section className="tours-packages-detail-card tours-packages-inclusions">
                                <div className="tours-packages-detail-title"><h3>Inclusions</h3></div>
                                <ul>{INCLUSIONS.map((item) => <li key={item}>{item}</li>)}</ul>
                            </section>
                            <section className="tours-packages-detail-card tours-packages-exclusions">
                                <div className="tours-packages-detail-title"><h3>Exclusions</h3></div>
                                <ul
                                style={{
                                    gridTemplateColumns: `repeat(${EXCLUSIONS.length > 6 ? 2 : 1}, minmax(0, 1fr))`,
                                    gridTemplateRows: `repeat(${Math.ceil(EXCLUSIONS.length / (EXCLUSIONS.length > 6 ? 2 : 1))}, auto)`,
                                }}
                                >
                                {EXCLUSIONS.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                                </ul>

                            </section>
                        </div>
                    </div>

                    <aside className="tours-packages-aside">
                        <div className="tours-packages-booking-card">
                            <h3>{pkg.label} Batanes</h3>
                            <p className="tours-packages-price">{pkg.price}</p>
                            <div className="tours-packages-booking-rule" />
                            <h4>Package highlights</h4>
                            <ul className="tours-packages-highlights">
                                <li>North Batan, South Batan and Sabtang Island tours</li>
                                <li>Photo stops with comfortable pacing</li>
                                <li>Local coordination and on-trip support</li>
                            </ul>
                            <a className="tours-packages-btn" href={CONTACT}>
                                Inquire about {pkg.label} <MoveUpRight size={16} aria-hidden="true" />
                            </a>
                        </div>
                    </aside>
                </div>
                <p className="tours-packages-footnote">Tour timing and stops may change with weather, sea conditions, and local schedules.</p>
            </div>
            </div>
        </section>
    );
}

export default Tours;
