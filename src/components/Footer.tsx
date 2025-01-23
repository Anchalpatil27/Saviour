'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react'


export default function Footer() {

  return (
    <footer className="bg-gradient-to-br from-slate-800 via-blue-700 to-cyan-600 text-white py-8 font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Image src="/Saviour.png" alt="SAVIOUR Logo" width={150} height={33} className="mb-2 invert" />
            <p className="text-xs text-emerald-50">Empowering communities through disaster preparedness and response.</p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page" className="text-white hover:text-cyan-100 transition-colors">
                <Facebook size={16} />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Twitter page" className="text-white hover:text-cyan-100 transition-colors">
                <Twitter size={16} />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page" className="text-white hover:text-cyan-100 transition-colors">
                <Instagram size={16} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-2 text-cyan-100">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link href="/about" className="text-xs text-emerald-50 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-xs text-emerald-50 hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/contact" className="text-xs text-emerald-50 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/donate" className="text-xs text-emerald-50 hover:text-white transition-colors">Donate</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-2 text-cyan-100">Contact Us</h4>
            <ul className="space-y-1">
              <li className="flex items-center">
                <Mail size={14} className="mr-2 text-emerald-200" />
                <a href="mailto:info@saviour.org" className="text-xs text-emerald-50 hover:text-white transition-colors">info@saviour.org</a>
              </li>
              <li className="flex items-center">
                <Phone size={14} className="mr-2 text-emerald-200" />
                <a href="tel:+918306721779" className="text-xs text-emerald-50 hover:text-white transition-colors">+91 8306721779</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-emerald-400/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-emerald-50 mb-2 sm:mb-0">&copy; 2025 SAVIOUR. All rights reserved.</p>
          <nav className="flex space-x-4">
            <Link href="/privacy" className="text-xs text-emerald-50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-emerald-50 hover:text-white transition-colors">Terms of Service</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

