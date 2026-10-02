import '../index.css';

import { useEffect, useState } from 'react';
import ScrollHint from '../components/Scrollhint';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Bed, Users } from "lucide-react";
import ReserveModal from '../components/ReserveModal';

const BUCKET = "gallery";



function roomImageUrl(path: string): string {
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/* Room kinds shown in the switcher. `value` must match rooms.room_type in Supabase
   (compared ignoring case, spaces and apostrophes). */
const ROOM_KINDS = [
    { value: "Couple's Room", label: "Couple's Room" },
    { value: "Triple Sharing", label: "Triple Sharing" },
    { value: "Barkada Room", label: "Barkada Room" },
    { value: "Family Room", label: "Family Room" },
];
const ALL = "all";

const normalizeKind = (s: string | null | undefined): string =>
    (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

function Accommodation(){
    interface Room {
        id: number;
        room_number: string;
        room_name: string;
        room_type: string;
        images: string[];
        max_guests: number;
        base_guests: number;
        num_beds: number;
        room_size_sqm: number;
        room_price: number;
        extra_guests_fee: number;
        description: string;
        amenities: string[];
        is_active: boolean;
    }

    const AMENITY_LABELS: Record<string, string> = {
        balcony: "Balcony",
        street_view: "Street View",
        private_bathroom: "Private Bathroom",
        tv: "Flat-Screen TV",
        wifi: "Free Wifi",
        aircon: "Air Conditioning",
    };

    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [reservingRoom, setReservingRoom] = useState<Room | null>(null)
    const [kind, setKind] = useState<string>(ALL);

    useEffect(() => {
        getRoomInfo()
    }, [])
    
    
    async function getRoomInfo() {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('is_active', true)
            .order('room_number');

        if (error) {
            console.error(error);
            return
        } else {
            setRooms(data);
        }
    }


    function handleViewDetails(room: Room) {
        // navigate to a room details page, e.g. using react-router
        navigate(`/rooms/${room.id}`);
    }

    function handleBookRoom(room: Room) {
        setReservingRoom(room);
    }

    const countOf = (value: string): number =>
        rooms.filter((r) => normalizeKind(r.room_type) === normalizeKind(value)).length;

    const visibleRooms = kind === ALL
        ? rooms
        : rooms.filter((r) => normalizeKind(r.room_type) === normalizeKind(kind));

    const switcherOptions = [
        { value: ALL, label: "All rooms", count: rooms.length },
        ...ROOM_KINDS.map((k) => ({ ...k, count: countOf(k.value) })),
    ];

    return(
        <section>
            <div className='accommodation-hero-section'>
                <div className='accommodation-content page-content'>
                    <div className='accommodation-text page-header hero-nudge'>
                    <h2>Siayanrock Is. Hometel</h2>
                    <p>Discover iconic tourist spots, rolling hills, stone houses, and coastal views through thoughtfully curated itineraries.</p>
                    <ScrollHint targetId='accommodation-body' />
                </div>
                </div>
            </div>

            <div id='accommodation-body' className='accommodation-rooms page-body'>
                

                <div className='accommodation-kind-switcher' role='tablist' aria-label='Filter rooms by kind'>
                    {switcherOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type='button'
                            role='tab'
                            className='accommodation-kind-pill'
                            aria-selected={kind === opt.value}
                            onClick={() => setKind(opt.value)}>
                            <span className='accommodation-kind-pill-label'>{opt.label}</span>
                        </button>
                    ))}
                </div>
                
                <div className='accommodation-rooms-content'>
                    <div className='accommodation-room-cards'>

                        {visibleRooms.length === 0 && rooms.length > 0 && (
                            <p className='accommodation-kind-empty'>
                                No rooms of this kind are available right now.
                            </p>
                        )}

                        {visibleRooms.map((room) => {
                            const primaryImage = room.images?.[0];

                            return (
                                <div className='room-card' key={room.id}>
                                    <div className='room-img'>
                                        <img
                                            src={primaryImage ? roomImageUrl(primaryImage) : '/images/placeholder.jpg'}
                                            alt={room.room_type}
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                    </div>

                                    <div className='room-contents'>
                                        <div className='room-header'>
                                            <h3>{room.room_name} Room</h3>

                                            <div className="room-items">
                                                <div className="room-item">
                                                    <Bed size={16}  />
                                                    <p>
                                                        {room.num_beds}{' '}
                                                        {room.num_beds === 1 ? 'bed' : 'beds'}
                                                    </p>
                                                </div>

                                                <div className="room-item">
                                                    <Users size={16} />
                                                    <p>{room.max_guests} people</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <p>{room.description}</p> */}

                                        <div className="room-checklist">
                                            {room.amenities?.map((amenity) => (
                                                <div className="amenity" key={amenity}>
                                                    <FontAwesomeIcon icon={faCheck} color='#5f5e5e' />
                                                    <p>{AMENITY_LABELS[amenity] || amenity}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className='room-price'>
                                            <p>
                                                From{' '}
                                                <span className="price-highlight">
                                                    ₱{room.room_price}
                                                </span>
                                                /night
                                            </p>

                                            <div className='room-buttons'>
                                                <button
                                                    className='view-details'
                                                    onClick={() => handleViewDetails(room)}>
                                                    View Details
                                                </button>

                                                <button
                                                    className='book-room'
                                                    onClick={() => handleBookRoom(room)}>
                                                    Reserve Room
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>


                    </div>
                </div>
                <ReserveModal
                    open={reservingRoom !== null}
                    onClose={() => setReservingRoom(null)}
                    roomName={reservingRoom?.room_name}
                    roomThumbnail={reservingRoom?.images?.[0] ? roomImageUrl(reservingRoom.images[0]) : undefined}
                    guestCount={reservingRoom?.base_guests ?? 2}
                />
        </section>
    );
}

export default Accommodation;