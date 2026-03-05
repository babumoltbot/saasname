import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import DemoSection from "@/components/landing/DemoSection";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <DemoSection />
      <Pricing />
      <Footer />
    </>
  );
}
