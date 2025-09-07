import { motion } from "framer-motion"

export function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Submit Complaint",
      description:
        "Fill out the detailed complaint form with all relevant information about your exam issue.",
    },
    {
      step: "02",
      title: "Initial Review",
      description:
        "Our system validates your complaint and assigns it to the appropriate examination committee.",
    },
    {
      step: "03",
      title: "Investigation",
      description:
        "The committee thoroughly investigates your complaint and gathers all necessary information.",
    },
    {
      step: "04",
      title: "Resolution",
      description:
        "You receive a detailed response with the committee's decision and any corrective actions.",
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-gray-100">How It Works</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our streamlined process ensures your complaints are handled efficiently and fairly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center space-y-4"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold shadow-lg">
                  {step.step}
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-900/40 dark:to-blue-900/40 -z-10"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold dark:text-gray-100">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
