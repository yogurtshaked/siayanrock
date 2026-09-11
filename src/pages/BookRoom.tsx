import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

import {
    ArrowRight,
    Plus,
    X,
} from "lucide-react"

interface Room {
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

function BookRoom() {
    const { roomId } = useParams<{ roomId?: string }>()
    const navigate = useNavigate()

    const [room, setRoom] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)

    const [checkIn, setCheckIn] = useState("2025-12-20")
    const [checkOut, setCheckOut] = useState("2025-12-22")
    const [guestCount, setGuestCount] = useState(2)

    const [rooms, setRooms] = useState<Room[]>([])

    useEffect(() => {
        async function fetchRoom() {
            if (!roomId) {
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from("rooms")
                .select("*")
                .eq("id", roomId)
                .single()

            if (error) {
                console.error(error)
                setLoading(false)
                return
            }

            const selectedRoom = data as Room

            setRoom(selectedRoom)
            setRooms([selectedRoom])
            setLoading(false)
        }

        void fetchRoom()
    }, [roomId])

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0

        const start = new Date(`${checkIn}T00:00:00`)
        const end = new Date(`${checkOut}T00:00:00`)

        return Math.max(
            0,
            Math.round(
                (end.getTime() - start.getTime()) / 86_400_000
            )
        )
    }

    const nights = calculateNights()

    const total = rooms.reduce((sum, room) => {
        const extraGuests = Math.max(
            0,
            guestCount - room.base_guests
        )

        const roomTotal =
            room.room_price * nights

        const extraGuestTotal =
            extraGuests *
            room.extra_guests_fee *
            nights

        return sum + roomTotal + extraGuestTotal
    }, 0)

    const peso = (amount: number) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0,
        }).format(amount)

    const formatDate = (date: string) => {
        if (!date) return "Select date"

        const parsed = new Date(`${date}T00:00:00`)

        return parsed.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    function handleRemoveRoom() {
        setRooms([])
        setRoom(null)

        navigate("/book")
    }

    function handleAddRoom() {
        navigate("/accommodation")
    }

    function handleContinue() {
        // You can navigate to your details page later.
        console.log("Continue booking", {
            rooms,
            checkIn,
            checkOut,
            guestCount,
            total,
        })
    }

    if (loading) {
        return (
            <section className="bookroom-page">
                <div className="bookroom-container">
                    <p>Loading booking...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="bookroom-page">
            <div className="bookroom-page-content">
            <div className='bookroom-title page-title'>
                <p className="section-title">Siayanrock Is. Hometel</p>
                <h3>Book Your Stay</h3>
                <p className='section-description'>Browse by category or scroll through everything — from the hometel itself to the roads, hills, and sunsets just outside the door.</p>
            </div>

            <div className="bookroom-container">
                {/* Progress */}
                <div className="booking-progress">
                    <div className="booking-step active">
                        <div className="step-number">
                            1
                        </div>
                        <span>Rooms</span>
                    </div>
                    <div className="step-line" />
                    <div className="booking-step">
                        <div className="step-number">
                            2
                        </div>
                        <span>Your details</span>
                    </div>

                    <div className="step-line" />

                    <div className="booking-step">
                        <div className="step-number">
                            3
                        </div>

                        <span>Confirmation</span>
                    </div>

                </div>

                {/* Stay summary */}
                <div className="stay-summary">

                    <div className="stay-summary-item">
                        <span>CHECK IN</span>

                        <strong>
                            {formatDate(checkIn)}
                        </strong>
                    </div>

                    <div className="stay-summary-item">
                        <span>CHECK OUT</span>

                        <strong>
                            {formatDate(checkOut)}
                        </strong>
                    </div>

                    <div className="stay-summary-item">
                        <span>GUESTS</span>

                        <strong>
                            {guestCount}{" "}
                            {guestCount === 1
                                ? "guest"
                                : "guests"}
                        </strong>
                    </div>

                    <button
                        className="modify-button"
                        type="button"
                    >
                        Modify
                    </button>

                </div>

                {/* Selected room */}
                <div className="selected-room-section">

                    <div className="selected-room-heading">
                        <h2>Selected room</h2>

                        <p>
                            Add more rooms below if your
                            group needs extra space.
                        </p>
                    </div>

                    {rooms.length > 0 ? (
                        rooms.map((selectedRoom) => (
                            <div
                                className="selected-room-card"
                                key={selectedRoom.id}
                            >

                                <div
                                    className="selected-room-image"
                                    style={{
                                        backgroundImage: `url(${
                                            selectedRoom.images?.[0]
                                        })`,
                                    }}
                                />

                                <div className="selected-room-info">

                                    <button
                                        type="button"
                                        className="remove-room"
                                        onClick={handleRemoveRoom}
                                    >
                                        Remove
                                    </button>

                                    <h3>
                                        {selectedRoom.room_name} Room
                                    </h3>

                                    <p className="room-meta">
                                        {selectedRoom.num_beds}{" "}
                                        {selectedRoom.num_beds === 1
                                            ? "bed"
                                            : "beds"}{" "}
                                        ·{" "}
                                        {selectedRoom.max_guests} guests
                                        {" · "}
                                        {selectedRoom.room_size_sqm} sqm
                                    </p>

                                    <div className="room-price-line">

                                        <span>
                                            {peso(
                                                selectedRoom.room_price
                                            )}{" "}
                                            × {nights}{" "}
                                            {nights === 1
                                                ? "night"
                                                : "nights"}
                                        </span>

                                        <strong>
                                            {peso(
                                                selectedRoom.room_price *
                                                    nights
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="no-room-selected">
                            <p>
                                No room selected yet.
                            </p>

                            <button
                                type="button"
                                onClick={handleAddRoom}
                            >
                                Browse rooms
                            </button>
                        </div>
                    )}

                    {/* Add another room */}
                    <button
                        type="button"
                        className="add-room-button"
                        onClick={handleAddRoom}
                    >
                        <Plus size={18} strokeWidth={1.8} />
                        Add another room
                    </button>

                </div>

                {/* Bottom summary */}
                <div className="booking-footer">

                    <div className="booking-total">

                        <p>
                            {rooms.length}{" "}
                            {rooms.length === 1
                                ? "room"
                                : "rooms"}{" "}
                            · {nights}{" "}
                            {nights === 1
                                ? "night"
                                : "nights"}
                        </p>

                        <strong>
                            {peso(total)} total
                        </strong>

                    </div>

                    <button
                        type="button"
                        className="continue-button"
                        disabled={rooms.length === 0}
                        onClick={handleContinue}
                    >
                        Continue
                        <ArrowRight
                            size={16}
                            strokeWidth={2}
                        />
                    </button>

                    </div>
                </div>

            </div>

        </section>
    )
}

export default BookRoom;