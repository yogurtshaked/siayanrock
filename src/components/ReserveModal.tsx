import { X, ChevronRight, Phone, Mail, MessageCircle } from "lucide-react";
import '../index.css';

// Update these to the hotel's real contact channels.
// Consider moving this into a `hotel_settings` table later so it's editable
// without a code change/redeploy.
const HOTEL_CONTACT = {
    whatsappNumber: "639170000000", // digits only, country code, no + or spaces
    messengerUsername: "453301817861917",
    phoneDisplay: "+63 919 538 3911",
    phoneHref: "+639195383911",
    email: "siayanrockis.hometel@gmail.com",
};

interface ReserveModalProps {
    open: boolean;
    onClose: () => void;
    roomName?: string;
    roomThumbnail?: string;
    checkIn?: string;
    checkOut?: string;
    guestCount?: number;
    nights?: number;
    total?: number;
}

function formatDateLabel(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function peso(amount: number): string {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
    }).format(amount);
}

function buildInquiryMessage(props: ReserveModalProps): string {
    if (!props.roomName) {
        return "Hi! I'd like to inquire about booking a room at Siayanrock Hometel.";
    }

    const dateRange =
        props.checkIn && props.checkOut
            ? `${formatDateLabel(props.checkIn)} to ${formatDateLabel(props.checkOut)}`
            : "dates to be confirmed";

    const guestCount = props.guestCount ?? 2;
    const nights = props.nights ?? 0;
    const total = props.total ?? 0;
    const totalLine = nights > 0 ? ` Estimated total is ${peso(total)}.` : "";

    return `Hi! I'd like to inquire about booking the ${props.roomName} Room for ${dateRange}, ${guestCount} ${guestCount === 1 ? "guest" : "guests"
        }.${totalLine}`;
}

function ReserveModal(props: ReserveModalProps) {
    const {
        open,
        onClose,
        roomName,
        roomThumbnail,
        checkIn = "",
        checkOut = "",
        guestCount = 2,
        nights = 0,
        total = 0,
    } = props;

    if (!open) return null;

    const message = buildInquiryMessage(props);
    const encodedMessage = encodeURIComponent(message);

    const whatsappHref = `https://wa.me/${HOTEL_CONTACT.whatsappNumber}?text=${encodedMessage}`;
    const messengerHref = `https://m.me/${HOTEL_CONTACT.messengerUsername}`;
    const phoneHref = `tel:${HOTEL_CONTACT.phoneHref}`;
    const emailHref = `mailto:${HOTEL_CONTACT.email}?subject=${encodeURIComponent(
        roomName ? `Room inquiry: ${roomName} Room` : "Room inquiry"
    )}&body=${encodedMessage}`;

    function handleOverlayClick() {
        onClose();
    }

    function stopPropagation(event: React.MouseEvent) {
        event.stopPropagation();
    }

    return (
        <div className="reserve-modal-overlay" onClick={handleOverlayClick}>
            <div className="reserve-modal" onClick={stopPropagation}>
                <div className="reserve-modal-header">
                    <p className="reserve-modal-title">Reserve this room</p>
                    <button
                        type="button"
                        className="reserve-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={18} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="reserve-modal-summary">
                    {roomName ? (
                        <>
                            {roomThumbnail ? (
                                <img src={roomThumbnail} alt="" className="reserve-modal-thumb" />
                            ) : (
                                <div className="reserve-modal-thumb reserve-modal-thumb--empty" />
                            )}
                            <div>
                                <p className="reserve-modal-room-name">{roomName} Room</p>
                                <p className="reserve-modal-room-meta">
                                    {checkIn && checkOut
                                        ? `${formatDateLabel(checkIn)} to ${formatDateLabel(checkOut)} · ${guestCount} ${guestCount === 1 ? "guest" : "guests"
                                        }`
                                        : `${guestCount} ${guestCount === 1 ? "guest" : "guests"} · dates not yet selected`}
                                </p>
                                {nights > 0 && (
                                    <p className="reserve-modal-room-price">
                                        {peso(total)} for {nights} {nights === 1 ? "night" : "nights"}
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="reserve-modal-room-meta">
                            Tell us your dates and group size once you reach out — we'll help you find the right room.
                        </p>
                    )}
                </div>

                <p className="reserve-modal-note">
                    Reach the owner directly to confirm this room. Your message will already
                    include the room and dates above.
                </p>

                <div className="reserve-modal-options">
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-modal-option"
                    >
                        <span className="reserve-modal-option-icon reserve-modal-option-icon--whatsapp">
                            <MessageCircle size={17} strokeWidth={1.5} />
                        </span>
                        <span className="reserve-modal-option-text">
                            <span className="reserve-modal-option-label">Message on WhatsApp</span>
                            <span className="reserve-modal-option-sub">Fastest reply, usually within the hour</span>
                        </span>
                        <ChevronRight size={16} strokeWidth={1.5} className="reserve-modal-option-chevron" />
                    </a>

                    <a
                        href={messengerHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-modal-option"
                    >
                        <span className="reserve-modal-option-icon reserve-modal-option-icon--messenger">
                            <MessageCircle size={17} strokeWidth={1.5} />
                        </span>
                        <span className="reserve-modal-option-text">
                            <span className="reserve-modal-option-label">Message on Facebook</span>
                            <span className="reserve-modal-option-sub">@{HOTEL_CONTACT.messengerUsername}</span>
                        </span>
                        <ChevronRight size={16} strokeWidth={1.5} className="reserve-modal-option-chevron" />
                    </a>

                    <a href={phoneHref} className="reserve-modal-option">
                        <span className="reserve-modal-option-icon">
                            <Phone size={17} strokeWidth={1.5} />
                        </span>
                        <span className="reserve-modal-option-text">
                            <span className="reserve-modal-option-label">Call or text</span>
                            <span className="reserve-modal-option-sub">{HOTEL_CONTACT.phoneDisplay}</span>
                        </span>
                        <ChevronRight size={16} strokeWidth={1.5} className="reserve-modal-option-chevron" />
                    </a>

                    <a href={emailHref} className="reserve-modal-option">
                        <span className="reserve-modal-option-icon">
                            <Mail size={17} strokeWidth={1.5} />
                        </span>
                        <span className="reserve-modal-option-text">
                            <span className="reserve-modal-option-label">Email inquiry</span>
                            <span className="reserve-modal-option-sub">{HOTEL_CONTACT.email}</span>
                        </span>
                        <ChevronRight size={16} strokeWidth={1.5} className="reserve-modal-option-chevron" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ReserveModal;