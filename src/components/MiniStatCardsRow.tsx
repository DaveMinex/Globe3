import React from "react";
import { MiniStatCard } from "./MiniStatCard";

import type { MiniStatCardProps } from "./MiniStatCard";

interface MiniStatCardsRowProps {
  cards: MiniStatCardProps[];
  className?: string;
}

export const MiniStatCardsRow: React.FC<MiniStatCardsRowProps> = ({ cards, className = "" }) => (
  <div className={`flex flex-row gap-5 items-center justify-start ${className}`}>
    {cards.map((card, i) => (
      <MiniStatCard key={i} {...card} />
    ))}
  </div>
); 