'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'react-feather';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        {/* Logo + Branding */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/AcademyHub.png"
              alt="Academy Hub"
              width={160}
              height={40}
              className="object-contain h-10"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="items-center hidden h-full space-x-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center h-full px-4 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-50 sm:block"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="hidden px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 sm:block"
          >
            Get Started
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-gray-700 rounded-md md:hidden hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}

          <div className="pt-2 mt-2 border-t border-gray-200">
            <Link
              href="/auth/register"
              className="block px-3 py-2 mt-2 text-base font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>

          <div>
            <Link
              href="/auth/login"
              className="block px-3 py-2 mt-2 text-base font-medium text-center text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
