import React from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ActionCard({ icon: Icon, title, description, link, buttonLabel }) {
    return (
        <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-gradient-to-b from-background to-muted/10 overflow-hidden relative min-h-[220px]">
            <CardContent className="p-6 flex flex-col justify-between items-center text-center space-y-5 z-10 h-full">
                <div className="flex flex-col items-center space-y-5">
                    <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm px-2">{description}</CardDescription>
                </div>
                {buttonLabel && (
                    <Button asChild variant="ghost" size="sm" className="mt-2 group-hover:text-primary transition-colors gap-2">
                        <Link to={link} className="flex items-center">
                            <span>{buttonLabel}</span>
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

