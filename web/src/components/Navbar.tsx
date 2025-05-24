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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { Menu, LogOut, User, Settings } from "lucide-react"
import { authClient } from "~/lib/auth-client" 

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { data: session, isPending } = authClient.useSession()

  const navigationLinks = [
    { href: "/rental-deals", label: "Rental deals" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/why-choose-us", label: "Why choose us" },
  ]

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/"
        },
      },
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
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
            {isPending ? (
              <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={session.user.image || undefined} 
                        alt={session.user.name || "User"} 
                      />
                      <AvatarFallback>
                        {getInitials(session.user.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
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
              </>
            )}
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
              

              {session?.user && (
                <div className="flex items-center space-x-3 py-4 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={session.user.image || undefined} 
                      alt={session.user.name || "User"} 
                    />
                    <AvatarFallback>
                      {getInitials(session.user.name || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                  </div>
                </div>
              )}


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
                
    
                {session?.user && (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2 px-2 rounded-md hover:bg-blue-50 flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2 px-2 rounded-md hover:bg-blue-50 flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </>
                )}
              </nav>


              <div className="flex flex-col space-y-3 mt-8 pt-6 border-t">
                {session?.user ? (
                  <Button 
                    variant="outline" 
                    className="w-full justify-center border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      setIsOpen(false)
                      handleSignOut()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      asChild
                      className="w-full justify-center border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <Link href="/signin" onClick={() => setIsOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Sign up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar