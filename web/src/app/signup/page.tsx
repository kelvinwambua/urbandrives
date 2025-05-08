"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { siGoogle } from "simple-icons"
import Image from "next/image"
import { toast } from "sonner"
import { authClient } from "~/lib/auth-client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form"
import { useState } from "react"
import { ArrowRight, Car, Key, Mail, User } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type FormValues = z.infer<typeof formSchema>

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ["credentials", "security"]
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: "/dashboard"
      },{
        onRequest:() => {
          setLoading(true)
        },
        onSuccess:() => {
          setLoading(false)
          toast.success("Account Created Successfully", {
            description: "Redirecting to dashboard",
          })
        },
        onError:(ctx) => {
          setLoading(false)
          toast.error("Registration Failed", {
            description: ctx.error.message,
          })
        }
      });
    } catch (error) {
      setLoading(false)
      toast.error("An unexpected error occurred", {
        description: error instanceof Error ? error.message : "Please try again later",
      })
    }
  }
  
  const validateCurrentStep = async () => {
    let isValid = false;
    
    switch (steps[currentStep]) {
      case "credentials":
        isValid = await form.trigger(["name", "email"]);
        break;
      case "security":
        isValid = await form.trigger(["password", "confirmPassword"]);
        break;
      default:
        isValid = true;
    }
    
    return isValid;
  };

  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast.error("Please complete all required fields before proceeding.");
    } else {
        void form.handleSubmit(onSubmit)();
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-md overflow-hidden">
        {/* Logo header with gradient background */}
        <div className="bg-primary p-6">
          <div className="flex items-center justify-center">
            <Car className="h-8 w-8 text-primary-foreground mr-2" />
            <div className="text-primary-foreground">
              <h1 className="font-bold text-xl">Urban Drives</h1>
              <p className="text-xs text-primary-foreground/80">Premium Car Rental Service</p>
            </div>
          </div>
          
          {/* Progress steps */}
          <div className="flex justify-between mt-6">
            <p className="text-sm font-medium text-primary-foreground">Step {currentStep + 1} of {steps.length}</p>
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-2 w-12 rounded-full ${index <= currentStep ? 'bg-secondary' : 'bg-primary-foreground/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-foreground">Create your account</h2>
            <p className="text-sm text-muted-foreground">Join Urban Drives and start your journey</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {currentStep === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="name" 
                              placeholder="Jane Doe"
                              className="pl-9 rounded-md"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="you@example.com"
                              className="pl-9 rounded-md"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="password" 
                              type="password"
                              placeholder="Create a strong password"
                              className="pl-9 rounded-md"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="confirmPassword" 
                              type="password"
                              placeholder="Confirm your password"
                              className="pl-9 rounded-md"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <div className="flex justify-between space-x-4 pt-4">
                {currentStep > 0 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={goToPrevStep}
                    disabled={loading}
                  >
                    Back
                  </Button>
                )}
                
                <Button 
                  type="button" 
                  className={`${currentStep === 0 ? 'w-full' : 'flex-1'}`}
                  onClick={goToNextStep}
                  disabled={loading}
                >
                  {currentStep < steps.length - 1 ? "Continue" : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-card text-xs text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                type="button"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                >
                  <path d={siGoogle.path} />
                </svg>
                Google
              </Button>
              
              <div className="text-center text-sm mt-6 text-muted-foreground">
                Already have an account?{" "}
                <a href="/signin" className="text-primary hover:text-primary/80 font-medium">
                  Sign in
                </a>
              </div>
            </form>
          </Form>
        </div>
      </div>
      
      <p className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Urban Drives. All rights reserved.
      </p>
    </div>
  )
}