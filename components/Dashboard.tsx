
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  DollarSign,
  Briefcase,
  User,
  X,
  FileText,
  Users,
  Check,
  Ban
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BRAND_COLORS } from '../constants';

interface DashboardProps {
  user: any;
}

interface Application {
  id: string;
  user_id: string;
  amount: number;
  loan_type: string;
  purpose: string;
  status: string;
  created_at: string;
  user_email?: string; // Only for employers
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Detect role from metadata
  const userRole = user.user_metadata?.role || 'customer';
  const isEmployer = userRole === 'employer';

  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    loan_type: 'Personal Loan',
    purpose: ''
  });

  const fetchApplications = async () => {
    setLoading(true);
    let query = supabase
      .from('loan_applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    // If employer, we might want to join user data, but for simplicity we show raw data
    // In a real app, you'd fetch user emails from profiles table
    
    const { data, error } = await query;
    
    if (!error && data) setApplications(data);
    setLoading(false);

    // Auto-open form for new customers with no entries
    if (!isEmployer && data && data.length === 0) {
      setIsFormOpen(true);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      user_id: user.id,
      amount: parseFloat(formData.amount),
      loan_type: formData.loan_type,
      purpose: formData.purpose,
      updated_at: new Date()
    };

    let error;
    if (editingId) {
      const { error: err } = await supabase
        .from('loan_applications')
        .update(payload)
        .eq('id', editingId);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('loan_applications')
        .insert([payload]);
      error = err;
    }

    if (!error) {
      await fetchApplications();
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ amount: '', loan_type: 'Personal Loan', purpose: '' });
    } else {
      alert(error.message);
    }
    setFormLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (!isEmployer) return;
    
    const { error } = await supabase
      .from('loan_applications')
      .update({ status: newStatus, updated_at: new Date() })
      .eq('id', id);
    
    if (!error) {
      fetchApplications();
    } else {
      alert(error.message);
    }
  };

  const handleEdit = (app: Application) => {
    if (app.status !== 'Pending') {
      alert('Only pending applications can be edited.');
      return;
    }
    setFormData({
      amount: app.amount.toString(),
      loan_type: app.loan_type,
      purpose: app.purpose
    });
    setEditingId(app.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      const { error } = await supabase
        .from('loan_applications')
        .delete()
        .eq('id', id);
      
      if (!error) fetchApplications();
    }
  };

  return (
    <div className="pt-24 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">
              {isEmployer ? 'Employer Portal' : 'Customer Portal'}
            </h1>
            <p className="text-slate-500 font-medium">
              Logged in as <span className="text-cyan-600 font-bold capitalize">{userRole}</span> • {user.email}
            </p>
          </div>
          
          {!isEmployer && (
            <button 
              onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ amount: '', loan_type: 'Personal Loan', purpose: '' }); }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-bold shadow-lg transition-transform hover:scale-105 ${BRAND_COLORS.primaryBg}`}
            >
              <Plus className="w-5 h-5" />
              <span>New Loan Entry</span>
            </button>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="bg-cyan-50 p-3 rounded-xl text-cyan-600">
              {isEmployer ? <Users className="w-6 h-6"/> : <TrendingUp className="w-6 h-6"/>}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {isEmployer ? 'Total Applications' : 'Your Entries'}
              </p>
              <p className="text-2xl font-black text-slate-900">{applications.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><Clock className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Review</p>
              <p className="text-2xl font-black text-slate-900">
                {applications.filter(a => a.status === 'Pending').length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="bg-green-50 p-3 rounded-xl text-green-600"><CheckCircle className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved Volume</p>
              <p className="text-2xl font-black text-slate-900">
                K {applications.filter(a => a.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* List View */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
             <h2 className="text-xl font-bold text-slate-900">
               {isEmployer ? 'Global Entries' : 'Your Loan History'}
             </h2>
             <button onClick={fetchApplications} className="text-cyan-600 hover:text-cyan-700 text-sm font-bold">Refresh Feed</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Loan Details</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-300" />
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                      No applications currently in system.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{app.loan_type}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[200px]">
                          {isEmployer ? `UID: ${app.user_id.slice(0, 8)}...` : app.purpose}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-700">K {app.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          app.status === 'Pending' ? 'status-pending' : 
                          app.status === 'Approved' ? 'status-approved' : 'status-rejected'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end space-x-1">
                            {isEmployer ? (
                              <>
                                <button 
                                  onClick={() => updateStatus(app.id, 'Approved')}
                                  title="Approve"
                                  className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => updateStatus(app.id, 'Rejected')}
                                  title="Reject"
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleEdit(app)}
                                  className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(app.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Entry Form Modal */}
      {isFormOpen && !isEmployer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className={`p-6 flex justify-between items-center text-white ${BRAND_COLORS.primaryBg}`}>
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Entry' : 'Fill Loan Form'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-slate-400" /> Loan Amount (K)
                </label>
                <input 
                  type="number" 
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-cyan-600 outline-none" 
                  placeholder="5000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1 text-slate-400" /> Loan Type
                </label>
                <select 
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-cyan-600 outline-none"
                  value={formData.loan_type}
                  onChange={(e) => setFormData({...formData, loan_type: e.target.value})}
                >
                  <option>Personal Loan</option>
                  <option>Business Loan</option>
                  <option>Salaried Loan</option>
                  <option>Collateral Loan</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <User className="w-4 h-4 mr-1 text-slate-400" /> Purpose of Loan
                </label>
                <textarea 
                  rows={3}
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-cyan-600 outline-none"
                  placeholder="E.g. Business expansion..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={formLoading}
                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 ${BRAND_COLORS.primaryBg} hover:opacity-95 disabled:opacity-50`}
              >
                {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{editingId ? 'Update Entry' : 'Submit Loan Application'}</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
