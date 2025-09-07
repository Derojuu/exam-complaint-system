import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { FileText } from "lucide-react"

interface HomePageNavigationProps {
  navOpen: boolean
  setNavOpen: (open: boolean) => void
}

export function HomePageNavigation({ navOpen, setNavOpen }: HomePageNavigationProps) {
  return (
    <nav className="glass-effect sticky top-0 z-50 border-b dark:bg-gray-900/80 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">EXCOS</span>
          </div>
          {/* Right side nav */}
          <div className="flex items-center">
            {/* Hamburger for mobile */}
            <div className="lg:hidden flex items-center">
              <ThemeToggle />
              <button
                className="ml-2 p-2 rounded-md text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-0 focus:ring-transparent active:bg-gray-100 dark:active:bg-gray-800"
                onClick={() => setNavOpen(!navOpen)}
                aria-label="Open navigation menu"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  boxShadow: "none",
                }}
              >
                {/* Three horizontal lines (classic hamburger) */}
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {navOpen ? (
                    // X icon for close
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    // Three horizontal lines
                    <>
                      <line x1="4" y1="7" x2="20" y2="7" strokeWidth="2" strokeLinecap="round" />
                      <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round" />
                      <line x1="4" y1="17" x2="20" y2="17" strokeWidth="2" strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {/* Desktop nav */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* ThemeToggle is now left of Sign In */}
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="btn-gradient">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile nav dropdown */}
      {navOpen && (
        <div className="lg:hidden bg-white/90 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-3 shadow-md">
          <Link href="/login" onClick={() => setNavOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register" onClick={() => setNavOpen(false)}>
            <Button
              className="w-full btn-gradient justify-start active:bg-purple-100 dark:active:bg-purple-900 focus:bg-purple-100 dark:focus:bg-purple-900"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
