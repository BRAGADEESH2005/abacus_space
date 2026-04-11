// SEO Configuration and Schema Generators
// Industry-level SEO practices for real estate website

const siteConfig = {
  siteName: "Abacus Spaces",
  siteUrl: "https://abacuspaces.com",
  description:
    "Commercial real estate consulting company specializing in office and retail space leasing",
  organization: {
    name: "Abacus Spaces",
    url: "https://abacuspaces.com",
    description:
      "Abacus Spaces is a commercial real estate consulting company, specializing exclusively in Leasing Office and Retail Spaces.",
    address: {
      streetAddress: "Commercial Building",
      addressLocality: "Coimbatore",
      addressRegion: "TN",
      postalCode: "641001",
      addressCountry: "IN",
    },
    contact: {
      telephone: "+91-7339544927",
      email: "info@abacuspaces.com",
    },
    social: {
      linkedin: "https://linkedin.com/company/abacus-spaces",
      instagram:
        "https://www.instagram.com/abacus_spaces?igsh=b3VrM290NGRyMGx6",
      twitter: "https://twitter.com/abacus_spaces",
    },
  },
};

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org/",
  "@type": "Organization",
  name: siteConfig.organization.name,
  url: siteConfig.organization.url,
  description: siteConfig.organization.description,
  logo: "https://abacuspaces.com/logo_abacus.png",
  image: "https://abacuspaces.com/logo_abacus.png",
  address: {
    "@type": "PostalAddress",
    ...siteConfig.organization.address,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Sales",
    telephone: siteConfig.organization.contact.telephone,
    email: siteConfig.organization.contact.email,
    availableLanguage: ["en", "hi"],
  },
  sameAs: [
    siteConfig.organization.social.linkedin,
    siteConfig.organization.social.instagram,
    siteConfig.organization.social.twitter,
  ],
};

// Real Estate Listing Schema Generator
export const generateRealEstateListingSchema = (listing) => ({
  "@context": "https://schema.org/",
  "@type": "RealEstateListing",
  name: listing.name,
  description: listing.description,
  image: listing.image,
  url: listing.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: listing.address?.street || "",
    addressLocality: listing.address?.city || "",
    addressRegion: listing.address?.state || "",
    postalCode: listing.address?.zip || "",
    addressCountry: "IN",
  },
  price: listing.price,
  priceCurrency: "INR",
  availability: listing.availability || "InStock",
  areaServed: {
    "@type": "City",
    name: listing.address?.city,
  },
});

// Local Business Schema for City-Specific SEO
export const generateLocalBusinessSchema = (city, state) => ({
  "@context": "https://schema.org/",
  "@type": "LocalBusiness",
  name: `Abacus Spaces - ${city}`,
  description: `Commercial real estate solutions in ${city}, ${state}`,
  url: `https://abacuspaces.com/locations/${city.toLowerCase().replace(/\s+/g, "-")}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: city,
    addressRegion: state,
    addressCountry: "IN",
  },
  sameAs: [
    siteConfig.organization.social.linkedin,
    siteConfig.organization.social.instagram,
    siteConfig.organization.social.twitter,
  ],
});

// Breadcrumb Schema for Navigation
export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: `https://abacuspaces.com${crumb.url}`,
  })),
});

// FAQ Schema for Help Content
export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Aggregate Rating Schema for Reviews
export const generateAggregateRatingSchema = (name, rating, ratingCount) => ({
  "@context": "https://schema.org/",
  "@type": "AggregateRating",
  ratingValue: rating,
  ratingCount: ratingCount,
  bestRating: "5",
  worstRating: "1",
  name: name,
});

export default siteConfig;
