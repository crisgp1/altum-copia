'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/services' },
  { label: 'Nosotros', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contact' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

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
        }
      )
      // Logo entrance
      .fromTo(logoRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
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
    
    // Simple exit sequence
    tl.to([ctaButtonRef.current, ...menuItemsRef.current, logoRef.current],
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
      .call(() => {
        // Re-enable body scroll and reset transforms
        document.body.style.overflow = 'auto';
        gsap.set([overlayRef.current, logoRef.current, ...menuItemsRef.current, ctaButtonRef.current], {
          clearProps: 'all'
        });
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
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div 
          className="bg-white/70 backdrop-blur-xl border-b border-white/30"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(183,159,118,0.1) 100%)'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center">
                <div className="text-xl leading-tight">
                  <span className="altum-brand text-slate-800">ALTUM</span>{' '}
                  <span className="legal-brand" style={{ color: '#B79F76' }}>Legal</span>
                </div>
              </div>

              {/* Auth Section */}
              <div className="flex items-center gap-4 mr-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors">
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 text-xs font-medium text-white rounded-full transition-colors"
                      style={{ backgroundColor: '#B79F76' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#152239'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B79F76'}
                    >
                      Registrarse
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </SignedIn>
              </div>

              {/* Elegant Menu Button */}
              <button
                onClick={toggleMenu}
                className="group relative w-12 h-12 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 flex flex-col justify-center items-center space-y-1.5 focus:outline-none transition-all duration-300 hover:bg-white/60"
              >
                <span 
                  className={`w-6 h-0.5 transition-all duration-500 ease-out ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
                  style={{ backgroundColor: '#B79F76' }}
                ></span>
                <span 
                  className={`w-6 h-0.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}
                  style={{ backgroundColor: '#B79F76' }}
                ></span>
                <span 
                  className={`w-6 h-0.5 transition-all duration-500 ease-out ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
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
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >

          {/* Logo in Menu */}
          <div 
            ref={logoRef}
            className="absolute top-8 left-8 text-xl leading-tight"
          >
            <span className="altum-brand text-slate-900">ALTUM</span>{' '}
            <span className="legal-brand" style={{ color: '#B79F76' }}>Legal</span>
          </div>

          {/* Menu Items - High contrast for visibility */}
          <div className="w-full max-w-6xl mx-auto px-6 lg:px-16 xl:px-20">
            <div className="text-left space-y-6 md:space-y-5 lg:space-y-6 xl:space-y-8">
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
                    className="group block text-2xl md:text-2xl lg:text-3xl xl:text-3xl font-light cursor-pointer leading-tight relative"
                    style={{ 
                      fontFamily: 'Minion Pro, serif',
                      color: '#152239'
                    }}
                  >
                    <span className="relative z-10 transition-all duration-500 group-hover:opacity-70">
                      {item.label}
                    </span>
                    {/* Elegant underline effect */}
                    <div 
                      className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-16"
                      style={{ backgroundColor: '#B79F76' }}
                    ></div>
                  </a>
                </div>
              ))}
            </div>
            
            {/* Sophisticated CTA Button */}
            <div className="text-left pt-12 lg:pt-16">
              <div style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none', isolation: 'isolate' }}>
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
                  className="group relative overflow-hidden rounded-full px-10 py-4 text-base font-medium transition-all duration-500 shadow-xl"
                  style={{
                    backgroundColor: '#152239',
                    border: '2px solid #152239',
                    color: '#FFFFFF',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    position: 'relative',
                    zIndex: 10
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
                <span className="relative z-10 flex items-center">
                  Consulta Gratuita
                  <svg 
                    className="ml-3 w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" 
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
          </div>

          {/* Refined close indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-light">
            <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm" style={{ color: '#152239' }}>
              <span>ESC para cerrar</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}