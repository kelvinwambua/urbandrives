"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Badge } from "~/components/ui/badge"
import { Calendar } from "~/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { toast } from "sonner"
import { format } from "date-fns"
import { 
  FileText,
  Download,
  Calendar as CalendarIcon,
  TrendingUp,
  Car,
  Users,
  DollarSign,
  BarChart3,
  FileSpreadsheet,
  Eye,
  Loader2
} from "lucide-react"
import { cn } from "~/lib/utils"

const API_BASE_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api`
const APP_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`

interface SalesReportDTO {
  id: number
  customerName: string
  customerEmail: string
  carMake: string
  carModel: string
  carYear: number
  startDate: string
  endDate: string
  totalAmount: number
  status: string
}

interface SalesReportSummaryDTO {
  totalBookings: number
  totalRevenue: number
  averageBookingValue: number
  totalDays: number
}

interface MonthlyData {
  month: string
  year: number
  bookings: number
  revenue: number
}

interface CarPerformanceData {
 make: string
 model: string
 totalBookings: number
 totalRevenue: number
 averageRevenue: number
 totalDays: number
}

interface CustomerAnalysisData {
 customerName: string
 customerEmail: string
 totalBookings: number
 totalSpent: number
 averageSpent: number
 firstBookingDate: string
 lastBookingDate: string
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [salesData, setSalesData] = useState<SalesReportDTO[]>([])
  const [summaryData, setSummaryData] = useState<SalesReportSummaryDTO | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [carPerformanceData, setCarPerformanceData] = useState<CarPerformanceData[]>([])
  const [customerAnalysisData, setCustomerAnalysisData] = useState<CustomerAnalysisData[]>([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState("sales")

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

  const fetchSalesReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates")
      return
    }

    try {
      setLoading(true)
      const token = await fetchToken()
      
      const startDateStr = format(startDate, 'yyyy-MM-dd')
      const endDateStr = format(endDate, 'yyyy-MM-dd')
      
      const salesResponse = await fetch(
        `${APP_BASE_URL}/api/admin/reports/sales?startDate=${startDateStr}&endDate=${endDateStr}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const summaryResponse = await fetch(
        `${APP_BASE_URL}/api/admin/reports/sales/summary?startDate=${startDateStr}&endDate=${endDateStr}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (salesResponse.ok && summaryResponse.ok) {
        const sales = await salesResponse.json()
        const summary = await summaryResponse.json()
        setSalesData(sales)
        setSummaryData(summary)
        toast.success("Sales report loaded successfully")
      } else {
        throw new Error("Failed to fetch sales data")
      }
    } catch (error) {
      console.error('Error fetching sales report:', error)
      toast.error("Failed to load sales report")
    } finally {
      setLoading(false)
    }
  }

  const fetchMonthlyData = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates")
      return
    }

