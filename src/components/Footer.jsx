// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "/bgremoved2.png"; // Replace this with your actual logo path

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white py-10 px-6 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src={logo} alt="WorkComfo Logo" className="h-8 w-8" />
            <h3 className="text-xl font-bold">WorkComfo</h3>
          </div>
          <p className="text-sm text-green-100">
            Empowering Freelancers on Blockchain
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Explore</h4>
          <ul className="text-sm space-y-1 text-green-100">
            <li>
              <Link to="/explore" className="hover:underline">
                Browse Gigs
              </Link>
            </li>
            <li>
              <Link to="/post" className="hover:underline">
                Post a Job
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Company</h4>
          <ul className="text-sm space-y-1 text-green-100">
            <li>
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="text-sm text-green-200 flex items-end">
            <img src={logo} alt="WorkComfo Logo" className="h-8 w-8" />
          © {new Date().getFullYear()} WorkComfo™. 
          <br/> {" " }All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
