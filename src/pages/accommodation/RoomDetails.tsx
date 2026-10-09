import "./accommodation.css";
import "../../index.css";
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Bath, Bed, Check, DoorOpen, ShowerHead, Snowflake, Tv, Users, SquareDashed, ChevronLeft, Wifi, Shirt, Clapperboard, LampDesk, Plus } from "lucide-react"
import ReserveModal from "@/components/ReserveModal"
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';

import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { addDays, parseLocalDate, startOfToday, toLocalISO } from "@/lib/searchDates"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import Reveal from "@/components/Reveal";

const BUCKET = "gallery"

function roomImageUrl(path: string): string {
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// keeps a date from the URL only if it's valid and not in the past
function readDate(value: string | null, minISO: string): string {
    return parseLocalDate(value) && value! >= minISO ? value! : ""
}

type BookedRange = { start: string; end: string }   // yyyy-MM-dd: a booking's check-in and check-out
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
    toiletries: Bath,
    "wardrobe / closet": Shirt,
    "streaming service (netflix)": Clapperboard,
    "desk & seating area": LampDesk,
}

function RoomDetails() {
    const { roomId } = useParams<{ roomId: string }>()
    const navigate = useNavigate()

    const [room, setRoom] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)
    const [isReserveModalOpen, setReserveModalOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [params, setParams] = useSearchParams()
    const todayISO = toLocalISO(startOfToday())

    // start from the search in the URL, ignoring anything invalid or in the past
    const [initial] = useState(() => {
        const ci = readDate(params.get("checkIn"), todayISO)
        let co = readDate(params.get("checkOut"), todayISO)
        if (!ci || co <= ci) co = ""
        const g = parseInt(params.get("guests") ?? "", 10)
        return { ci, co, g: Number.isFinite(g) && g >= 1 ? g : 2 }
    })

    const [checkIn, setCheckIn] = useState(initial.ci)
    const [checkOut, setCheckOut] = useState(initial.co)
    const [guestCount, setGuestCount] = useState(initial.g)
    const [booked, setBooked] = useState<BookedRange[]>([])

    // ---------- date validation ----------
    const errors = useMemo(() => {
        const e: { checkIn?: string; checkOut?: string } = {}

        if (checkIn && checkIn < todayISO) e.checkIn = "Check-in can't be in the past"
        if (checkIn && checkOut && checkOut <= checkIn) e.checkOut = "Check-out must be after check-in"

        return e
    }, [checkIn, checkOut, todayISO])

    const datesValid = !!checkIn && !!checkOut && !errors.checkIn && !errors.checkOut
   const checkInDate = parseLocalDate(checkIn)
const checkOutDate = parseLocalDate(checkOut)

// a booking holds the nights check_in ... check_out - 1, and its check-out day stays free
const blockedCheckIns = useMemo(
    () => booked.map((b) => ({
        start: parseLocalDate(b.start)!,
        end: addDays(parseLocalDate(b.end)!, -1),
    })),
    [booked]
)

// a check-out day is blocked when the night before it is taken
const blockedCheckOuts = useMemo(
    () => booked.map((b) => ({
        start: addDays(parseLocalDate(b.start)!, 1),
        end: parseLocalDate(b.end)!,
    })),
    [booked]
)

// first booking starting on or after a day (ISO strings compare correctly)
const nextBookingStart = (fromISO: string): string | undefined =>
    booked.map((b) => b.start).filter((s) => s >= fromISO).sort()[0]

// a stay can't run past the next booking
const lastCheckOut = checkIn ? parseLocalDate(nextBookingStart(checkIn) ?? "") ?? undefined : undefined

const isBookedNight = (d: Date) => {
    const iso = toLocalISO(d)
    return booked.some((b) => iso >= b.start && iso < b.end)
}

// still checked for dates that arrive through the URL
const unavailable = datesValid && booked.some((b) => b.start < checkOut && b.end > checkIn)

function handleCheckInChange(date: Date | null) {
    const value = date ? toLocalISO(date) : ""
    setCheckIn(value)

    if (!value || !checkOut) return
    const next = nextBookingStart(value)
    // clear check-out if it's now on or before check-in, or the stay would run into another booking
    if (checkOut <= value || (next && checkOut > next)) setCheckOut("")
}

function handleCheckOutChange(date: Date | null) {
    setCheckOut(date ? toLocalISO(date) : "")
}

    // resolved public URLs for this room's images, derived once room loads
    const imageUrls = useMemo(
        () => (room?.images ?? []).map(roomImageUrl),
        [room?.images]
    )

    const pricing = useMemo(() => {
        const nightlyRate = Number(room?.room_price) || 0
        const extraGuestFee = Number(room?.extra_guests_fee) || 0
        const baseGuests = room?.base_guests ?? 2

        if (!datesValid) {
            return { nights: 0, extraGuests: 0, roomSubtotal: 0, extraGuestTotal: 0, total: 0 }
        }

        const start = new Date(`${checkIn}T00:00:00`)
        const end = new Date(`${checkOut}T00:00:00`)
        const nights = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000))

        const extraGuests = Math.max(0, guestCount - baseGuests)
        const roomSubtotal = nightlyRate * nights
        const extraGuestTotal = extraGuests * extraGuestFee * nights

        return { nights, extraGuests, roomSubtotal, extraGuestTotal, total: roomSubtotal + extraGuestTotal }
    }, [datesValid, checkIn, checkOut, guestCount, room?.room_price, room?.extra_guests_fee, room?.base_guests])

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

    useEffect(() => {
        if (lightboxIndex === null) return

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                closeLightbox()
            }

            if (event.key === "ArrowLeft") {
                showPrev()
            }

            if (event.key === "ArrowRight") {
                showNext()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [lightboxIndex, imageUrls.length])
    // a search for 5+ guests can exceed this room's capacity
    useEffect(() => {
        if (room && guestCount > room.max_guests) setGuestCount(room.max_guests)
    }, [room])

    // this room's current and future bookings
useEffect(() => {
    if (!room) return
    let cancelled = false

    supabase
        .from("bookings")
        .select("check_in, check_out")
        .eq("room_id", room.id)
        .gte("check_out", todayISO)
        .in("status", ["pending", "confirmed"])
        .then(({ data, error }) => {
            if (cancelled) return
            if (error) {
                console.error(error)
                return
            }
            setBooked(
                (data ?? [])
                    .map((b) => ({
                        start: String(b.check_in).slice(0, 10),   // works for date or timestamp columns
                        end: String(b.check_out).slice(0, 10),
                    }))
                    .filter((b) => parseLocalDate(b.start) && parseLocalDate(b.end) && b.end > b.start)
            )
        })

    return () => { cancelled = true }
}, [room, todayISO])

    // keep the URL in step, so refresh and "Back to rooms" keep the search
    useEffect(() => {
        if (!checkIn && !checkOut) {
            setParams({}, { replace: true })
            return
        }
        const next = new URLSearchParams()
        if (checkIn) next.set("checkIn", checkIn)
        if (checkOut) next.set("checkOut", checkOut)
        next.set("guests", String(guestCount))
        setParams(next, { replace: true })
    }, [checkIn, checkOut, guestCount])


    function openLightbox(index: number) {
        setLightboxIndex(index)
    }

    function closeLightbox() {
        setLightboxIndex(null)
    }

    function showPrev() {
        if (lightboxIndex === null || imageUrls.length === 0) return

        setLightboxIndex(
            (lightboxIndex - 1 + imageUrls.length) % imageUrls.length
        )
    }

    function showNext() {
        if (lightboxIndex === null || imageUrls.length === 0) return

        setLightboxIndex(
            (lightboxIndex + 1) % imageUrls.length
        )
    }


    const peso = (amount: number) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0,
        }).format(amount)

    function handleBookRoom() {
        if (unavailable) return          // booked on the dates entered
        setReserveModalOpen(true)
    }

    function handleBack() {
        navigate({
            pathname: "/accommodation",
            search: datesValid
                ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guestCount}`
                : "",
        })
    }


    if (loading) return <p>Loading room details...</p>
    if (!room) return <p>Room not found.</p>

    return (
        <section>
            <div className="room-details-page" id='page'>
                <div className='room-details-body'>
                    <Reveal className="room-details-nav page-content">
                        <button
                            type="button"
                            className="back-link"
                            onClick={handleBack}
                        >
                            <ChevronLeft size={16} strokeWidth={1.5} />
                            Back to rooms
                        </button>
                    </Reveal>


                    <div className="room-details-content page-content ">
                        <Reveal className="room-details-images">
                            {imageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Room ${room.room_name} - ${index + 1}`}
                                    onClick={() => openLightbox(index)}
                                    className="room-details-image"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                />
                            ))}
                        </Reveal>


                        <Reveal className="room-info-book">
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
                                                    <div className="room-amenity-icon">
                                                        <Icon size={20} strokeWidth={1.5} />
                                                    </div>

                                                    <p>{amenity}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="booking-form">

                                {/* 1. Rate */}
                                <div className="pricing-header">
                                    <p className="pricing-label">Room rate</p>

                                    <div className="pricing-rate">
                                        <span className="price-highlight">{peso(room.room_price)}</span>
                                        <span className="pricing-unit">/ night</span>
                                    </div>

                                    <ul className="pricing-notes">
                                        <li>
                                            <Users size={15} strokeWidth={1.75} />
                                            Room price is good for {room.base_guests ?? 2} guests
                                        </li>
                                        {Number(room.extra_guests_fee) > 0 && (
                                            <li>
                                                <Plus size={15} strokeWidth={1.75} />
                                                {peso(Number(room.extra_guests_fee))} per extra guest, per night
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* 2. Your stay */}
                                <div className="booking-fields">
                                    <div className="booking-fields-row">
                                        <div className={`booking-field${errors.checkIn ? " has-error" : ""}`}>
    <label htmlFor="check-in">Check in</label>
    <DatePicker
        id="check-in"
        selected={checkInDate}
        onChange={handleCheckInChange}
        selectsStart
        startDate={checkInDate}
        endDate={checkOutDate}
        minDate={startOfToday()}
        excludeDateIntervals={blockedCheckIns}
        dayClassName={(d) => (isBookedNight(d) ? "day-booked" : "")}
        placeholderText="mm-dd-yyyy"
        dateFormat="MM-dd-yyyy"
        popperPlacement="bottom-start"
        autoComplete="off"
        ariaInvalid={errors.checkIn ? "true" : undefined}
    />
    {errors.checkIn && <span className="booking-field-error" role="alert">{errors.checkIn}</span>}
</div>

<div className={`booking-field${errors.checkOut ? " has-error" : ""}`}>
    <label htmlFor="check-out">Check out</label>
    <DatePicker
        id="check-out"
        selected={checkOutDate}
        onChange={handleCheckOutChange}
        selectsEnd
        startDate={checkInDate}
        endDate={checkOutDate}
        minDate={addDays(checkInDate ?? startOfToday(), 1)}
        maxDate={lastCheckOut}
        excludeDateIntervals={blockedCheckOuts}
        dayClassName={(d) => (isBookedNight(addDays(d, -1)) ? "day-booked" : "")}
        placeholderText="mm-dd-yyyy"
        dateFormat="MM-dd-yyyy"
        popperPlacement="bottom-end"
        autoComplete="off"
        ariaInvalid={errors.checkOut ? "true" : undefined}
    />
    {errors.checkOut && <span className="booking-field-error" role="alert">{errors.checkOut}</span>}
</div>
                                    </div>

                                    <div className="booking-field">
                                        <label htmlFor="guests">
                                            Guests <span className="booking-field-hint">(max {room.max_guests})</span>
                                        </label>
                                        <select
                                            id="guests"
                                            value={guestCount}
                                            onChange={(e) => setGuestCount(Number(e.target.value))}
                                        >
                                            {Array.from({ length: room.max_guests }, (_, i) => {
                                                const count = i + 1
                                                return (
                                                    <option key={count} value={count}>
                                                        {count} {count === 1 ? "guest" : "guests"}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>

                                {/* 3. Cost */}
                                <div className="booking-price-summary">
                                    {unavailable ? (
        <p className="booking-price-hint booking-price-hint--error">
            This room isn't available on those dates. Try different dates.
        </p>
    ) : pricing.nights > 0 ? (
                                        <p className="booking-price-hint booking-price-hint--error">
                                            This room isn't available on those dates. Try different dates.
                                        </p>
                                    ) : pricing.nights > 0 ? (
                                        <>
                                            <div className="booking-price-row">
                                                <span>
                                                    {peso(room.room_price)} × {pricing.nights}{" "}
                                                    {pricing.nights === 1 ? "night" : "nights"}
                                                </span>
                                                <span>{peso(pricing.roomSubtotal)}</span>
                                            </div>

                                            {pricing.extraGuests > 0 && (
                                                <div className="booking-price-row">
                                                    <span>
                                                        {pricing.extraGuests} extra{" "}
                                                        {pricing.extraGuests === 1 ? "guest" : "guests"} × {pricing.nights}{" "}
                                                        {pricing.nights === 1 ? "night" : "nights"}
                                                    </span>
                                                    <span>{peso(pricing.extraGuestTotal)}</span>
                                                </div>
                                            )}

                                            <div className="booking-total-row">
                                                <span>Total</span>
                                                <strong>{peso(pricing.total)}</strong>
                                            </div>
                                        </>
                                   ) : (
        <p className="booking-price-hint">Pick your dates to see the total.</p>
    )}
                                </div>

                                {/* 4. Action */}
                                <div className="booking-form-btn">
                                    <button className="book-room-btn" onClick={handleBookRoom} disabled={unavailable}>
                                        Reserve this room&nbsp; <ArrowRight animateOnHover size={16} />
                                    </button>
                                </div>

                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>

            <ReserveModal
                open={isReserveModalOpen}
                onClose={() => setReserveModalOpen(false)}
                roomName={room.room_name}
                roomThumbnail={imageUrls[0]}
                checkIn={datesValid ? checkIn : ""}
                checkOut={datesValid ? checkOut : ""}
                guestCount={guestCount}
                nights={pricing.nights}
                total={pricing.total}
            />

            {lightboxIndex !== null && imageUrls.length > 0 && (
                <div
                    className="room-lightbox-overlay"
                    onClick={closeLightbox}
                >
                    <button
                        type="button"
                        className="room-lightbox-close"
                        onClick={closeLightbox}
                        aria-label="Close image viewer"
                    >
                        ✕
                    </button>

                    <button
                        type="button"
                        className="room-lightbox-nav room-lightbox-prev"
                        onClick={(event) => {
                            event.stopPropagation()
                            showPrev()
                        }}
                        aria-label="Previous image"
                    >
                        ‹
                    </button>

                    <img
                        src={imageUrls[lightboxIndex]}
                        alt={`Room ${room.room_name} - ${lightboxIndex + 1}`}
                        className="room-lightbox-image"
                        onClick={(event) => event.stopPropagation()}
                    />

                    <button
                        type="button"
                        className="room-lightbox-nav room-lightbox-next"
                        onClick={(event) => {
                            event.stopPropagation()
                            showNext()
                        }}
                        aria-label="Next image"
                    >
                        ›
                    </button>
                </div>
            )}

        </section>
    );
}

export default RoomDetails;