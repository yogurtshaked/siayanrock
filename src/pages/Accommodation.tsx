import '../index.css';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons/faBed';
import { faCheck, faUserGroup } from '@fortawesome/free-solid-svg-icons';


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
        extra_guest_fee: number;
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
        // navigate to booking flow with this room pre-selected
        console.log("Book room:", room);
    }


    return(
        <section>
            <div className='accommodation-hero-section'>
                <div className='accommodation-content'>
                    <div className='accommodation-text'>
                        <h2>Siayanrock Is. Hometel</h2>
                        <p>Discover iconic tourist spots, rolling hills, stone houses, and coastal views through thoughtfully curated itineraries.</p>
                    </div>
                </div>
            </div>

            <div className='accommodation-rooms'>
                <div className='accommodation-rooms-title'>
                    <p className="section-title">OUR ROOMS</p>
                    <h3>Find your perfect room</h3>
                </div>
                
                <div className='accommodation-rooms-content'>
                    <div className='accommodation-room-cards'>

                        {rooms.map((room) => {
                            const primaryImage = room.images?.[0];

                            return (
                                <div className='room-card' key={room.id}>
                                    <div className='room-img'>
                                        <img
                                            src={primaryImage || '/images/placeholder.jpg'}
                                            alt={room.room_type}
                                        />
                                    </div>

                                    <div className='room-contents'>
                                        <div className='room-header'>
                                            <h3>{room.room_name} Room</h3>

                                            <div className="room-pax">
                                                <div className="pax-item">
                                                    <FontAwesomeIcon icon={faBed} />
                                                    <p>
                                                        {room.num_beds}{' '}
                                                        {room.num_beds === 1 ? 'bed' : 'beds'}
                                                    </p>
                                                </div>

                                                <div className="pax-item">
                                                    <FontAwesomeIcon icon={faUserGroup} />
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
                                                    Book Room
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
        </section>
    );
}

export default Accommodation;