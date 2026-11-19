import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark' | 'extracted';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  className?: string;
  href?: string;
}

export default function Logo({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
  href = '/',
}: LogoProps) {
  const isDarkBg = variant === 'light'; // Text/emblem should be light if on dark background
  const logoSrc = isDarkBg ? '/brand/logo-light.png' : '/brand/logo.png';

  // Size configurations
  const dimensions = {
    sm: { width: 140, height: 70 },
    md: { width: 190, height: 95 },
    lg: { width: 240, height: 120 },
    hero: { width: 320, height: 160 },
  }[size];

  const content = (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
        <Image
          src={logoSrc}
          alt="Radhey Radhey Girls Point"
          fill
          priority
          className="object-contain"
          sizes={`${dimensions.width}px`}
        />
      </div>

      {showTagline && size !== 'sm' && (
        <p
          className={`font-sans text-[7px] sm:text-[8px] uppercase tracking-[0.25em] font-semibold -mt-1 ${
            isDarkBg ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          Ethnic <span className="opacity-40">|</span> Fusion <span className="opacity-40">|</span> Casual <span className="opacity-40">|</span> Festive
        </p>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-block hover:opacity-95 transition-opacity">
      {content}
    </Link>
  );
}
