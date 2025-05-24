"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  const navigationLinks = [
    { href: "/rental-deals", label: "Rental deals" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/why-choose-us", label: "Why choose us" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
 
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo_With_Text.png"
              alt="Urban Drives"
              width={140}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

      
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

      
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              asChild
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button 
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>

      
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-700"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] sm:w-[350px] bg-white border-l"
            >
              <SheetHeader className="text-left pb-4">
                <div className="flex items-center justify-between">
                  <Image
                    src="/Logo_With_Text.png"
                    alt="Urban Drives"
                    width={120}
                    height={28}
                    className="h-7 w-auto"
                  />
                </div>
              </SheetHeader>
              
               <nav className="flex flex-col space-y-4 mt-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2 px-2 rounded-md hover:bg-blue-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

    
              <div className="flex flex-col space-y-3 mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  asChild
                  className="w-full justify-center border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button 
                  asChild
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar