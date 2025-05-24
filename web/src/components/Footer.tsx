import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Company Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Logo */}
                        <div className="mb-6">
                            <Image 
                                src="/Logo_With_Text.png"
                                alt="Rentcars Logo"
                                width={150}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                                <div className="text-gray-300">
                                    <p>25566 Hc 1, Glenallen,</p>
                                    <p>Alaska, 99588, USA</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <Link 
                                    href="tel:+60347842731"
                                    className="text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    +603 4784 273 12
                                </Link>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <Link 
                                    href="mailto:rentcars@gmail.com"
                                    className="text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    rentcars@gmail.com
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Our Product */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-6">Our Product</h3>
                        <div className="space-y-3">
                            {['Career', 'Car', 'Packages', 'Features', 'Priceline'].map((item) => (
                                <Link 
                                    key={item}
                                    href="#"
                                    className="block text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
                        <div className="space-y-3">
                            {['Download', 'Help Centre', 'Guides', 'Partner Network', 'Cruises', 'Developer'].map((item) => (
                                <Link 
                                    key={item}
                                    href="#"
                                    className="block text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* About Rentcars & Follow Us */}
                    <div className="space-y-8">
                        {/* About Rentcars */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-6">About Rentcars</h3>
                            <div className="space-y-3">
                                {['Why choose us', 'Our Story', 'Investor Relations', 'Press Center', 'Advertise'].map((item) => (
                                    <Link 
                                        key={item}
                                        href="#"
                                        className="block text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Follow Us */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-6">Follow Us</h3>
                            <div className="flex space-x-4">
                                <Link 
                                    href="#"
                                    className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                                >
                                    <Facebook className="w-5 h-5" />
                                </Link>
                                <Link 
                                    href="#"
                                    className="w-10 h-10 bg-gray-700 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                                >
                                    <Instagram className="w-5 h-5" />
                                </Link>
                                <Link 
                                    href="#"
                                    className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                                >
                                    <Youtube className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700">
                <div className="container mx-auto px-6 py-6">
                    <div className="text-center text-gray-400">
                        <p>Copyright 2023 • Rentcars, All Rights Reserved</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}