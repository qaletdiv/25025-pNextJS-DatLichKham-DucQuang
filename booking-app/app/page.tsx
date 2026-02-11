import FeatureDoctor from "./Components/Common/FeatureDoctor/FeatureDoctor";
import HeroSection from "./Components/Common/HeroSection/HeroSection";
import ProviderSection from "./Components/Common/ProviderSection/ProviderSection";
import SpeciallitiesSection from "./Components/Common/SpecialitiesSection/SpecialitiesSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProviderSection />
      <SpeciallitiesSection />
      <FeatureDoctor />
    </div>
  );
}
