import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark' | 'extracted';
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'header';
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

  // Dedicated responsive header size
  if (size === 'header') {
    const headerContent = (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <div className="relative w-32 sm:w-40 md:w-44 h-11 sm:h-13 md:h-14">
          <Image
            src={logoSrc}
            alt="Radhey Radhey Girls Point"
            fill
            priority
            className="object-contain object-center"
            sizes="(max-width: 640px) 130px, 180px"
          />
        </div>
      </div>
    );

    if (!href) return headerContent;
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
        {headerContent}
      </Link>
    );
  }

  // Size configurations for footer, cards, hero, and admin
  const dimensions = {
    sm: { width: 120, height: 60 },
    md: { width: 160, height: 80 },
    lg: { width: 220, height: 110 },
    hero: { width: 300, height: 150 },
  }[size as 'sm' | 'md' | 'lg' | 'hero'] || { width: 160, height: 80 };

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
