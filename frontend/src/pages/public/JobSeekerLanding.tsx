import { Link } from 'react-router-dom';
import { Briefcase, Zap, FileText, CheckCircle, Target, BrainCircuit, Activity, ArrowRight, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const JobSeekerLanding = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: 'Swipe-Based Discovery',
      description: 'Discover jobs through an intuitive swipe interface. Swipe right to save, left to pass.'
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      title: 'AI Resume Analysis',
      description: 'Upload a resume, analyze ATS compatibility, and receive instant improvement suggestions.'
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-blue-500" />,
      title: 'Explainable Matching',
      description: 'Understand exactly why a particular job matches your unique skills and experience.'
    },
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and receive actionable suggestions for improvement.'
    },
    {
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      title: 'Application Tracking',
      description: 'Monitor submitted applications and their statuses efficiently in one dashboard.'
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-500" />,
      title: 'Smart Recommendations',
      description: 'Discover jobs tailored to your preferences, adapting to your swipe behavior over time.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      {/* Premium Header */}
      <header className="absolute top-0 w-full z-50 border-b border-white/10 bg-black/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">SwipeX</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login?role=job_seeker" className="text-white/80 font-medium hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/register/job-seeker" className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2942")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-blue-900/70" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-400/20 text-blue-300 font-semibold text-sm mb-8 shadow-sm">
              <Zap className="w-4 h-4 text-blue-400" /> Supercharge Your Career
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
              Find Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Opportunity</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 max-w-xl leading-relaxed drop-shadow">
              Discover personalized job opportunities tailored just for you. Swipe through jobs, analyze your resume, and land interviews faster with AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register/job-seeker" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-blue-600/40 hover:-translate-y-1 transition-all text-lg flex items-center justify-center gap-2">
                Join as Job Seeker
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Right: UI Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:block relative"
          >
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/30 blur-[100px] -z-10 rounded-full"></div>
            
            {/* Mockup Card 1 */}
            <div className="bg-white rounded-[2rem] p-6 shadow-2xl transform rotate-2 translate-x-4 hover:rotate-0 hover:translate-x-0 transition-transform duration-500 border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl">Senior Frontend Engineer</h3>
                  <p className="text-slate-500 font-medium">TechNova Solutions • Remote</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">React</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">TypeScript</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">Framer Motion</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
                <Star className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-blue-900 mb-1">98% Match based on your resume</p>
                  <p className="text-sm text-blue-800/80">Your extensive experience with React and modern UI libraries perfectly aligns with their core stack.</p>
                </div>
              </div>
            </div>

            {/* Mockup Card 2 (Background) */}
            <div className="absolute top-8 -right-8 w-full bg-white/60 backdrop-blur-sm rounded-[2rem] p-6 shadow-xl -z-10 transform -rotate-3 scale-95 border border-white/50">
               <div className="h-16 w-3/4 bg-slate-200 rounded-xl mb-4 animate-pulse"></div>
               <div className="h-8 w-1/2 bg-slate-200 rounded-lg mb-6 animate-pulse"></div>
               <div className="h-24 w-full bg-slate-200 rounded-2xl animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-slate-50 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Discover, apply, and land your dream job in one intuitive, AI-powered platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group bg-white rounded-[2rem] p-8 border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <div className="group-hover:scale-110 group-hover:brightness-0 group-hover:invert transition-all duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600" />
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight drop-shadow-sm">Ready to accelerate your career?</h2>
          <p className="text-blue-100 text-xl mb-12 font-medium max-w-2xl mx-auto">
            Join thousands of job seekers who have already found their perfect match using SwipeX's AI platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register/job-seeker" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-slate-50 hover:scale-105 transition-all shadow-xl text-lg flex items-center justify-center gap-2">
              Create Job Seeker Account
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/login?role=job_seeker" className="px-8 py-4 bg-blue-700/50 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all text-lg border border-blue-400/30 backdrop-blur-sm flex items-center justify-center">
              Log in to Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
