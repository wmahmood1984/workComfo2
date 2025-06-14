import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ConnectButton from './ConnectButton'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full flex justify-between items-center px-6 py-4 bg-white shadow">
        <div className="text-xl font-bold text-green-600"><img 
        className='w-24'
        src={`/bgremoved.png`}></img></div>
        <div className="space-x-4">
          <a href="/explore" className="text-gray-700 hover:text-green-600">Explore Gigs</a>
          <a href="/post" className="text-gray-700 hover:text-green-600">Post a Gig</a>
          <ConnectButton/>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center mt-24 px-4">
        <h1 className="text-green-600 text-4xl font-extrabold">
          Decentralized Freelance Platform
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-xl">
          Hire professionals and get paid — all without middlemen. Built on blockchain. Fast, secure, and global.
        </p>

        <div className="mt-8 space-x-4">
          <a href="/post" className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700">
            Post a Job
          </a>
          <a href="/explore" className="bg-white text-green-600 border border-green-600 px-6 py-3 rounded-lg hover:bg-green-50">
            Browse Gigs
          </a>
        </div>
      </main>
    </div>
    </>
  )
}

export default App
