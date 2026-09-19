import { Link } from "react-router-dom";

function NotFound() {

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl font-extrabold text-blue-600">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mt-4">Page not found</h1>
      <p className="text-gray-500 mt-2">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  );
}

export default NotFound;
