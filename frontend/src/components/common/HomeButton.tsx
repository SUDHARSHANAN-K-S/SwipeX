import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export const HomeButton = () => {
  return (
    <Link 
      to="/" 
      title="Go to Home" 
      className="fixed top-6 left-6 z-50 flex items-center gap-2 group transition-all rounded-xl p-2 hover:bg-white/60 hover:shadow-sm"
    >
      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all">
        <Briefcase className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
        SwipeX
      </span>
    </Link>
  );
};
