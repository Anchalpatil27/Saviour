import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us - SAVIOUR',
  description: 'Get in touch with SAVIOUR for any inquiries or support',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/contact-texture.svg')] opacity-10"></div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-5xl font-bold mb-12 text-ce\nter text-blue-800">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in-left">
            <h2 className="text-2xl font-semibold mb-6 text-blue-800">Get in Touch</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input id="name" type="text" placeholder="Your Name" required className="w-full" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <Input id="email" type="email" placeholder="your@gmail.com" required className="w-full" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <Textarea id="message" placeholder="Your message here..." required className="w-full" rows={4} />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Send Message</Button>
            </form>
          </div>
          <div className="space-y-8 animate-fade-in-right">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-blue-800">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <span>info@saviour.org</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <span>+91 8306721779</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <span>IIITDM Jabalpur</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-blue-800">Hours of Operation</h2>
              <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Saturday - Sunday: Closed</p>
              <p className="mt-2 font-semibold">24/7 Emergency Hotline: +91 8306721779</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">Need Immediate Assistance?</h2>
              <p className="mb-4">Our emergency response team is available 24/7 for urgent situations.</p>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                <a href="tel:+918306721779">Call Emergency Hotline</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
