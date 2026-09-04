// pages/RoomDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons/faBed';
import { faCheck, faUserGroup } from '@fortawesome/free-solid-svg-icons';

type Room = {
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
};

function RoomDetails() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        async function fetchRoom() {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', roomId)
                .single();

            if (error) {
                console.error(error);
            } else {
                setRoom(data);
            }
            setLoading(false);
        }

        fetchRoom();
    }, [roomId]);

    function handleBookRoom() {
        navigate(`/book/${roomId}`); 
    }

    if (loading) return <p>Loading room details...</p>;
    if (!room) return <p>Room not found.</p>;

    return (
        <section>
            <div className="room-details-section">
                <button className="back-btn" onClick={() => navigate(-1)}>← &nbsp;Back</button>    
                <div className="room-images">
                    <h2>{room.room_name}</h2>
                    <div className="room-items">
                        <div className="pax-item">
                            <FontAwesomeIcon icon={faBed} />
                            <p>
                                {room.num_beds}{' '}
                                {room.num_beds === 1 ? 'bed' : 'beds'}
                            </p>
                        </div>
                        <div className="pax-item">
                            <FontAwesomeIcon icon={faBed} />
                            <p>
                                {room.max_guests}{' '}
                                {room.max_guests === 1 ? 'guest' : 'guests'}
                            </p>
                        </div>
                        <div className="pax-item">
                            <FontAwesomeIcon icon={faBed} />
                            <p>
                                {room.room_size_sqm}{' '}
                                {room.room_size_sqm === 1 ? 'sqm' : 'sqm'}
                            </p>
                        </div>
                    </div>

                    <div className="room-overview">
                        <h2>Overview</h2>
                        <p>{room.description}</p>
                    </div>

                    <div className="room-amenities">
                        <h2>Amenities</h2>
                        <div className="amenities-list">
                            {room.amenities?.map((amenity) => (
                                <div className="amenity" key={amenity}> 
                                    <FontAwesomeIcon icon={faCheck} />
                                    <p>{amenity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleBookRoom}>Book This Room</button>
                </div>
            </div>
        </section>
    );
}

export default RoomDetails;