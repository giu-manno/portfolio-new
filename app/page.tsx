import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
// import Experience from "@/components/Experience";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import CtaFooter from "@/components/CtaFooter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Work />
        {/* <Experience /> */}
        <About />
        <Testimonials />
      </main>
      <CtaFooter />
      <Footer />
    </>
  );
}
