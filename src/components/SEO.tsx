// src/components/SEO.tsx
const SITE_URL = "https://siayanrockhometel.com"; // replace with your real domain
const DEFAULT_IMAGE = `${SITE_URL}/images/og-img.JPG`; // 1200x630

type SEOProps = {
    title: string;
    description: string;
    path: string; // e.g. "/tours"
    image?: string;
};

export default function SEO({ title, description, path, image = DEFAULT_IMAGE }: SEOProps) {
    const url = `${SITE_URL}${path}`;

    return (
        <>
            <title>{`${title}`}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />

            <meta name="twitter:card" content="summary_large_image" />
        </>
    );
}