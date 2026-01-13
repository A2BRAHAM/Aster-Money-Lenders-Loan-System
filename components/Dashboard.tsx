
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Edit3, TrendingUp, Clock, CheckCircle, Loader2,
  DollarSign, Briefcase, User, X, Users, Check, Ban, Wallet,
  ShieldCheck, Home, ChevronDown, ChevronRight, Calendar,
  ClipboardList, ArrowRightLeft, UserPlus, PenTool, BarChart3,
  Calculator, HardDrive, Receipt, UserCheck, MapPin, Info,
  Upload, FileText, Smartphone, Mail, Map,
  Building, UserSquare2, Fingerprint, CreditCard, HeartHandshake,
  AlertCircle, Shield, ArrowLeft
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

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems?: string[];
  isSingle?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [currentView, setCurrentView] = useState('overview');
  
  const userRole = user.user_metadata?.role || 'customer';
  const isEmployer = userRole === 'employer';

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubItemClick = (subItem: string) => {
    setCurrentView(subItem);
  };

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

  const updateStatus = async (id: string, newStatus: string) => {
    if (!isEmployer) return;
    const { error } = await supabase.from('loan_applications').update({ status: newStatus, updated_at: new Date() }).eq(id, id);
    if (!error) fetchApplications();
  };

  const menuItems: MenuItem[] = [
    { id: 'branch', label: 'Home branch', icon: <Home className="w-4 h-4" />, isSingle: true },
    { id: 'borrowers', label: 'Borrowers', icon: <Users className="w-4 h-4" />, subItems: [
      'View borrowers', 'Add borrower', 'View borrower groups', 'Add borrowers group', 
      'Send SMS to all', 'Send email to all', 'Invite borrowers'
    ]},
    { id: 'loans', label: 'Loans', icon: <BarChart3 className="w-4 h-4" />, subItems: [
      'View all loans', 'Add loan', 'Due loans', 'Missed repayments', 'Loans in arrears',
      'No repayments', 'Past maturity date', 'Principal outstanding', '1 month late',
      '3 months late', 'Loan calculator', 'Guarantors', 'Loan comments', 'Approve loans'
    ]},
    { id: 'repayments', label: 'Repayments', icon: <DollarSign className="w-4 h-4" />, subItems: [
      'View repayments', 'Add bulk repayments', 'Add repayments (CSV)', 'Repayments charts', 'Approve repayments'
    ]},
    { id: 'collateral', label: 'Collateral register', icon: <ShieldCheck className="w-4 h-4" />, isSingle: true },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" />, isSingle: true },
    { id: 'collection', label: 'Collection sheets', icon: <ClipboardList className="w-4 h-4" />, subItems: [
      'Daily collection sheet', 'Missed repayment sheet', 'Past maturity date', 'Send SMS', 'Send email'
    ]},
    { id: 'savings', label: 'Savings', icon: <Wallet className="w-4 h-4" />, subItems: [
      'View savings accounts', 'Add savings account', 'Savings charts', 'Savings report',
      'Savings products report', 'Savings fee report', 'Cash safe management'
    ]},
    { id: 'savings_trans', label: 'Savings transactions', icon: <ArrowRightLeft className="w-4 h-4" />, subItems: [
      'View transactions', 'Add bulk transactions', 'Upload (CSV)', 'Staff report', 'Approve transactions'
    ]},
    { id: 'investors', label: 'Investors', icon: <UserPlus className="w-4 h-4" />, subItems: [
      'View investors', 'Add investor', 'Send SMS', 'Send email', 'Invite investors'
    ]},
    { id: 'investor_acc', label: 'Investor accounts', icon: <Briefcase className="w-4 h-4" />, subItems: [
      'View all accounts', 'Add investor account', 'View all investments', 'View investor transactions', 'Approve loan investments'
    ]},
    { id: 'signatures', label: 'E-signatures', icon: <PenTool className="w-4 h-4" />, isSingle: true },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, subItems: [
      'Borrowers report', 'Loan report', 'Loan arrears aging report', 'Collections report',
      'Collector report (staff)', 'Deferred income', 'Deferred income monthly', 'Pro-rata collections monthly',
      'Disbursement report', 'Fees report', 'Loan officer report', 'Loan products report',
      'MFRS ratios', 'Daily report', 'Monthly report', 'Outstanding report',
      'Portfolio at risk (PAR)', 'At a glance report'
    ]},
    { id: 'accounting', label: 'Accounting', icon: <Calculator className="w-4 h-4" />, subItems: [
      'Cash flow accumulated', 'Cash flow monthly', 'Profit / loss', 'Balance sheet',
      'Trial balance', 'General ledger summary', 'Branch equity', 'Inter-bank transfers',
      'Reconcile entries', 'Chart of accounts', 'Manual journal'
    ]},
    { id: 'assets', label: 'Asset management', icon: <HardDrive className="w-4 h-4" />, subItems: [
      'View asset management', 'Add asset management'
    ]},
    { id: 'income', label: 'Other income', icon: <TrendingUp className="w-4 h-4" />, subItems: [
      'View other income', 'Add other income', 'Upload other income (CSV file)'
    ]},
    { id: 'expenses', label: 'Expenses', icon: <Receipt className="w-4 h-4" />, subItems: [
      'View expenses', 'Add expense', 'Upload expenses (CSV file)'
    ]},
    { id: 'payroll', label: 'Payroll', icon: <UserCheck className="w-4 h-4" />, subItems: [
      'View payroll', 'Add payroll', 'Payroll report'
    ]}
  ];

  if (!isEmployer) {
    return (
      <div className="pt-24 pb-12 bg-red-50/10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-serif font-bold text-red-950">Your Portfolio</h1>
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest mt-1">
                Account: <span className="text-red-600">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <StatsCard icon={<Wallet className="w-8 h-8"/>} title="Portfolio Value" value={`K ${(applications.reduce((acc, c) => acc + (c.status === 'Approved' ? c.amount : 0), 0) * 1.1).toLocaleString()}`} />
            <StatsCard icon={<Clock className="w-8 h-8"/>} title="Active Requests" value={applications.filter(a => a.status === 'Pending').length.toString()} color="orange" />
            <StatsCard icon={<CheckCircle className="w-8 h-8"/>} title="Approved Credit" value={`K ${applications.filter(a => a.status === 'Approved').reduce((acc, c) => acc + c.amount, 0).toLocaleString()}`} color="red-filled" />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-red-50 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-red-50 flex justify-between items-center bg-red-50/10">
               <h2 className="text-lg font-bold text-red-950 uppercase tracking-widest">Transaction Queue</h2>
               <button onClick={fetchApplications} className="text-red-400 hover:text-red-600 text-xs font-black uppercase tracking-widest">Refresh</button>
            </div>
            <ApplicationTable loading={loading} applications={applications} isEmployer={false} updateStatus={updateStatus} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 fixed h-screen overflow-y-auto z-40 border-r border-slate-800 pt-20 custom-scrollbar">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate w-32">{user.email?.split('@')[0]}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Administrator</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-slate-500">Active Branch</span>
              <span className="bg-red-600/20 text-red-500 px-2 py-0.5 rounded">Branch #1</span>
            </div>
            <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2">
              View another branch
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.isSingle ? (
                <button 
                  onClick={() => setCurrentView('overview')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentView === 'overview' && item.id === 'branch' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-slate-500 group-hover:text-red-600">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      expandedMenus[item.id] ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`${expandedMenus[item.id] ? 'text-red-500' : 'text-slate-500'}`}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {expandedMenus[item.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  
                  {expandedMenus[item.id] && (
                    <div className="ml-9 space-y-1 py-1 animate-fade-in">
                      {item.subItems?.map((sub, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleSubItemClick(sub)}
                          className={`w-full text-left px-3 py-1.5 text-[11px] font-medium transition-all border-l border-slate-700 ${
                            currentView === sub ? 'text-red-500 pl-4 border-red-500' : 'text-slate-400 hover:text-red-500 hover:pl-4'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-64 pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          {currentView === 'Add borrower' ? (
            <AddBorrowerPage user={user} onBack={() => setCurrentView('overview')} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-slate-900">Admin Console</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="w-3 h-3 text-red-600" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Overview • Nchelenge Branch</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-slate-50">Generate Report</button>
                  <button 
                    onClick={() => setCurrentView('Add borrower')}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-black transition-all"
                  >+ Add New Borrower</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard icon={<Users className="w-6 h-6"/>} title="Total Borrowers" value="1,284" />
                <StatsCard icon={<Wallet className="w-6 h-6"/>} title="Portfolio Growth" value="+22.4%" color="green" />
                <StatsCard icon={<Clock className="w-6 h-6"/>} title="Arrears Aging" value="K 42,500" color="orange" />
                <StatsCard icon={<CheckCircle className="w-6 h-6"/>} title="Approval Rate" value="94.2%" color="red-filled" />
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Loan Requests</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input type="text" placeholder="Search..." className="pl-8 pr-4 py-1.5 rounded-full bg-slate-100 text-[10px] focus:outline-none focus:ring-1 focus:ring-red-600 w-48" />
                        <Users className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <button onClick={fetchApplications} className="text-red-600 hover:text-black text-[10px] font-black uppercase tracking-widest">Refresh View</button>
                  </div>
                </div>
                <ApplicationTable loading={loading} applications={applications} isEmployer={true} updateStatus={updateStatus} />
              </div>
            </>
          )}
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }
      `}} />
    </div>
  );
};

// --- ADD BORROWER PAGE COMPONENT ---
const AddBorrowerPage = ({ user, onBack }: { user: any, onBack: () => void }) => {
  const [customerType, setCustomerType] = useState('');
  const [docType, setDocType] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('');

  // INITIAL STATE WITH EMPTY FIELDS
  const initialForm = {
    fullName: '',
    nationality: '',
    gender: '',
    nrc: '',
    primaryPhone: '',
    email: '',
    nokName: '',
    nokPhone: '',
    employerName: '',
    jobTitle: '',
    employmentType: '',
    employmentDate: '',
    contractStartDate: '',
    contractEndDate: '',
    workStation: '',
    employeeNo: '',
    businessName: '',
    businessType: '',
    monthlyIncome: '',
    loanAmount: '',
    loanPurpose: '',
    loanPeriod: '',
    paymentFreqOther: '',
    bankName: '',
    bankBranch: '',
    sortCode: '',
    accountNumber: '',
    mmNumber: '',
    mmRegisteredName: '',
    houseNumber: '',
    district: '',
    province: '',
  };

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // SYSTEM GENERATED CUSTOMER NUMBER (READ-ONLY)
  const customerNumber = useMemo(() => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d}${m}${y}0001`; 
  }, []);

  // FORMATTERS & VALIDATORS
  const handleTypedInput = (key: string, val: string, isEmail: boolean = false) => {
    const processedValue = isEmail ? val.toLowerCase() : val.toUpperCase();
    setForm(prev => ({ ...prev, [key]: processedValue }));
  };

  const handleNameInput = (key: string, val: string) => {
    const clean = val.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    setForm(prev => ({ ...prev, [key]: clean }));
  };

  const handleEmailChange = (val: string) => {
    const clean = val.toLowerCase();
    setForm(prev => ({ ...prev, email: clean }));
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !re.test(val)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
    } else {
      setErrors(prev => {
        const n = { ...prev };
        delete n.email;
        return n;
      });
    }
  };

  const handleNRCChange = (val: string) => {
    let clean = val.replace(/\D/g, '');
    if (clean.length > 9) clean = clean.substring(0, 9);
    let formatted = '';
    for (let i = 0; i < clean.length; i++) {
      if (i === 6 || i === 8) formatted += '/';
      formatted += clean[i];
    }
    setForm(prev => ({ ...prev, nrc: formatted }));
  };

  const handlePhoneChange = (key: string, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (clean.length <= 9) {
      setForm(prev => ({ ...prev, [key]: clean }));
    }
  };

  const handleEmployeeNoChange = (val: string) => {
    let clean = val.replace(/\D/g, '');
    if (clean.length > 8) clean = clean.substring(0, 8);
    setForm(prev => ({ ...prev, employeeNo: clean }));
    if (clean && (clean.length !== 8 || !clean.startsWith('00'))) {
      setErrors(prev => ({ ...prev, employeeNo: 'Must be 8 digits starting with 00' }));
    } else {
      setErrors(prev => {
        const n = { ...prev };
        delete n.employeeNo;
        return n;
      });
    }
  };

  const handleCurrencyChange = (key: string, val: string) => {
    const clean = val.replace(/\D/g, '');
    setForm(prev => ({ ...prev, [key]: clean }));
  };

  const formatCurrency = (val: string) => {
    if (!val) return '';
    return `K ${Number(val).toLocaleString()}`;
  };

  const handleNumericChange = (key: string, val: string, maxLen: number) => {
    const clean = val.replace(/\D/g, '');
    if (clean.length <= maxLen) {
      setForm(prev => ({ ...prev, [key]: clean }));
    }
  };

  const padAccountNumber = () => {
    if (form.accountNumber && form.accountNumber.length < 13) {
      setForm(prev => ({ ...prev, accountNumber: prev.accountNumber.padStart(13, '0') }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isBankValid = form.accountNumber.length === 13 && form.sortCode.length === 6;
    const isMMValid = form.mmNumber.length === 9 && form.mmRegisteredName.length > 0;

    if (!isBankValid || !isMMValid) {
      alert("Error: Complete both Bank and Mobile Money accounts accurately.");
      return;
    }
    
    // SAVE LOGIC
    alert(`Success! Borrower ${form.fullName} saved with Number ${customerNumber}`);
    
    // CLEAR ALL FIELDS
    setForm(initialForm);
    setCustomerType('');
    setDocType('');
    setPaymentFrequency('');
    
    // REDIRECT TO HOME BRANCH (OVERVIEW)
    onBack();
  };

  // UI styling components - INCREASED FONT SIZE BY +2
  const labelClass = "text-[14px] text-black font-normal normal-case mb-1.5 block";
  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-700 font-normal outline-none focus:ring-1 focus:ring-red-600 transition-all uppercase placeholder:normal-case";
  
  // Specific audit section styling - FONT SIZES REDUCED PER SPEC
  const auditLabelClass = "text-[11px] text-black font-normal uppercase mb-0.5";
  const auditDetailClass = "text-[8px] text-slate-500 uppercase font-normal tracking-widest";

  return (
    <div className="min-h-screen bg-slate-100/50 py-10 px-4">
      <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-serif font-bold text-slate-900">Add Borrower Record</h1>
          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-red-100">Portal</span>
        </div>
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-[1.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-fade-in-up">
        <form onSubmit={handleSave} className="p-8 space-y-12">
          
          {/* CUSTOMER NUMBER HEADER */}
          <section className="bg-red-600 -mx-8 -mt-8 p-6 mb-8 text-white flex justify-between items-center border-b border-white/10">
             <div>
                <p className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-1">Customer Number</p>
                <h4 className="text-lg font-mono font-normal text-white">{customerNumber}</h4>
             </div>
             <Shield className="w-6 h-6 text-white/40" />
          </section>

          {/* SECTION 1: IDENTITY DETAILS */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
               <User className="w-4 h-4 text-red-600" />
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Identity details</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Full name (NRC/ID)</label>
                <input 
                  type="text" required
                  placeholder="Enter full legal name" 
                  value={form.fullName}
                  onChange={(e) => handleNameInput('fullName', e.target.value)}
                  className={inputClass} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>NRC number</label>
                  <input 
                    type="text" required
                    placeholder="123456/12/1" 
                    value={form.nrc}
                    onChange={(e) => handleNRCChange(e.target.value)}
                    className={`${inputClass} font-mono tracking-widest`} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Nationality</label>
                  <input 
                    type="text" required
                    value={form.nationality}
                    onChange={(e) => handleNameInput('nationality', e.target.value)}
                    className={inputClass} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Gender</label>
                  <select 
                    required
                    value={form.gender}
                    onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value }))}
                    className={`${inputClass} !normal-case`}
                  >
                     <option value="">Select gender</option>
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Phone number (+260)</label>
                  <div className="flex shadow-sm rounded-xl overflow-hidden border border-slate-200 transition-all focus-within:ring-1 focus-within:ring-red-600">
                    <span className="flex items-center px-4 bg-slate-50 text-[13px] font-normal text-slate-400 border-r border-slate-200">+260</span>
                    <input 
                      type="tel" required
                      value={form.primaryPhone}
                      onChange={(e) => handlePhoneChange('primaryPhone', e.target.value)}
                      placeholder="9 digits" 
                      className="w-full px-4 py-3 text-[13px] text-slate-700 font-normal outline-none uppercase" 
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Email address</label>
                <input 
                  type="email" required
                  value={form.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="lowercase@domain.com" 
                  className={`${inputClass} lowercase !font-normal`} 
                />
                {errors.email && <p className="text-[12px] text-red-500 font-normal mt-1">{errors.email}</p>}
              </div>
            </div>
          </section>

          {/* CUSTOMER RESIDENTIAL ADDRESS */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
               <MapPin className="w-4 h-4 text-red-600" />
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Customer residential address</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className={labelClass}>House number</label>
                <input 
                  type="text" required
                  placeholder="Enter house number" 
                  value={form.houseNumber}
                  onChange={(e) => handleTypedInput('houseNumber', e.target.value)}
                  className={inputClass} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>District</label>
                  <input 
                    type="text" required
                    placeholder="Enter district" 
                    value={form.district}
                    onChange={(e) => handleTypedInput('district', e.target.value)}
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Province</label>
                  <input 
                    type="text" required
                    placeholder="Enter province" 
                    value={form.province}
                    onChange={(e) => handleTypedInput('province', e.target.value)}
                    className={inputClass} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: VERIFICATION DOCUMENTS */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
               <Fingerprint className="w-4 h-4 text-red-600" />
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Verification documents</h3>
            </div>
            
            <div className="space-y-4">
               <div>
                 <label className={labelClass}>Document type</label>
                 <select 
                   required
                   value={docType}
                   onChange={(e) => setDocType(e.target.value)}
                   className={`${inputClass} !normal-case`}
                 >
                    <option value="">Select document type</option>
                    <option value="NRC (front & back)">NRC (front & back)</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver’s license">Driver’s license</option>
                 </select>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {docType.includes('NRC') ? (
                   <>
                     <div className="border-2 border-dashed border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 bg-slate-50 hover:border-red-600 cursor-pointer group">
                        <Upload className="w-5 h-5 text-slate-300 group-hover:text-red-600" />
                        <span className="text-[12px] font-normal uppercase text-slate-400">NRC front</span>
                     </div>
                     <div className="border-2 border-dashed border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 bg-slate-50 hover:border-red-600 cursor-pointer group">
                        <Upload className="w-5 h-5 text-slate-300 group-hover:text-red-600" />
                        <span className="text-[12px] font-normal uppercase text-slate-400">NRC back</span>
                     </div>
                   </>
                 ) : (
                   <div className="col-span-2 border-2 border-dashed border-slate-100 rounded-xl p-6 flex flex-col items-center justify-center space-y-2 bg-slate-50 hover:border-red-600 cursor-pointer group">
                      <Upload className="w-6 h-6 text-slate-300 group-hover:text-red-600" />
                      <span className="text-[13px] font-normal uppercase text-slate-400">Document photo</span>
                   </div>
                 )}
               </div>
            </div>
          </section>

          {/* SECTION 3: EMPLOYMENT DETAILS - REMOVED RED BORDER */}
          <section className="space-y-6 transition-all duration-300">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
               <Briefcase className="w-4 h-4 text-red-600" />
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Employment details</h3>
            </div>
            
            <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                <button 
                  type="button"
                  onClick={() => setCustomerType('Employed')}
                  className={`flex-1 py-2 rounded-lg text-[12px] font-normal uppercase transition-all ${customerType === 'Employed' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500'}`}
                >Employed</button>
                <button 
                  type="button"
                  onClick={() => setCustomerType('Self-employed')}
                  className={`flex-1 py-2 rounded-lg text-[12px] font-normal uppercase transition-all ${customerType === 'Self-employed' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500'}`}
                >Self-employed / business owner</button>
            </div>

            <div className="space-y-6 animate-fade-in">
              {customerType === 'Employed' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Employer name</label>
                      <input 
                        type="text" required
                        placeholder="Company name" 
                        value={form.employerName}
                        onChange={(e) => handleNameInput('employerName', e.target.value)}
                        className={inputClass} 
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Job title</label>
                      <input 
                        type="text" required
                        placeholder="Current role"
                        value={form.jobTitle}
                        onChange={(e) => handleNameInput('jobTitle', e.target.value)}
                        className={inputClass} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Employment type</label>
                      <select 
                        required
                        value={form.employmentType}
                        onChange={(e) => setForm(prev => ({ ...prev, employmentType: e.target.value }))}
                        className={`${inputClass} !normal-case`}
                      >
                         <option value="">Select type</option>
                         <option value="Permanent">Permanent</option>
                         <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Work station</label>
                      <input 
                        type="text" required
                        value={form.workStation}
                        onChange={(e) => handleTypedInput('workStation', e.target.value)}
                        placeholder="work station / department"
                        className={inputClass} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    {form.employmentType === 'Permanent' && (
                      <div>
                        <label className={labelClass}>Employment date</label>
                        <input 
                          type="date" required
                          value={form.employmentDate}
                          onChange={(e) => setForm(prev => ({ ...prev, employmentDate: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                    )}
                    {form.employmentType === 'Contract' && (
                      <>
                        <div>
                          <label className={labelClass}>Contract start date</label>
                          <input 
                            type="date" required
                            value={form.contractStartDate}
                            onChange={(e) => setForm(prev => ({ ...prev, contractStartDate: e.target.value }))}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Contract end date</label>
                          <input 
                            type="date" required
                            value={form.contractEndDate}
                            onChange={(e) => setForm(prev => ({ ...prev, contractEndDate: e.target.value }))}
                            className={inputClass}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Employee number (8 digits starting with 00)</label>
                    <input 
                      type="text" required
                      value={form.employeeNo}
                      onChange={(e) => handleEmployeeNoChange(e.target.value)}
                      placeholder="00xxxxxx"
                      className={`${inputClass} font-mono tracking-widest`} 
                    />
                    {errors.employeeNo && <p className="text-[12px] text-red-500 font-normal mt-1">{errors.employeeNo}</p>}
                  </div>
                </>
              )}
              {customerType === 'Self-employed' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Business name</label>
                      <input 
                        type="text" required
                        value={form.businessName}
                        onChange={(e) => handleNameInput('businessName', e.target.value)}
                        className={inputClass} 
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Type of business</label>
                      <input 
                        type="text" required
                        value={form.businessType}
                        onChange={(e) => handleNameInput('businessType', e.target.value)}
                        className={inputClass} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Monthly income</label>
                    <div className="flex shadow-sm rounded-xl overflow-hidden border border-slate-200 transition-all focus-within:ring-1 focus-within:ring-red-600">
                      <span className="bg-slate-50 px-4 flex items-center text-[13px] font-normal text-slate-400 border-r border-slate-200 tracking-widest">K</span>
                      <input 
                        type="text" required
                        value={form.monthlyIncome}
                        onChange={(e) => handleCurrencyChange('monthlyIncome', e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 text-[13px] text-slate-700 font-normal outline-none uppercase" 
                      />
                    </div>
                    {form.monthlyIncome && <p className="text-[12px] font-normal text-red-600 mt-1">{formatCurrency(form.monthlyIncome)}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>PACRA registration certificate</label>
                    <div className="border-2 border-dashed border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 bg-slate-50 hover:border-red-600 cursor-pointer group">
                      <Upload className="w-5 h-5 text-slate-300 group-hover:text-red-600" />
                      <span className="text-[10px] font-normal uppercase text-slate-400">PACRA registration certificate</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 4: CUSTOMER ACCOUNTS */}
          <section className="space-y-8">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
               <CreditCard className="w-4 h-4 text-red-600" />
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Customer accounts</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Building className="w-3 h-3" /> Bank account</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Bank name</label>
                    <input 
                      type="text" required placeholder="e.g. Absa"
                      value={form.bankName} onChange={(e) => handleTypedInput('bankName', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Branch</label>
                    <input 
                      type="text" required placeholder="Branch name"
                      value={form.bankBranch} onChange={(e) => handleTypedInput('bankBranch', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Account number</label>
                    <input 
                      type="text" required
                      value={form.accountNumber}
                      onChange={(e) => handleNumericChange('accountNumber', e.target.value, 13)}
                      onBlur={padAccountNumber}
                      placeholder="0000000000000"
                      className={`${inputClass} font-mono tracking-widest`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Sort code</label>
                    <input 
                      type="text" required
                      value={form.sortCode}
                      onChange={(e) => handleNumericChange('sortCode', e.target.value, 6)}
                      placeholder="6 digits"
                      className={`${inputClass} font-mono tracking-widest`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Smartphone className="w-3 h-3" /> Mobile money</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Account number (+260)</label>
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <span className="bg-slate-200 px-3 flex items-center text-[13px] font-normal text-slate-500 border-r border-slate-200">+260</span>
                      <input 
                        type="tel" required
                        value={form.mmNumber}
                        onChange={(e) => handlePhoneChange('mmNumber', e.target.value)}
                        placeholder="9 digits"
                        className="w-full px-3 py-2 text-[13px] text-slate-700 font-normal outline-none bg-white uppercase"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Registered name</label>
                    <input 
                      type="text" required placeholder="Name registered to this account"
                      value={form.mmRegisteredName} onChange={(e) => handleNameInput('mmRegisteredName', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: NEXT OF KIN */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
               <HeartHandshake className="w-4 h-4 text-red-600" />
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Next of kin</h3>
            </div>
            
            <div className="space-y-4">
               <div>
                 <label className={labelClass}>Full name</label>
                 <input 
                   type="text" required
                   value={form.nokName}
                   onChange={(e) => handleNameInput('nokName', e.target.value)}
                   className={inputClass} 
                 />
               </div>
               <div>
                 <label className={labelClass}>Phone number (+260)</label>
                 <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white">
                    <span className="bg-slate-50 px-4 flex items-center text-[13px] font-normal text-slate-400 border-r border-slate-200">+260</span>
                    <input 
                      type="tel" required
                      value={form.nokPhone}
                      onChange={(e) => handlePhoneChange('nokPhone', e.target.value)}
                      className="w-full px-4 py-3 text-[13px] text-slate-700 font-normal outline-none bg-white uppercase" 
                    />
                 </div>
               </div>
            </div>
          </section>

          {/* SECTION 6: LOAN REQUEST */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
               <DollarSign className="w-4 h-4 text-red-600" />
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Loan request</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div>
                 <label className={labelClass}>Requested amount</label>
                 <div className="flex rounded-xl overflow-hidden border border-slate-200">
                    <span className="bg-slate-50 px-4 flex items-center text-[13px] font-normal text-slate-400 border-r border-slate-200 tracking-widest">K</span>
                    <input 
                      type="text" required
                      value={form.loanAmount}
                      onChange={(e) => handleCurrencyChange('loanAmount', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 text-[13px] text-slate-700 font-normal outline-none uppercase" 
                    />
                 </div>
                 {form.loanAmount && <p className="text-[10px] font-normal text-red-600 mt-1">{formatCurrency(form.loanAmount)}</p>}
               </div>
               <div>
                 <label className={labelClass}>Loan purpose</label>
                 <input 
                   type="text" required
                   value={form.loanPurpose}
                   onChange={(e) => handleTypedInput('loanPurpose', e.target.value)}
                   placeholder="enter loan purpose"
                   className={inputClass} 
                 />
               </div>
               <div>
                 <label className={labelClass}>Loan period</label>
                 <select 
                   required
                   value={form.loanPeriod}
                   onChange={(e) => setForm(prev => ({ ...prev, loanPeriod: e.target.value }))}
                   className={`${inputClass} !normal-case`}
                 >
                    <option value="">Select period</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={`${m} month${m > 1 ? 's' : ''}`}>{m} month${m > 1 ? 's' : ''}</option>
                    ))}
                 </select>
               </div>
               <div>
                 <label className={labelClass}>Payment frequency</label>
                 <select 
                   required
                   value={paymentFrequency}
                   onChange={(e) => setPaymentFrequency(e.target.value)}
                   className={`${inputClass} !normal-case`}
                 >
                    <option value="">Select frequency</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                    <option value="Other">Other</option>
                 </select>
               </div>
            </div>
            {paymentFrequency === 'Other' && (
              <div className="animate-fade-in">
                <label className={labelClass}>Specify frequency</label>
                <input 
                  type="text" required
                  value={form.paymentFreqOther}
                  onChange={(e) => handleTypedInput('paymentFreqOther', e.target.value)}
                  placeholder="Specify payment frequency"
                  className={inputClass}
                />
              </div>
            )}
          </section>

          {/* AUDIT TRAIL - REDUCED FONT SIZES */}
          <section className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-200 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-slate-900" />
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Recorded and verified by</h4>
             </div>
             <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                   <p className={auditLabelClass}>Full name</p>
                   <p className={auditDetailClass}>{user.user_metadata?.full_name || 'System Admin'}</p>
                </div>
                <div>
                   <p className={auditLabelClass}>Email address</p>
                   <p className={auditDetailClass}>{user.email}</p>
                </div>
                <div>
                   <p className={auditLabelClass}>Employee number</p>
                   <p className={auditDetailClass}>{user.user_metadata?.employee_number || 'N/A'}</p>
                </div>
                <div>
                   <p className={auditLabelClass}>Position / role</p>
                   <p className="text-red-600 text-[8px] uppercase font-normal tracking-widest">{user.user_metadata?.role || 'Administrator'}</p>
                </div>
             </div>
          </section>

          <div className="pt-8 flex items-center justify-between">
             <button 
              type="button" 
              onClick={onBack}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
             >
               Discard
             </button>
             <button 
              type="submit" 
              className="px-10 py-4 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-black transition-all active:scale-95"
             >
               Save
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const StatsCard = ({ icon, title, value, color = 'red' }: { icon: any, title: string, value: string, color?: string }) => {
  const colorStyles: Record<string, string> = {
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-500',
    green: 'bg-green-50 text-green-600',
    'red-filled': 'bg-red-600 text-white shadow-lg shadow-red-100'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-5">
      <div className={`p-3 rounded-xl ${colorStyles[color] || colorStyles.red}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const ApplicationTable = ({ loading, applications, isEmployer, updateStatus }: { loading: boolean, applications: Application[], isEmployer: boolean, updateStatus: any }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
          <th className="px-8 py-4">Borrower Details</th>
          <th className="px-8 py-4">Principal Amount</th>
          <th className="px-8 py-4">Status</th>
          <th className="px-8 py-4">Date Filed</th>
          <th className="px-8 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {loading ? (
          <tr><td colSpan={5} className="px-8 py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" /></td></tr>
        ) : applications.length === 0 ? (
          <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active loan records</td></tr>
        ) : (
          applications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-4">
                <div className="font-bold text-slate-900">{app.loan_type}</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate max-w-[150px]">{app.purpose}</div>
              </td>
              <td className="px-8 py-4 font-black text-slate-900">K {app.amount.toLocaleString()}</td>
              <td className="px-8 py-4">
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  app.status === 'Pending' ? 'status-pending' : app.status === 'Approved' ? 'status-approved' : 'status-rejected'
                }`}>
                  {app.status}
                </span>
              </td>
              <td className="px-8 py-4 text-[10px] text-slate-600 font-bold">{new Date(app.created_at).toLocaleDateString()}</td>
              <td className="px-8 py-4 text-right">
                <div className="flex justify-end space-x-2">
                  {isEmployer ? (
                    <>
                      <button onClick={() => updateStatus(app.id, 'Approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => updateStatus(app.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject"><Ban className="w-3.5 h-3.5" /></button>
                    </>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 italic">No action needed</span>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default Dashboard;
