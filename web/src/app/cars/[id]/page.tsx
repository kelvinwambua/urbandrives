"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Skeleton } from "~/components/ui/skeleton"
import { Calendar } from "~/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Separator } from "~/components/ui/separator"
import { toast } from "sonner"
import { format } from "date-fns"
import { 
  ArrowLeft,
  Calendar as CalendarIcon, 
  Car, 
  Fuel, 
  Users, 
  MapPin, 
  Clock,
  Star,
  Shield,
  Gauge,
  Settings,
  Heart,
  Share,
  Phone,
  Mail
} from "lucide-react"
import { cn } from "~/lib/utils"
import type { DateRange } from "react-day-picker"
import Image from "next/image"


const API_BASE_URL =`${process.env.NEXT_PUBLIC_APP_URL}/api`
const APP_BASE_URL =`${process.env.NEXT_PUBLIC_API_URL}`

interface Car {
  id: number
  make: string
  model: string
  year: number
  color: string
  licensePlate: string
  dailyRate: number
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "UNAVAILABLE"
  description: string
  createdAt: string
  updatedAt: string
  imageUrl: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "RENTED":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    case "MAINTENANCE":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "UNAVAILABLE":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const carId = params?.id as string
  
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const fetchToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.status}`)
      }
      
      const tokenData = await response.json()
      return tokenData.token
    } catch (error) {
      console.error('Error fetching token:', error)
      throw error
    }
  }

  const fetchCarDetail = async () => {
    try {
      setLoading(true)
      const token = await fetchToken()
      
      const response = await fetch(`${APP_BASE_URL}/api/cars/${carId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const carData: Car = await response.json()
        setCar(carData)
      } else if (response.status === 404) {
        toast.error("Car not found")
        router.push('/cars')
      } else {
        throw new Error(`Failed to fetch car: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching car:', error)
      toast.error("Failed to load car details", {
        description: "Please try again later"
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalPrice = () => {
    if (!dateRange?.from || !dateRange?.to || !car) {
      setTotalPrice(0)
      return
    }

    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    const total = days * car.dailyRate
    setTotalPrice(total)
  }

const handleBooking = () => {
  if (!dateRange?.from || !dateRange?.to) {
    toast.error("Please select rental dates")
    return
  }

  if (car?.status !== "AVAILABLE") {
    toast.error("This car is not available for booking")
    return
  }


  const startDate = format(dateRange.from, 'yyyy-MM-dd')
  const endDate = format(dateRange.to, 'yyyy-MM-dd')
  router.push(`/booking?carId=${carId}&startDate=${startDate}&endDate=${endDate}`)
}

  useEffect(() => {
    if (carId) {
      fetchCarDetail()
    }
  }, [carId])

  useEffect(() => {
    calculateTotalPrice()
  }, [dateRange, car])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Car not found</h3>
          <p className="text-gray-600 mb-4">The car you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/cars')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cars
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/cars')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cars
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {car.make} {car.model}
              </h1>
              <p className="text-gray-600 mt-1">
                {car.year} • {car.color} • License: {car.licensePlate}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(car.status)}>
                {car.status.toLowerCase()}
              </Badge>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>


      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <Card className="overflow-hidden">
              <Image
                src={car.imageUrl}
                alt={`${car.make} ${car.model}`}
                width={800}
                height={600}
                className="w-full h-96 object-cover"
                priority
              />
            </Card>
      <Card>
              <CardHeader>
                <CardTitle>About this car</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {car.description || `Experience the perfect blend of style and performance with this ${car.year} ${car.make} ${car.model}. This ${car.color.toLowerCase()} beauty offers comfort, reliability, and efficiency for your journey.`}
                </p>
              </CardContent>
            </Card>

 
            <Card>
              <CardHeader>
                <CardTitle>Features & Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Seating</p>
                      <p className="text-sm text-gray-600">4-5 passengers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Fuel className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Transmission</p>
                      <p className="text-sm text-gray-600">Automatic</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Gauge className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Fuel Type</p>
                      <p className="text-sm text-gray-600">Gasoline</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Insurance</p>
                      <p className="text-sm text-gray-600">Included</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">AC</p>
                      <p className="text-sm text-gray-600">Available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="font-medium">Rating</p>
                      <p className="text-sm text-gray-600">4.8/5.0</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">${car.dailyRate}</CardTitle>
                    <CardDescription>per day</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-gray-500 text-sm">(24 reviews)</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
   
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select rental dates
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "MMM dd")} -{" "}
                              {format(dateRange.to, "MMM dd, yyyy")}
                            </>
                          ) : (
                            format(dateRange.from, "MMM dd, yyyy")
                          )
                        ) : (
                          <span>Pick date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

 
                {dateRange?.from && dateRange?.to && (
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>Daily rate</span>
                      <span>${car.dailyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Days ({Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))})
                      </span>
                      <span>×{Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}


                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={car.status !== "AVAILABLE" || !dateRange?.from || !dateRange?.to}
                  onClick={handleBooking}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {car.status === "AVAILABLE" ? "Book Now" : "Not Available"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Free cancellation up to 24 hours before pickup
                </p>

                <Separator />

       
                <div className="space-y-3">
                  <p className="font-medium text-gray-900">Need help?</p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Phone className="mr-2 h-4 w-4" />
                      Call us: +254740185793
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      support@urbandrives.com
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}