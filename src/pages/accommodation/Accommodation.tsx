import "./accommodation.css";
import "../../index.css";
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ScrollHint from '@/components/Scrollhint';
import { supabase } from '@/lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Bed, Users } from "lucide-react";
import ReserveModal from '@/components/ReserveModal';
import RoomSearchBar, { type RoomSearchValues } from '@/components/RoomSearch';
import { parseLocalDate, nightsBetween } from '@/lib/searchDates';

const BUCKET = "gallery";

const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;

function roomImageUrl(path: string): string {
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

const ALL = "all";

const normalizeKind = (s: string | null | undefined): string =>
    (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

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

function Accommodation() {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [reservingRoom, setReservingRoom] = useState<Room | null>(null);
    const [kind] = useState<string>(ALL);
    const [unavailableIds, setUnavailableIds] = useState<Set<number>>(new Set());
    const [checking, setChecking] = useState(false);

    /* ---------- search params ---------- */
    const search = useMemo(() => {
        const checkIn = parseLocalDate(params.get("checkIn"));
        const checkOut = parseLocalDate(params.get("checkOut"));
        const guestsParam = params.get("guests");
        const guests = guestsParam ? parseInt(guestsParam, 10) : NaN; // "5+" -> 5

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!checkIn || !checkOut || !Number.isFinite(guests)) return null;
        if (checkIn < today || checkOut <= checkIn) return null;

        return {
            checkIn,
            checkOut,
            checkInStr: params.get("checkIn")!,
            checkOutStr: params.get("checkOut")!,
            guests,
            nights: nightsBetween(checkIn, checkOut),
        };
    }, [params]);

    /* ---------- load rooms (this was missing) ---------- */
    useEffect(() => {
        getRoomInfo();
    }, []);

    async function getRoomInfo() {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('is_active', true)
            .order('room_number');

        if (error) {
            console.error(error);
            return;
        }
        setRooms(data ?? []);
    }

    /* ---------- load conflicting bookings ---------- */
    useEffect(() => {
        if (!search) {
            setUnavailableIds(new Set());
            return;
        }

        let cancelled = false;

        (async () => {
            setChecking(true);

            const { data, error } = await supabase
                .from('bookings')
                .select('room_id')
                .lt('check_in', search.checkOutStr)
                .gt('check_out', search.checkInStr)
                .in('status', ['pending', 'confirmed']);

            if (cancelled) return;

            if (error) {
                console.error(error);
                setUnavailableIds(new Set());
            } else {
                setUnavailableIds(new Set((data ?? []).map((b) => b.room_id)));
            }
            setChecking(false);
        })();

        return () => { cancelled = true; };
    }, [search]);

    /* ---------- derived data ---------- */
    const availableRooms = useMemo(() => {
        if (!search) return rooms;
        return rooms.filter(
            (r) => r.max_guests >= search.guests && !unavailableIds.has(r.id)
        );
    }, [rooms, search, unavailableIds]);

    const visibleRooms = kind === ALL
        ? availableRooms
        : availableRooms.filter((r) => normalizeKind(r.room_type) === normalizeKind(kind));

    const stayTotal = (room: Room): number | null => {
        if (!search) return null;
        const extraGuests = Math.max(0, search.guests - room.base_guests);
        return (room.room_price + extraGuests * room.extra_guests_fee) * search.nights;
    };

    const handleSearch = ({ checkIn, checkOut, guests }: RoomSearchValues) => {
        setParams({ checkIn, checkOut, guests });
    };

    const clearSearch = () => setParams({});

    function handleViewDetails(room: Room) {
        navigate(`/rooms/${room.id}`);
    }

    function handleBookRoom(room: Room) {
        setReservingRoom(room);
    }

    return (
        <section>
            <div className='accommodation-page' id='page'>
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
                    <div className='accommodation-content page-content'>

                        <RoomSearchBar
                            variant="inline"
                            defaultCheckIn={search?.checkInStr ?? null}
                            defaultCheckOut={search?.checkOutStr ?? null}
                            defaultGuests={search ? params.get("guests") : null}
                            onSearch={handleSearch}
                            onClear={clearSearch}
                        />

                        {checking && <p className='accommodation-checking'>Checking availability…</p>}

                        <div className='accommodation-rooms-content'>
                            <div className='accommodation-room-cards'>

                                {/* One empty state only */}
                                {!checking && rooms.length > 0 && visibleRooms.length === 0 && (
                                    <p className='accommodation-kind-empty'>
                                        {search
                                            ? "No rooms are available for those dates and group size. Try different dates or fewer guests."
                                            : "No rooms of this kind are available right now."}
                                    </p>
                                )}

                                {visibleRooms.map((room) => {
                                    const primaryImage = room.images?.[0];
                                    const total = stayTotal(room);

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
                                                            <Bed size={16} />
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
                                                            {peso(room.room_price)}
                                                        </span>
                                                        /night
                                                        {total !== null && search && (
                                                            <>
                                                                <br />
                                                                <small>
                                                                    Total {peso(total)} for {search.nights} night{search.nights > 1 ? "s" : ""}
                                                                </small>
                                                            </>
                                                        )}
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