    try {
      setLoading(true)
      const token = await fetchToken()
      
      const startDateStr = format(startDate, 'yyyy-MM-dd')
      const endDateStr = format(endDate, 'yyyy-MM-dd')
      
      const response = await fetch(
        `${APP_BASE_URL}/api/admin/reports/monthly-summary?startDate=${startDateStr}&endDate=${endDateStr}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        const formattedData = data.map((item: any[]) => ({
          month: format(new Date(item[0], item[1] - 1), 'MMM'),
          year: item[0],
          bookings: item[2],
          revenue: item[3]
        }))
        setMonthlyData(formattedData)
        toast.success("Monthly data loaded successfully")
      } else {
        throw new Error("Failed to fetch monthly data")
      }
    } catch (error) {
      console.error('Error fetching monthly data:', error)
      toast.error("Failed to load monthly data")
    } finally {
      setLoading(false)
    }
  }

  const fetchCarPerformance = async () => {
 if (!startDate || !endDate) {
   toast.error("Please select both start and end dates")
   return
 }

 try {
   setLoading(true)
   const token = await fetchToken()
   
   const startDateStr = format(startDate, 'yyyy-MM-dd')
   const endDateStr = format(endDate, 'yyyy-MM-dd')
   
   const response = await fetch(
     `${APP_BASE_URL}/api/admin/reports/car-performance?startDate=${startDateStr}&endDate=${endDateStr}`,
     {
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       },
     }
   )

   if (response.ok) {
     const data = await response.json()
     const formattedData = data.map((item: any[]) => ({
       make: item[0].split(' ')[0],
       model: item[0].split(' ').slice(1).join(' '),
       totalBookings: item[1],
       totalRevenue: item[2],
       averageRevenue: item[3],
       totalDays: item[4]
     }))
     setCarPerformanceData(formattedData)
     toast.success("Car performance data loaded successfully")
   } else {
     throw new Error("Failed to fetch car performance data")
   }
 } catch (error) {
   console.error('Error fetching car performance:', error)
   toast.error("Failed to load car performance data")
 } finally {
   setLoading(false)
 }
}

const fetchCustomerAnalysis = async () => {
 if (!startDate || !endDate) {
   toast.error("Please select both start and end dates")
   return
 }

 try {
   setLoading(true)
   const token = await fetchToken()
   
   const startDateStr = format(startDate, 'yyyy-MM-dd')
   const endDateStr = format(endDate, 'yyyy-MM-dd')
   
   const response = await fetch(
     `${APP_BASE_URL}/api/admin/reports/customer-analysis?startDate=${startDateStr}&endDate=${endDateStr}`,
     {
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       },
     }
   )

   if (response.ok) {
     const data = await response.json()
     const formattedData = data.map((item: any[]) => ({
       customerName: item[0],
       customerEmail: item[1],
       totalBookings: item[2],
       totalSpent: item[3],
       averageSpent: item[4],
       firstBookingDate: item[5],
       lastBookingDate: item[6]
     }))
     setCustomerAnalysisData(formattedData)
     toast.success("Customer analysis loaded successfully")
   } else {
     throw new Error("Failed to fetch customer analysis")
   }
 } catch (error) {
   console.error('Error fetching customer analysis:', error)
   toast.error("Failed to load customer analysis")
 } finally {
   setLoading(false)
 }
}


  const downloadPDF = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates")
      return
    }

    try {
      setDownloading(true)
      const token = await fetchToken()
      
      const startDateStr = format(startDate, 'yyyy-MM-dd')
      const endDateStr = format(endDate, 'yyyy-MM-dd')
      
      const response = await fetch(
        `${APP_BASE_URL}/api/admin/reports/sales/pdf?startDate=${startDateStr}&endDate=${endDateStr}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `sales-report-${startDateStr}-to-${endDateStr}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success("PDF downloaded successfully")
      } else {
        throw new Error("Failed to download PDF")
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error("Failed to download PDF")
    } finally {
      setDownloading(false)
    }
  }

  const downloadExcel = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates")
      return
    }

    try {
      setDownloading(true)
      const token = await fetchToken()
      
      const startDateStr = format(startDate, 'yyyy-MM-dd')
      const endDateStr = format(endDate, 'yyyy-MM-dd')
      
      const response = await fetch(
        `${APP_BASE_URL}/api/admin/reports/sales/excel?startDate=${startDateStr}&endDate=${endDateStr}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `sales-report-${startDateStr}-to-${endDateStr}.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success("Excel file downloaded successfully")
      } else {
        throw new Error("Failed to download Excel")
      }
    } catch (error) {
      console.error('Error downloading Excel:', error)
      toast.error("Failed to download Excel file")
    } finally {
      setDownloading(false)
    }
  }

  const downloadLastMonthPDF = async () => {
    try {
      setDownloading(true)
      const token = await fetchToken()
      
      const response = await fetch(
        `${APP_BASE_URL}/api/admin/reports/sales/last-month/pdf`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `last-month-sales-report.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success("Last month PDF downloaded successfully")
      } else {
        throw new Error("Failed to download last month PDF")
      }
    } catch (error) {
      console.error('Error downloading last month PDF:', error)
      toast.error("Failed to download last month PDF")
    } finally {
      setDownloading(false)
    }
  }

  const downloadLastMonthExcel = async () => {
    try {
      setDownloading(true)
      const token = await fetchToken()
      
      const response = await fetch(
        `${APP_BASE_URL}/api/admin/reports/sales/last-month/excel`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `last-month-sales-report.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success("Last month Excel downloaded successfully")
      } else {
        throw new Error("Failed to download last month Excel")
      }
    } catch (error) {
      console.error('Error downloading last month Excel:', error)
      toast.error("Failed to download last month Excel")
    } finally {
      setDownloading(false)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    switch (tab) {
      case "sales":
        if (startDate && endDate) fetchSalesReport()
        break
      case "monthly":
        if (startDate && endDate) fetchMonthlyData()
        break
      case "cars":
        if (startDate && endDate) fetchCarPerformance()
        break
      case "customers":
        if (startDate && endDate) fetchCustomerAnalysis()
        break
    }
  }

  const setDateRange = (range: "today" | "7days" | "30days" | "90days") => {
    const today = new Date()
    const end = new Date(today)
    let start = new Date(today)
    
    switch (range) {
      case "today":
        start = new Date(today)
        break
      case "7days":
        start.setDate(today.getDate() - 7)
        break
      case "30days":
        start.setDate(today.getDate() - 30)
        break
      case "90days":
        start.setDate(today.getDate() - 90)
        break
    }
    
    setStartDate(start)
    setEndDate(end)
  }

  useEffect(() => {
    const today = new Date()
    const oneMonthAgo = new Date(today)
    oneMonthAgo.setDate(today.getDate() - 30)
    
    setStartDate(oneMonthAgo)
    setEndDate(today)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Generate comprehensive reports and analyze your business performance
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
   <Card className="lg:col-span-3">
     <CardContent className="p-6">
       <div className="flex items-center gap-3">
         <div className="p-2 bg-blue-100 rounded-lg">
           <CalendarIcon className="h-5 w-5 text-blue-600" />
         </div>
         <div className="flex-1">
           <Label className="text-sm font-medium">Start Date</Label>
           <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
             <PopoverTrigger asChild>
               <Button
                 variant="outline"
                 className={cn(
                   "w-full justify-start text-left font-normal mt-1",
                   !startDate && "text-muted-foreground"
                 )}
               >
                 <CalendarIcon className="mr-2 h-4 w-4" />
                 {startDate ? format(startDate, "PPP") : "Pick a date"}
               </Button>
             </PopoverTrigger>
             <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                 mode="single"
                 selected={startDate}
                 onSelect={(date) => {
                   setStartDate(date)
                   setStartDateOpen(false)
                 }}
                 initialFocus
               />
             </PopoverContent>
           </Popover>
         </div>
       </div>
     </CardContent>
   </Card>

   <Card className="lg:col-span-3">
     <CardContent className="p-6">
       <div className="flex items-center gap-3">
         <div className="p-2 bg-green-100 rounded-lg">
           <CalendarIcon className="h-5 w-5 text-green-600" />
         </div>
         <div className="flex-1">
           <Label className="text-sm font-medium">End Date</Label>
           <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
             <PopoverTrigger asChild>
               <Button
                 variant="outline"
                 className={cn(
                   "w-full justify-start text-left font-normal mt-1",
                   !endDate && "text-muted-foreground"
                 )}
               >
                 <CalendarIcon className="mr-2 h-4 w-4" />
                 {endDate ? format(endDate, "PPP") : "Pick a date"}
               </Button>
             </PopoverTrigger>
             <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                 mode="single"
                 selected={endDate}
                 onSelect={(date) => {
                   setEndDate(date)
                   setEndDateOpen(false)
                 }}
                 initialFocus
               />
             </PopoverContent>
           </Popover>
         </div>
       </div>
     </CardContent>
   </Card>

   <Card className="lg:col-span-3">
     <CardContent className="p-6">
       <div className="space-y-2">
         <Label className="text-sm font-medium">Quick Downloads</Label>
         <Button 
           onClick={downloadLastMonthPDF}
           disabled={downloading}
           className="w-full"
           variant="outline"
         >
           {downloading ? (
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
           ) : (
             <FileText className="mr-2 h-4 w-4" />
           )}
           Last Month PDF
         </Button>
       </div>
     </CardContent>
   </Card>

   <Card className="lg:col-span-3">
     <CardContent className="p-6">
       <div className="space-y-2">
         <Label className="text-sm font-medium invisible">.</Label>
         <Button 
           onClick={downloadLastMonthExcel}
           disabled={downloading}
           className="w-full"
           variant="outline"
         >
           {downloading ? (
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
           ) : (
             <FileSpreadsheet className="mr-2 h-4 w-4" />
           )}
           Last Month Excel
         </Button>
       </div>
     </CardContent>
   </Card>
 </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDateRange("today")}
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDateRange("7days")}
          >
            Last 7 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDateRange("30days")}
          >
            Last 30 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDateRange("90days")}
          >
            Last 90 Days
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Sales Report
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Monthly Summary
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Car Performance
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customer Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <div className="flex gap-4">
              <Button onClick={fetchSalesReport} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                Generate Report
              </Button>
              <Button onClick={downloadPDF} disabled={downloading} variant="outline">
                {downloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download PDF
              </Button>
              <Button onClick={downloadExcel} disabled={downloading} variant="outline">
                {downloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download Excel
              </Button>
            </div>

            {summaryData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold">{summaryData.totalBookings}</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold">${summaryData.totalRevenue}</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Booking</p>
                        <p className="text-2xl font-bold">${summaryData.averageBookingValue.toFixed(2)}</p>
                      </div>
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Days</p>
                        <p className="text-2xl font-bold">{summaryData.totalDays}</p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <CalendarIcon className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {salesData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sales Details</CardTitle>
                  <CardDescription>
                    Detailed breakdown of all bookings in the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Customer</th>
                          <th className="text-left p-3 font-medium">Vehicle</th>
                          <th className="text-left p-3 font-medium">Period</th>
                          <th className="text-left p-3 font-medium">Amount</th>
                          <th className="text-left p-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.map((booking) => (
                          <tr key={booking.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div>
                                <p className="font-medium">{booking.customerName}</p>
                                <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                              </div>
                            </td>
                            <td className="p-3">
                              <p className="font-medium">{booking.carMake} {booking.carModel}</p>
                              <p className="text-sm text-gray-600">{booking.carYear}</p>
                            </td>
                            <td className="p-3">
                              <p className="text-sm">
                                {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                              </p>
                            </td>
                            <td className="p-3">
                              <p className="font-medium">${booking.totalAmount}</p>
                            </td>
                            <td className="p-3">
                              <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                                {booking.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <Button onClick={fetchMonthlyData} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              Generate Monthly Report
            </Button>

            {monthlyData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>
                    Monthly breakdown of bookings and revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Month</th>
                          <th className="text-left p-3 font-medium">Year</th>
                          <th className="text-left p-3 font-medium">Bookings</th>
                          <th className="text-left p-3 font-medium">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((month, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{month.month}</td>
                            <td className="p-3">{month.year}</td>
                            <td className="p-3">{month.bookings}</td>
                            <td className="p-3 font-medium">${month.revenue}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </CardContent>
             </Card>
           )}
         </TabsContent>

         <TabsContent value="cars" className="space-y-6">
           <Button onClick={fetchCarPerformance} disabled={loading}>
             {loading ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             ) : (
               <Eye className="mr-2 h-4 w-4" />
             )}
             Generate Car Performance Report
           </Button>

          {carPerformanceData.length > 0 && (
 <Card>
   <CardHeader>
     <CardTitle>Car Performance Analysis</CardTitle>
     <CardDescription>
       Performance metrics for each vehicle in your fleet
     </CardDescription>
   </CardHeader>
   <CardContent>
     <div className="overflow-x-auto">
       <table className="w-full border-collapse">
         <thead>
           <tr className="border-b">
             <th className="text-left p-3 font-medium">Vehicle</th>
             <th className="text-left p-3 font-medium">Bookings</th>
             <th className="text-left p-3 font-medium">Revenue</th>
             <th className="text-left p-3 font-medium">Avg. Revenue</th>
             <th className="text-left p-3 font-medium">Days Rented</th>
           </tr>
         </thead>
         <tbody>
           {carPerformanceData.map((car, index) => (
             <tr key={index} className="border-b hover:bg-gray-50">
               <td className="p-3">
                 <div>
                   <p className="font-medium">{car.make} {car.model}</p>
                 </div>
               </td>
               <td className="p-3">{car.totalBookings}</td>
               <td className="p-3 font-medium">${car.totalRevenue}</td>
               <td className="p-3">${car.averageRevenue}</td>
               <td className="p-3">{car.totalDays}</td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </CardContent>
 </Card>
)}
         </TabsContent>

         <TabsContent value="customers" className="space-y-6">
           <Button onClick={fetchCustomerAnalysis} disabled={loading}>
             {loading ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             ) : (
               <Eye className="mr-2 h-4 w-4" />
             )}
             Generate Customer Analysis
           </Button>

           {customerAnalysisData.length > 0 && (
 <Card>
   <CardHeader>
     <CardTitle>Customer Analysis</CardTitle>
     <CardDescription>
       Customer behavior and spending patterns
     </CardDescription>
   </CardHeader>
   <CardContent>
     <div className="overflow-x-auto">
       <table className="w-full border-collapse">
         <thead>
           <tr className="border-b">
             <th className="text-left p-3 font-medium">Customer</th>
             <th className="text-left p-3 font-medium">Total Bookings</th>
             <th className="text-left p-3 font-medium">Total Spent</th>
             <th className="text-left p-3 font-medium">Avg. per Booking</th>
             <th className="text-left p-3 font-medium">Last Booking</th>
           </tr>
         </thead>
         <tbody>
           {customerAnalysisData.map((customer, index) => (
             <tr key={index} className="border-b hover:bg-gray-50">
               <td className="p-3">
                 <div>
                   <p className="font-medium">{customer.customerName}</p>
                   <p className="text-sm text-gray-600">{customer.customerEmail}</p>
                 </div>
               </td>
               <td className="p-3">{customer.totalBookings}</td>
               <td className="p-3 font-medium">${customer.totalSpent.toLocaleString()}</td>
               <td className="p-3">${customer.averageSpent}</td>
               <td className="p-3">
                 {customer.lastBookingDate ? 
                   format(new Date(customer.lastBookingDate), 'MMM dd, yyyy') : 
                   'N/A'
                 }
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </CardContent>
 </Card>
)}
         </TabsContent>
       </Tabs>
     </div>
   </div>
 )
}