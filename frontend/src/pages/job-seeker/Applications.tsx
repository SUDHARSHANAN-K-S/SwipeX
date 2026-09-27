import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building, MapPin, Loader2, RefreshCw, Calendar, CheckCircle, XCircle, Clock, Heart, SkipBack, Undo2, Send, Search } from 'lucide-react';
import { applicationsApi } from '../../api/applications.api';
import type { JobInteraction } from '../../api/applications.api';
import { jobsApi } from '../../api/jobs.api';

// Status styling mapping
const statusStyles: Record<string, { bg: string, text: string, icon: any }> = {
  'Applied': { bg: 'bg-blue-50', text: 'text-blue-700', icon: Clock },
  'Shortlisted': { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: CheckCircle },
  'Interview': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Calendar },
  'Offer': { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
  'Hired': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  'Rejected': { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
  'Saved': { bg: 'bg-pink-50', text: 'text-pink-700', icon: Heart },
  'Skipped': { bg: 'bg-slate-100', text: 'text-slate-600', icon: SkipBack },
};

type TabType = 'All' | 'Applied' | 'Saved' | 'Skipped';

export const Applications = () => {
  const [history, setHistory] = useState<JobInteraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await applicationsApi.getJobHistory();
      setHistory(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load job history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUndoSkip = async (jobId: string) => {
    setActionLoading(jobId);
    try {
      await jobsApi.undoSkip(jobId);
      // Remove from history
      setHistory(prev => prev.filter(item => !(item.job.job_id === jobId && item.type === 'Skipped')));
    } catch (err) {
      console.error(err);
      alert('Failed to undo skip.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApply = async (jobId: string) => {
    setActionLoading(jobId);
    try {
      await applicationsApi.applyToJob(jobId);
      // Update local state to reflect applied status
      setHistory(prev => prev.map(item => {
        if (item.job.job_id === jobId && item.type === 'Saved') {
          return { ...item, type: 'Applied', status: 'Applied', interaction_date: new Date().toISOString() };
        }
        return item;
      }));
    } catch (err) {
      console.error(err);
      alert('Failed to apply. You may have already applied.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      // Tab filter
      if (activeTab !== 'All' && item.type !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = item.job?.job_title?.toLowerCase().includes(query);
        const companyMatch = item.job?.company_name?.toLowerCase().includes(query);
        if (!titleMatch && !companyMatch) return false;
      }
      return true;
    });
  }, [history, activeTab, searchQuery]);

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 text-sm">Loading job history…</p>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={fetchHistory} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Job History</h1>
        <p className="text-slate-500 text-sm mt-1">Review your applications, saved jobs, and skipped opportunities.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        {/* Tabs */}
        <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm w-full sm:w-auto overflow-x-auto">
          {(['All', 'Applied', 'Saved', 'Skipped'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-slate-100 text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs or companies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 px-4 bg-white border border-slate-200 border-dashed rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} jobs found</h2>
          <p className="text-slate-500 text-sm max-w-sm">
            {searchQuery 
              ? "We couldn't find any jobs matching your search." 
              : "You haven't interacted with any jobs yet. Start swiping on the Discover page!"}
          </p>
          {!searchQuery && (
            <Link to="/dashboard" className="px-5 py-2.5 mt-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Discover Jobs
            </Link>
          )}
        </div>
      )}

      {/* List */}
      <div className="grid gap-4">
        {filteredHistory.map((item) => {
          const style = statusStyles[item.status] || statusStyles['Applied'];
          const StatusIcon = style.icon;
          const isProcessing = actionLoading === item.job.job_id;

          return (
            <div
              key={item.interaction_id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all flex flex-col md:flex-row gap-5"
            >
              {/* Left Content */}
              <div className="flex items-start gap-4 flex-1">
                {/* Company Logo */}
                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  {item.job?.company_logo
                    ? <img src={item.job.company_logo} alt={item.job.company_name || ''} className="w-full h-full object-cover rounded-xl" />
                    : <Building className="w-7 h-7 text-slate-400" />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="font-bold text-slate-900 text-lg truncate">{item.job?.job_title || 'Unknown Position'}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">{item.job?.company_name || 'Company'}</p>

                  <div className="flex flex-wrap gap-2.5 mt-3">
                    {item.job?.location && (
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />{item.job.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> 
                      {item.type === 'Skipped' ? 'Skipped' : item.type === 'Saved' ? 'Saved' : 'Applied'} {new Date(item.interaction_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Actions & Status */}
              <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                {/* Status Badge */}
                <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${style.bg} ${style.text}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="font-bold text-xs">{item.status}</span>
                </div>

                {/* Action Buttons */}
                {item.type === 'Skipped' && (
                  <button 
                    onClick={() => handleUndoSkip(item.job.job_id)}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Undo2 className="w-3.5 h-3.5" />}
                    Undo Skip
                  </button>
                )}

                {item.type === 'Saved' && (
                  <button 
                    onClick={() => handleApply(item.job.job_id)}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm disabled:opacity-70"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
