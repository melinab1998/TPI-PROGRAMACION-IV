import DoctorProfile from "@/components/Home/DoctorProfile/DoctorProfile";
import FAQSection from "@/components/Home/FAQSection/FAQSection";
import HeroSection from "@/components/Home/HeroSection/HeroSection";
import ServicesSection from "@/components/Home/ServicesSection/ServicesSection";
import TestimonialsSection from "@/components/Home/TestimonialSection/TestimonialSection";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <HeroSection />
            <ServicesSection />
            <DoctorProfile />
            <TestimonialsSection />
            <FAQSection />
        </div>
    );
}