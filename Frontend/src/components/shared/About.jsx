import React from 'react'
import Navbar from './Navbar'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full h-[calc(100vh-4rem)]">
        <iframe
          src="https://mpji-portfolio.vercel.app"
          className="w-full h-full border-0"
          title="Portfolio Website"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default About