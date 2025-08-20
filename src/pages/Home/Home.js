import React from "react";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import WhyAbacus from "../../components/WhyAbacus/WhyAbacus";
import RegionsMap from "../../components/RegionsMap/RegionsMap";
import TrustedBy from "../../components/TrustedBy/TrustedBy";
import InsightsNews from "../../components/InsightsNews/InsightsNews";
import CallToAction from "../../components/CallToAction/CallToAction";

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <WhyAbacus />
      <RegionsMap />
      <TrustedBy />
      <InsightsNews />
      <CallToAction />
    </>
  );
};

export default Home;