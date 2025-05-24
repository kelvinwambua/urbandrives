"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { toast } from "sonner"
import { format } from "date-fns"
import { 
  ArrowLeft,
  Car, 
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  CreditCard,
  CheckCircle
} from "lucide-react"



const API_BASE_URL =`${process.env.NEXT_PUBLIC_APP_URL}/api`
const APP_BASE_URL =`${process.env.NEXT_PUBLIC_API_URL}`

interface Car {
  id: number
  make: string
  model: string
  year: number
  color: string
  dailyRate: number
  imageUrl: string
}

interface BookingFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
}

 function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const carId = searchParams?.get('carId')
  const startDate = searchParams?.get('startDate')
  const endDate = searchParams?.get('endDate')
  
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  })

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
      } else {
        throw new Error(`Failed to fetch car: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching car:', error)
      toast.error("Failed to load car details")
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !car) return 0
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return days * car.dailyRate
  }

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!carId || !startDate || !endDate) {
      toast.error("Missing booking information")
      return
    }

    if (!formData.customerName || !formData.customerEmail) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      const token = await fetchToken()

      const bookingData = {
        carId: parseInt(carId),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        startDate: startDate,
        endDate: endDate,
        notes: formData.notes
      }

      const response = await fetch(`${APP_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      if (response.ok) {
        const booking = await response.json()
        toast.success("Booking created successfully!", {
          description: "You will receive a confirmation email shortly."
        })
    
        router.push(`/booking-success?bookingId=${booking.id}`)
      } else {
        const errorData = await response.json()
        toast.error("Failed to create booking", {
          description: errorData.error || "Please try again later"
        })
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error("Failed to create booking", {
        description: "Please try again later"
      })
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!carId || !startDate || !endDate) {
      toast.error("Missing booking information")
      router.push('/cars')
      return
    }
    
    fetchCarDetail()
  }, [carId, startDate, endDate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-pulse" />
          <p className="text-gray-600">Loading booking details...</p>
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
          <Button onClick={() => router.push('/cars')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cars
          </Button>
        </div>
      </div>
    )
  }

  const totalPrice = calculateTotalPrice()
  const days = startDate && endDate ? 
    Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0

  return (
    <div className="min-h-screen bg-gray-50">
  
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/cars/${carId}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Car Details
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 mt-1">
            {car.make} {car.model} ({car.year})
          </p>
        </div>
      </div>

       <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                  <CardDescription>
                    Please provide your contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerEmail">Email Address *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Additional Notes
                  </CardTitle>
                  <CardDescription>
                    Any special requests or additional information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special requests, pickup location preferences, etc."
                    rows={4}
                  />
                </CardContent>
              </Card>


              <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </form>
          </div>

   
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
         
                <div className="flex gap-3">
                  <img
                    src={car.imageUrl}
                    alt={`${car.make} ${car.model}`}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium">{car.make} {car.model}</h3>
                    <p className="text-sm text-gray-600">{car.year} • {car.color}</p>
                  </div>
                </div>

                <Separator />

    
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Rental Period</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Start: {startDate ? format(new Date(startDate), 'MMM dd, yyyy') : 'N/A'}</p>
                    <p>End: {endDate ? format(new Date(endDate), 'MMM dd, yyyy') : 'N/A'}</p>
                    <p>Duration: {days} day{days !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <Separator />

     
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Daily rate</span>
                    <span>${car.dailyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days ({days})</span>
                    <span>×{days}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-1">Important Notes:</p>
                  <ul className="space-y-1">
                    <li>• Payment will be processed upon confirmation</li>
                    <li>• Free cancellation up to 24 hours before pickup</li>
                    <li>• Valid driver's license required</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-pulse">
            <CheckCircle className="h-full w-full" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BookingPage />
    </Suspense>
  )
}