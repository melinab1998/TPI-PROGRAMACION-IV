import DoctorProfile from "@/components/DoctorProfile/DoctorProfile";
import FAQSection from "@/components/FAQSection/FAQSection";
import HeroSection from "@/components/HeroSection/HeroSection";
import ServicesSection from "@/components/ServicesSection/ServicesSection";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <HeroSection />
            <ServicesSection/>
            <DoctorProfile/>
            <FAQSection/>
        </div>
    );
}