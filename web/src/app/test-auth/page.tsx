'use client'

import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface UserPrincipal {
  id: string
  email: string
  name: string
  image: string
  emailVerified: boolean
  roles: string[]
}

interface AuthTestResponse {
  authenticated: boolean
  user: UserPrincipal
  authorities: Array<{ authority: string }>
}

export default function AuthTestPage() {
  const [token, setToken] = useState('')
  const [currentUser, setCurrentUser] = useState<UserPrincipal | null>(null)
  const [testAuthData, setTestAuthData] = useState<AuthTestResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = 'https://urbandrives.vercel.app/api'

  const fetchToken = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const tokenData = await response.text()
        setToken(tokenData)
      } else {
        throw new Error(`Failed to fetch token: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching token:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUser = async () => {
    if (!token) {
      console.error('No token available')
      return
    }

    setLoading(true)
    try {
      // Get fresh token
      const responseToken = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!responseToken.ok) {
        throw new Error(`Failed to fetch fresh token: ${responseToken.status}`)
      }
      
      // Extract the token text from the response
      const freshToken = await responseToken.text()
      
      // Use the fresh token to get user data
      const response = await fetch(`https://urbandrives-6eb940e4a23c.herokuapp.com/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${freshToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const userData: UserPrincipal = await response.json()
        setCurrentUser(userData)
      } else if (response.status === 401) {
        console.error('Unauthorized - token may be expired')
      } else {
        throw new Error(`Failed to fetch user: ${response.status}`)
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    if (!token) {
      console.error('No token available')
      return
    }

    setLoading(true)
    try {
      // Get fresh token for this test too
      const responseToken = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!responseToken.ok) {
        throw new Error(`Failed to fetch fresh token: ${responseToken.status}`)
      }
      
      const freshToken = await responseToken.text()
      
      const response = await fetch(`https://urbandrives-6eb940e4a23c.herokuapp.com/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${freshToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const authData: AuthTestResponse = await response.json()
        setTestAuthData(authData)
      } else if (response.status === 401) {
        console.error('Unauthorized - token may be expired')
      } else {
        throw new Error(`Auth test failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Error testing auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/public/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const healthData = await response.json()
        console.log('Health check passed:', healthData)
      } else {
        throw new Error(`Health check failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Health check error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Urban Drives Auth Test</h1>
        <p className="text-muted-foreground">Test your Spring Boot authentication endpoints</p>
      </div>

      {/* Token Management */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Get Authentication Token</CardTitle>
          <CardDescription>
            Fetch a token from the /auth/token endpoint
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={fetchToken} disabled={loading}>
              {loading ? "Fetching..." : "Fetch Token"}
            </Button>
            <Button variant="outline" onClick={checkHealth} disabled={loading}>
              Health Check
            </Button>
          </div>
          
          {token && (
            <div className="space-y-2">
              <Label htmlFor="token">Current Token:</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token here or fetch automatically"
                className="font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authentication Tests */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Get Current User</CardTitle>
            <CardDescription>
              Test the /auth/me endpoint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={getCurrentUser} disabled={loading || !token} className="w-full">
              {loading ? "Loading..." : "Get Current User"}
            </Button>
            
            {currentUser && (
              <div className="space-y-2 text-sm">
                <div className="font-semibold">User Information:</div>
                <div className="bg-muted p-3 rounded-md">
                  <div><strong>ID:</strong> {currentUser.id}</div>
                  <div><strong>Name:</strong> {currentUser.name}</div>
                  <div><strong>Email:</strong> {currentUser.email}</div>
                  <div><strong>Email Verified:</strong> {currentUser.emailVerified ? '✓' : '✗'}</div>
                  <div><strong>Roles:</strong> {currentUser.roles?.join(', ') || 'None'}</div>
                  {currentUser.image && (
                    <div><strong>Image:</strong> {currentUser.image}</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Test Authentication</CardTitle>
            <CardDescription>
              Test the /auth/test endpoint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testAuth} disabled={loading || !token} className="w-full">
              {loading ? "Testing..." : "Test Auth"}
            </Button>
            
            {testAuthData && (
              <div className="space-y-2 text-sm">
                <div className="font-semibold">Auth Test Results:</div>
                <div className="bg-muted p-3 rounded-md">
                  <div><strong>Authenticated:</strong> {testAuthData.authenticated ? '✓' : '✗'}</div>
                  <div><strong>User:</strong> {testAuthData.user.name} ({testAuthData.user.email})</div>
                  <div><strong>Authorities:</strong></div>
                  <ul className="ml-4 list-disc">
                    {testAuthData.authorities.map((auth, index) => (
                      <li key={index}>{auth.authority}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}