import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types"; // ✅ add this

function SEO({ title, description, keywords, image, url }) {
  const defaultTitle = "Axivibe - Premium E-commerce Store";
  const defaultDescription =
    "Shop premium products, explore categories, and enjoy exclusive deals at Axivibe.";
  const defaultKeywords = "ecommerce, shop, products, deals, online shopping";
  const defaultImage = "https://axivibe.vercel.app/og-image.png";
  const defaultUrl = "https://axivibe.vercel.app";

  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* Open Graph */}
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Canonical */}
      <link rel="canonical" href={url || defaultUrl} />
    </Helmet>
  );
}

// ✅ PropTypes validation
SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
};

export default SEO;
