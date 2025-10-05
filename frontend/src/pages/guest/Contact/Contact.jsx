import Hero from "@/components/Contact/Hero/Hero";
import ContactInfoCard from "@/components/Contact/ContactInfoCard/ContactInfoCard";
import ContactForm from "@/components/Contact/ContactForm/ContactForm";
import LocationMap from "@/components/Contact/LocationMap/LocationMap";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Contact() {
    return (
        <div className="min-h-screen py-10 mt-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <Hero />

                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <ContactInfoCard />
                    <ContactForm />
                </motion.div>

                <LocationMap />
            </div>
        </div>
    );
}

