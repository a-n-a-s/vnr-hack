import Features from "@/components/onboarding/Features";
import Footer from "@/components/onboarding/footer";
import Header from "@/components/onboarding/Header";
import Hero from "@/components/onboarding/Hero";

export default function Home() {
  return (
    <div className="">
      <Header />
      <Hero />
      <Features />
      <Footer/>
    </div>
  );
}
