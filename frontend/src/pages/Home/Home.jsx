import HeroSection from "@/components/HeroSection/HeroSection";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <HeroSection />
        </div>
    );
}