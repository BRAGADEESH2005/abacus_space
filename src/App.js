import React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import WhyAbacus from "./components/WhyAbacus/WhyAbacus";
import RegionsMap from "./components/RegionsMap/RegionsMap";
import TrustedBy from "./components/TrustedBy/TrustedBy";
import InsightsNews from "./components/InsightsNews/InsightsNews";
import CallToAction from "./components/CallToAction/CallToAction";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Services />
      <WhyAbacus />
      <RegionsMap />
      <TrustedBy />
      <InsightsNews />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default App;
