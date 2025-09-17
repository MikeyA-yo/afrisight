import { Link, useLocation } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Music, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const handleFeaturesClick = () => {
    if (isHomePage) {
      // If on home page, scroll to features section
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If not on home page, navigate to home page with features hash
      window.location.href = '/#features'
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Music className="h-8 w-8" style={{ color: '#007f5f' }} />
          <span className="text-2xl font-bold text-gradient-african heading-font">
            AfriSight
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={handleFeaturesClick}
            className="text-sm font-medium text-gray-700 hover:text-[#007f5f] transition-colors body-font-medium cursor-pointer"
          >
            Features
          </button>
          <Link 
            to="/login" 
            className="text-sm font-medium text-gray-700 hover:text-[#007f5f] transition-colors body-font-medium"
          >
            Events
          </Link>
          <Link 
            to="/login" 
            className="text-sm font-medium text-gray-700 hover:text-[#007f5f] transition-colors body-font-medium"
          >
            Community
          </Link>
          <Link 
            to="/login" 
            className="text-sm font-medium text-gray-700 hover:text-[#007f5f] transition-colors body-font-medium"
          >
            For Creators
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-700 hover:text-[#007f5f] body-font-medium">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="gradient-african hover:gradient-african-hover text-white body-font-medium">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={handleFeaturesClick}
              className="block text-sm font-medium text-gray-700 hover:text-[#007f5f] py-2 body-font-medium cursor-pointer text-left w-full"
            >
              Features
            </button>
            <Link 
              to="/login" 
              className="block text-sm font-medium text-gray-700 hover:text-[#007f5f] py-2 body-font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/login" 
              className="block text-sm font-medium text-gray-700 hover:text-[#007f5f] py-2 body-font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Community
            </Link>
            <Link 
              to="/login" 
              className="block text-sm font-medium text-gray-700 hover:text-[#007f5f] py-2 body-font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              For Creators
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Link to="/login">
                <Button variant="ghost" className="justify-start text-gray-700 hover:text-[#007f5f] body-font-medium w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="justify-start gradient-african hover:gradient-african-hover text-white body-font-medium w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
