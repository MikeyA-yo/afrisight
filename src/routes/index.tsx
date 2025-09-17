import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Calendar, Users, Sparkles, ArrowRight, Play } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-green-50 border-green-200 text-[#007f5f] mb-8 body-font-medium">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Creative Intelligence Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 heading-font">
              Empower Your{' '}
              <span className="text-gradient-african">
                Creative Journey
              </span>{' '}
              with AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed body-font">
              Whether you're a content creator, musician, producer, or event planner - predict trends, 
              discover opportunities, and connect with fellow creators. AfriSight brings AI-powered insights to fuel your creative success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    className="gradient-african hover:gradient-african-hover text-lg px-8 py-6 h-auto text-white body-font-medium"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 h-auto border-2 border-[#007f5f] text-[#007f5f] hover:bg-[#007f5f] hover:text-white body-font-medium"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-font">
            Everything you need to{' '}
            <span className="text-gradient-african">
              succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto body-font">
            Powerful AI tools designed for all types of creators - from content creators and musicians to producers and event planners
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-8">
                <div className="rounded-full w-16 h-16 flex items-center justify-center mb-6" style={{ backgroundColor: '#007f5f' }}>
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 heading-font">AI Trend Prediction</h3>
                <p className="text-gray-600 leading-relaxed body-font">
                  Stay ahead of the curve with our advanced AI algorithms that analyze content trends across 
                  platforms, helping you create engaging content that resonates with your audience.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-8">
                <div className="rounded-full w-16 h-16 flex items-center justify-center mb-6" style={{ backgroundColor: '#f4d35e' }}>
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 heading-font">Events & Opportunities</h3>
                <p className="text-gray-600 leading-relaxed body-font">
                  Discover events, festivals, collaborations, and creative opportunities in your niche. 
                  Whether it's music festivals, content creator meetups, or production gigs - never miss out.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100">
              <CardContent className="p-8">
                <div className="rounded-full w-16 h-16 flex items-center justify-center mb-6" style={{ backgroundColor: '#52b788' }}>
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 heading-font">Creator Network</h3>
                <p className="text-gray-600 leading-relaxed body-font">
                  Connect with content creators, musicians, producers, and event planners. Collaborate on projects, 
                  share resources, and build meaningful relationships that elevate your creative career.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="gradient-african rounded-3xl p-12 md:p-16 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 heading-font">
            Ready to transform your creative career?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto body-font">
            Join thousands of content creators, musicians, producers, and event planners who are already using AfriSight 
            to predict trends, discover opportunities, and build their creative future.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-white text-[#007f5f] hover:bg-gray-100 text-lg px-8 py-6 h-auto font-semibold body-font-medium"
              >
                Start Your Journey Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
