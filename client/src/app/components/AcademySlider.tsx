'use client';

import Image from 'next/image';

export default function AcademySlider() {
  const logos = [
    { src: '/images/Salford English Acdemy.png', name: 'Alpha Academy' },
    { src: '/images/images.png', name: 'Gamma School' },
    { src: '/images/images.png', name: 'Delta Academy' },
    { src: '/images/AcademyHub.png', name: 'Zeta Academy' },
  ];

  return (
    <section id="academy-logos" className="w-full py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto overflow-x-auto">
        <div className="flex gap-6 px-4">
          {logos.map((logo, index) => (
            <div key={index} className="flex flex-col items-center flex-shrink-0 w-40 text-center sm:w-48">
              <div className="flex items-center justify-center w-40 h-40 overflow-hidden border-4 border-blue-500 rounded-full shadow-lg sm:w-48 sm:h-48">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                  priority={index === 0}
                />
              </div>
              <p className="mt-4 text-base font-semibold text-gray-800 sm:text-lg">{logo.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
