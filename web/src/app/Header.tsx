"use client"

import Image from "next/image"
import { useState } from "react"
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from "~/components/ui/popover"
import { useRouter } from "next/navigation"

export default function Header() {
    const router = useRouter()
   const [searchData, setSearchData] = useState({
       location: '',
       pickupDate: undefined as Date | undefined,
       returnDate: undefined as Date | undefined
   })

   const handleInputChange = (field: string, value: string | Date | undefined) => {
       setSearchData(prev => ({
           ...prev,
           [field]: value
       }))
   }

   const handleSearch = () => {
    router.push("/cars")
       
   }

   const getDefaultDates = () => {
       const today = new Date()
       const pickup = new Date(today)
       pickup.setDate(today.getDate() + 1)
       pickup.setHours(9, 0)
       
       const returnDate = new Date(today)
       returnDate.setDate(today.getDate() + 2)
       returnDate.setHours(11, 0)

       return {
           pickup: pickup,
           return: returnDate
       }
   }

   const defaultDates = getDefaultDates()

   React.useEffect(() => {
       setSearchData(prev => ({
           ...prev,
           pickupDate: defaultDates.pickup,
           returnDate: defaultDates.return
       }))
   }, [])

   return (
       <header className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
           <div className="absolute inset-0 opacity-20">
               <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full transform translate-x-1/2 animate-pulse"></div>
               <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full animate-bounce" style={{ animationDuration: '6s' }}></div>
               <div className="absolute top-1/2 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-60"></div>
           </div>

           <div className="container mx-auto px-6 py-20 relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
                   <div className="space-y-8">
                       <div className="space-y-4">
                           <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                               ✨ #1 Car Rental Platform
                           </div>
                           <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                               Find, book and rent a car{" "}
                               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                                   Easily
                                   <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded animate-pulse"></div>
                               </span>
                           </h1>
                           <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                               Get a car wherever and whenever you need it with your browser! 
                               Premium vehicles, instant booking, and 24/7 support.
                           </p>
                       </div>

                       <div className="flex items-center space-x-8 pt-4">
                           <div className="flex items-center space-x-2">
                               <div className="flex -space-x-2">
                                   {[1,2,3,4].map(i => (
                                       <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full border-2 border-white"></div>
                                   ))}
                               </div>
                               <span className="text-sm text-gray-600 font-medium">10k+ happy customers</span>
                           </div>
                           <div className="flex items-center space-x-1">
                               {[1,2,3,4,5].map(i => (
                                   <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                   </svg>
                               ))}
                               <span className="text-sm text-gray-600 ml-2">4.9/5 rating</span>
                           </div>
                       </div>
                   </div>

                   <div className="relative h-96 lg:h-[500px] group">
                       <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                       <Image 
                           src="/hero.png"
                           alt="Premium car rental service showcase"
                           fill
                           className="object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
                           priority
                       />
                   </div>
               </div>

               <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-100/50">
                   <div className="mb-6">
                       <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Perfect Ride</h3>
                       <p className="text-gray-600">Choose your pickup location and dates to get started</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                       <div className="space-y-2">
                           <label className="flex items-center text-gray-700 font-medium text-sm">
                               <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                               </svg>
                               Pickup Location
                           </label>
                           <div className="relative">
                               <input 
                                   type="text" 
                                   placeholder="Nairobi, Kenya"
                                   value={searchData.location}
                                   onChange={(e) => handleInputChange('location', e.target.value)}
                                   className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-300"
                               />
                               <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                               </svg>
                           </div>
                       </div>

                       <div className="space-y-2">
                           <label className="flex items-center text-gray-700 font-medium text-sm">
                               <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                               </svg>
                               Pickup Date 
                           </label>
                           <Popover>
                               <PopoverTrigger asChild>
                                   <Button
                                       variant={"outline"}
                                       className={cn(
                                           "w-full p-4 h-auto justify-start text-left font-normal border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                           !searchData.pickupDate && "text-muted-foreground"
                                       )}
                                   >
                                       <CalendarIcon className="mr-2 h-4 w-4" />
                                       {searchData.pickupDate ? format(searchData.pickupDate, "PPP") : <span>Pick a date</span>}
                                   </Button>
                               </PopoverTrigger>
                               <PopoverContent className="w-auto p-0" align="start">
                                   <Calendar
                                       mode="single"
                                       selected={searchData.pickupDate}
                                       onSelect={(date) => handleInputChange('pickupDate', date)}
                                       initialFocus
                                   />
                               </PopoverContent>
                           </Popover>
                       </div>

                       <div className="space-y-2">
                           <label className="flex items-center text-gray-700 font-medium text-sm">
                               <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                               </svg>
                               Return Date
                           </label>
                           <Popover>
                               <PopoverTrigger asChild>
                                   <Button
                                       variant={"outline"}
                                       className={cn(
                                           "w-full p-4 h-auto justify-start text-left font-normal border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                           !searchData.returnDate && "text-muted-foreground"
                                       )}
                                   >
                                       <CalendarIcon className="mr-2 h-4 w-4" />
                                       {searchData.returnDate ? format(searchData.returnDate, "PPP") : <span>Pick a date</span>}
                                   </Button>
                               </PopoverTrigger>
                               <PopoverContent className="w-auto p-0" align="start">
                                   <Calendar
                                       mode="single"
                                       selected={searchData.returnDate}
                                       onSelect={(date) => handleInputChange('returnDate', date)}
                                       initialFocus
                                   />
                               </PopoverContent>
                           </Popover>
                       </div>

                       <button 
                           onClick={handleSearch}
                           className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 group"
                       >
                           <span>Search Cars</span>
                           <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                           </svg>
                       </button>
                   </div>

                   <div className="mt-6 pt-6 border-t border-gray-100">
                       <div className="flex flex-wrap gap-3">
                           <span className="text-sm text-gray-600 font-medium">Popular filters:</span>
                           {['Economy', 'SUV', 'Luxury', 'Electric'].map(filter => (
                               <button key={filter} className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm font-medium transition-colors duration-200">
                                   {filter}
                               </button>
                           ))}
                       </div>
                   </div>
               </div>
           </div>
       </header>
   )
}