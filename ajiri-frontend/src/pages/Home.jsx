import { HeroSection } from "../components/Hero-section";
import { FeaturesSection } from "../components/Features-section";
import { StatsSection } from "../components/Stats-section";
import { PlatformSection } from "../components/Platfrom-section";

export function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <PlatformSection />
    </>
  );
}