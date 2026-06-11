"use client";

import React, { useState } from "react";
import { cn } from "@/lib/client-utils";
import { Link, Chip } from "@heroui/react";
import { ArrowRight } from "lucide-react";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <Link href={card.href} className="block">
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "rounded-xl relative overflow-hidden h-80 w-full transition-all duration-200 ease-out cursor-pointer border border-default-200 dark:border-default-800 will-change-transform",
          hovered !== null && hovered !== index && "blur-[2px] scale-[0.97] opacity-70"
        )}
      >
        {/* Subtle Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20`} />
       
        {/* Base Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-default-50/90 dark:from-default-100/90 dark:to-default-200/90 backdrop-blur-sm" />
       
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Icon and Title */}
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} opacity-90 shadow-lg`}>
              <card.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-default-900 dark:text-default-100">{card.title}</h3>
          </div>
         
          {/* Description - Always visible */}
          <div className="flex-1 mt-4 mb-4">
            <p className="text-default-700 dark:text-default-400 leading-relaxed text-sm font-medium">
              {card.description}
            </p>
          </div>
         
          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {card.features.map((feature: string, idx: number) => (
              <Chip
                key={idx}
                size="sm"
                className="bg-default-200 dark:bg-default-700 text-default-800 dark:text-default-300 text-xs border border-default-300 dark:border-default-600"
                variant="bordered"
              >
                {feature}
              </Chip>
            ))}
          </div>
         
          {/* CTA - Shows on hover */}
          <div
            className={cn(
              "transition-all duration-300 transform",
              hovered === index
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <div className={`flex items-center text-white font-medium px-4 py-2 rounded-lg bg-gradient-to-r ${card.gradient} shadow-lg`}>
              Explore {card.title}
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
);

Card.displayName = "Card";

type Card = {
  title: string;
  src?: string;
  icon: any;
  description: string;
  href: string;
  gradient: string;
  features: string[];
};

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}