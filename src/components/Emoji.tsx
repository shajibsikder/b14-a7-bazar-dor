import React from "react";
import Image from "next/image";

interface EmojiProps {
  symbol?: string;
  className?: string;
  size?: number;
}

const emojiMap: Record<string, string> = {
  "🫘": "/emojis/1fad8.svg",
  "🫙": "/emojis/1fad9.svg",
  "🫚": "/emojis/1fad6.svg",
};

export default function Emoji({ symbol, className = "", size = 24 }: EmojiProps) {
  if (!symbol) return null;

  const svgSrc = emojiMap[symbol];
  if (svgSrc) {
    return (
      <Image
        src={svgSrc}
        alt={symbol}
        width={size}
        height={size}
        className={`inline-block object-contain ${className}`}
      />
    );
  }

  return <span className={className}>{symbol}</span>;
}
