import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'motion/react'
import { ArrowRight, UserPlus, Music, Users, Calendar, Video, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

interface SignupFormData {
  name: string
  email: string
  creatorType: string
}

function RouteComponent() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    creatorType: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Integrate with backend API
    console.log('Signup form data:', formData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    // TODO: Handle success/error states and redirect to dashboard
    // window.location.href = '/creator/dashboard'
  }

  const isFormValid = formData.name && formData.email && formData.creatorType

  const creatorTypes = [
    { value: 'Content Creator', label: 'Content Creator', icon: Video },
    { value: 'Musician', label: 'Musician', icon: Music },
    { value: 'Producer', label: 'Producer', icon: Sparkles },
    { value: 'Event Planner', label: 'Event Planner', icon: Calendar },
    { value: 'Other', label: 'Other', icon: Users }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mx-auto w-16 h-16 gradient-african rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl heading-font">
              Join <span className="text-gradient-african">AfriSight</span>
            </CardTitle>
            <CardDescription className="text-gray-600 body-font">
              Connect with creators and unlock AI-powered insights for your creative journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 body-font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full border-gray-300 focus:border-[#007f5f] focus:ring-[#007f5f] body-font"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 body-font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border-gray-300 focus:border-[#007f5f] focus:ring-[#007f5f] body-font"
                  required
                />
              </div>

              {/* Creator Type Field */}
              <div className="space-y-2">
                <Label htmlFor="creatorType" className="text-sm font-medium text-gray-700 body-font-medium">
                  I am a...
                </Label>
                <Select 
                  value={formData.creatorType} 
                  onValueChange={(value) => handleInputChange('creatorType', value)}
                >
                  <SelectTrigger className="w-full border-gray-300 focus:border-[#007f5f] focus:ring-[#007f5f] body-font">
                    <SelectValue placeholder="Select your creator type" />
                  </SelectTrigger>
                  <SelectContent>
                    {creatorTypes.map((type) => {
                      const IconComponent = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value} className="body-font">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-4 h-4 text-[#007f5f]" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full gradient-african hover:gradient-african-hover text-white body-font-medium py-6 h-auto text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </motion.div>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600 body-font">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-[#007f5f] hover:text-[#004b35] font-medium body-font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 body-font">
            By creating an account, you agree to our{' '}
            <Link to="/" className="text-[#007f5f] hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/" className="text-[#007f5f] hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
