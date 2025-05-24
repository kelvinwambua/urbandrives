"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"
import { 
  CheckCircle,
  Calendar,
  Car,
  Mail,
  Phone,
  FileText,
  ArrowRight,
  Home
} from "lucide-react"

const API_BASE_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api`
const APP_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`

interface BookingDetails {
  id: number
  car: {
    id: number
    make: string
    model: string
    year: number
    color: string
    imageUrl: string
  }
  customerName: string
  customerEmail: string
  customerPhone: string
  startDate: string
  endDate: string
  totalAmount: number
  status: string
  notes: string
  createdAt: string
}

function BookingSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams?.get('bookingId')
  
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)

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

  const fetchBookingDetails = async () => {
    if (!bookingId) return
    
    try {
      setLoading(true)
      const token = await fetchToken()
      
      const response = await fetch(`${APP_BASE_URL}/api/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const bookingData: BookingDetails = await response.json()
        setBooking(bookingData)
      } else {
        throw new Error(`Failed to fetch booking: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
      toast.error("Failed to load booking details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!bookingId) {
      router.push('/cars')
      return
    }
    
    fetchBookingDetails()
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-pulse">
            <CheckCircle className="h-full w-full" />
          </div>
          <p className="text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Booking not found</h3>
          <Button onClick={() => router.push('/cars')}>
            <Home className="mr-2 h-4 w-4" />
            Back to Cars
          </Button>
        </div>
      </div>
    )
  }

  const days = Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Your rental has been successfully booked. We've sent a confirmation email to {booking.customerEmail}
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Booking #{booking.id}</CardTitle>
                  <CardDescription>
                    Created on {format(new Date(booking.createdAt), 'MMM dd, yyyy at h:mm a')}
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {booking.status.toLowerCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle Details
                </h3>
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={booking.car.imageUrl}
                    alt={`${booking.car.make} ${booking.car.model}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium">{booking.car.make} {booking.car.model}</h4>
                    <p className="text-sm text-gray-600">{booking.car.year} • {booking.car.color}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Rental Period
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pickup Date</p>
                    <p className="font-medium">{format(new Date(booking.startDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Return Date</p>
                    <p className="font-medium">{format(new Date(booking.endDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Total duration: {days} day{days !== 1 ? 's' : ''}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{booking.customerEmail}</span>
                  </div>
                  {booking.customerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{booking.customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {booking.notes && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Special Notes
                  </h3>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{booking.notes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">${booking.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• You'll receive a confirmation email with detailed pickup instructions</p>
                <p>• Please bring a valid driver's license and credit card for pickup</p>
                <p>• Our team will contact you 24 hours before pickup to confirm details</p>
                <p>• Free cancellation is available up to 24 hours before pickup</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => router.push('/cars')} className="flex-1">
              <Home className="mr-2 h-4 w-4" />
              Browse More Cars
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/booking/${booking.id}`)}
              className="flex-1"
            >
              View Booking Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
      <BookingSuccessContent />
    </Suspense>
  )
}