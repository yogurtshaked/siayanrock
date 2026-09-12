import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import {
    ArrowRight,
    CalendarDays,
    Check,
    Plus,
    Users,
    X,
    ChevronRight,
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
    const [isModifying, setIsModifying] = useState(false)
    const location = useLocation()
    const { roomId: roomIdParam } = useParams<{ roomId?: string }>()
    const roomId = roomIdParam ?? (location.state?.roomId as string | undefined)
    const navigate = useNavigate()

    const cameFromRoom = location.state?.from === "room"
    const roomName     = location.state?.roomName as string | undefined

    const bookingState = location.state as {
        checkIn?: string
        checkOut?: string
        guestCount?: number
    } | null

    const [room, setRoom] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)

    const [checkIn, setCheckIn] = useState(
        bookingState?.checkIn || ""
    )

    const [checkOut, setCheckOut] = useState(
        bookingState?.checkOut || ""
    )

    const [guestCount, setGuestCount] = useState(
        bookingState?.guestCount || 2
    )

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
                <div className="room-nav">
                <nav className="breadcrumb" aria-label="Breadcrumb">
                
                    {/* Home — always present */}
                    <button
                        type="button"
                        className="breadcrumb-link"
                        onClick={() => navigate("/")}
                    >
                        Home
                    </button>
                
                    {cameFromRoom ? (
                        <>
                            {/* Home › Accommodation › [Room Name] › Booking */}
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
                
                            <button
                                type="button"
                                className="breadcrumb-link"
                                onClick={() =>
                                    navigate(`/rooms/${roomId}`, {
                                        state: {
                                            // preserve dates + guests so the
                                            // room details page still shows them
                                            checkIn,
                                            checkOut,
                                            guestCount,
                                        },
                                    })
                                }
                            >
                                {room?.room_name} Room
                            </button>
                        </>
                    ) : (
                        // Home › Booking  (came from navbar)
                        // No middle crumbs — direct path
                        null
                    )}
                
                    <span className="breadcrumb-separator">
                        <ChevronRight size={14} strokeWidth={1.5} />
                    </span>
                
                    <span className="breadcrumb-current" aria-current="page">
                        Booking
                    </span>
                </nav>
                {/*<div className='bookroom-title page-title'>
                    <p className="section-title">Siayanrock Is. Hometel</p>
                    <h3>Book Your Stay</h3>
                    <p className='section-description'>Browse by category or scroll through everything — from the hometel itself to the roads, hills, and sunsets just outside the door.</p>
                </div>*/}
            </div>
            <div className="bookroom-page-content">
                
                <div className="bookroom-container">
                    <div className="booking-progress">
                        <div className="booking-step active">
                            <div className="step-number">1</div>
                            <span>Rooms</span>
                        </div>

                        <div className="step-line" />
                        
                        <div className="booking-step">
                            <div className="step-number">2</div>
                            <span>Your details</span>
                        </div>

                        <div className="step-line" />

                        <div className="booking-step">
                            <div className="step-number">3</div>
                            <span>Confirmation</span>
                        </div>
                    </div>

                    {/* Stay summary */}
                   {/* Stay summary */}
                    <div className={`stay-summary ${isModifying ? "stay-summary-editing" : ""}`}>

                        {isModifying ? (
                            <>
                                <div className="stay-summary-edit">
                                    <div className="stay-summary-edit-field">
                                        <label htmlFor="summary-check-in">
                                            <CalendarDays size={15} />
                                            CHECK IN
                                        </label>

                                        <input
                                            id="summary-check-in"
                                            type="date"
                                            value={checkIn}
                                            onChange={(event) => {
                                                setCheckIn(event.target.value)

                                                // Clear checkout if it is now invalid
                                                if (
                                                    checkOut &&
                                                    event.target.value >= checkOut
                                                ) {
                                                    setCheckOut("")
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="stay-summary-edit-field">
                                        <label htmlFor="summary-check-out">
                                            <CalendarDays size={15} />
                                            CHECK OUT
                                        </label>

                                        <input
                                            id="summary-check-out"
                                            type="date"
                                            value={checkOut}
                                            onChange={(event) =>
                                                setCheckOut(event.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="stay-summary-edit-field">
                                        <label htmlFor="summary-guests">
                                            <Users size={15} />
                                            GUESTS
                                        </label>

                                        <select
                                            id="summary-guests"
                                            value={guestCount}
                                            onChange={(event) =>
                                                setGuestCount(Number(event.target.value))
                                            }
                                        >
                                            {Array.from(
                                                { length: room?.max_guests || 10 },
                                                (_, index) => {
                                                    const count = index + 1

                                                    return (
                                                        <option
                                                            key={count}
                                                            value={count}
                                                        >
                                                            {count}{" "}
                                                            {count === 1
                                                                ? "guest"
                                                                : "guests"}
                                                        </option>
                                                    )
                                                }
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    className="modify-button save-modify-button"
                                    type="button"
                                    onClick={() => setIsModifying(false)}
                                >
                                    <Check size={15} />
                                    Done
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="stay-summary-item">
                                    <CalendarDays size={16} strokeWidth={1.7} />

                                    <div>
                                        <span>CHECK IN</span>
                                        <strong>
                                            {formatDate(checkIn)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="stay-summary-item">
                                    <CalendarDays size={16} strokeWidth={1.7} />

                                    <div>
                                        <span>CHECK OUT</span>
                                        <strong>
                                            {formatDate(checkOut)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="stay-summary-item">
                                    <Users size={16} strokeWidth={1.7} />

                                    <div>
                                        <span>GUESTS</span>
                                        <strong>
                                            {guestCount}{" "}
                                            {guestCount === 1
                                                ? "guest"
                                                : "guests"}
                                        </strong>
                                    </div>
                                </div>

                                <button
                                    className="modify-button"
                                    type="button"
                                    onClick={() => setIsModifying(true)}
                                >
                                    Modify
                                </button>
                            </>
                        )}
                    </div>

                    <div className="selected-room-section">
                        <div className="selected-room-heading">
                            <h2>Selected room</h2>
                            <p>Add more rooms below if your group needs extra space.</p>
                        </div>

                        {rooms.length > 0 ? (
                            rooms.map((selectedRoom) => (
                                <div className="selected-room-card"key={selectedRoom.id}>
                                    <div className="selected-room-image"
                                        style={{
                                            backgroundImage: `url(${selectedRoom.images?.[0]
                                            })`,
                                        }}
                                    />

                                    <div className="selected-room-info">
                                        <button
                                            type="button"
                                            className="remove-room"
                                            onClick={handleRemoveRoom}>
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
                                <p>No room selected yet.</p>

                                <button
                                    type="button"
                                    onClick={handleAddRoom}>
                                    Browse rooms
                                </button>
                            </div>
                        )}

                        {/* Add another room */}
                        <button
                            type="button"
                            className="add-room-button"
                            onClick={handleAddRoom}>
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
                            <strong>{peso(total)} total</strong>
                        </div>

                        <button
                            type="button"
                            className="continue-button"
                            disabled={rooms.length === 0}
                            onClick={handleContinue}>
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