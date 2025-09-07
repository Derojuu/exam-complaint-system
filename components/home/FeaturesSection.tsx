import { motion } from "framer-motion"
import { Shield, Clock, CheckCircle, FileText, Users, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Confidential",
      description: "Your complaints are handled with the highest level of security and confidentiality.",
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Quick response times with automated notifications and status updates.",
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: CheckCircle,
      title: "Transparent Process",
      description: "Track your complaint status in real-time with complete transparency.",
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: FileText,
      title: "Easy Documentation",
      description: "Simple forms and file upload system for comprehensive complaint submission.",
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    },
    {
      icon: Users,
      title: "Expert Review",
      description: "Dedicated examination committee reviews each complaint thoroughly.",
      color: "text-red-600 bg-red-100 dark:bg-red-900/30",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Continuous improvement based on feedback and quality metrics.",
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
    }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-gray-100">Why Choose EXCOS?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our platform provides a comprehensive solution for exam complaint management with modern features and
            intuitive design.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-hover border-0 shadow-lg h-full dark:bg-gray-800/70">
                <CardContent className="p-8 text-center space-y-4">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold dark:text-gray-100">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
