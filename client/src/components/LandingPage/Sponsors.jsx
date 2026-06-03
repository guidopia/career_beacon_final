import React from 'react';

// Replace with actual logos or relevant icons/names
const sponsorLogos = [
  { name: 'University A', logoUrl: '/path/to/logo-a.svg', alt: 'University A Logo' },
  { name: 'Tech Company B', logoUrl: '/path/to/logo-b.svg', alt: 'Tech Company B Logo' },
  { name: 'Startup C', logoUrl: '/path/to/logo-c.svg', alt: 'Startup C Logo' },
  { name: 'Foundation D', logoUrl: '/path/to/logo-d.svg', alt: 'Foundation D Logo' },
  { name: 'EdTech E', logoUrl: '/path/to/logo-e.svg', alt: 'EdTech E Logo' },
  { name: 'Institute F', logoUrl: '/path/to/logo-f.svg', alt: 'Institute F Logo' },
];

const Sponsors = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-semibold text-gray-600 tracking-wider uppercase mb-8">
          Trusted by Leading Institutions & Partners
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-8 gap-y-8 items-center">
          {sponsorLogos.map((sponsor) => (
            <div key={sponsor.name} className="flex justify-center">
              {/* Use img tag if you have actual SVG/PNG logos */}
              {/* <img
                className="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
                src={sponsor.logoUrl}
                alt={sponsor.alt}
                loading="lazy"
              /> */}
              {/* Placeholder text if no logos */}
               <span className="text-gray-500 text-center text-sm">{sponsor.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;