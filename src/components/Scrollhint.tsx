import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollHintProps {
    targetId: string; // id of the section to scroll to
    label?: string;
}

/* "Scroll down" button for hero sections. Bobs gently, scrolls to the target
   on click, and fades out once the visitor has started scrolling. */
function ScrollHint({ targetId, label = 'Scroll to explore' }: ScrollHintProps) {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const onScroll = () => setHidden(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleClick = () => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <button
            type='button'
            className={'scroll-hint' + (hidden ? ' is-hidden' : '')}
            onClick={handleClick}
            aria-label={label}
            tabIndex={hidden ? -1 : 0}>
            <span className='scroll-hint-icon'>
                <ChevronDown size={20} aria-hidden='true' />
            </span>
            <span className='scroll-hint-label'>{label}</span>
        </button>
    );
}

export default ScrollHint;