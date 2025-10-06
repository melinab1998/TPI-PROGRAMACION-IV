import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Header({
    title,
    subtitle,
    onCreate,
    actionLabel,
    actionIcon: ActionIcon,
    extraContent,
    motionProps = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
}) {
    return (
        <motion.div {...motionProps}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-center text-center sm:text-left gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mt-4">
                        {title}
                    </h1>
                    {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
                </div>

                {onCreate && actionLabel && (
                    <Button onClick={onCreate} className="flex items-center gap-2">
                        {ActionIcon && <ActionIcon className="w-4 h-4" />}
                        {actionLabel}
                    </Button>
                )}

                {extraContent && extraContent}
            </div>
        </motion.div>
    );
}

