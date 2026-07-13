import Navbar from "@/components/website/Navbar";
import HeroSection from "@/components/website/HeroSection";
import HowItWorksSection from "@/components/website/HowItWorksSection";
import BenefitsSection from "@/components/website/BenefitsSection";
import SmartRouteSection from "@/components/website/SmartRouteSection";
import StatsSection from "@/components/website/StatsSection";
import PremiumSection from "@/components/website/PremiumSection";
import FAQSection from "@/components/website/FAQSection";
import DownloadSection from "@/components/website/DownloadSection";
import FooterSection from "@/components/website/FooterSection";

export default function HomePage() {
  return (
    <main className="bg-[#0D1117]">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <SmartRouteSection />
      <StatsSection />
      <PremiumSection />
      <FAQSection />
      <DownloadSection />
      <FooterSection />
    </main>
  );
}
