'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "@/components/NavItems";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="relative w-full z-50">
            {/* Main Navbar Container */}
            <nav className="navbar flex items-center justify-between px-4 py-3 md:px-8">
                <Link href="/">
                    <div className="flex items-center rounded-full gap-2.5 cursor-pointer">
                        <Image
                            src="/images/juuailogo.png"
                            alt="Juu AI logo"
                            width={46}
                            height={44}
                        />
                    </div>
                </Link>

                {/* Right side items */}
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Desktop Navigation - Hidden on Mobile */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavItems />
                    </div>

                    <SignedOut>
                        <SignInButton>
                            <button className="btn-signin">Sign In</button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>

                    {/* Mobile Menu Hamburger Button - Hidden on Desktop */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex md:hidden flex-col justify-center items-center gap-1.5 w-6 h-6 z-50 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <span className={`h-0.5 w-full bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`h-0.5 w-full bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                        <span className={`h-0.5 w-full bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay/Menu */}
            <div className={`fixed inset-0 bg-background/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-6 gap-6 z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <NavItems onMobileClick={() => setIsOpen(false)} isMobile={true} />
            </div>
        </header>
    )
}

export default Navbar;