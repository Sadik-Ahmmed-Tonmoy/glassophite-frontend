"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, User, Search, Heart, CreditCard } from "lucide-react"
import CartButton from "../NavigationBar/cart/CartButton"


export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.style.overflow = ""
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 border-b"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <ShoppingBag className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="font-bold text-xl group-hover:text-primary transition-colors duration-300">EyeStyle</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-all duration-300 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 ${
                isActive("/") ? "text-primary after:w-full" : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition-all duration-300 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 ${
                isActive("/products") ? "text-primary after:w-full" : "text-gray-700"
              }`}
            >
              Products
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-all duration-300 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 ${
                isActive("/about") ? "text-primary after:w-full" : "text-gray-700"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-all duration-300 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 ${
                isActive("/contact") ? "text-primary after:w-full" : "text-gray-700"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>
            <Link
              href="/wishlist"
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 text-gray-700" />
            </Link>
            <CartButton />
            <Link
              href="/checkout"
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110"
              aria-label="Checkout"
            >
              <CreditCard className="h-5 w-5 text-gray-700" />
            </Link>
            <Link
              href="/my-profile"
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                isActive("/my-profile") ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="My Profile"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <CartButton />
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition-all duration-300"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "rotate-45 top-3" : "top-1.5"
                  }`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-gray-700 top-3 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "-rotate-45 top-3" : "top-4.5"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-300 ${
                isActive("/")
                  ? "bg-primary/10 text-primary translate-x-2"
                  : "text-gray-700 hover:bg-gray-100 hover:translate-x-2"
              }`}
              onClick={closeMenu}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/products"
              className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-300 ${
                isActive("/products")
                  ? "bg-primary/10 text-primary translate-x-2"
                  : "text-gray-700 hover:bg-gray-100 hover:translate-x-2"
              }`}
              onClick={closeMenu}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Products</span>
            </Link>
            <Link
              href="/wishlist"
              className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-300 ${
                isActive("/wishlist")
                  ? "bg-primary/10 text-primary translate-x-2"
                  : "text-gray-700 hover:bg-gray-100 hover:translate-x-2"
              }`}
              onClick={closeMenu}
            >
              <Heart className="h-5 w-5" />
              <span>Wishlist</span>
            </Link>
            <Link
              href="/checkout"
              className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-300 ${
                isActive("/checkout")
                  ? "bg-primary/10 text-primary translate-x-2"
                  : "text-gray-700 hover:bg-gray-100 hover:translate-x-2"
              }`}
              onClick={closeMenu}
            >
              <CreditCard className="h-5 w-5" />
              <span>Checkout</span>
            </Link>
            <Link
              href="/my-profile"
              className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-300 ${
                isActive("/my-profile")
                  ? "bg-primary/10 text-primary translate-x-2"
                  : "text-gray-700 hover:bg-gray-100 hover:translate-x-2"
              }`}
              onClick={closeMenu}
            >
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeMenu} aria-hidden="true" />
      )}
    </header>
  )
}
