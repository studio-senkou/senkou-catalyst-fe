import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Features from "./components/features";
import WhyCatalyst from "./components/why";
import Testimonials from "./components/testimonials";
import Pricing from "./components/pricing";
import CTA from "./components/cta";
import Footer from "./components/footer";

// Main App Component
const CatalystLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      {/* <Showcase /> */}
      <WhyCatalyst />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default CatalystLanding;
