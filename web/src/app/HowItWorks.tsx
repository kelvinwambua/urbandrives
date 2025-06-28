import Link from "next/link";
import Header from "./Header";
import { MapPin, Calendar, Car } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            icon: <MapPin className="w-8 h-8 text-white" />,
            title: "Choose location",
            description: "Choose your and find your best car"
        },
        {
            id: 2,
            icon: <Calendar className="w-8 h-8 text-white" />,
            title: "Pick-up date",
            description: "Select your pick up date and time to book your car"
        },
        {
            id: 3,
            icon: <Car className="w-8 h-8 text-white" />,
            title: "Book your car",
            description: "Book your car and we will deliver it directly to you"
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
              s
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                        HOW IT WORKS
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Rent with following 3 working steps
                    </h2>
                </div>

           
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <div key={step.id} className="text-center group">
                        
                            <div className="relative mb-8">
                                <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors duration-300 shadow-lg">
                                    {step.icon}
                                </div>
                         
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-200 z-0" style={{ transform: 'translateX(50%)' }}>
                                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

