"use client"

import Image from "next/image"

export default function Header() {
    return (
        <header className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
            {/* Background geometric shapes */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200 rounded-full transform translate-x-1/2"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-300 rounded-full"></div>
            </div>

            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
                    {/* Left content */}
                    <div className="space-y-6">
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Find, book and rent a car{" "}
                            <span className="text-blue-600 relative">
                                Easily
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 rounded"></div>
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Get a car wherever and whenever you need it with your browser!
                        </p>
                    </div>

                    {/* Right content - Hero image */}
                    <div className="relative h-96 lg:h-[500px]">
                        <Image 
                            src="/hero.png" // Make sure your image has the correct extension
                            alt="Hero image showing cars and road"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Search section */}
                <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        {/* Location */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 font-medium">
                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Location
                            </label>
                            <input 
                                type="text" 
                                placeholder="Search your location"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Pickup date */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 font-medium">
                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Pickup date
                            </label>
                            <input 
                                type="datetime-local"
                                defaultValue="2024-02-15T09:00"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Return date */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 font-medium">
                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Return date
                            </label>
                            <input 
                                type="datetime-local"
                                defaultValue="2024-02-16T11:00"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Search button */}
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}