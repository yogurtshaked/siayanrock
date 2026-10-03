import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { Users } from '@/components/animate-ui/icons/users';
import { Search } from '@/components/animate-ui/icons/search';
import { CalendarDaysIcon } from '@/components/ui/calendar-days';
import { addDays, parseLocalDate, startOfToday, toLocalISO } from "../lib/searchDates";
import { X } from "lucide-react";


export type RoomSearchValues = {
    checkIn: string;   // yyyy-MM-dd
    checkOut: string;  // yyyy-MM-dd
    guests: string;    // "1" ... "5+"
};


type Errors = { checkIn?: string; checkOut?: string; guests?: string };

type Props = {
    defaultCheckIn?: string | null;
    defaultCheckOut?: string | null;
    defaultGuests?: string | null;
    onSearch: (values: RoomSearchValues) => void;
    onClear?: () => void;
    variant?: "hero" | "inline";
};

export default function RoomSearchBar({
    defaultCheckIn = null,
    defaultCheckOut = null,
    defaultGuests = null,
    onSearch,
    onClear,
    variant = "hero",
}: Props) {
    const [checkIn, setCheckIn] = useState<Date | null>(parseLocalDate(defaultCheckIn));
    const [checkOut, setCheckOut] = useState<Date | null>(parseLocalDate(defaultCheckOut));
    const [guests, setGuests] = useState<string>(defaultGuests ?? "");
    const [errors, setErrors] = useState<Errors>({});

    // Re-sync when the URL changes (Home -> Accommodation, back/forward, "Clear search")
    useEffect(() => {
        setCheckIn(parseLocalDate(defaultCheckIn));
        setCheckOut(parseLocalDate(defaultCheckOut));
        setGuests(defaultGuests ?? "");
        setErrors({});
    }, [defaultCheckIn, defaultCheckOut, defaultGuests]);

    const today = startOfToday();

    const handleCheckInChange = (date: Date | null) => {
        setCheckIn(date);
        setErrors((e) => ({ ...e, checkIn: undefined }));
        // New check-in on/after the current check-out -> clear check-out
        if (date && checkOut && date >= checkOut) setCheckOut(null);
    };

    const handleCheckOutChange = (date: Date | null) => {
        setCheckOut(date);
        setErrors((e) => ({ ...e, checkOut: undefined }));
    };

    const validate = (): Errors => {
        const next: Errors = {};

        if (!checkIn) next.checkIn = "Select a check-in date";
        else if (checkIn < today) next.checkIn = "Check-in can't be in the past";

        if (!checkOut) next.checkOut = "Select a check-out date";
        else if (checkIn && checkOut <= checkIn)
            next.checkOut = "Check-out must be after check-in";

        if (!guests) next.guests = "Select number of guests";

        return next;
    };

    const handleSearch = () => {
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length > 0) return;

        onSearch({
            checkIn: toLocalISO(checkIn!),
            checkOut: toLocalISO(checkOut!),
            guests,
        });
    };
    const c = variant === "inline"
    ? {
        root: "rs-bar", range: "rs-range", card: "rs-field", label: "rs-label",
        value: "rs-input", arrow: "rs-arrow", select: "rs-select",
        action: "rs-action", btn: "rs-btn", error: "rs-error", guestsLabel: "",
      }
    : {
        root: "hero-search-bar", range: "date-range", card: "date-card", label: "date-card-label",
        value: "date-card-value", arrow: "date-arrow", select: "guests-select",
        action: "search-button-container", btn: "search-btn", error: "field-error",
        guestsLabel: "guests-label",
      };

      const isApplied =
    !!defaultCheckIn && !!defaultCheckOut && !!defaultGuests &&
    !!checkIn && !!checkOut &&
    toLocalISO(checkIn) === defaultCheckIn &&
    toLocalISO(checkOut) === defaultCheckOut &&
    guests === defaultGuests;

const handleClear = () => {
    setCheckIn(null);
    setCheckOut(null);
    setGuests("");
    setErrors({});
    onClear?.();
};

    return (
    <div className={c.root}>
        <div className={c.range}>
            <div className={c.card}>
                <label className={c.label}>
                    <CalendarDaysIcon size={16} />
                    <span>Check-In</span>
                </label>
                <DatePicker
                    selected={checkIn}
                    onChange={handleCheckInChange}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={today}
                    maxDate={checkOut ? addDays(checkOut, -1) : undefined}
                    placeholderText="mm-dd-yyyy"
                    dateFormat="MM-dd-yyyy"
                    className={c.value}
                    popperPlacement="bottom-start"
                />
                {errors.checkIn && <span className={c.error}>{errors.checkIn}</span>}
            </div>

            <div className={c.arrow}>
                <ArrowRight size={18} />
            </div>

            <div className={c.card}>
                <label className={c.label}>
                    <CalendarDaysIcon size={16} />
                    <span>Check-Out</span>
                </label>
                <DatePicker
                    selected={checkOut}
                    onChange={handleCheckOutChange}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={addDays(checkIn ?? today, 1)}
                    placeholderText="mm-dd-yyyy"
                    dateFormat="MM-dd-yyyy"
                    className={c.value}
                    popperPlacement="bottom-start"
                />
                {errors.checkOut && <span className={c.error}>{errors.checkOut}</span>}
            </div>
        </div>

        <div className={c.card}>
            <div className={`${c.label} ${c.guestsLabel}`.trim()}>
                <Users animateOnHover size={16} />
                <span>Guests</span>
            </div>
            <select
                className={c.select}
                value={guests}
                onChange={(e) => {
                    setGuests(e.target.value);
                    setErrors((er) => ({ ...er, guests: undefined }));
                }}>
                <option value="" disabled hidden>No. of guests</option>
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5+">5+ guests</option>
            </select>
            {errors.guests && <span className={c.error}>{errors.guests}</span>}
        </div>

       <div className={c.action}>
    <button
        type="button"
        className={c.btn}
        onClick={isApplied ? handleClear : handleSearch}
        aria-label={isApplied ? "Clear search" : "Search rooms"}
        title={isApplied ? "Clear search" : "Search rooms"}>
        <span key={isApplied ? "clear" : "search"} className="rs-icon-swap">
            {isApplied ? <X size={22} /> : <Search size={22} />}
        </span>
    </button>
</div>
    </div>
);
}