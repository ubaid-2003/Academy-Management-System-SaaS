'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <section id="home" className="py-12 bg-gradient-to-b from-blue-50 to-white sm:py-20">
            <div className="container flex flex-col items-center gap-12 px-6 mx-auto lg:flex-row lg:gap-16">
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                    <p className="text-xl font-semibold tracking-wide text-blue-700 sm:text-2xl">
                        🚀 AcademyHub SaaS – Transform the Way You Manage Education
                    </p>

                    <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
                        All-in-One <span className="text-blue-600">Academy Management</span> <br className="hidden lg:block" />
                        For a Smarter Future
                    </h1>

                    <p className="max-w-2xl mt-4 text-lg text-gray-700 sm:text-xl">
                        Manage <span className="font-semibold text-blue-600">students</span>,
                        <span className="font-semibold text-blue-600"> teachers</span>,
                        and <span className="font-semibold text-blue-600">courses</span> with ease.
                        Automate attendance, schedule classes, handle fees, and deliver exceptional learning experiences – all from a single dashboard.
                    </p>

                    <p className="mt-3 italic text-gray-500 text-md">
                        Empowering institutions with technology that scales.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link
                            href="/auth/register"
                            className="px-8 py-3 text-sm font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-md sm:text-base sm:px-10"
                        >
                            Register Academy
                        </Link>
                        <Link
                            href="/demo"
                            className="px-8 py-3 text-sm font-medium text-blue-600 transition-all bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:shadow-md sm:text-base sm:px-10"
                        >
                            Request Demo
                        </Link>
                    </div>
                </div>

                {/* Image */}
                <div className="flex-1">
                    <div className="relative">
                        <Image
                            src="/images/student-laptop.png"
                            alt="Academy Management Dashboard"
                            width={600}
                            height={500}
                            className="w-full"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
