import Link from "next/link"
import { FileText } from "lucide-react"

export function HomePageFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">EXCOS</span>
            </div>
            <p className="text-gray-400">Exam Complaint System for Transparent and Efficient Resolution.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">
                Submit Complaint
              </Link>
              <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">
                Track Status
              </Link>
              <Link href="/register" className="block text-gray-400 hover:text-white transition-colors">
                Register
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} EXCOS. All rights reserved. Built with ❤️ for academic excellence.
        </div>
      </div>
    </footer>
  )
}
