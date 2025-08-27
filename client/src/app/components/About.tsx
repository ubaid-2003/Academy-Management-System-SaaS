'use client';

import { Check } from 'react-feather';
import Image from 'next/image';
import React from 'react';

const About = () => {
  const features = [
    { title: "Affordable price", icon: <Check size={16} /> },
    { title: "Easy to manage admin panel", icon: <Check size={16} /> },
    { title: "Data Security", icon: <Check size={16} /> },
    { title: "2 step verification", icon: <Check size={16} /> }
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center">

          {/* Left Side - Text Content */}
          <div className="flex-1 lg:pr-12">
            <p className="mb-2 text-lg font-semibold text-blue-600">
              A modern and unique style
            </p>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              Why it is best?
            </h2>

            <p className="max-w-md mb-8 text-lg text-gray-600">
              Academyhub is the pinnacle of academy management, offering advanced technology,
              user-friendly features, and personalized solutions. It simplifies communication,
              streamlines administrative tasks, and elevates the educational experience for all stakeholders.
            </p>

            <div className="flex flex-col max-w-md gap-4 mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 transition-all duration-300 rounded-lg bg-gray-50 hover:shadow-md"
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-3 bg-blue-700 rounded-full">
                    {React.cloneElement(feature.icon, { color: 'white' })}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex-1">
            <div className="relative w-full overflow-hidden bg-white shadow-lg h-96 rounded-xl">
              <Image
                src="/images/whybest.png"
                alt="Academyhub Dashboard Preview"
                fill
                className="object-cover"
                quality={100}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
