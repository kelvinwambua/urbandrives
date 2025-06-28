"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { Skeleton } from "~/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog"
import { toast } from "sonner"
import { 
 Search, 
 Car, 
 Trash2,
 Edit,
 Eye,
 Plus,
 Filter,
 MoreHorizontal,
 X,
 CheckCircle,
 XCircle,
 AlertCircle,
 Clock
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import Image from "next/image"

const API_BASE_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api`
const APP_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`

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

const getStatusIcon = (status: string) => {
 switch (status) {
   case "AVAILABLE":
     return <CheckCircle className="h-4 w-4" />
   case "RENTED":
     return <XCircle className="h-4 w-4" />
   case "MAINTENANCE":
     return <AlertCircle className="h-4 w-4" />
   case "UNAVAILABLE":
     return <X className="h-4 w-4" />
   default:
     return <Clock className="h-4 w-4" />
 }
}

export default function AdminCarsPage() {
 const [cars, setCars] = useState<Car[]>([])
 const [filteredCars, setFilteredCars] = useState<Car[]>([])
 const [loading, setLoading] = useState(true)
 const [searchQuery, setSearchQuery] = useState("")
 const [statusFilter, setStatusFilter] = useState("all")
 const [sortBy, setSortBy] = useState("id")
 const [showFilters, setShowFilters] = useState(false)
 const [deletingCarId, setDeletingCarId] = useState<number | null>(null)
 const [updatingCarId, setUpdatingCarId] = useState<number | null>(null)

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
     
     const response = await fetch(`${APP_BASE_URL}/api/cars`, {
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

 const deleteCar = async (carId: number) => {
   try {
     setDeletingCarId(carId)
     const token = await fetchToken()
     
     const response = await fetch(`${APP_BASE_URL}/api/admin/cars/${carId}`, {
       method: 'DELETE',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       },
     })

     if (response.ok) {
       setCars(cars.filter(car => car.id !== carId))
       setFilteredCars(filteredCars.filter(car => car.id !== carId))
       toast.success("Car deleted successfully")
     } else {
       throw new Error(`Failed to delete car: ${response.status}`)
     }
   } catch (error) {
     console.error('Error deleting car:', error)
     toast.error("Failed to delete car", {
       description: "Please try again later"
     })
   } finally {
     setDeletingCarId(null)
   }
 }

 const updateCarStatus = async (carId: number, newStatus: string) => {
   try {
     setUpdatingCarId(carId)
     const token = await fetchToken()
     
     const car = cars.find(c => c.id === carId)
     if (!car) return

     const updatedCar = { ...car, status: newStatus as Car['status'] }
     
     const response = await fetch(`${APP_BASE_URL}/api/admin/cars/${carId}`, {
       method: 'PUT',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(updatedCar)
     })

     if (response.ok) {
       const updatedCarData = await response.json()
       const updatedCars = cars.map(c => c.id === carId ? updatedCarData : c)
       setCars(updatedCars)
       setFilteredCars(updatedCars.filter(car => 
         (statusFilter === "all" || car.status === statusFilter) &&
         (searchQuery === "" || 
          car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()))
       ))
       toast.success(`Car status updated to ${newStatus.toLowerCase()}`)
     } else {
       throw new Error(`Failed to update car: ${response.status}`)
     }
   } catch (error) {
     console.error('Error updating car:', error)
     toast.error("Failed to update car status", {
       description: "Please try again later"
     })
   } finally {
     setUpdatingCarId(null)
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
       car.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
       car.color.toLowerCase().includes(searchQuery.toLowerCase())
     )
   }

   filtered.sort((a, b) => {
     switch (sortBy) {
       case "id":
         return b.id - a.id
       case "make":
         return a.make.localeCompare(b.make)
       case "year":
         return b.year - a.year
       case "rate":
         return b.dailyRate - a.dailyRate
       case "status":
         return a.status.localeCompare(b.status)
       default:
         return 0
     }
   })

   setFilteredCars(filtered)
 }

 useEffect(() => {
   fetchCars()
 }, [])

 useEffect(() => {
   applySortAndFilter()
 }, [searchQuery, sortBy, statusFilter, cars])

 const handleSearch = (e: React.FormEvent) => {
   e.preventDefault()
 }

 return (
   <div className="min-h-screen bg-gray-50">
     <div className="bg-white border-b">
       <div className="container mx-auto px-4 py-6">
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
           <div>
             <h1 className="text-3xl font-bold text-gray-900">Car Management</h1>
             <p className="text-gray-600 mt-1">Manage your fleet of vehicles</p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-4 lg:w-2/3">
             <form onSubmit={handleSearch} className="flex-1">
               <div className="relative">
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                 <Input
                   placeholder="Search by make, model, license plate..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10"
                 />
               </div>
             </form>
             
             <div className="flex gap-2">
               <Button
                 variant="outline"
                 onClick={() => setShowFilters(!showFilters)}
               >
                 <Filter className="mr-2 h-4 w-4" />
                 Filters
               </Button>
               
               <Button onClick={() => window.location.href = '/admin/list'}>
                 <Plus className="mr-2 h-4 w-4" />
                 Add Car
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
                     <SelectItem value="id">Newest First</SelectItem>
                     <SelectItem value="make">Make A-Z</SelectItem>
                     <SelectItem value="year">Year (Newest)</SelectItem>
                     <SelectItem value="rate">Rate (Highest)</SelectItem>
                     <SelectItem value="status">Status</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

               <div>
                 <Label htmlFor="status">Status Filter</Label>
                 <Select value={statusFilter} onValueChange={setStatusFilter}>
                   <SelectTrigger>
                     <SelectValue placeholder="Filter by status..." />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Status</SelectItem>
                     <SelectItem value="AVAILABLE">Available</SelectItem>
                     <SelectItem value="RENTED">Rented</SelectItem>
                     <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                     <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

               <div className="flex items-end">
                 <Button
                   variant="outline"
                   onClick={() => {
                     setSearchQuery("")
                     setSortBy("id")
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

     <div className="container mx-auto px-4 py-8">
       <div className="flex justify-between items-center mb-6">
         <p className="text-gray-600">
           {loading ? "Loading..." : `${filteredCars.length} cars total`}
         </p>
       </div>

       {loading ? (
         <div className="space-y-4">
           {Array.from({ length: 5 }).map((_, i) => (
             <Card key={i}>
               <CardContent className="p-6">
                 <div className="flex items-center space-x-4">
                   <Skeleton className="h-16 w-16 rounded" />
                   <div className="flex-1 space-y-2">
                     <Skeleton className="h-4 w-1/4" />
                     <Skeleton className="h-4 w-1/3" />
                   </div>
                   <Skeleton className="h-8 w-24" />
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       ) : filteredCars.length === 0 ? (
         <Card>
           <CardContent className="text-center py-12">
             <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
             <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
             <p className="text-gray-600">Try adjusting your search criteria or add a new car</p>
           </CardContent>
         </Card>
       ) : (
         <div className="space-y-4">
           {filteredCars.map((car) => (
             <Card key={car.id} className="hover:shadow-md transition-shadow">
               <CardContent className="p-6">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                     <div className="relative">
                       <Image
                         width={64}
                         height={64}
                         src={car.imageUrl}
                         alt={`${car.make} ${car.model}`}
                         className="w-16 h-16 object-cover rounded-lg"
                       />
                     </div>
                     
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-3 mb-1">
                         <h3 className="text-lg font-semibold text-gray-900">
                           {car.make} {car.model} ({car.year})
                         </h3>
                         <Badge className={getStatusColor(car.status)}>
                           <span className="flex items-center gap-1">
                             {getStatusIcon(car.status)}
                             {car.status.toLowerCase()}
                           </span>
                         </Badge>
                       </div>
                       <div className="flex items-center gap-4 text-sm text-gray-600">
                         <span>License: {car.licensePlate}</span>
                         <span>Color: {car.color}</span>
                         <span className="font-medium">${car.dailyRate}/day</span>
                       </div>
                       {car.description && (
                         <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                           {car.description}
                         </p>
                       )}
                     </div>
                   </div>

                   <div className="flex items-center gap-2">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => window.location.href = `/cars/${car.id}`}
                     >
                       <Eye className="mr-2 h-4 w-4" />
                       View
                     </Button>

                    

                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button
                           variant="outline"
                           size="sm"
                           disabled={updatingCarId === car.id}
                         >
                           <MoreHorizontal className="h-4 w-4" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem
                           onClick={() => updateCarStatus(car.id, "AVAILABLE")}
                           disabled={car.status === "AVAILABLE" || car.status === "RENTED"}
                         >
                           <CheckCircle className="mr-2 h-4 w-4" />
                           Mark Available
                         </DropdownMenuItem>
                         <DropdownMenuItem
                           onClick={() => updateCarStatus(car.id, "MAINTENANCE")}
                           disabled={car.status === "MAINTENANCE" || car.status === "RENTED"}
                         >
                           <AlertCircle className="mr-2 h-4 w-4" />
                           Mark Maintenance
                         </DropdownMenuItem>
                         <DropdownMenuItem
                           onClick={() => updateCarStatus(car.id, "UNAVAILABLE")}
                           disabled={car.status === "UNAVAILABLE" || car.status === "RENTED"}
                         >
                           <X className="mr-2 h-4 w-4" />
                           Mark Unavailable
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>

                     <AlertDialog>
                       <AlertDialogTrigger asChild>
                         <Button
                           variant="destructive"
                           size="sm"
                           disabled={deletingCarId === car.id || car.status === "RENTED"}
                         >
                           <Trash2 className="mr-2 h-4 w-4" />
                           Delete
                         </Button>
                       </AlertDialogTrigger>
                       <AlertDialogContent>
                         <AlertDialogHeader>
                           <AlertDialogTitle>Delete Car</AlertDialogTitle>
                           <AlertDialogDescription>
                             Are you sure you want to delete {car.make} {car.model} ({car.licensePlate})? 
                             This action cannot be undone.
                           </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                           <AlertDialogCancel>Cancel</AlertDialogCancel>
                           <AlertDialogAction
                             onClick={() => deleteCar(car.id)}
                             className="bg-red-600 hover:bg-red-700"
                           >
                             Delete Car
                           </AlertDialogAction>
                         </AlertDialogFooter>
                       </AlertDialogContent>
                     </AlertDialog>
                   </div>
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