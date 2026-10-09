import { X, ChevronRight, Phone, Mail, MessageCircle } from "lucide-react";
import '../index.css';

const HOTEL_CONTACT = {
    whatsappNumber: "639672003129",
    messengerUsername: "453301817861917",
    phoneDisplay: "+63 967 2003 129",
    phoneHref: "+639672003129",
    email: "siayanrockis.hometel@gmail.com",
};

const TOUR_CONTACT = {
    ...HOTEL_CONTACT,
    email: "mavienpoint@gmail.com",
    messengerUsername: "453301817861917",   
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
    // Tour inquiry (optional)
    tourPackage?: string;
    tourDetail?: string;
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
    if (props.tourPackage) {
        return `Hi! I'd like to inquire about the ${props.tourPackage} tour package (${props.tourDetail ?? "details to be confirmed"}). Is it available for my travel dates?`;
    }

    if (!props.roomName) {
        return "Hi! I'd like to inquire about booking a room at Siayanrock Hometel.";
    }

    const dateRange =
        props.checkIn && props.checkOut
            ? `${formatDateLabel(props.checkIn)} to ${formatDateLabel(props.checkOut)}`
            : "dates to be confirmed";

    const guestCount = props.guestCount ?? 2;

    return `Hi! I'd like to inquire about booking the ${props.roomName} Room for ${dateRange}, ${guestCount} ${guestCount === 1 ? "guest" : "guests"}.`;
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
        tourPackage,
        tourDetail,
    } = props;

    if (!open) return null;

    const isTour = Boolean(tourPackage);
    const message = buildInquiryMessage(props);
    const encodedMessage = encodeURIComponent(message);

    const contact = isTour ? TOUR_CONTACT : HOTEL_CONTACT;

    const emailSubject = isTour
        ? `Tour inquiry: ${tourPackage}`
        : roomName
            ? `Room inquiry: ${roomName} Room`
            : "Room inquiry";
    const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodedMessage}`;
    const messengerHref = `https://m.me/${contact.messengerUsername}?text=${encodedMessage}`;
    const phoneHref = `tel:${contact.phoneHref}`;
    const emailHref = `mailto:${contact.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodedMessage}`;

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
                    <p className="reserve-modal-title">
                        {isTour ? "Inquire about this tour" : "Reserve this room"}
                    </p>
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
                    {isTour ? (
                        <div>
                            <p className="reserve-modal-room-name">{tourPackage}</p>
                            {tourDetail && <p className="reserve-modal-room-meta">{tourDetail}</p>}
                        </div>
                    ) : roomName ? (
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
                    Reach the owner directly to confirm {isTour ? "this tour" : "this room"}. Your message will
                    already include the details above.
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
                            <span className="reserve-modal-option-sub">@{contact.messengerUsername}</span>
                        </span>
                        <ChevronRight size={16} strokeWidth={1.5} className="reserve-modal-option-chevron" />
                    </a>

                    <a href={phoneHref} className="reserve-modal-option">
                        <span className="reserve-modal-option-icon">
                            <Phone size={17} strokeWidth={1.5} />
                        </span>
                        <span className="reserve-modal-option-text">
                            <span className="reserve-modal-option-label">Call or text</span>
                            <span className="reserve-modal-option-sub">{contact.phoneDisplay}</span>
                        </span>
                        <ChevronRight size={16} strokeWidth={1.5} className="reserve-modal-option-chevron" />
                    </a>

                    <a href={emailHref} className="reserve-modal-option">
                        <span className="reserve-modal-option-icon">
                            <Mail size={17} strokeWidth={1.5} />
                        </span>
                        <span className="reserve-modal-option-text">
                            <span className="reserve-modal-option-label">Email inquiry</span>
                            <span className="reserve-modal-option-sub">{contact.email}</span>
                        </span>
                        <ChevronRight size={16} strokeWidth={1.5} className="reserve-modal-option-chevron" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ReserveModal;