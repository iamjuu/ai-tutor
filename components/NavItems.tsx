'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Companions', href: '/companions' },
    { label: 'My Journey', href: '/my-journey' },
]

interface NavItemsProps {
    isMobile?: boolean;
    onMobileClick?: () => void;
}

const NavItems = ({ isMobile = false, onMobileClick }: NavItemsProps) => {
    const pathname = usePathname();
    const [pendingHref, setPendingHref] = useState<string | null>(null);

    useEffect(() => {
        setPendingHref(null);
    }, [pathname]);

    return (
        <nav className={cn(
            "flex items-center gap-4",
            isMobile ? "flex-col items-start gap-6 text-xl w-full" : "flex-row gap-4"
        )}>
            {navItems.map(({ label, href }) => (
                <Link
                    href={href}
                    key={label}
                    onClick={() => {
                        if (pathname !== href) setPendingHref(href);
                        if (onMobileClick) onMobileClick(); // Closes mobile menu
                    }}
                    aria-current={pathname === href ? 'page' : undefined}
                    className={cn(
                        'relative flex items-center gap-2 transition-colors',
                        isMobile && 'w-full py-2 border-b border-muted/20', // Mobile styling tweak
                        pathname === href && 'text-primary font-semibold',
                        pendingHref === href && 'text-primary pointer-events-none'
                    )}
                >
                    {label}
                    {pendingHref === href && (
                        <span
                            className="size-3 rounded-full border-2 border-primary border-t-transparent animate-spin"
                            aria-label="Loading"
                        />
                    )}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems;