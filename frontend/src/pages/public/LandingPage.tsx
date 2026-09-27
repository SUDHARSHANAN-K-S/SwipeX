import { useNavigate } from 'react-router-dom';
import { Briefcase, Building, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-900">
      {/* Premium Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=2747&q=80")' }}
      >
        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-blue-900/70" />
      </div>

      <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">SwipeX</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl w-full mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 font-medium text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            The AI-Powered Career Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">SwipeX</span>
          </h1>
          <p className="mt-6 text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow">
            Tell us who you are to discover a personalized, AI-driven experience designed specifically for your career goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full perspective-1000">
          {/* Job Seeker Card */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            onClick={() => navigate('/job-seeker')}
            className="group cursor-pointer relative overflow-hidden rounded-[2rem] bg-white/10 backdrop-blur-lg border border-white/20 p-10 hover:bg-white/15 hover:border-blue-400/50 transition-all duration-500 flex flex-col items-center text-center shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-2"
          >
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/30 blur-[60px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-blue-500/30">
              <Search className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">I'm a Job Seeker</h2>
            <p className="text-slate-300 mb-10 flex-1 leading-relaxed">
              Discover dream roles, improve your resume with AI, and manage applications through our intuitive swipe interface.
            </p>
            <div className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl group-hover:shadow-lg group-hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2">
              Explore as Job Seeker
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Recruiter Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            onClick={() => navigate('/recruiter')}
            className="group cursor-pointer relative overflow-hidden rounded-[2rem] bg-white/10 backdrop-blur-lg border border-white/20 p-10 hover:bg-white/15 hover:border-indigo-400/50 transition-all duration-500 flex flex-col items-center text-center shadow-2xl hover:shadow-indigo-500/20 transform hover:-translate-y-2"
          >
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/30 blur-[60px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 text-indigo-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 border border-indigo-500/30">
              <Building className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">I'm a Recruiter</h2>
            <p className="text-slate-300 mb-10 flex-1 leading-relaxed">
              Post jobs, discover top candidates faster, and simplify hiring with AI-powered matching and powerful analytics.
            </p>
            <div className="w-full py-4 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl group-hover:shadow-lg group-hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2">
              Explore as Recruiter
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
