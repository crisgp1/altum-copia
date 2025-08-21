'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import Image from 'next/image'; // 🔄 UPDATE 1: Added Next.js Image import
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { LayoutDashboard } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/services' },
  { label: 'Nosotros', href: '/about' },
  { label: 'Equipo', href: '/equipo' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null); // Reference to main navbar
  const { isAdmin, isContentCreator } = useUserRole();

  // Handle logo click for home redirect
  const handleLogoClick = () => {
    router.push('/');
  };

  // Mount detection to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll detection effect for logo switching
  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  useEffect(() => {
    if (isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  const openMenu = () => {
    const tl = gsap.timeline();
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    tl.set(menuRef.current, { display: 'flex' })
      // Hide main navbar first
      .to(navbarRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
      // Simple glassmorphism entrance
      .fromTo(overlayRef.current,
        {
          opacity: 0,
          backdropFilter: 'blur(0px)'
        },
        {
          opacity: 1,
          backdropFilter: 'blur(20px)',
          duration: 0.6,
          ease: 'power2.out'
        },
        '-=0.2' // Start slightly before navbar fade completes
      )
      // Logo entrance - REMOVED (logo hidden in menu)
      // .fromTo(logoRef.current,
      //   { y: -20, opacity: 0 },
      //   { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      //   '-=0.3'
      // )
      // Menu items simple fade in
      .fromTo(menuItemsRef.current, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.2'
      )
      // CTA button
      .fromTo(ctaButtonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      );
  };

  const closeMenu = () => {
    const tl = gsap.timeline();
    
    // Simple exit sequence - REMOVED logoRef
    tl.to([ctaButtonRef.current, ...menuItemsRef.current],
        {
          opacity: 0,
          y: -20,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.in'
        }
      )
      .to(overlayRef.current,
        { 
          opacity: 0, 
          backdropFilter: 'blur(0px)',
          duration: 0.4,
          ease: 'power2.in'
        },
        '-=0.2'
      )
      .set(menuRef.current, { display: 'none' })
      // Show main navbar after menu closes
      .to(navbarRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      })
      .call(() => {
        // Re-enable body scroll and reset transforms
        document.body.style.overflow = 'auto';
        
        // Clear props with null checks
        const elementsToReset = [];
        if (overlayRef.current) elementsToReset.push(overlayRef.current);
        if (ctaButtonRef.current) elementsToReset.push(ctaButtonRef.current);
        menuItemsRef.current.forEach(item => {
          if (item) elementsToReset.push(item);
        });
        
        if (elementsToReset.length > 0) {
          gsap.set(elementsToReset, {
            clearProps: 'all'
          });
        }
      });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    // Add a small delay for the menu close animation
    setTimeout(() => {
      router.push(href);
      }, 300);
    };
  

  return (
    <>
      {/* Glassmorphism Header Bar */}
      <nav ref={navbarRef} className="fixed top-0 left-0 right-0 z-50">
        <div
          className="bg-white/70 backdrop-blur-xl border-b border-white/30"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(183,159,118,0.1) 100%)'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
              {/* Logo Section - Responsive */}
              <div className="flex items-center flex-shrink-0 min-w-0">
                <button
                  onClick={handleLogoClick}
                  className="relative hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 rounded-md p-1 sm:p-2"
                  aria-label="Ir al inicio"
                >
                  {/* Text Logo - Initial State */}
                  <div
                    className={`text-sm sm:text-base lg:text-lg leading-tight transition-all duration-500 ease-out ${
                      isMounted && isScrolled ? 'opacity-0 transform scale-95 -translate-y-2' : 'opacity-100 transform scale-100 translate-y-0'
                    }`}
                    style={{
                      position: isMounted && isScrolled ? 'absolute' : 'relative',
                      top: isMounted && isScrolled ? '50%' : '0',
                      left: isMounted && isScrolled ? '50%' : '0',
                      transform: isMounted && isScrolled ? 'translate(-50%, -50%) scale(0.95)' : 'none'
                    }}
                  >
                    <span className="altum-brand text-slate-800">ALTUM</span>{' '}
                    <span className="legal-brand" style={{ color: '#B79F76' }}>Legal</span>
                  </div>
                  
                  {/* Cropped Logo - Scrolled State */}
                  <div
                    className={`transition-all duration-500 ease-out ${
                      isMounted && isScrolled ? 'opacity-100 transform scale-100 translate-y-0' : 'opacity-0 transform scale-105 translate-y-2'
                    }`}
                    style={{
                      position: isMounted && isScrolled ? 'relative' : 'absolute',
                      top: isMounted && isScrolled ? '0' : '50%',
                      left: isMounted && isScrolled ? '0' : '50%',
                      transform: isMounted && isScrolled ? 'none' : 'translate(-50%, -50%) scale(1.05)'
                    }}
                  >
                    <Image
                      src="/images/attorneys/logos/logo-dark.png"
                      alt="Altum Legal"
                      width={120}
                      height={30}
                      className="object-contain w-[85px] h-auto sm:w-[95px] sm:h-auto lg:w-[120px] lg:h-auto"
                      priority
                    />
                  </div>
                </button>
              </div>

              {/* Auth Section - Responsive */}
              <div className="hidden sm:flex items-center gap-2 sm:gap-3 lg:gap-4 mr-2 sm:mr-3 lg:mr-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-2 py-1">
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white rounded-full transition-colors"
                      style={{ backgroundColor: '#B79F76' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#152239'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B79F76'}
                    >
                      <span className="hidden sm:inline">Registrarse</span>
                      <span className="sm:hidden">Registro</span>
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  {(isAdmin() || isContentCreator()) && (
                    <button
                      onClick={() => router.push('/admin')}
                      className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-white bg-white/80 hover:bg-amber-600 border border-slate-200 hover:border-amber-600 rounded-full transition-all duration-200"
                      title="Panel de administración"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden lg:inline">Dashboard</span>
                    </button>
                  )}
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-7 h-7 sm:w-8 sm:h-8"
                      }
                    }}
                  />
                </SignedIn>
              </div>

              {/* Mobile Auth Section */}
              <div className="flex sm:hidden items-center gap-2 mr-2">
                <SignedIn>
                  {(isAdmin() || isContentCreator()) && (
                    <button
                      onClick={() => router.push('/admin')}
                      className="p-1.5 text-slate-700 hover:text-amber-600 transition-colors"
                      title="Dashboard"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                    </button>
                  )}
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-6 h-6"
                      }
                    }}
                  />
                </SignedIn>
              </div>

              {/* Menu Button - Responsive */}
              <button
                onClick={toggleMenu}
                className="group relative w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-transparent flex flex-col justify-center items-center space-y-1 sm:space-y-1.5 focus:outline-none transition-all duration-300 flex-shrink-0"
              >
                <span 
                  className={`w-5 sm:w-6 h-0.5 transition-all duration-500 ease-out ${isOpen ? 'rotate-45 translate-y-1.5 sm:translate-y-2' : ''}`}
                  style={{ backgroundColor: '#B79F76' }}
                ></span>
                <span 
                  className={`w-5 sm:w-6 h-0.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}
                  style={{ backgroundColor: '#B79F76' }}
                ></span>
                <span 
                  className={`w-5 sm:w-6 h-0.5 transition-all duration-500 ease-out ${isOpen ? '-rotate-45 -translate-y-1.5 sm:-translate-y-2' : ''}`}
                  style={{ backgroundColor: '#B79F76' }}
                ></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Glassmorphism Full Screen Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40"
        style={{ display: 'none' }}
      >
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)'
          }}
        >

          {/* 🔄 UPDATE 5: HIDDEN - Logo removed from menu (looks bad) */}
          <div
            ref={logoRef}
            className="absolute top-8 left-8 opacity-0 pointer-events-none"
            style={{ display: 'none' }}
          >
            <Image
              src="/images/attorneys/logos/logo-dark.png"
              alt="Altum Legal"
              width={120}
              height={30}
              className="object-contain"
              priority
            />
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 flex flex-col justify-center items-center focus:outline-none transition-all duration-300 z-50"
            aria-label="Cerrar menú"
          >
            <span 
              className="absolute w-6 h-0.5 rotate-45"
              style={{ backgroundColor: '#B79F76' }}
            ></span>
            <span 
              className="absolute w-6 h-0.5 -rotate-45"
              style={{ backgroundColor: '#B79F76' }}
            ></span>
          </button>

          {/* Menu Items - High contrast for visibility */}
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-20">
            <div className="text-left space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 xl:space-y-8">
              {navItems.map((item, index) => (
                <div
                  key={item.href}
                  ref={(el) => { if (el) menuItemsRef.current[index] = el; }}
                  className="overflow-hidden"
                >
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="group block text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl font-light cursor-pointer leading-tight relative"
                    style={{
                      fontFamily: 'Minion Pro, serif',
                      color: '#0f172a',
                      textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <span className="relative z-10 transition-all duration-500 group-hover:opacity-70">
                      {item.label}
                    </span>
                    {/* Elegant underline effect */}
                    <div 
                      className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-12 sm:group-hover:w-16"
                      style={{ backgroundColor: '#B79F76' }}
                    ></div>
                  </a>
                </div>
              ))}
            </div>
            
            {/* Mobile Auth Section in Menu */}
            <div className="flex sm:hidden justify-center pt-8 pb-4 border-t border-slate-200 mt-8">
              <SignedOut>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <SignInButton mode="modal">
                    <button className="w-full text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-3 border border-slate-300 rounded-lg">
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors"
                      style={{ backgroundColor: '#B79F76' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#152239'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B79F76'}
                    >
                      Registrarse
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                {(isAdmin() || isContentCreator()) && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setTimeout(() => router.push('/admin'), 300);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Ir al Dashboard</span>
                  </button>
                )}
              </SignedIn>
            </div>
            
            {/* Sophisticated CTA Button */}
            <div className="text-left pt-8 sm:pt-10 lg:pt-16">
              <button
                ref={ctaButtonRef}
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(() => {
                    // Scroll to contact section or handle CTA
                    const contactSection = document.querySelector('#contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 200);
                }}
                className="group rounded-full px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors duration-500 shadow-xl w-full sm:w-auto"
                style={{
                  backgroundColor: '#152239',
                  border: '2px solid #152239',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B79F76';
                  e.currentTarget.style.border = '2px solid #B79F76';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#152239';
                  e.currentTarget.style.border = '2px solid #152239';
                }}
              >
                <span className="flex items-center justify-center" style={{ color: '#FFFFFF' }}>
                  <span className="hidden sm:inline">Consulta Gratuita</span>
                  <span className="sm:hidden">Consulta</span>
                  <svg 
                    className="ml-2 sm:ml-3 w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-500 group-hover:translate-x-1 sm:group-hover:translate-x-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Refined close indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-light">
            <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200" style={{ color: '#0f172a' }}>
              <span>ESC para cerrar</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}