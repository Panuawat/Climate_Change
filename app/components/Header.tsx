'use client';

import Link from 'next/link';
import { Home, Info } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
      <h1 className="text-xl font-bold text-gray-800">Climate Change</h1>
      <nav className="flex gap-4">
        <Link href="/" className="text-gray-600 hover:text-gray-800">
          <Home size={20} />
        </Link>
        <Link href="/about" className="text-gray-600 hover:text-gray-800">
          <Info size={20} />
        </Link>
      </nav>
    </header>
  );
}