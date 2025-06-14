// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import ConnectButton from '../ConnectButton';

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center py-4 px-6 bg-white shadow">
      <Link to="/" className="text-xl font-bold text-green-600"><img 
        className='w-24'
        src={`/bgremoved.png`}></img></Link>
      <div className="space-x-4">
        <Link to="/explore" className="text-gray-700 hover:text-green-600">Explore Gigs</Link>
        <Link to="/post" className="text-gray-700 hover:text-green-600">Post a Gig</Link>
          <ConnectButton/>
      </div>
    </nav>
  );
}
