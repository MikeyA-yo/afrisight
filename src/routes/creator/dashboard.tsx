import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Bot, 
  Send, 
  Compass, 
  Calendar, 
  Settings, 
  Home, 
  Menu, 
  X, 
  Sparkles,
  Music,
  TrendingUp,
  Users,
  LogOut,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Trash2,
  User,
  Lock,
  Shield,
  MapPin,
  ExternalLink,
  RefreshCw,
  Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useUser, getUserInitials } from '../../contexts/UserContext'
import { settingsApi, eventsApi } from '../../lib/api'
import type { UpdateProfileRequest, ChangePasswordRequest, Event, EventsResponse } from '../../lib/api'

export const Route = createFileRoute('/creator/dashboard')({
  component: RouteComponent,
})

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

function RouteComponent() {
  const { user, logout, updateUser } = useUser()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Creator Expert. I can help you analyze trends, predict performance, and provide insights based on real data from Spotify, YouTube, and movie hits. What would you like to explore today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Settings form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    creatorType: user?.creatorType || ''
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Delete account state
  const [deleteForm, setDeleteForm] = useState({
    password: '',
    confirmDeletion: ''
  })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [showDeletePassword, setShowDeletePassword] = useState(false)

  // Events state
  const [events, setEvents] = useState<Event[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [eventsError, setEventsError] = useState('')
  const [eventsLastUpdated, setEventsLastUpdated] = useState<string | null>(null)
  const [eventFilter, setEventFilter] = useState<'all' | 'tix' | 'luma'>('all')

  const creatorTypes = [
    'Content Creator',
    'Musician', 
    'Producer',
    'Event Planner',
    'Other'
  ]

  const navigationItems = [
    { id: 'dashboard', label: 'AI Assistant', icon: Bot },
    { id: 'explore', label: 'Explore Creators', icon: Compass },
    { id: 'events', label: 'Upcoming Events', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm analyzing the latest trends and data. Based on current Spotify analytics, here are some insights for your creative strategy...",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
  }

  // Fetch events function
  const fetchEvents = async () => {
    setEventsLoading(true)
    setEventsError('')

    try {
      const response = await eventsApi.scrapeEvents()
      
      if (response.success) {
        setEvents(response.data.combinedEvents)
        setEventsLastUpdated(response.summary.scrapedAt)
      }
    } catch (error) {
      setEventsError(error instanceof Error ? error.message : 'Failed to fetch events')
    } finally {
      setEventsLoading(false)
    }
  }

  // Load events when events section is accessed for the first time
  useEffect(() => {
    if (activeSection === 'events' && events.length === 0 && !eventsLoading) {
      fetchEvents()
    }
  }, [activeSection])

  // Filter events based on selected filter
  const filteredEvents = events.filter(event => {
    if (eventFilter === 'all') return true
    return event.source === eventFilter
  })

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')

    try {
      const updates: UpdateProfileRequest = {}
      
      // Only send fields that have changed
      if (profileForm.name !== user?.name) updates.name = profileForm.name
      if (profileForm.email !== user?.email) updates.email = profileForm.email
      if (profileForm.creatorType !== user?.creatorType) updates.creatorType = profileForm.creatorType

      if (Object.keys(updates).length === 0) {
        setProfileSuccess('No changes to save')
        return
      }

      const response = await settingsApi.updateProfile(updates)
      
      if (response.success) {
        updateUser(response.profile)
        setProfileSuccess('Profile updated successfully!')
        
        // Update form with the response data
        setProfileForm({
          name: response.profile.name,
          email: response.profile.email,
          creatorType: response.profile.creatorType
        })
      }
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      setPasswordLoading(false)
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long')
      setPasswordLoading(false)
      return
    }

    try {
      const passwordData: ChangePasswordRequest = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }

      const response = await settingsApi.changePassword(passwordData)
      
      if (response.success) {
        setPasswordSuccess('Password changed successfully!')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleteLoading(true)
    setDeleteError('')

    if (deleteForm.confirmDeletion !== 'DELETE_MY_ACCOUNT') {
      setDeleteError('Please type "DELETE_MY_ACCOUNT" to confirm')
      setDeleteLoading(false)
      return
    }

    try {
      const response = await settingsApi.deleteAccount({
        password: deleteForm.password,
        confirmDeletion: deleteForm.confirmDeletion
      })
      
      if (response.success) {
        // Redirect to home page after successful deletion
        logout()
        window.location.href = '/'
      }
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete account')
    } finally {
      setDeleteLoading(false)
    }
  }

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* AI Chat Header */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-african rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold heading-font text-gray-900">AI Creator Expert</h2>
                <p className="text-gray-600 body-font">Your intelligent creative companion</p>
              </div>
            </div>

            {/* Chat Messages */}
            <Card className="flex-1 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg body-font ${
                          message.isUser
                            ? 'gradient-african text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 px-4 py-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="mt-6 flex space-x-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about trends, analytics, or creative strategies..."
                    className="flex-1 border-gray-300 focus:border-[#007f5f] focus:ring-[#007f5f] body-font"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="gradient-african hover:gradient-african-hover text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-[#007f5f]" />
                    <div>
                      <h3 className="font-semibold heading-font">Trending Now</h3>
                      <p className="text-sm text-gray-600 body-font">Afrobeats rising 24%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Music className="w-8 h-8 text-[#f4d35e]" />
                    <div>
                      <h3 className="font-semibold heading-font">Top Genre</h3>
                      <p className="text-sm text-gray-600 body-font">Amapiano leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-[#007f5f]" />
                    <div>
                      <h3 className="font-semibold heading-font">Active Creators</h3>
                      <p className="text-sm text-gray-600 body-font">2,547 online</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case 'explore':
        return (
          <div className="text-center py-20">
            <Compass className="w-16 h-16 text-[#007f5f] mx-auto mb-4" />
            <h2 className="text-2xl font-bold heading-font mb-2">Explore Creators</h2>
            <p className="text-gray-600 body-font">Coming soon - Connect with fellow creators</p>
          </div>
        )
      case 'events':
        return (
          <div className="space-y-6">
            {/* Events Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold heading-font text-gray-900">Upcoming Events</h2>
                <p className="text-gray-600 body-font">Discover creative opportunities from Tix.Africa and Luma</p>
                {eventsLastUpdated && (
                  <p className="text-xs text-gray-500 body-font mt-1">
                    Last updated: {new Date(eventsLastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
              <Button
                onClick={fetchEvents}
                disabled={eventsLoading}
                className="gradient-african hover:opacity-90 text-white font-medium body-font"
              >
                {eventsLoading ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Refreshing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Events</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Filter and Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select value={eventFilter} onValueChange={(value: 'all' | 'tix' | 'luma') => setEventFilter(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="tix">Tix.Africa</SelectItem>
                      <SelectItem value="luma">Luma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {events.length > 0 && (
                <div className="flex items-center space-x-4 text-sm text-gray-600 body-font">
                  <span>Total: {filteredEvents.length} events</span>
                  <span>•</span>
                  <span>Tix.Africa: {events.filter(e => e.source === 'tix').length}</span>
                  <span>•</span>
                  <span>Luma: {events.filter(e => e.source === 'luma').length}</span>
                </div>
              )}
            </div>

            {/* Error State */}
            {eventsError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200"
              >
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium body-font-medium">Failed to load events</p>
                  <p className="text-sm body-font">{eventsError}</p>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {eventsLoading && events.length === 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-0 shadow-md">
                    <CardContent className="p-0">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Events Grid */}
            {!eventsLoading && filteredEvents.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={`${event.source}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                      <CardContent className="p-0">
                        {/* Event Image */}
                        <div className="relative h-48 bg-gradient-to-br from-green-100 to-yellow-100">
                          {event.imageUrl ? (
                            <img
                              src={event.imageUrl}
                              alt={event.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Calendar className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Source Badge */}
                          <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              event.source === 'tix' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {event.source === 'tix' ? 'Tix.Africa' : 'Luma'}
                            </span>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold heading-font text-gray-900 line-clamp-2">
                            {event.name}
                          </h3>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 body-font">
                              <Calendar className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            
                            {event.location && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600 body-font">
                                <MapPin className="w-4 h-4" />
                                <span className="line-clamp-1">{event.location}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-lg font-bold text-[#007f5f] heading-font">
                              {event.price}
                            </div>
                            <Button
                              onClick={() => window.open(event.eventUrl, '_blank')}
                              size="sm"
                              className="gradient-african hover:opacity-90 text-white font-medium body-font"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Event
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!eventsLoading && filteredEvents.length === 0 && events.length === 0 && !eventsError && (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold heading-font text-gray-700 mb-2">No Events Found</h3>
                <p className="text-gray-500 body-font mb-6">
                  Click "Refresh Events" to load the latest events from Tix.Africa and Luma.
                </p>
                <Button
                  onClick={fetchEvents}
                  className="gradient-african hover:opacity-90 text-white font-medium body-font"
                >
                  Load Events
                </Button>
              </div>
            )}

            {/* No Results for Filter */}
            {!eventsLoading && filteredEvents.length === 0 && events.length > 0 && (
              <div className="text-center py-20">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold heading-font text-gray-700 mb-2">No Events Match Filter</h3>
                <p className="text-gray-500 body-font mb-6">
                  No events found for the selected source. Try changing the filter or refresh events.
                </p>
                <Button
                  onClick={() => setEventFilter('all')}
                  variant="outline"
                  className="border-[#007f5f] text-[#007f5f] hover:bg-[#007f5f] hover:text-white font-medium body-font"
                >
                  Show All Events
                </Button>
              </div>
            )}
          </div>
        )
      case 'settings':
        return (
          <div className="space-y-8">
            {/* Profile Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-african rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="heading-font">Profile Information</CardTitle>
                    <p className="text-sm text-gray-600 body-font">Update your personal information</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="body-font-medium">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        className="body-font"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="body-font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="body-font"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creatorType" className="body-font-medium">Creator Type</Label>
                    <Select 
                      value={profileForm.creatorType} 
                      onValueChange={(value) => setProfileForm(prev => ({ ...prev, creatorType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your creator type" />
                      </SelectTrigger>
                      <SelectContent>
                        {creatorTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Profile Error/Success Messages */}
                  <AnimatePresence mode="wait">
                    {profileError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm body-font">{profileError}</span>
                      </motion.div>
                    )}

                    {profileSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm body-font">{profileSuccess}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full md:w-auto gradient-african hover:opacity-90 text-white font-medium body-font px-8"
                  >
                    {profileLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-african rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="heading-font">Change Password</CardTitle>
                    <p className="text-sm text-gray-600 body-font">Update your account password</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="body-font-medium">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                          className="body-font pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="body-font-medium">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Enter new password"
                          className="body-font pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="body-font-medium">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                          className="body-font pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Error/Success Messages */}
                  <AnimatePresence mode="wait">
                    {passwordError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm body-font">{passwordError}</span>
                      </motion.div>
                    )}

                    {passwordSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm body-font">{passwordSuccess}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full md:w-auto gradient-african hover:opacity-90 text-white font-medium body-font px-8"
                  >
                    {passwordLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Changing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>Change Password</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Danger Zone - Delete Account */}
            <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="heading-font text-red-600">Danger Zone</CardTitle>
                    <p className="text-sm text-gray-600 body-font">Permanently delete your account</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-red-800 body-font-medium mb-2">Warning</h4>
                  <p className="text-sm text-red-700 body-font">
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </p>
                </div>

                <form onSubmit={handleDeleteAccount} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="deletePassword" className="body-font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="deletePassword"
                          type={showDeletePassword ? "text" : "password"}
                          value={deleteForm.password}
                          onChange={(e) => setDeleteForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter your password"
                          className="body-font pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowDeletePassword(!showDeletePassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmDeletion" className="body-font-medium">
                        Type "DELETE_MY_ACCOUNT" to confirm
                      </Label>
                      <Input
                        id="confirmDeletion"
                        type="text"
                        value={deleteForm.confirmDeletion}
                        onChange={(e) => setDeleteForm(prev => ({ ...prev, confirmDeletion: e.target.value }))}
                        placeholder="DELETE_MY_ACCOUNT"
                        className="body-font"
                        required
                      />
                    </div>
                  </div>

                  {/* Delete Error Message */}
                  {deleteError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm body-font">{deleteError}</span>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={deleteLoading}
                    variant="destructive"
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-medium body-font px-8"
                  >
                    {deleteLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Deleting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Account</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-african rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-african heading-font">AfriSight</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors body-font-medium ${
                    activeSection === item.id
                      ? 'gradient-african text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold heading-font text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 body-font">
                    {user?.name || 'Loading...'}
                  </p>
                  <p className="text-xs text-gray-500 body-font">
                    {user?.creatorType || 'Creator'}
                  </p>
                </div>
                <div className="w-8 h-8 gradient-african rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user ? getUserInitials(user.name) : 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {renderDashboardContent()}
        </main>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
