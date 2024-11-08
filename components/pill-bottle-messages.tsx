'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

export default function PillBottleMessages() {
  const [messages, setMessages] = useState<string[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const controls = useAnimation()
  const paperControls = useAnimation()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetch('/messages.json')
      .then((response) => response.json())
      .then((data) => setMessages(data.messages))
  }, [])

  const shakeBottle = async () => {
    await controls.start({
      x: [0, -10, 10, -10, 10, 0],
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5 },
    })
  }

  const takePill = async () => {
    await controls.start({ y: -50, transition: { duration: 0.5 } })
    await controls.start({ y: 0, transition: { duration: 0.5 } })
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setCurrentMessage(randomMessage)
    await paperControls.start({ scaleY: 1, opacity: 1, transition: { duration: 0.5 } })
  }

  useEffect(() => {
    const interval = setInterval(shakeBottle, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!isClient) {
    return null // or a loading spinner
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      
      <motion.div
        className="relative w-40 h-64 bg-blue-200 rounded-full overflow-hidden cursor-pointer"
        style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}
        animate={controls}
        onClick={takePill}
      >
        
        <div className="absolute top-0 left-0 right-0 h-12 bg-blue-300 rounded-t-full flex items-center justify-center text-2xl">
          😊
        </div>
        <div className="absolute bottom-4 left-4 right-4 top-16 bg-blue-100 rounded-b-full overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-2 bg-blue-400 rounded-full"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
              }}
              animate={controls}
            ></motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="mt-8 p-4 bg-yellow-100 rounded-lg shadow-md w-64 h-40 flex items-center justify-center text-center"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={paperControls}
      >
        <p className="text-gray-800">{currentMessage}</p>
      </motion.div>
    </div>
  )
}