import React from "react";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import WhyAbacus from "../../components/WhyAbacus/WhyAbacus";
import RegionsMap from "../../components/RegionsMap/RegionsMap";
import CallToAction from "../../components/CallToAction/CallToAction";
import ResidentialBanner from "../../components/ResidentialBanner/ResidentialBanner";
import LatestInRealEstate from "../../components/LatestInRealEstate/LatestInRealEstate";
const Home = () => {
  return (
    <>
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
