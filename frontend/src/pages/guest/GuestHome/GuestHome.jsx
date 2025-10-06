import DoctorProfile from "@/components/guest/GuestHome/DoctorProfile/DoctorProfile";
import FAQSection from "@/components/guest/GuestHome/FAQSection/FAQSection";
import HeroSection from "@/components/guest/GuestHome/HeroSection/HeroSection";
import ServicesSection from "@/components/guest/GuestHome/ServicesSection/ServicesSection";
import TestimonialsSection from "@/components/guest/GuestHome/TestimonialSection/TestimonialSection";

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