import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { Bath, Bed, Check, DoorOpen, ShowerHead, Snowflake, Tv, Users, Wifi, Phone, SquareDashed, ChevronRight  } from "lucide-react"

type Room = {
    id: number
    room_number: string
    room_name: string
    room_type: string
    images: string[]
    max_guests: number
    base_guests: number
    num_beds: number
    room_size_sqm: number
    room_price: number
    extra_guests_fee: number
    description: string
    amenities: string[]
    is_active: boolean
}

const amenityIcons: Record<string, React.ElementType> = { 
    wifi: Wifi, 
    "air conditioning": Snowflake, 
    balcony: DoorOpen, 
    "flat-screen tv": Tv, 
    "hot and cold shower": ShowerHead, 
    towels: Bath, 
}

function RoomDetails() {
    const { roomId } = useParams<{ roomId: string }>()
    const navigate = useNavigate()

    const [room, setRoom] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [guestCount, setGuestCount] = useState(2)

    const pricing = useMemo(() => {
    const nightlyRate = Number(room?.room_price) || 0
    const extraGuestFee = Number(room?.extra_guests_fee) || 0

    if (!checkIn || !checkOut) {
        return {
            nights: 0,
            extraGuests: 0,
            roomSubtotal: 0,
            extraGuestTotal: 0,
            total: 0,
        }
    }

    const start = new Date(`${checkIn}T00:00:00`)
    const end = new Date(`${checkOut}T00:00:00`)
    const nights = Math.max(
        0,
        Math.round((end.getTime() - start.getTime()) / 86_400_000),
    )

    const extraGuests = Math.max(0, guestCount - 2)
    const roomSubtotal = nightlyRate * nights
    const extraGuestTotal = extraGuests * extraGuestFee * nights

    return {
        nights,
        extraGuests,
        roomSubtotal,
        extraGuestTotal,
        total: roomSubtotal + extraGuestTotal,
        }
    }, [
        checkIn,
        checkOut,
        guestCount,
        room?.room_price,
        room?.extra_guests_fee,
    ])

    useEffect(() => {
        async function fetchRoom() {
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .eq("id", roomId)
            .single()

        if (error) {
            console.error(error)
        } else {
            setRoom(data as Room)
        }

        setLoading(false)
        }

        void fetchRoom()
    }, [roomId])

    const peso = (amount: number) =>
        new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
        }).format(amount)

        function handleBookRoom() {
            navigate(`/book/${roomId}`, {
                state: {
                    from: "room",                  // ← tells BookRoom where user came from
                    roomName: room?.room_name,      // ← "Vuhus", "Marlboro", etc.
                    checkIn,
                    checkOut,
                    guestCount,
                },
            })
        }

    if (loading) return <p>Loading room details...</p>
    if (!room) return <p>Room not found.</p>

    return (
        <section>
            <div className="room-details-page">                
                <div className="room-nav">
                    <nav className="breadcrumb" aria-label="Breadcrumb">
    <button
        type="button"
        className="breadcrumb-link"
        onClick={() => navigate("/")}
    >
        Home
    </button>
 
    <span className="breadcrumb-separator">
        <ChevronRight size={14} strokeWidth={1.5} />
    </span>
 
    <button
        type="button"
        className="breadcrumb-link"
        onClick={() => navigate("/accommodation")}
    >
        Accommodation
    </button>
 
    <span className="breadcrumb-separator">
        <ChevronRight size={14} strokeWidth={1.5} />
    </span>
 
    <span className="breadcrumb-current" aria-current="page">
        {room.room_name} Room
    </span>
</nav>
                </div>

                <div className="room-details-content">
                    <div className="room-details-images">
                        {room.images?.map((image, index) => (
                            <img
                            key={index}
                            src={image}
                            alt={`Room ${room.room_name} - ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div className="room-info-book">
                        <div className="room-information">
                            <div className="room-details-title">
                                <h2 className="room-name">{room.room_name} Room</h2>
                                <div className="room-items">
                                    
                                    <div className="room-item">
                                        <Bed size={20} strokeWidth={1.5} />
                                        <p>
                                            {room.num_beds}{' '}
                                            {room.num_beds === 1 ? 'bed' : 'beds'}
                                        </p>
                                    </div>
                                    <div className="room-item">
                                        <Users size={20} strokeWidth={1.5} />
                                        <p>
                                            {room.max_guests}{' '}
                                            {room.max_guests === 1 ? 'guest' : 'guests'}
                                        </p>
                                    </div>
                                    <div className="room-item">
                                        <SquareDashed size={20} strokeWidth={1.5} />
                                        <p>
                                            {room.room_size_sqm}{' '}
                                            {room.room_size_sqm === 1 ? 'sqm' : 'sqm'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="room-overview room-details-header">
                                <h2>Overview</h2>
                                <p>{room.description}</p>
                            </div>

                            <div className="room-amenities room-details-header">
                                <h2>Amenities</h2>
                                <div className="room-amenities-list">
                                {room.amenities?.map((amenity) => {
                                    const Icon = amenityIcons[amenity.toLowerCase()] ?? Check

                                    return (
                                        <div className="room-amenity" key={amenity}>
                                            
                                            <Icon size={20} strokeWidth={1.5} />
                                            <p>{amenity}</p>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                        </div>

                    <div className="booking-form">
                        
                        <div>
                            <p>Room Pricing</p>
                            <p className="pricing-rate"> 
                                <span className="price-highlight"> 
                                    ₱{room.room_price} 
                                </span> 
                                <span className="pricing-unit"> 
                                    /night 
                                </span> 
                                <span className="pricing-guests"> 
                                    per 2 pax 
                                </span> 
                            </p>
                        </div>

                        <div className="booking-form-date booking-form-dates">
                            <div className="booking-input-field">
                                <label htmlFor="check-in">Check in</label>
                                <input
                                id="check-in"
                                type="date"
                                value={checkIn}
                                onChange={(event) => setCheckIn(event.target.value)}
                                />
                            </div>

                            <div className="booking-input-field">
                                <label htmlFor="check-out">Check out</label>
                                <input
                                id="check-out"
                                type="date"
                                min={checkIn || undefined}
                                value={checkOut}
                                onChange={(event) => setCheckOut(event.target.value)}
                                />
                            </div>
                        </div>
                            

                            <div className="booking-form-date">
                                <div className="booking-input-field">
                                    <label htmlFor="guests">Guests</label>

                                    <select
                                    id="guests"
                                    value={guestCount}
                                    onChange={(event) => setGuestCount(Number(event.target.value))}
                                    >
                                    {Array.from({ length: room.max_guests }, (_, index) => {
                                        const count = index + 1

                                        return (
                                        <option key={count} value={count}>
                                            {count} {count === 1 ? "guest" : "guests"}
                                        </option>
                                        )
                                    })}
                                    </select>
                                </div>
                                </div>
                            

                            <div className="booking-price-summary">
                            {pricing.nights > 0 ? (
                                <>
                                <div className="booking-price-row">
                                    <span>
                                    {peso(room.room_price)} × {pricing.nights}{" "}
                                    {pricing.nights === 1 ? "night" : "nights"}
                                    </span>
                                    <strong>{peso(pricing.roomSubtotal)}</strong>
                                </div>

                                {pricing.extraGuests > 0 && (
                                    <div className="booking-price-row">
                                    <span>
                                        {pricing.extraGuests} extra{" "}
                                        {pricing.extraGuests === 1 ? "guest" : "guests"} ×{" "}
                                        {pricing.nights} {pricing.nights === 1 ? "night" : "nights"}
                                    </span>
                                    <strong>{peso(pricing.extraGuestTotal)}</strong>
                                    </div>
                                )}

                                <div className="booking-total-row">
                                    <span>Total</span>
                                    <strong>{peso(pricing.total)}</strong>
                                </div>
                                </>
                            ) : (
                                <p className="booking-price-hint">
                                Select check-in and check-out dates to see the total.
                                </p>
                            )}
                            </div>


                            <div className="booking-form-btn">
                                <button className="book-room-btn" onClick={handleBookRoom}>Book This Room&nbsp; <ArrowRight size={16}/></button>
                                <button className="contact-btn" onClick={handleBookRoom}><Phone size={14}/>&nbsp; Contact Reception</button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default RoomDetails;