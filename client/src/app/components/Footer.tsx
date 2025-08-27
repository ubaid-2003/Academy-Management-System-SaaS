'use client';

import Link from 'next/link';
import Image from 'next/image';

// inside your component JSX replace SVG with:
<Image
    src="/images/AcademyHub.png"
    alt="Academy Hub Logo"
    width={40}    // adjust as needed
    height={40}   // adjust as needed
    className="object-contain"
/>

const Footer = () => {
    return (
        <footer id='footer  '
            style={{ backgroundColor: 'rgba(56, 163, 165, 0.08)' }}
            className="text-white py-12"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center gap-8">

                {/* Left Side */}
                <div className="flex flex-col justify-center md:w-1/2 h-48 md:h-48 p-6">
                    {/* Academy Hub Icon */}
                    <div className="flex items-center space-x-3 mb-4 text-teal-700">
                        <Image
                            src="/images/AcademyHub.png"
                            alt="Academy Hub Logo"
                            width={100}    // adjust as needed
                            height={100}   // adjust as needed
                            className="object-contain"
                        />
                    </div>
                    <p className="text-lg font-medium max-w-sm text-black">
                        Academyhub - SaaS - Manage Your School
                    </p>
                </div>

                {/* Right Side: 3 Containers */}
                <div className="flex flex-row w-full gap-6">

                    {/* Links */}
                    <div className="flex flex-col justify-center w-full md:w-1/3 h-full px-4 text-teal-800">
                        <h3 className="font-semibold mb-3">Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:underline text-black">Home</Link>
                            </li>
                            <li>
                                <Link href="/features" className="hover:underline text-black">Features</Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:underline text-black">Pricing</Link>
                            </li>
                            <li>
                                <Link href="/faqs" className="hover:underline text-black">FAQs</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center w-full md:w-1/3 h-full px-4 text-teal-800">
                        <h3 className="font-semibold mb-3">Info</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:underline text-black">About Us</Link></li>
                            <li><Link href="/contact" className="hover:underline text-black">Contact</Link></li>
                            <li><Link href="/privacy-policy" className="hover:underline text-black">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:underline text-black">Terms & Conditions</Link></li>
                            <li><Link href="/refund" className="hover:underline text-black">Refund Cancellation</Link></li>
                        </ul>
                    </div>

                    {/* Follow */}
                    <div className="flex flex-col justify-center w-full md:w-1/3 h-full px-4 text-teal-800">
                        <h3 className="font-semibold mb-3">Follow</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="flex items-center space-x-2 hover:underline">
                                    {/* Facebook Icon */}
                                    <svg
                                        width="18"
                                        height="18"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="text-teal-800"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                                    </svg>
                                    <span>Facebook</span>
                                </Link>
                            </li>

                            <li>
                                <Link href="#" className="flex items-center space-x-2 hover:underline">
                                    {/* Instagram Icon */}
                                    <svg
                                        width="18"
                                        height="18"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="text-teal-800"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.404 3.635 1.37c-.967.967-1.24 2.14-1.298 3.417C2.013 5.668 2 6.077 2 9.335v5.33c0 3.258.013 3.667.072 4.947.058 1.277.331 2.45 1.298 3.417.967.967 2.14 1.24 3.417 1.298 1.28.059 1.689.072 4.947.072s3.667-.013 4.947-.072c1.277-.058 2.45-.331 3.417-1.298.967-.967 1.24-2.14 1.298-3.417.059-1.28.072-1.689.072-4.947v-5.33c0-3.258-.013-3.667-.072-4.947-.058-1.277-.331-2.45-1.298-3.417-.967-.967-2.14-1.24-3.417-1.298C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                                    </svg>
                                    <span>Instagram</span>
                                </Link>
                            </li>

                            <li>
                                <Link href="#" className="flex items-center space-x-2 hover:underline">
                                    {/* LinkedIn Icon */}
                                    <svg
                                        width="18"
                                        height="18"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="text-teal-800"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11.75 20h-2.25v-9h2.25v9zm-1.125-10.268c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm15.875 10.268h-2.25v-4.5c0-1.081-.019-2.473-1.507-2.473-1.507 0-1.738 1.18-1.738 2.397v4.576h-2.25v-9h2.163v1.233h.031c.302-.572 1.04-1.175 2.141-1.175 2.289 0 2.713 1.507 2.713 3.467v5.475z" />
                                    </svg>
                                    <span>LinkedIn</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Border */}
            <div className="border-t border-teal-200 opacity-50 mt-8"></div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-teal-800 text-sm select-none">
                © 2025 © Academy Hub. All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;
