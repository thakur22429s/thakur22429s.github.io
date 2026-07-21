import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Work from "@/components/Work";
import Life from "@/components/Life";
import AskAbhay from "@/components/AskAbhay";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Work />
        <Life />
        <AskAbhay />
        <Footer />
      </main>
    </>
  );
}
