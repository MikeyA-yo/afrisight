import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  Users
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

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
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-[#f4d35e] mx-auto mb-4" />
            <h2 className="text-2xl font-bold heading-font mb-2">Upcoming Events</h2>
            <p className="text-gray-600 body-font">Coming soon - Discover creative opportunities</p>
          </div>
        )
      case 'settings':
        return (
          <div className="text-center py-20">
            <Settings className="w-16 h-16 text-[#007f5f] mx-auto mb-4" />
            <h2 className="text-2xl font-bold heading-font mb-2">Settings</h2>
            <p className="text-gray-600 body-font">Coming soon - Customize your experience</p>
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
              <div className="w-8 h-8 gradient-african rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
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
