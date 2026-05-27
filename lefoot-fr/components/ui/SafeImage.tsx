"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { FALLBACK_NEWS_IMAGE, isAllowedImageUrl } from "@/lib/image-hosts";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className,
  priority,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(isAllowedImageUrl(src) ? src : FALLBACK_NEWS_IMAGE);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-200 text-gray-400",
          fill && "absolute inset-0",
          className
        )}
      >
        <span className="text-2xl">⚽</span>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => {
        if (imgSrc !== FALLBACK_NEWS_IMAGE) {
          setImgSrc(FALLBACK_NEWS_IMAGE);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
