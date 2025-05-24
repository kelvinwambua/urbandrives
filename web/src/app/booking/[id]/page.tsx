"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
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
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Edit,
  Trash2,
  Download
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

interface BookingDetails {
  id: number
  car: Car
  customerName: string
  customerEmail: string
  customerPhone?: string
  startDate: string
  endDate: string
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  PENDING: { 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    icon: AlertCircle,
    label: 'Pending'
  },
  CONFIRMED: { 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: CheckCircle,
    label: 'Confirmed'
  },
  ACTIVE: { 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: CheckCircle,
    label: 'Active'
  },
  COMPLETED: { 
    color: 'bg-gray-100 text-gray-800 border-gray-200', 
    icon: CheckCircle,
    label: 'Completed'
  },
  CANCELLED: { 
    color: 'bg-red-100 text-red-800 border-red-200', 
    icon: XCircle,
    label: 'Cancelled'
  }
}

export default function BookingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params?.id as string
  
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

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
      } else if (response.status === 404) {
        toast.error("Booking not found")
        router.push('/booking')
      } else {
        throw new Error(`Failed to fetch booking: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
      toast.error("Failed to load booking details")
      router.push('/booking')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!booking || !window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      setUpdating(true)
      const token = await fetchToken()

      const response = await fetch(`${APP_BASE_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success("Booking cancelled successfully")
        fetchBookingDetails() // Refresh the data
      } else {
        const errorData = await response.json()
        toast.error("Failed to cancel booking", {
          description: errorData.error || "Please try again later"
        })
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error("Failed to cancel booking")
    } finally {
      setUpdating(false)
    }
  }

  const calculateDays = () => {
    if (!booking) return 0
    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const canCancelBooking = () => {
    return booking && ['PENDING', 'CONFIRMED'].includes(booking.status)
  }

  useEffect(() => {
    if (!bookingId) {
      router.push('/booking')
      return
    }
    
    fetchBookingDetails()
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
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
          <Button onClick={() => router.push('/booking')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </div>
      </div>
    )
  }

  const StatusIcon = statusConfig[booking.status].icon
  const days = calculateDays()

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/booking')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Booking #{booking.id}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={`${statusConfig[booking.status].color} font-medium`}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {statusConfig[booking.status].label}
                </Badge>
                <span className="text-sm text-gray-500">
                  Created {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              {canCancelBooking() && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleCancelBooking}
                  disabled={updating}
                >
                  {updating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

     
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
          <div className="lg:col-span-2 space-y-6">
      
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={booking.car.imageUrl}
                    alt={`${booking.car.make} ${booking.car.model}`}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.car.make} {booking.car.model}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-gray-500">Year:</span>
                        <span className="ml-2 font-medium">{booking.car.year}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Color:</span>
                        <span className="ml-2 font-medium">{booking.car.color}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Daily Rate:</span>
                        <span className="ml-2 font-medium">${booking.car.dailyRate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Rental Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pickup Date</label>
                      <p className="text-lg font-semibold">
                        {format(new Date(booking.startDate), 'EEEE, MMMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Return Date</label>
                      <p className="text-lg font-semibold">
                        {format(new Date(booking.endDate), 'EEEE, MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-lg font-semibold">
                        {days} day{days !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="text-2xl font-bold text-green-600">
                        ${booking.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="font-semibold">{booking.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="font-semibold">{booking.customerEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {booking.customerPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="font-semibold">{booking.customerPhone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

   
            {booking.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{booking.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

      
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
   
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily Rate</span>
                      <span className="font-medium">${booking.car.dailyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{days} day{days !== 1 ? 's' : ''}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount</span>
                      <span className="text-green-600">${booking.totalAmount}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Booking ID</span>
                      <span className="font-mono">#{booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <Badge className={`${statusConfig[booking.status].color} text-xs`}>
                        {statusConfig[booking.status].label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Updated</span>
                      <span>{format(new Date(booking.updatedAt), 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

        
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(`mailto:${booking.customerEmail}`, '_blank')}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email Customer
                  </Button>
                  
                  {booking.customerPhone && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open(`tel:${booking.customerPhone}`, '_blank')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Customer
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push(`/cars/${booking.car.id}`)}
                  >
                    <Car className="mr-2 h-4 w-4" />
                    View Vehicle
                  </Button>
                </CardContent>
              </Card>

        
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">Important Notes</p>
                      <ul className="text-blue-700 space-y-1">
                        <li>• Valid driver's license required at pickup</li>
                        <li>• Vehicle inspection will be conducted</li>
                        <li>• Fuel tank should be returned at same level</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}