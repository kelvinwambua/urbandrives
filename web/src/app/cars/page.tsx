"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { Skeleton } from "~/components/ui/skeleton"
import { Calendar } from "~/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { toast } from "sonner"
import { format } from "date-fns"
import { 
  Search, 
  Calendar as CalendarIcon, 
  Car, 
  Fuel, 
  Users, 
  MapPin, 
  Clock,
  Filter,
  SortAsc,
  Eye,
  Heart,
  Star
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



export default function CarsListingPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [sortBy, setSortBy] = useState("price-low")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

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

  const fetchCars = async () => {
    try {
      setLoading(true)
      const token = await fetchToken()
      
      let url = `${API_BASE_URL}/api/cars`
      
     
      if (dateRange?.from && dateRange?.to) {
        const startDate = format(dateRange.from, 'yyyy-MM-dd')
        const endDate = format(dateRange.to, 'yyyy-MM-dd')
        url = `${APP_BASE_URL}api/cars/available/dates?startDate=${startDate}&endDate=${endDate}`
      } else {
        url = `${APP_BASE_URL}/api/cars/available`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const carsData: Car[] = await response.json()
        setCars(carsData)
        setFilteredCars(carsData)
      } else {
        throw new Error(`Failed to fetch cars: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
      toast.error("Failed to load cars", {
        description: "Please try again later"
      })
    } finally {
      setLoading(false)
    }
  }

  const searchCars = async (query: string) => {
    if (!query.trim()) {
      setFilteredCars(cars)
      return
    }

    try {
      const token = await fetchToken()
      const response = await fetch(`${API_BASE_URL}/api/cars/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const searchResults: Car[] = await response.json()
        setFilteredCars(searchResults)
      }
    } catch (error) {
      console.error('Error searching cars:', error)
     
      const filtered = cars.filter(car => 
        car.make.toLowerCase().includes(query.toLowerCase()) ||
        car.model.toLowerCase().includes(query.toLowerCase()) ||
        car.color.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredCars(filtered)
    }
  }

  const applySortAndFilter = () => {
    let filtered = [...cars]

 
    if (statusFilter !== "all") {
      filtered = filtered.filter(car => car.status === statusFilter)
    }

  
    if (searchQuery.trim()) {
      filtered = filtered.filter(car => 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.color.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }


    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.dailyRate - b.dailyRate
        case "price-high":
          return b.dailyRate - a.dailyRate
        case "year-new":
          return b.year - a.year
        case "year-old":
          return a.year - b.year
        case "make":
          return a.make.localeCompare(b.make)
        default:
          return 0
      }
    })

    setFilteredCars(filtered)
  }

  useEffect(() => {
    fetchCars()
  }, [dateRange])

  useEffect(() => {
    applySortAndFilter()
  }, [searchQuery, sortBy, statusFilter, cars])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchCars(searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50">
 
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Cars</h1>
              <p className="text-gray-600 mt-1">Find the perfect car for your journey</p>
            </div>
            

            <div className="flex flex-col sm:flex-row gap-4 lg:w-2/3">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by make, model, or color..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>
              
              <div className="flex gap-2">
       
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
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
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </div>


          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sort">Sort by</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="year-new">Year: Newest First</SelectItem>
                      <SelectItem value="year-old">Year: Oldest First</SelectItem>
                      <SelectItem value="make">Make: A to Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="RENTED">Rented</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setDateRange(undefined)
                      setSortBy("price-low")
                      setStatusFilter("all")
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <p className="text-gray-600">
          {loading ? "Loading..." : `${filteredCars.length} cars available`}
        </p>
      </div>

 
      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
                <div className="relative">
                 <Image
    width={400}
    height={300} 
    src={car.imageUrl}
    alt={`${car.make} ${car.model}`}
    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
    quality={100} 
    priority={false}
  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getStatusColor(car.status)}>
                      {car.status.toLowerCase()}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-gray-600 text-sm">{car.year} • {car.color}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${car.dailyRate}</p>
                      <p className="text-xs text-gray-500">per day</p>
                    </div>
                  </div>

                  {car.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {car.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>4 seats</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4" />
                      <span>Auto</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex gap-2">
                   <Button 
  className="flex-1" 
  disabled={car.status !== "AVAILABLE"}
  onClick={() => window.location.href = `/cars/${car.id}`}
>
  <Eye className="mr-2 h-4 w-4" />
  View Details
</Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled={car.status !== "AVAILABLE"}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}