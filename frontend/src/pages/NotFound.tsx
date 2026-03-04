import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center w-full max-w-md bg-white p-10 rounded-2xl shadow-xl transition-all hover:shadow-2xl border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-5 rounded-full ring-8 ring-blue-50/50">
            <AlertCircle className="h-16 w-16 text-blue-600" />
          </div>
        </div>
        <h1 className="text-7xl font-black text-slate-900 mb-2 tracking-tighter shadow-sm drop-shadow-sm">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Page Not Found</h2>
        <p className="text-slate-500 mb-8 mx-auto text-base">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            <Home className="mr-2 -ml-1 h-5 w-5" />
            Return to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center px-6 py-3.5 border border-slate-200 text-base font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-[0.98]"
          >
            Go Back
          </button>
        </div>
      </div>
      
      <div className="mt-12 text-center text-sm tracking-wide text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} Unity Hospital. All rights reserved.
      </div>
    </div>
  );
};

export default NotFound;
