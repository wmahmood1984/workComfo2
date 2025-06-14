import React from 'react'

export default function Home() {
  return (
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
  )
}
