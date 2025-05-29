import { NextPage } from 'next';
import Link from 'next/link';

const Custom500: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">500</h1>
        <p className="text-xl text-gray-600 mb-8">Internal Server Error</p>
        <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Custom500; 