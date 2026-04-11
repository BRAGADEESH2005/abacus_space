import React from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import WhyAbacus from "../../components/WhyAbacus/WhyAbacus";
import RegionsMap from "../../components/RegionsMap/RegionsMap";
import CallToAction from "../../components/CallToAction/CallToAction";
import ResidentialBanner from "../../components/ResidentialBanner/ResidentialBanner";
import LatestInRealEstate from "../../components/LatestInRealEstate/LatestInRealEstate";
import {
  organizationSchema,
  generateBreadcrumbSchema,
} from "../../utils/seoConfig";

const Home = () => {
  const breadcrumbs = [{ name: "Home", url: "/" }];

  return (
    <>
      <Helmet>
        <title>
          Abacus Spaces | Commercial Real Estate & Office Space Solutions
        </title>
        <meta
          name="description"
          content="Find premium office spaces, retail properties, and coworking solutions. Abacus Spaces specializes in commercial real estate leasing across India."
        />
        <meta
          name="keywords"
          content="office space, commercial real estate, retail space, coworking, office lease, business space, commercial property"
        />
        <meta name="author" content="Abacus Spaces" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://abacuspaces.com" />

        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Abacus Spaces | Commercial Real Estate Solutions"
        />
        <meta
          property="og:description"
          content="Premium office spaces, retail properties & coworking solutions across India"
        />
        <meta
          property="og:image"
          content="https://abacuspaces.com/og-image.jpg"
        />
        <meta property="og:url" content="https://abacuspaces.com" />
        <meta property="og:site_name" content="Abacus Spaces" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Abacus Spaces | Commercial Real Estate"
        />
        <meta
          name="twitter:description"
          content="Find your perfect office or retail space with Abacus Spaces"
        />
        <meta
          name="twitter:image"
          content="https://abacuspaces.com/twitter-image.jpg"
        />

        {/* Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
        </script>
      </Helmet>

      <Hero />
      <LatestInRealEstate />
      <WhyAbacus />
      <RegionsMap />
      <ResidentialBanner />
      <Services />
      <CallToAction />
    </>
  );
};

export default Home;
