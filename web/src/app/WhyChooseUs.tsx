import Image from "next/image";
import { DollarSign, User, Clock, Headphones } from "lucide-react";

export default function WhyChooseUs() {
    const features = [
        {
            id: 1,
            title: "Best price guaranteed",
            description: "Find a lower price? We'll refund you 100% of the difference.",
            icon: <DollarSign className="w-6 h-6 text-white" />
        },
        {
            id: 2,
            title: "Experience driver",
            description: "Don't have driver? Don't worry, we have many experienced driver for you.",
            icon: <User className="w-6 h-6 text-white" />
        },
        {
            id: 3,
            title: "24 hour car delivery",
            description: "Book your car anytime and we will deliver it directly to you.",
            icon: <Clock className="w-6 h-6 text-white" />
        },
        {
            id: 4,
            title: "24/7 technical support",
            description: "Have a question? Contact Rentcars support any time when you have problem.",
            icon: <Headphones className="w-6 h-6 text-white" />
        }
    ];

    return (
        <section className="py-20 bg-white relative overflow-hidden">
     
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 transform rotate-45 rounded-3xl"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 transform rotate-12 rounded-3xl"></div>
                <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 transform -rotate-12 rounded-2xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left side - Car image */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative w-full h-96 lg:h-[500px] group">
                            {/* Decorative background circle */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full transform scale-90 group-hover:scale-95 transition-transform duration-500 opacity-50"></div>
                            <Image 
                                src="/blue-car.png"
                                alt="Blue rental car illustration"
                                fill
                                className="object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
                                priority
                            />
                        </div>
                    </div>

                    
                    <div className="order-1 lg:order-2 space-y-10">
           
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                WHY CHOOSE US
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                We offer the best experience with our rental deals
                            </h2>
                        </div>

                
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div 
                                    key={feature.id} 
                                    className="flex items-start space-x-4 group p-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                      
                                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200 shadow-lg group-hover:shadow-xl">
                                        {feature.icon}
                                    </div>
                                    
                              
                                    <div className="flex-1 space-y-2 pt-1">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    
                        <div className="pt-6">
                            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2">
                                <span>Learn More</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}