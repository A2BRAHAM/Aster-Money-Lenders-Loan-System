
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Loader2,
  DollarSign,
  Briefcase,
  User,
  X,
  Users,
  Check,
  Ban,
  Wallet,
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
    if (!isEmployer) {
      query = query.eq('user_id', user.id);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) setApplications(data);
    setLoading(false);
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
      const { error: err } = await supabase.from('loan_applications').update(payload).eq('id', editingId);
      error = err;
    } else {
      const { error: err } = await supabase.from('loan_applications').insert([payload]);
      error = err;
    }
    if (!error) {
      await fetchApplications();
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ amount: '', loan_type: 'Personal Loan', purpose: '' });
    }
    setFormLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (!isEmployer) return;
    const { error } = await supabase.from('loan_applications').update({ status: newStatus, updated_at: new Date() }).eq('id', id);
    if (!error) fetchApplications();
  };

  const handleEdit = (app: Application) => {
    if (app.status !== 'Pending') return;
    setFormData({ amount: app.amount.toString(), loan_type: app.loan_type, purpose: app.purpose });
    setEditingId(app.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this application?')) {
      const { error } = await supabase.from('loan_applications').delete().eq('id', id);
      if (!error) fetchApplications();
    }
  };

  return (
    <div className="pt-24 pb-12 bg-red-50/10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-serif font-bold text-red-950">
              {isEmployer ? 'Management Console' : 'Your Portfolio'}
            </h1>
            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mt-1">
              Account: <span className={BRAND_COLORS.primary}>{user.email}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-red-50 shadow-sm flex items-center space-x-6">
            <div className={`p-4 rounded-2xl bg-red-50 ${BRAND_COLORS.primary}`}><Wallet className="w-8 h-8"/></div>
            <div>
              <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest mb-1">Portfolio Value</p>
              <p className="text-2xl font-black text-red-950">K {(applications.reduce((acc, c) => acc + (c.status === 'Approved' ? c.amount : 0), 0) * 1.1).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-red-50 shadow-sm flex items-center space-x-6">
            <div className="p-4 rounded-2xl bg-orange-50 text-orange-500"><Clock className="w-8 h-8"/></div>
            <div>
              <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest mb-1">Active Requests</p>
              <p className="text-2xl font-black text-red-950">{applications.filter(a => a.status === 'Pending').length}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-red-50 shadow-sm flex items-center space-x-6">
            <div className={`p-4 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-100`}><CheckCircle className="w-8 h-8"/></div>
            <div>
              <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest mb-1">Approved Credit</p>
              <p className="text-2xl font-black text-red-950">K {applications.filter(a => a.status === 'Approved').reduce((acc, c) => acc + c.amount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-red-50 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-red-50 flex justify-between items-center bg-red-50/10">
             <h2 className="text-lg font-bold text-red-950 uppercase tracking-widest">Transaction Queue</h2>
             <button onClick={fetchApplications} className="text-red-400 hover:text-red-600 text-xs font-black uppercase tracking-widest">Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-red-50/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Product</th>
                  <th className="px-8 py-5">Principal</th>
                  <th className="px-8 py-5">Current Status</th>
                  <th className="px-8 py-5">Initiated</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-50">
                {loading ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" /></td></tr>
                ) : applications.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-red-400 font-bold uppercase tracking-widest text-xs">No active records</td></tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-red-50/10 transition-colors">
                      <td className="px-8 py-5"><div className="font-bold text-red-950">{app.loan_type}</div><div className="text-[9px] text-red-400 font-bold uppercase tracking-widest">{app.purpose.slice(0, 30)}...</div></td>
                      <td className="px-8 py-5 font-black text-red-950">K {app.amount.toLocaleString()}</td>
                      <td className="px-8 py-5"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'Pending' ? 'status-pending' : app.status === 'Approved' ? 'status-approved' : 'status-rejected'}`}>{app.status}</span></td>
                      <td className="px-8 py-5 text-xs text-red-700 font-bold">{new Date(app.created_at).toLocaleDateString()}</td>
                      <td className="px-8 py-5 text-right"><div className="flex justify-end space-x-2">{isEmployer ? (<><button onClick={() => updateStatus(app.id, 'Approved')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Check className="w-4 h-4" /></button><button onClick={() => updateStatus(app.id, 'Rejected')} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"><Ban className="w-4 h-4" /></button></>) : (<>{app.status === 'Pending' && (<><button onClick={() => handleEdit(app)} className="p-2 text-red-400 hover:text-red-600 rounded-lg"><Edit3 className="w-4 h-4" /></button><button onClick={() => handleDelete(app.id)} className="p-2 text-red-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button></>)}</>)}</div></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
