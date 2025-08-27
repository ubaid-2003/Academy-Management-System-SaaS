// components/pricing/PricingSection.tsx
import { useState, useEffect } from 'react';

type PricingTier = {
    id: string;
    name: string;
    studentLimit: number;
    staffLimit: number;
    price: string;
    duration: string;
    features: string[];
    accentColor: string;
};

const PricingSection = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const pricingTiers: PricingTier[] = [
        {
            id: 'lite',
            name: "Lite",
            studentLimit: 200,
            staffLimit: 50,
            price: "¥ 1,499.00",
            duration: "30 Days",
            accentColor: "border-blue-500",
            features: [
                "Student Management",
                "Academic Management",
                "Slider Management",
                "Teacher Management",
                "Session Year Management",
                "Holiday Management",
                "Timetable Management",
                "Attendance Management",
                "Exam Management",
                "Lesson Management",
                "Assignment Management"
            ]
        },
        {
            id: 'standard',
            name: "Standard",
            studentLimit: 300,
            staffLimit: 100,
            price: "¥ 2,499.00",
            duration: "56 Days",
            accentColor: "border-green-500",
            features: [
                "Student Management",
                "Academic Management",
                "Slider Management",
                "Teacher Management",
                "Session Year Management",
                "Holiday Management",
                "Timetable Management",
                "Attendance Management",
                "Exam Management",
                "Lesson Management",
                "Assignment Management"
            ]
        },
        {
            id: 'pro',
            name: "Pro",
            studentLimit: 500,
            staffLimit: 250,
            price: "¥ 4,999.00",
            duration: "90 Days",
            accentColor: "border-purple-500",
            features: [
                "Student Management",
                "Academic Management",
                "Slider Management",
                "Teacher Management",
                "Session Year Management",
                "Holiday Management",
                "Timetable Management",
                "Attendance Management",
                "Exam Management",
                "Lesson Management",
                "Assignment Management"
            ]
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
                    Flexible Pricing Packages
                </h1>
            </div>

            {/* Cards */}
            <div className={`grid gap-6 mt-${isSticky ? "32" : "10"} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}>
                {pricingTiers.map((tier) => (
                    <div
                        key={tier.id}
                        className={`relative border-t-8 ${tier.accentColor} rounded-lg shadow-md p-4 flex flex-col bg-white transition-all duration-300 ${hoveredCard === tier.id ? 'bg-opacity-90' : 'bg-opacity-100'}`}
                        onMouseEnter={() => setHoveredCard(tier.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        {/* Prepaid Tag */}
                        <span className="absolute top-4 right-4 bg-gray-200 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                            Prepaid
                        </span>

                        <h3 className="text-lg font-bold mt-2">{tier.name}</h3>

                        {/* Details + Features Scroll */}
                        <div className="mt-4 flex flex-col flex-1 border rounded-md overflow-hidden">
                            
                            {/* Sticky Details */}
                            <div className="bg-white sticky top-0 z-20 border-b space-y-2 p-2">
                                <div className="flex justify-between border-b pb-1">
                                    <span>Student Limit:</span>
                                    <span>{tier.studentLimit}</span>
                                </div>
                                <div className="flex justify-between border-b pb-1">
                                    <span>Staff Limit:</span>
                                    <span>{tier.staffLimit}</span>
                                </div>
                                <div className="flex justify-between border-b pb-1">
                                    <span>Package Amount:</span>
                                    <span>{tier.price}</span>
                                </div>
                                <div className="flex justify-between border-b pb-1">
                                    <span>Duration:</span>
                                    <span>{tier.duration}</span>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="overflow-y-auto max-h-40 p-2">
                                {tier.features.map((feature) => (
                                    <div
                                        key={feature}
                                        className="py-1 text-sm text-gray-700"
                                    >
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Get Started Button */}
                        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300">
                            Get Started
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingSection;
