
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
  Ban,
  Wallet,
  Settings,
  ShieldCheck
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
  user_email?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const userRole = user.user_metadata?.role || 'customer';
  const isEmployer = userRole === 'employer';

  const [formData, setFormData] = useState({
    amount: '',
    loan_type: 'Personal Loan',
    purpose: ''
  });

  const fetchApplications = async () => {
    setLoading(true);
    let query = supabase.from('loan_applications').select('*');
    
    // Customers only see their own
    if (!isEmployer) {
      query = query.eq('user_id', user.id);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (!error && data) setApplications(data);
    setLoading(false);

    if (!isEmployer && data && data.length === 0) {
      setIsFormOpen(true);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [isEmployer]);

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
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">
              {isEmployer ? 'Loan Management System' : 'Your Financial Portal'}
            </h1>
            <p className="text-slate-500 font-medium">
              Logged in as <span className={`font-bold capitalize ${isEmployer ? 'text-cyan-600' : 'text-amber-600'}`}>{userRole}</span> • {user.email}
            </p>
          </div>
          
          {!isEmployer && (
            <button 
              onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ amount: '', loan_type: 'Personal Loan', purpose: '' }); }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-bold shadow-lg transition-transform hover:scale-105 ${BRAND_COLORS.secondaryBg}`}
            >
              <Plus className="w-5 h-5" />
              <span>Apply for a Loan</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${isEmployer ? 'bg-cyan-50 text-cyan-600' : 'bg-amber-50 text-amber-600'}`}>
              {isEmployer ? <Users className="w-6 h-6"/> : <Wallet className="w-6 h-6"/>}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {isEmployer ? 'Total Submissions' : 'Active Balance'}
              </p>
              <p className="text-2xl font-black text-slate-900">
                {isEmployer ? applications.length : `K ${(applications.filter(a => a.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0) * 1.1).toLocaleString()}`}
              </p>
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
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isEmployer ? 'Disbursed Capital' : 'Approved Loans'}</p>
              <p className="text-2xl font-black text-slate-900">
                K {applications.filter(a => a.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
             <h2 className="text-xl font-bold text-slate-900">
               {isEmployer ? 'Inbound Loan Queue' : 'My Loan History'}
             </h2>
             <button onClick={fetchApplications} className="text-slate-400 hover:text-slate-600 text-sm font-bold">Refresh Feed</button>
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
                      No records found in this view.
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
                                {app.status === 'Pending' && (
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

        {/* Exclusive Customer Tools */}
        {!isEmployer && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
               <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
               <h3 className="text-2xl font-serif font-bold mb-4">Investment Portal</h3>
               <p className="text-amber-50/80 mb-6 font-medium">Earn up to 14.2% interest by investing with Aster Money Lenders. Secure your future with our certified portfolios.</p>
               <button className="px-6 py-3 bg-white text-amber-600 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-amber-50 transition-colors">
                 Manage Investments
               </button>
            </div>
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group border border-white/5">
               <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
               <h3 className="text-2xl font-serif font-bold mb-4">Credit Consultation</h3>
               <p className="text-slate-400 mb-6 font-medium">Get a free consultation with our credit experts to optimize your financial strategy and increase your loan eligibility.</p>
               <button className="px-6 py-3 bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/20 transition-colors border border-white/10">
                 Book Consultation
               </button>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && !isEmployer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className={`p-6 flex justify-between items-center text-white ${BRAND_COLORS.secondaryBg}`}>
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Entry' : 'Loan Application'}</h2>
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
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none" 
                  placeholder="5000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1 text-slate-400" /> Loan Type
                </label>
                <select 
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
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
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="E.g. Medical bills, Business stock..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={formLoading}
                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 ${BRAND_COLORS.secondaryBg} hover:opacity-95 disabled:opacity-50`}
              >
                {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{editingId ? 'Update Application' : 'Submit Loan Entry'}</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
