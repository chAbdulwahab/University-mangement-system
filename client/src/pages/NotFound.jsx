import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h1 className="text-9xl font-black text-text/5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
          404
        </h1>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4">Oops! Page not found</h2>
          <p className="text-text/60 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another universe.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;


