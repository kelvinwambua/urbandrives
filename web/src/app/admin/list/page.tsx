"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { toast } from "sonner"
import { 
  Upload,
  X,
  Camera,
  Car,
  DollarSign,
  Calendar,
  Palette,
  FileText,
  ArrowLeft,
  Check,
  AlertCircle,
  ImageIcon
} from "lucide-react"
import Image from "next/image"

const API_BASE_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api`
const APP_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`

interface CarFormData {
  make: string
  model: string
  year: number | string
  color: string
  licensePlate: string
  dailyRate: number | string
  description: string
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

const popularMakes = [
  "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes-Benz", 
  "Audi", "Volkswagen", "Hyundai", "Kia", "Mazda", "Subaru", "Lexus", 
  "Infiniti", "Acura", "Jeep", "Ram", "GMC", "Cadillac"
]

const colors = [
  "White", "Black", "Silver", "Gray", "Red", "Blue", "Green", "Yellow", 
  "Orange", "Purple", "Brown", "Gold", "Beige", "Pink"
]

export default function UploadCarPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<CarFormData>({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    dailyRate: "",
    description: ""
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Partial<CarFormData>>({})

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

  const handleInputChange = (field: keyof CarFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size too large", {
          description: "Please select an image smaller than 10MB"
        })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type", {
          description: "Please select an image file"
        })
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const removeImage = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CarFormData> = {}

    if (!formData.make.trim()) newErrors.make = "Make is required"
    if (!formData.model.trim()) newErrors.model = "Model is required"
    if (!formData.year) newErrors.year = "Year is required"
    if (!formData.color) newErrors.color = "Color is required"
    if (!formData.licensePlate.trim()) newErrors.licensePlate = "License plate is required"
    if (!formData.dailyRate) newErrors.dailyRate = "Daily rate is required"
    else if (Number(formData.dailyRate) <= 0) newErrors.dailyRate = "Daily rate must be greater than 0"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsUploading(true)

    try {
      const token = await fetchToken()
      
      const formDataToSend = new FormData()
      formDataToSend.append('make', formData.make.trim())
      formDataToSend.append('model', formData.model.trim())
      formDataToSend.append('year', formData.year.toString())
      formDataToSend.append('color', formData.color)
      formDataToSend.append('licensePlate', formData.licensePlate.trim().toUpperCase())
      formDataToSend.append('dailyRate', formData.dailyRate.toString())
      
      if (formData.description.trim()) {
        formDataToSend.append('description', formData.description.trim())
      }
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile)
      }

      const response = await fetch(`${APP_BASE_URL}/api/cars/with-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (response.ok) {
        const newCar = await response.json()
        toast.success("Car uploaded successfully!", {
          description: `${newCar.make} ${newCar.model} has been added to your fleet`
        })
        router.push(`/cars/${newCar.id}`)
      } else {
        throw new Error(`Failed to upload car: ${response.status}`)
      }
    } catch (error) {
      console.error('Error uploading car:', error)
      toast.error("Failed to upload car", {
        description: "Please try again later"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/cars')}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cars
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload New Car</h1>
              <p className="text-gray-600 mt-1">Add a new vehicle to your fleet</p>
            </div>
          </div>
        </div>
      </div>


      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
    
            <div className="lg:col-span-1">
              <Card className="h-fit sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Car Image
                  </CardTitle>
                  <CardDescription>
                    Upload a high-quality image of your car
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {previewUrl ? (
                    <div className="relative group">
                      <Image
                        src={previewUrl}
                        alt="Car preview"
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={removeImage}
                          className="bg-white text-gray-900 hover:bg-gray-100"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload car image</p>
                      <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {!previewUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Image
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>


            <div className="lg:col-span-2 space-y-6">
              

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Enter the basic details about your car
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   
                    <div>
                      <Label htmlFor="make" className="text-sm font-medium">
                        Make *
                      </Label>
                      <Select 
                        value={formData.make} 
                        onValueChange={(value) => handleInputChange('make', value)}
                      >
                        <SelectTrigger className={errors.make ? "border-red-300" : ""}>
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularMakes.map((make) => (
                            <SelectItem key={make} value={make}>
                              {make}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.make && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.make}
                        </p>
                      )}
                    </div>

      
                    <div>
                      <Label htmlFor="model" className="text-sm font-medium">
                        Model *
                      </Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        placeholder="e.g., Camry, Civic, F-150"
                        className={errors.model ? "border-red-300" : ""}
                      />
                      {errors.model && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.model}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
                    <div>
                      <Label htmlFor="year" className="text-sm font-medium">
                        Year *
                      </Label>
                      <Select 
                        value={formData.year.toString()} 
                        onValueChange={(value) => handleInputChange('year', parseInt(value))}
                      >
                        <SelectTrigger className={errors.year ? "border-red-300" : ""}>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.year && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.year}
                        </p>
                      )}
                    </div>

       
                    <div>
                      <Label htmlFor="color" className="text-sm font-medium">
                        Color *
                      </Label>
                      <Select 
                        value={formData.color} 
                        onValueChange={(value) => handleInputChange('color', value)}
                      >
                        <SelectTrigger className={errors.color ? "border-red-300" : ""}>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color} value={color}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color.toLowerCase() }}
                                />
                                {color}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.color && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.color}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

   
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Registration & Pricing
                  </CardTitle>
                  <CardDescription>
                    Set the rental rate and license information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
                    <div>
                      <Label htmlFor="licensePlate" className="text-sm font-medium">
                        License Plate *
                      </Label>
                      <Input
                        id="licensePlate"
                        value={formData.licensePlate}
                        onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
                        placeholder="e.g., ABC-123"
                        className={errors.licensePlate ? "border-red-300" : ""}
                      />
                      {errors.licensePlate && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.licensePlate}
                        </p>
                      )}
                    </div>

           
                    <div>
                      <Label htmlFor="dailyRate" className="text-sm font-medium">
                        Daily Rate (KES) *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="dailyRate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.dailyRate}
                          onChange={(e) => handleInputChange('dailyRate', parseFloat(e.target.value) || '')}
                          placeholder="0.00"
                          className={`pl-9 ${errors.dailyRate ? "border-red-300" : ""}`}
                        />
                      </div>
                      {errors.dailyRate && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.dailyRate}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

        
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Description
                  </CardTitle>
                  <CardDescription>
                    Provide additional details about your car
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your car's features, condition, and any special notes for renters..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.description.length}/500 characters (optional)
                  </p>
                </CardContent>
              </Card>

          
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Uploading Car...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Upload Car
                      </>
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    By uploading, you agree to our terms of service and privacy policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}