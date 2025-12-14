import { Link } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';

function NotFound() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
        <p className="mb-4">The page you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;