import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function About() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">About Us</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Empowering communities in times of crisis
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Saviour is dedicated to providing innovative solutions for disaster preparedness and response.
          </p>
        </div>
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">Our Mission</h3>
              <p className="mt-4 text-lg text-gray-500">
                At Saviour, our mission is to leverage technology to save lives and minimize the impact of natural disasters. We believe that by providing timely information, facilitating communication, and fostering community support, we can make a significant difference in how people prepare for, respond to, and recover from catastrophic events.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">Our Vision</h3>
              <p className="mt-4 text-lg text-gray-500">
                We envision a world where communities are resilient in the face of natural disasters. Through our platform, we aim to create a global network of mutual aid and support, ensuring that no one faces a crisis alone. We strive to be at the forefront of disaster response technology, continually innovating to meet the evolving challenges posed by climate change and other environmental factors.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <h3 className="text-2xl font-extrabold text-gray-900 text-center">Our Values</h3>
          <ul className="mt-8 space-y-4 max-w-3xl mx-auto">
            <li className="flex items-center animate-pop-out">
              <span className="bg-blue-500 rounded-full p-2 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </span>
              <span className="text-lg">Innovation in disaster management</span>
            </li>
            <li className="flex items-center animate-pop-out delay-100">
              <span className="bg-green-500 rounded-full p-2 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </span>
              <span className="text-lg">Community empowerment</span>
            </li>
            <li className="flex items-center animate-pop-out delay-200">
              <span className="bg-yellow-500 rounded-full p-2 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              </span>
              <span className="text-lg">Accessibility and inclusivity</span>
            </li>
            <li className="flex items-center animate-pop-out delay-300">
              <span className="bg-red-500 rounded-full p-2 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              </span>
              <span className="text-lg">Collaboration with local and global partners</span>
            </li>
            <li className="flex items-center animate-pop-out delay-400">
              <span className="bg-purple-500 rounded-full p-2 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              </span>
              <span className="text-lg">Continuous improvement and learning</span>
            </li>
          </ul>
        </div>
        <div className="mt-20">
          <h3 className="text-2xl font-extrabold text-gray-900 text-center">Our Team</h3>
          <p className="mt-4 max-w-3xl mx-auto text-center text-lg text-gray-500">
            Saviour is built by a dedicated team of technologists, disaster management experts, and community organizers. We&apos;re passionate about using our skills to make a positive impact on the world.
          </p>
        </div>
        <div className="mt-20 text-center">
          <Button asChild className="px-8 py-3 md:py-4 md:text-lg md:px-10">
            <Link href="/contact">
              Get in Touch
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

