import { useState } from 'react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <section
            id="contact"
            className="relative bg-gradient-to-b from-sky-50 to-white py-16 overflow-hidden"
        >            <div className="absolute top-0 left-0 right-0 flex justify-center">
                <div className="h-1 w-24 bg-blue-500 rounded-full mt-8"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                <div className="text-center mb-16 relative max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Let's Get In Touch
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 relative z-10 px-4 bg-sky-50 inline-block">
                        Have a question or just want to say hi? We'd love to hear from you.
                    </p>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-blue-500 rounded-full opacity-20 -z-10"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-stretch">
                    {/* Contact Form */}
                    <div className="bg-white p-10 rounded-3xl shadow-lg flex flex-col">
                        <form onSubmit={handleSubmit} className="space-y-8 flex flex-col flex-grow">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                required
                            />

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                required
                            />

                            <textarea
                                id="message"
                                name="message"
                                rows={6}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none h-full"
                                required
                            />

                            <button
                                type="submit"
                                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-md transition-transform duration-300 transform hover:scale-105"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white p-10 rounded-3xl shadow-lg flex flex-col justify-center space-y-8">
                        {/* Phone Container */}
                        <div className="flex items-center space-x-4 p-6 border rounded-lg hover:shadow-md transition-shadow duration-300">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                                <p className="text-gray-600">Mobile: +91 7702620284</p>
                            </div>
                        </div>

                        {/* Email Container */}
                        <div className="flex items-center space-x-4 p-6 border rounded-lg hover:shadow-md transition-shadow duration-300">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                                <p className="text-gray-600">support@academyhub.in</p>
                            </div>
                        </div>

                        {/* Location Container */}
                        <div className="flex items-center space-x-4 p-6 border rounded-lg hover:shadow-md transition-shadow duration-300">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                                <p className="text-gray-600">Anantapur, Andhra Pradesh, 515001</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;
