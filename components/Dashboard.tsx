import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Edit3, TrendingUp, Clock, CheckCircle, Loader2,
  DollarSign, Briefcase, User, X, Users, Check, Ban, Wallet,
  ShieldCheck, Home, ChevronDown, ChevronRight, Calendar,
  ClipboardList, ArrowRightLeft, UserPlus, PenTool, BarChart3,
  Calculator, HardDrive, Receipt, UserCheck, MapPin, Info,
  Upload, FileText, Smartphone, Mail, Map,
  Building, UserSquare2, Fingerprint, CreditCard, HeartHandshake,
  AlertCircle, Shield, ArrowLeft, Settings, ShieldAlert, ToggleLeft, ToggleRight,
  Package, Search, Filter, MoreHorizontal, History,
  UserCircle, Eye, Download, Activity, PanelLeftClose, PanelLeftOpen, HelpCircle,
  Zap, Headset, ShoppingCart, Box, Printer, FileSpreadsheet, ArrowDown, Bell,
  FileDown, RefreshCw, Layers, ShieldCheck as ShieldCheckIcon, AlertTriangle,
  RotateCcw, Landmark, List, ClipboardCheck, ChevronUp, Paperclip, 
  Maximize2, StickyNote, Paperclip as PaperclipIcon, Layout, ExternalLink, File,
  Minimize2, Square, Printer as PrinterIcon, Minus, Copy, MessageSquare, Share2, Star,
  Mail as MailIcon, ArrowDownAz, Settings2, SearchIcon, CalculatorIcon, CheckSquare, 
  AlertOctagon, UserMinus, FileUp, Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  balance?: number;
  due_date?: string;
  customer_name?: string;
}

interface Borrower {
  id: string;
  customerNumber: string;
  fullName: string;
  gender: string;
  dob: string;
  nrc: string;
  phone: string;
  email: string;
  address: string;
  employmentType: 'Employed' | 'Self-employed';
  status: 'Current' | 'In arrears' | 'Closed';
  branch: string;
  totalPaid: number;
  openLoansBalance: number;
  companyName?: string;
  fax?: string;
  terms?: string;
  nationality?: string;
  regDate?: string;
  verifiedBy?: string;
  verifiedRole?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems?: { id: string; label: string }[];
  isSingle?: boolean;
}

const SYSTEM_ADMIN_EMAIL = "abrahamgmutwale@gmail.com";

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [currentView, setCurrentView] = useState('overview');
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null);
  const [showPaymentWidget, setShowPaymentWidget] = useState(false);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const isSystemAdmin = user.email === SYSTEM_ADMIN_EMAIL;
  const userRole = isSystemAdmin ? 'Admin' : (user.user_metadata?.role || 'customer');

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubItemClick = (viewId: string) => {
    setCurrentView(viewId);
  };

  const sidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const fetchApplications = async () => {
    setLoading(true);
    let query = supabase.from('loan_applications').select('*');
    if (userRole === 'customer') {
      query = query.eq('user_id', user.id);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (!error && data) {
      const supplemented = data.map(app => ({
        ...app,
        balance: app.status === 'Approved' ? app.amount * 0.8 : 0,
        due_date: new Date(Date.now() + 86400000 * 15).toISOString(),
        customer_name: app.user_email?.split('@')[0] || 'Unknown Customer'
      }));
      setApplications(supplemented);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [userRole]);

  const menuItems: MenuItem[] = [
    { id: 'branch', label: 'Home Branch', icon: <Home className="w-4 h-4" />, isSingle: true },
    { id: 'borrowers', label: 'Borrowers', icon: <Users className="w-4 h-4" />, subItems: [
      { id: 'ViewBorrowers', label: 'View Borrowers' },
      { id: 'AddBorrower', label: 'Add Borrower' },
      { id: 'ViewBorrowerGroups', label: 'View Borrower Groups' },
      { id: 'InviteBorrowers', label: 'Invite Borrowers' }
    ]},
    { id: 'loans', label: 'Loans', icon: <BarChart3 className="w-4 h-4" />, subItems: [
      { id: 'ViewAllLoans', label: 'View All Loans' },
      { id: 'AddLoan', label: 'Add Loan' },
      { id: 'DueLoans', label: 'Due Loans' },
      { id: 'LoanCalculator', label: 'Loan Calculator' },
      { id: 'ApproveLoans', label: 'Approve Loans' }
    ]},
    { id: 'repayments', label: 'Repayments', icon: <DollarSign className="w-4 h-4" />, subItems: [
      { id: 'ViewRepayments', label: 'View Repayments' },
      { id: 'AddBulkRepayments', label: 'Add Bulk Repayments' },
      { id: 'ApproveRepayments', label: 'Approve Repayments' }
    ]},
    { id: 'accounting', label: 'Accounting', icon: <Calculator className="w-4 h-4" />, subItems: [
      { id: 'BalanceSheet', label: 'Balance Sheet' },
      { id: 'TrialBalance', label: 'Trial Balance' },
      { id: 'ChartOfAccounts', label: 'Chart of Accounts' },
      { id: 'ManualJournal', label: 'Manual Journal' }
    ]},
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" />, subItems: [
      { id: 'LoanReport', label: 'Loan Report' },
      { id: 'BorrowersReport', label: 'Borrowers Report' },
      { id: 'CollectionsReport', label: 'Collections Report' }
    ]}
  ];

  const handleAction = (action: string) => {
    if (action === 'ReceivePayment') setShowPaymentWidget(true);
    else if (action === 'AddLoan' || action === 'CreateLoan') {
      setCurrentView('AddLoan');
    }
    else if (action === 'ReviewLoanRequest' || action === 'ApproveLoan') setCurrentView('ApproveLoans');
    else if (action === 'ViewCustomersList') setCurrentView('ViewBorrowers');
    else if (action === 'RegisterCustomer') {
      setEditingBorrower(null);
      setCurrentView('AddBorrower');
    }
    else if (action === 'Calendar') setCurrentView('calendar_view');
  };

  const handleViewBorrower = (borrower: Borrower) => {
    setSelectedBorrower(borrower);
    setCurrentView('borrower-profile');
  };

  const handleEditBorrower = (borrower: Borrower) => {
    setEditingBorrower(borrower);
    setCurrentView('AddBorrower');
  };

  const handleDeleteBorrower = (borrowerId: string) => {
    if (window.confirm("Are you sure you want to delete this borrower? This action cannot be undone.")) {
      alert("Borrower deleted successfully.");
    }
  };

  const renderContent = () => {
    if (currentView === 'AddBorrower') return <AddBorrowerPage user={user} borrower={editingBorrower} onBack={() => setCurrentView('ViewBorrowers')} />;
    if (currentView === 'ViewBorrowers') return <BorrowerListPage onViewBorrower={handleViewBorrower} onEditBorrower={handleEditBorrower} onDeleteBorrower={handleDeleteBorrower} onBack={() => setCurrentView('overview')} />;
    if (currentView === 'borrower-profile' && selectedBorrower) return <BorrowerProfilePage borrower={selectedBorrower} onBack={() => setCurrentView('ViewBorrowers')} />;
    
    // Loan Module Views
    if (currentView === 'ViewAllLoans') return <ViewAllLoansPage onAction={handleAction} onBack={() => setCurrentView('overview')} />;
    if (currentView === 'AddLoan') return <AddLoanPage onBack={() => setCurrentView('ViewAllLoans')} />;
    if (currentView === 'DueLoans') return <DueLoansPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'LoanCalculator') return <LoanCalculatorPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ApproveLoans') return <ApproveLoansPage onBack={() => setCurrentView('overview')} />;

    if (currentView === 'overview') {
      return (
        <div className="animate-fade-in space-y-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-[11px] font-medium text-slate-500 uppercase mt-1">Aster Money Lenders • Primary Branch</p>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={fetchApplications} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-slate-100 shadow-sm transition-all"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
               <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-normal shadow-sm hover:bg-slate-100 flex items-center gap-2"><FileDown className="w-3.5 h-3.5" /> Export Data</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KPICard title="Total Customers" value="1,422" icon={<Users />} color="blue" />
            <KPICard title="Active Loans" value="894" icon={<Briefcase />} color="green" />
            <KPICard title="Total Portfolio" value="K 4.2M" icon={<Wallet />} color="green" />
            <KPICard title="Total Collected" value="K 1.8M" icon={<CheckCircle />} color="green" />
            <KPICard title="Outstanding Balance" value="K 2.4M" icon={<BarChart3 />} color="yellow" />
            <KPICard title="Loans In Arrears" value="K 425K" icon={<AlertTriangle />} color="red" />
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <h3 className="text-[11px] font-bold uppercase text-slate-400">Quick Actions</h3>
                <div className="h-px bg-slate-100 flex-1"></div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg text-center">Loans & Payments</p>
                   <ActionButton icon={<Plus />} label="Create Loan" onClick={() => handleAction('CreateLoan')} />
                   <ActionButton icon={<ClipboardCheck />} label="Review Loan Request" onClick={() => handleAction('Review Loan Request')} />
                   <ActionButton icon={<CheckCircle />} label="Approve Loan" onClick={() => handleAction('Approve Loan')} />
                   <ActionButton icon={<DollarSign />} label="Receive Payment" onClick={() => handleAction('ReceivePayment')} />
                   <ActionButton icon={<RotateCcw />} label="Create Refund" onClick={() => handleAction('Create Refund')} />
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg text-center">Customers & Accounts</p>
                   <ActionButton icon={<List />} label="View Customers List" onClick={() => handleAction('ViewCustomersList')} />
                   <ActionButton icon={<Download />} label="Deposit Money" onClick={() => handleAction('DepositMoney')} />
                   <ActionButton icon={<ArrowRightLeft />} label="Transfer Fund" onClick={() => handleAction('TransferFund')} />
                   <ActionButton icon={<UserPlus />} label="Register Customer" onClick={() => handleAction('RegisterCustomer')} />
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg text-center">Finance & Expenses</p>
                   <ActionButton icon={<Receipt />} label="Enter Expense" onClick={() => handleAction('EnterExpense')} />
                   <ActionButton icon={<Calendar />} label="Calendar" onClick={() => handleAction('Calendar')} />
                   <ActionButton icon={<History />} label="Audit Log" onClick={() => handleAction('AuditLog')} />
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg text-center">Employees & HR</p>
                   <ActionButton icon={<Clock />} label="Employee Clocking" onClick={() => handleAction('EmployeeClocking')} />
                   <ActionButton icon={<CreditCard />} label="Pay Employee" onClick={() => handleAction('Pay Employee')} />
                   <ActionButton icon={<ClipboardList />} label="Assign Task" onClick={() => handleAction('Assign Task')} />
                   <ActionButton icon={<HeartHandshake />} label="HR Management" onClick={() => handleAction('HR Management')} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase text-slate-400">Active Loans Table</h3>
                    <div className="relative">
                      <input type="text" placeholder="Search Loan ID..." className="pl-8 pr-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] outline-none focus:ring-1 focus:ring-red-600 w-48" />
                      <Search className="w-3.5 h-3.5 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <ActiveLoansTable applications={applications} onAction={handleAction} />
               </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <h3 className="text-[11px] font-bold uppercase text-slate-400 mb-6">Risk & Arrears Management</h3>
                  <div className="space-y-4">
                    <OverdueRow name="Moses Mulenga" days={14} balance="K 8,420" risk="High" />
                    <OverdueRow name="Agness Chama" days={5} balance="K 12,500" risk="Medium" />
                    <OverdueRow name="John Phiri" days={2} balance="K 3,200" risk="Low" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      );
    }
    return <div className="p-10 text-center text-slate-400 font-bold uppercase">Module In Progress</div>;
  };

  const sidebarWidth = isSidebarCollapsed ? 'w-20' : 'w-64';
  const mainMargin = isSidebarCollapsed ? 'ml-20' : 'ml-64';

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-x-hidden text-left">
      <aside className={`${sidebarWidth} bg-slate-900 text-slate-300 flex-shrink-0 fixed h-screen overflow-y-auto z-40 border-r border-slate-800 pt-20 custom-scrollbar transition-all duration-300`}>
        <div className="px-4 py-2 border-b border-slate-800 flex justify-end">
          <button onClick={sidebarToggle} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>
        <div className={`p-6 border-b border-slate-800 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} mb-4`}>
            <div className="w-10 h-10 rounded-full bg-red-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-900/20">
              {user.email?.[0].toUpperCase()}
            </div>
            {!isSidebarCollapsed && (
              <div className="truncate">
                <p className="text-sm font-bold text-white truncate w-32">{user.email?.split('@')[0]}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{userRole}</p>
              </div>
            )}
          </div>
        </div>
        <nav className="p-4 space-y-1">
          <button 
            onClick={() => setCurrentView('overview')}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'} py-2.5 rounded-lg text-sm font-normal transition-all ${
              currentView === 'overview' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </button>
          <div className="h-px bg-slate-800 my-4"></div>
          {menuItems.slice(1).map((item) => (
            <div key={item.id} className="space-y-1">
              <button 
                onClick={() => !isSidebarCollapsed && toggleMenu(item.id)}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'} py-2.5 rounded-lg text-sm font-normal transition-all ${
                  expandedMenus[item.id] && !isSidebarCollapsed ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className={`flex items-center ${isSidebarCollapsed ? '' : 'space-x-3'}`}>
                  <span className={`${expandedMenus[item.id] && !isSidebarCollapsed ? 'text-red-500' : 'text-slate-500'} flex-shrink-0`}>{item.icon}</span>
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!isSidebarCollapsed && (expandedMenus[item.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
              </button>
              {expandedMenus[item.id] && !isSidebarCollapsed && (
                <div className="ml-9 space-y-1 py-1 animate-fade-in">
                  {item.subItems?.map((sub, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSubItemClick(sub.id)}
                      className={`w-full text-left px-3 py-1.5 text-[11px] font-normal transition-all border-l border-slate-700 ${
                        currentView === sub.id ? 'text-red-500 pl-4 border-red-500' : 'text-slate-400 hover:text-red-500 hover:pl-4'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className={`flex-1 ${mainMargin} pt-36 pb-12 px-8 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {showPaymentWidget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up text-left">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900">Receive Payment</h3>
                  <p className="text-[10px] font-bold text-red-600 uppercase mt-1">Operational Module</p>
                </div>
                <button onClick={() => setShowPaymentWidget(false)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 transition-all shadow-sm"><X className="w-5 h-5" /></button>
              </div>
              <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Payment Recorded Successfully'); setShowPaymentWidget(false); }}>
                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">Search Customer Or Loan ID</label>
                      <input type="text" placeholder="e.g. LN-4042-01 or John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] outline-none focus:ring-1 focus:ring-red-600" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">Amount Received</label>
                        <div className="flex rounded-xl overflow-hidden border border-slate-200">
                          <span className="bg-slate-50 px-3 flex items-center text-[13px] font-bold text-slate-500 border-r border-slate-200">K</span>
                          <input type="number" step="0.1" placeholder="0.0" className="w-full px-4 py-3 text-[13px] outline-none font-normal" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">Payment Method</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] outline-none focus:ring-1 focus:ring-red-600">
                          <option>Airtel Money</option>
                          <option>MTN MoMo</option>
                          <option>Bank Transfer</option>
                          <option>Cash</option>
                        </select>
                      </div>
                   </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setShowPaymentWidget(false)} className="flex-1 py-3.5 rounded-xl border border-slate-200 text-[10px] font-bold uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-[2] py-3.5 rounded-xl bg-red-600 text-white text-[10px] font-bold uppercase shadow-xl shadow-red-200 hover:bg-black transition-all text-center">Submit Payment</button>
                </div>
              </form>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

// --- Shared Internal Dashboard Components ---

const KPICard = ({ title, value, icon, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group text-left">
      <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <p className="text-[11px] font-bold text-black uppercase mb-1">{title}</p>
      <p className="text-[14px] font-normal text-slate-600">{value}</p>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, color = 'blue' }: any) => {
  const baseColor = color === 'red' ? 'text-red-600' : 'text-slate-600';
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-3.5 rounded-2xl border border-slate-100 transition-all ${baseColor} hover:bg-slate-100 text-left`}>
      <div className="p-2 bg-slate-50 rounded-lg transition-colors">
        {React.cloneElement(icon, { className: 'w-4 h-4' })}
      </div>
      <span className="text-[11px] font-bold uppercase tracking-normal">{label}</span>
    </button>
  );
};

const ActiveLoansTable = ({ applications, onAction }: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50 text-slate-400 text-[8px] font-bold uppercase">
          <tr>
            <th className="px-8 py-4">Loan ID</th>
            <th className="px-8 py-4">Customer</th>
            <th className="px-8 py-4">Amount</th>
            <th className="px-8 py-4">Balance</th>
            <th className="px-8 py-4">Due Date</th>
            <th className="px-8 py-4">Status</th>
            <th className="px-8 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applications.map((app: any) => (
            <tr key={app.id} className="hover:bg-slate-50/30 transition-colors text-left">
              <td className="px-8 py-4 text-[12px] font-mono text-slate-500">LN-{app.id.substring(0,4)}</td>
              <td className="px-8 py-4">
                <p className="text-[12px] font-bold text-slate-900">{app.customer_name}</p>
              </td>
              <td className="px-8 py-4 text-[13px] font-normal text-slate-900">K {app.amount.toLocaleString()}</td>
              <td className="px-8 py-4 text-[13px] font-bold text-red-600">K {app.balance?.toLocaleString()}</td>
              <td className="px-8 py-4 text-[11px] font-normal text-slate-500">{new Date(app.due_date).toLocaleDateString()}</td>
              <td className="px-8 py-4">
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                  app.status === 'Approved' ? 'bg-green-50 text-green-600' : app.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {app.status === 'Approved' ? 'Active' : app.status === 'Pending' ? 'Due Soon' : 'Closed'}
                </span>
              </td>
              <td className="px-8 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onAction('ReceivePayment')} className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-all rounded-lg"><History className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-all rounded-lg"><Eye className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const OverdueRow = ({ name, days, balance, risk }: any) => {
  const riskColor = risk === 'High' ? 'text-red-600' : risk === 'Medium' ? 'text-orange-500' : 'text-yellow-600';
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-50 hover:border-red-100 hover:bg-slate-100 transition-all group">
      <div className="text-left">
        <p className="text-[12px] font-bold text-slate-900">{name}</p>
        <p className="text-[9px] text-slate-400 font-bold uppercase">{days} Days Overdue</p>
      </div>
      <div className="text-right">
        <p className="text-[12px] font-black text-slate-900">{balance}</p>
        <p className={`text-[9px] font-bold uppercase ${riskColor}`}>{risk} Risk</p>
      </div>
    </div>
  );
};

// --- Sub-Pages ---

const BorrowerListPage = ({ onViewBorrower, onEditBorrower, onDeleteBorrower, onBack }: { onViewBorrower: (b: Borrower) => void, onEditBorrower: (b: Borrower) => void, onDeleteBorrower: (id: string) => void, onBack: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockBorrowers: Borrower[] = [
    { id: '1', customerNumber: 'CUST-100224-0001', fullName: 'ABINALA SICHALWE', gender: 'Male', dob: '1985-05-12', nrc: '456789/11/1', phone: '0770535221', email: 'abinala.s@test.com', address: 'Plot 12, Chililabombwe', employmentType: 'Employed', status: 'Current', branch: 'Nchelenge', totalPaid: 15400, openLoansBalance: 1677, companyName: 'ST PAULS MI...', fax: '197314/19/1', terms: '30 DAYS', nationality: 'Zambian', regDate: '2024-02-10', verifiedBy: 'Chanda B.', verifiedRole: 'Loan Officer' },
    { id: '2', customerNumber: 'CUST-110224-0002', fullName: 'ABRAHAM MUTWALE', gender: 'Male', dob: '1992-08-22', nrc: '123456/10/1', phone: '0973358899', email: 'abraham.m@test.com', address: 'Mwansabombwe', employmentType: 'Employed', status: 'Current', branch: 'Nchelenge', totalPaid: 5000, openLoansBalance: 2350, companyName: 'AM SOLUTIONS', fax: 'N/A', terms: '15 DAYS', nationality: 'Zambian', regDate: '2024-02-11', verifiedBy: 'Sarah M.', verifiedRole: 'Branch Manager' },
    { id: '3', customerNumber: 'CUST-120224-0003', fullName: 'ALEXANDER LUKWESA', gender: 'Male', dob: '1990-01-15', nrc: '987654/32/1', phone: '0966123456', email: 'alex.l@test.com', address: 'Lusaka', employmentType: 'Employed', status: 'Current', branch: 'Lusaka Main', totalPaid: 2000, openLoansBalance: 277, companyName: 'LUKWESA LTD', terms: 'DUE ON RECEIPT', nationality: 'Zambian', regDate: '2024-02-12', verifiedBy: 'James K.', verifiedRole: 'Compliance' },
  ];

  const filteredBorrowers = useMemo(() => {
    return mockBorrowers.filter(b => 
      b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="animate-fade-in-up text-left">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-serif font-bold text-slate-900">Borrower Directory</h1></div>
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase transition-colors flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-lg"><ArrowLeft className="w-3 h-3" /> Back To Overview</button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
           <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none text-[12px] font-normal outline-none focus:ring-1 focus:ring-red-600" 
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-red-600 text-white">
              <tr className="uppercase font-bold">
                <th className="px-8 py-4 text-[13px]">Full Name</th>
                <th className="px-8 py-4 text-[13px]">Unique Number</th>
                <th className="px-8 py-4 text-[13px]">Mobile</th>
                <th className="px-8 py-4 text-[13px]">Balance</th>
                <th className="px-8 py-4 text-[13px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBorrowers.map((borrower) => (
                <tr key={borrower.id} className="hover:bg-gray-200 transition-none group">
                  <td className="px-8 py-4 font-normal text-black text-[11px]">{borrower.fullName}</td>
                  <td className="px-8 py-4 font-normal text-black text-[11px]">{borrower.customerNumber}</td>
                  <td className="px-8 py-4 font-normal text-black text-[11px]">{borrower.phone}</td>
                  <td className="px-8 py-4 font-normal text-black text-[11px]">K {borrower.openLoansBalance.toLocaleString()}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onViewBorrower(borrower)} className="p-2 text-slate-400 hover:text-blue-600 transition-none" title="View customer details"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => onEditBorrower(borrower)} className="p-2 text-slate-400 hover:text-orange-600 transition-none" title="Edit customer"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteBorrower(borrower.id)} className="p-2 text-slate-400 hover:text-red-600 transition-none" title="Delete customer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- OFFICIAL CUSTOMER MASTER RECORD VIEW ---
const BorrowerProfilePage = ({ borrower: selectedBorrower, onBack }: { borrower: Borrower, onBack: () => void }) => {
  const loanData = [
    { id: 'LN-4021', amount: '15,000.00', date: '10/01/2024', period: '12 Months', freq: 'Monthly', rate: '15%', total: '17,250.00', paid: '3,000.00', balance: '14,250.00', due: '10/02/2024', status: 'Active' },
    { id: 'LN-3892', amount: '5,000.00', date: '15/10/2023', period: '6 Months', freq: 'Monthly', rate: '18%', total: '5,900.00', paid: '5,900.00', balance: '0.00', due: '15/04/2024', status: 'Completed' },
  ];

  const repaymentData = [
    { date: '10/01/2024', amount: '1,500.00', method: 'Airtel MoMo', ref: 'ATR-99212', staff: 'Chanda B.' },
    { date: '12/12/2023', amount: '1,500.00', method: 'Bank Transfer', ref: 'TX-4402', staff: 'Sarah M.' },
  ];

  const printLabelClass = "text-[11px] font-bold text-black whitespace-nowrap";
  const printValueClass = "text-[12px] font-normal text-slate-700";
  const printSectionHeaderClass = "text-[10px] font-bold uppercase text-red-600 mb-4 border-b border-red-100 pb-2 flex items-center gap-2";

  const getLoanStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'text-green-600';
      case 'overdue': return 'text-red-600';
      case 'pending': return 'text-slate-400';
      default: return 'text-black';
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className={`flex flex-col bg-white border border-[#a0a0a0] shadow-md overflow-hidden animate-fade-in font-sans leading-tight text-left transition-all duration-300 h-[calc(100vh-12rem)] w-full`}>
      {/* Combined Unified Top Header Bar - Continuous RED */}
      <div className="bg-red-600 border-b border-red-700 shrink-0 print:hidden p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-bold text-white flex items-center gap-2 tracking-normal">
             <Layout className="w-4 h-4 rotate-180" />
          </h2>
        </div>
        
        {/* Action Buttons Row - Single Horizontal Row (Flex Nowrap) */}
        <div className="flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide">
          {/* 1. Customize Report - TEXT ONLY */}
          <ReportButton label="Customize Report" icon={null} />
          
          <div className="h-6 w-px bg-white/20 mx-0.5 flex-shrink-0"></div>

          {/* 2. From dd/mm/yyyy - Combined Control */}
          <div className="flex items-center gap-1.5 text-white text-[10px] font-bold flex-shrink-0">
            <span className="text-white uppercase tracking-tight">From</span>
            <input type="date" placeholder="dd/mm/yyyy" className="bg-white/10 border border-white/20 rounded px-1.5 outline-none text-[11px] h-7 font-normal cursor-pointer [color-scheme:dark] text-white placeholder:text-white/40 date-input-field" />
          </div>
          
          {/* 3. To dd/mm/yyyy - Combined Control */}
          <div className="flex items-center gap-1.5 text-white text-[10px] font-bold flex-shrink-0 ml-0.5">
            <span className="text-white uppercase tracking-tight">To</span>
            <input type="date" placeholder="dd/mm/yyyy" className="bg-white/10 border border-white/20 rounded px-1.5 outline-none text-[11px] h-7 font-normal cursor-pointer [color-scheme:dark] text-white placeholder:text-white/40 date-input-field" />
          </div>

          <div className="h-6 w-px bg-white/20 mx-0.5 flex-shrink-0"></div>

          {/* 4. E-mail */}
          <ReportDropdown label="E-mail" icon={<MailIcon className="w-3 h-3" />} />

          {/* 5. Excel */}
          <ReportDropdown label="Excel" icon={<FileSpreadsheet className="w-3 h-3" />} />

          {/* 6. Print */}
          <ReportDropdown label="Print" icon={<PrinterIcon className="w-3 h-3" />} onClick={handlePrint} />
          
          <div className="h-6 w-px bg-white/20 mx-0.5 flex-shrink-0"></div>
          
          {/* 7. Back */}
          <ReportButton label="Back" icon={<ArrowLeft className="w-3 h-3" />} onClick={onBack} title="Back" />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar p-10 relative print:p-0">
          <div className="mb-10 border-b-2 border-red-600 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-serif font-black uppercase text-slate-900 tracking-normal mb-1">ASTER MONEY LENDERS</h1>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase">System Generated: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <h2 className="text-xl font-serif font-bold text-center border-y border-slate-100 py-4 bg-slate-50/50 tracking-normal uppercase">OFFICIAL CUSTOMER MASTER RECORD</h2>

            {/* Section 1: Customer Header Information (Personal Details) */}
            <section className="break-inside-avoid">
              <h3 className={printSectionHeaderClass}><User className="w-3.5 h-3.5" /> 1. Customer Header Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                <DataField label="Full Name" value={selectedBorrower.fullName} />
                <DataField label="Customer ID" value={selectedBorrower.customerNumber} />
                <DataField label="NRC / ID Number" value={selectedBorrower.nrc} />
                <DataField label="Gender" value={selectedBorrower.gender.toUpperCase()} />
                <DataField label="Date of Birth" value={selectedBorrower.dob} />
                <DataField label="Nationality" value={(selectedBorrower.nationality || 'Zambian').toUpperCase()} />
                <DataField label="Phone Number" value={selectedBorrower.phone} />
                <DataField label="Email Address" value={selectedBorrower.email} isLower />
              </div>
            </section>

            {/* Section 2: Residential Address */}
            <section className="break-inside-avoid">
              <h3 className={printSectionHeaderClass}><MapPin className="w-3.5 h-3.5" /> 2. Residential Address</h3>
              <div className="space-y-2 ml-6">
                <div className="flex items-baseline gap-2"><span className={printLabelClass}>Address / Plot:</span><span className={printValueClass}>{selectedBorrower.address}</span></div>
                <div className="flex items-baseline gap-2"><span className={printLabelClass}>District:</span><span className={printValueClass}>Nchelenge</span></div>
                <div className={selectedBorrower.branch ? 'flex items-baseline gap-2' : 'hidden'}><span className={printLabelClass}>Province:</span><span className={printValueClass}>Luapula</span></div>
                <div className="flex items-baseline gap-2"><span className={printLabelClass}>Country:</span><span className={printValueClass}>Zambia</span></div>
              </div>
            </section>

            {/* Section 3: Employment Details */}
            <section className="break-inside-avoid">
              <h3 className={printSectionHeaderClass}><Briefcase className="w-3.5 h-3.5" /> 3. Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div className="flex items-baseline gap-2"><span className={printLabelClass}>Employment Type:</span><span className={`${printValueClass} uppercase`}>{selectedBorrower.employmentType}</span></div>
                <div className="flex items-baseline gap-2"><span className={printLabelClass}>Employer / Business Name:</span><span className={printValueClass}>{selectedBorrower.companyName}</span></div>
                <div className="flex items-baseline gap-2"><span className={printLabelClass}>Job Title / Position:</span><span className={printValueClass}>Staff Officer</span></div>
                <div className="flex items-baseline gap-2"><span className={printLabelClass}>Monthly Income:</span><span className="text-[12px] font-black text-slate-900">K 12,400.00</span></div>
              </div>
            </section>

            {/* Section 4: Financial Overview (Savings and Investments) */}
            <section className="break-inside-avoid">
              <h3 className={printSectionHeaderClass}><Wallet className="w-3.5 h-3.5" /> 4. Financial Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100"><p className="text-[8px] font-bold text-red-600 uppercase mb-1">Total Open Balance</p><p className="text-lg font-black text-slate-900">K {selectedBorrower.openLoansBalance.toLocaleString()}</p></div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100"><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Loan Summary</p><p className="text-lg font-black text-slate-900">Active (1)</p></div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100"><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Savings Summary</p><p className="text-lg font-black text-slate-900">K { (selectedBorrower.openLoansBalance * 0.15).toLocaleString() }</p></div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100"><p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Investments</p><p className="text-lg font-black text-slate-900">K 10,000.00</p></div>
              </div>
            </section>

            {/* Section 5: Loan History & Repayments */}
            <section className="break-inside-avoid">
              <h3 className={printSectionHeaderClass}><History className="w-3.5 h-3.5" /> 5. Loan History & Repayments</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Loan ID</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Issued</th>
                      <th className="px-4 py-3">Outstanding</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanData.map((loan, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-red-600 font-bold">{loan.id}</td>
                        <td className="px-4 py-3 font-medium">K {loan.amount}</td>
                        <td className="px-4 py-3 text-slate-500">{loan.date}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">K {loan.balance}</td>
                        <td className={`px-4 py-3 font-bold uppercase ${getLoanStatusColor(loan.status)}`}>{loan.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="ml-6 space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase">Recent Repayment Transactions</p>
                <div className="space-y-1">
                  {repaymentData.map((r, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] text-slate-600 bg-slate-50/50 p-2 border-b border-slate-100">
                      <span className="font-bold">{r.date}</span>
                      <span className="font-black text-slate-900">K {r.amount} ({r.method})</span>
                      <span className="font-mono text-slate-400 text-[8px]">REF: {r.ref}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-12 break-inside-avoid">
              {/* Section 6: Next of Kin & Guarantor Details */}
              <section>
                <h3 className={printSectionHeaderClass}><HeartHandshake className="w-3.5 h-3.5" /> 6. Next of Kin & Guarantor Details</h3>
                <div className="space-y-6 ml-6">
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Next of Kin</p>
                    <div className="space-y-1 text-[11px]">
                      <p><span className="font-bold">Name:</span> MWANSA SICHALWE</p>
                      <p><span className="font-bold">Relationship:</span> Spouse</p>
                      <p><span className="font-bold">Contact:</span> 0974-442211</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Guarantor Detail</p>
                    <div className="space-y-1 text-[11px]">
                      <p className="font-black text-slate-900 uppercase">DR. CHRIS MULENGA</p>
                      <p><span className="font-bold">NRC:</span> 441122/11/1</p>
                      <p><span className="font-bold text-red-600">Status: VERIFIED</span></p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 7: Documents & Attachments */}
              <section>
                <h3 className={printSectionHeaderClass}><Paperclip className="w-3.5 h-3.5" /> 7. Documents & Attachments</h3>
                <div className="space-y-2 ml-6">
                  <DocumentRow name="NRC ID FRONT" status="VERIFIED" />
                  <DocumentRow name="NRC ID BACK" status="VERIFIED" />
                  <DocumentRow name="LATEST 3M PAYSLIPS" status="VERIFIED" />
                  <DocumentRow name="UTILITY BILL" status="PENDING" />
                </div>
              </section>
            </div>

            {/* Section 8: Audit & Verification (History Logs) */}
            <section className="break-inside-avoid">
              <h3 className={printSectionHeaderClass}><ShieldCheck className="w-3.5 h-3.5" /> 8. Audit & Verification</h3>
              <div className="grid grid-cols-3 gap-8 ml-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <DataField label="Registered Date" value={selectedBorrower.regDate || '2024-02-10'} />
                <DataField label="Verified By" value={(selectedBorrower.verifiedBy || 'CHANDA B.').toUpperCase()} />
                <DataField label="Compliance Status" value="ACTIVE / CLEAR" />
              </div>
              <div className="mt-8 ml-6 space-y-3">
                 <p className="text-[9px] font-black text-slate-400 uppercase">System Audit Trail Entry Logs</p>
                 <div className="text-[10px] text-slate-500 border-l-2 border-red-100 pl-4 py-1">
                   <p className="font-bold text-slate-900">PROFILE_CREATED (CHANDA B.)</p>
                   <p>2024-02-10 09:14:22 AM - Initial registration of customer record.</p>
                 </div>
                 <div className="text-[10px] text-slate-500 border-l-2 border-slate-100 pl-4 py-1">
                   <p className="font-bold text-slate-900">LOAN_DISBURSED (SARAH M.)</p>
                   <p>2024-01-10 11:20:00 AM - Disbursed LN-4021 total amount K 15,000.00.</p>
                 </div>
              </div>
            </section>
          </div>

          {/* Institutional Footer */}
          <div className="mt-20 border-t border-slate-200 pt-10 text-center">
             <p className="text-[9px] text-slate-400 uppercase font-bold tracking-normal mb-4">Official Institutional Record • Aster Money Lenders Headquarters</p>
             <div className="flex justify-center gap-10 text-[10px] font-bold text-slate-600 tracking-normal">
               <span>P: +260 973 358 899</span>
               <span>E: info@astermoneylenders.com</span>
               <span>W: astermoneylenders.com</span>
             </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .date-input-field::placeholder { font-weight: 400 !important; color: rgba(255, 255, 255, 0.4) !important; }
        .date-input-field::-webkit-datetime-edit-text,
        .date-input-field::-webkit-datetime-edit-month-field,
        .date-input-field::-webkit-datetime-edit-day-field,
        .date-input-field::-webkit-datetime-edit-year-field {
          font-weight: 400 !important;
        }
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          body { background: white !important; }
          .h-[calc(100vh-12rem)] { height: auto !important; overflow: visible !important; }
          .custom-scrollbar { overflow: visible !important; }
          @page { size: A4; margin: 15mm; }
        }
      `}} />
    </div>
  );
};

// --- Profile Page Helper Components ---

const ReportButton = ({ label, icon, onClick, title }: { label: string, icon: React.ReactNode | null, onClick?: () => void, title?: string }) => (
  <button onClick={onClick} title={title} className="flex items-center justify-center gap-1.5 px-3 py-1.5 hover:bg-white/10 rounded transition-all text-[11px] font-bold text-white border border-white/20 whitespace-nowrap flex-shrink-0 min-h-[36px]">
    {icon && <span className="text-white flex items-center">{icon}</span>}
    <span>{label}</span>
  </button>
);

const ReportDropdown = ({ label, icon, onClick }: { label: string, icon: React.ReactNode, onClick?: () => void }) => (
  <button onClick={onClick} className="flex items-center justify-center gap-1.5 px-3 py-1.5 hover:bg-white/10 rounded transition-all text-[11px] font-bold text-white border border-white/20 group whitespace-nowrap flex-shrink-0 min-h-[36px]">
    <span className="text-white flex items-center">{icon}</span>
    <span>{label}</span>
    <ChevronDown className="w-3 h-3 text-white/60 group-hover:text-white" />
  </button>
);

const DataField = ({ label, value, isLower }: { label: string, value: string, isLower?: boolean }) => (
  <div>
    <p className="text-[11px] font-bold text-black uppercase mb-0.5 tracking-normal">{label}</p>
    <p className={`text-[12px] font-normal text-slate-700 tracking-normal ${isLower ? 'lowercase' : ''}`}>{value}</p>
  </div>
);

const DocumentRow = ({ name, status }: { name: string, status: string }) => (
  <div className="flex items-center justify-between border-b border-slate-50 pb-1">
    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-normal">{name}</span>
    <span className={`text-[9px] font-black uppercase tracking-normal ${status === 'VERIFIED' ? 'text-green-600' : 'text-orange-500'}`}>{status}</span>
  </div>
);

// --- Sub-Pages ---

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown';
  section: string;
  position: 'Top' | 'Bottom' | 'After Field';
  afterFieldId?: string;
  options?: string[];
}

interface AltPaymentSlot {
  active: boolean;
  type: 'Bank' | 'MoMo';
  bankName: string;
  branch: string;
  accName: string;
  accNum: string;
  sortCode: string;
  provider: string;
  momoNum: string;
  regName: string;
}

const AddBorrowerPage = ({ borrower, onBack }: { user: any, borrower: Borrower | null, onBack: () => void }) => {
  const defaultSections = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'address', label: 'Residential Address' },
    { id: 'employment', label: 'Employment Details' },
    { id: 'payment', label: 'Bank / Payment Details' },
    { id: 'uploads', label: 'File Uploads' },
  ];

  const initialFormData = {
    fullName: '',
    gender: '',
    dob: '',
    age: '',
    nationality: '',
    nrc: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    district: '',
    province: '',
    country: 'Zambia',
    monthlyIncome: '',
    employerName: '',
    jobTitle: '',
    workStation: '',
    employeeNumber: '',
    businessName: '',
    businessType: '',
    businessAddress: ''
  };

  const initialAltSlotData: AltPaymentSlot = {
    active: false,
    type: 'Bank',
    bankName: '',
    branch: '',
    accName: '',
    accNum: '',
    sortCode: '',
    provider: '',
    momoNum: '',
    regName: ''
  };

  const [customSections, setCustomSections] = useState<{id: string, label: string}[]>([]);
  const [activeSectionId, setActiveSectionId] = useState('personal');
  const [empType, setEmpType] = useState<string>('');
  const [formData, setFormData] = useState<any>(initialFormData);
  const [altSlot, setAltSlot] = useState<AltPaymentSlot>(initialAltSlotData);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showCFModal, setShowCFModal] = useState(false);
  
  const [cfData, setCfData] = useState({ 
    label: '', 
    type: 'text', 
    section: 'personal', 
    position: 'Bottom', 
    afterFieldId: '', 
    options: '',
    isNewSection: false,
    newSectionName: ''
  });

  const sections = [...defaultSections, ...customSections];

  // Styling
  const labelClass = "text-[10px] font-bold uppercase text-slate-400 mb-1.5 block px-0 py-0 inline-block";
  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] outline-none focus:ring-1 focus:ring-red-600 bg-white text-slate-500 font-normal placeholder:text-slate-300";
  const readOnlyInputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] outline-none bg-slate-50 text-slate-400 font-normal cursor-not-allowed";
  
  // Handlers
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setFormData(prev => ({ ...prev, fullName: val }));
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    if (val >= today) return;
    
    let age = '';
    if (val) {
      const birthDate = new Date(val);
      const todayDate = new Date();
      age = (todayDate.getFullYear() - birthDate.getFullYear()).toString();
      const m = todayDate.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && todayDate.getDate() < birthDate.getDate())) {
        age = (parseInt(age) - 1).toString();
      }
    }
    setFormData(prev => ({ ...prev, dob: val, age }));
  };

  const handleNrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 9);
    let formatted = val;
    if (val.length > 6) {
      formatted = val.slice(0, 6) + '/' + val.slice(6, 8);
      if (val.length > 8) {
        formatted += '/' + val.slice(8, 9);
      }
    }
    setFormData(prev => ({ ...prev, nrc: formatted }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 10);
    if (val.length > 0 && val[0] !== '0') return;
    setFormData(prev => ({ ...prev, phone: val }));
  };

  const formatAmount = (val: string) => {
    if (!val) return '';
    const numeric = val.replace(/[^0-9.]/g, '');
    const parts = numeric.split('.');
    let result = parts[0];
    if (parts.length > 1) {
      result += '.' + parts[1].slice(0, 2);
    } else {
      result += '.00';
    }
    return result;
  };

  const handleAmountBlur = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: formatAmount(prev[field] as string) }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Borrower registered successfully.');
    setFormData(initialFormData);
    setEmpType('');
    setAltSlot({ ...initialAltSlotData });
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
    fileInputs.forEach(input => { input.value = ''; });
  };

  const updateAltSlot = (updates: Partial<AltPaymentSlot>) => {
    let newSlot = { ...altSlot, ...updates };
    if (updates.active === false) {
      newSlot = { ...newSlot, bankName: '', branch: '', accName: '', accNum: '', sortCode: '', provider: '', momoNum: '', regName: '' };
    }
    setAltSlot(newSlot);
  };

  const addCustomField = () => {
    let targetSectionId = cfData.section;
    if (cfData.isNewSection && cfData.newSectionName) {
      targetSectionId = `cs-${Date.now()}`;
      setCustomSections([...customSections, { id: targetSectionId, label: cfData.newSectionName }]);
    }

    const newCF: CustomField = {
      id: `cf-${Date.now()}`,
      label: cfData.label,
      type: cfData.type as any,
      section: targetSectionId,
      position: cfData.position as any,
      afterFieldId: cfData.afterFieldId,
      options: cfData.type === 'dropdown' ? cfData.options.split(',').map(o => o.trim()) : undefined
    };

    setCustomFields([...customFields, newCF]);
    setFormData({ ...formData, [newCF.id]: '' });
    setShowCFModal(false);
    setCfData({ label: '', type: 'text', section: 'personal', position: 'Bottom', afterFieldId: '', options: '', isNewSection: false, newSectionName: '' });
  };

  const renderCustomField = (cf: CustomField) => {
    const commonProps = {
      id: cf.id,
      className: inputClass,
      value: formData[cf.id] || '',
      onChange: (e: any) => setFormData({ ...formData, [cf.id]: e.target.value }),
      placeholder: `Enter ${cf.label}`
    };

    return (
      <div key={cf.id} className="space-y-1">
        <label className={labelClass + " text-white"}>{cf.label}</label>
        {cf.type === 'dropdown' ? (
          <select {...commonProps}>
            <option value="">Select Option</option>
            {cf.options?.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input type={cf.type === 'number' ? 'number' : cf.type === 'date' ? 'date' : 'text'} {...commonProps} />
        )}
      </div>
    );
  };

  const wrapFieldsWithCustom = (sectionId: string, standardFields: React.ReactElement[]) => {
    const sectionCFs = customFields.filter(cf => cf.section === sectionId);
    
    // Convert standard fields to list with metadata for "After Field" placement
    const fieldsWithMetadata = standardFields.map((field) => ({
      id: field.key as string,
      element: field
    }));

    // Start with Top CFs
    let result: React.ReactElement[] = sectionCFs.filter(cf => cf.position === 'Top').map(renderCustomField);
    
    // Add standard fields and "After" CFs
    fieldsWithMetadata.forEach(sf => {
      result.push(sf.element);
      sectionCFs.filter(cf => cf.position === 'After Field' && cf.afterFieldId === sf.id).forEach(cf => {
        result.push(renderCustomField(cf));
      });
    });

    // Add Bottom CFs
    result = [...result, ...sectionCFs.filter(cf => cf.position === 'Bottom').map(renderCustomField)];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {result}
      </div>
    );
  };

  return (
    <div className="animate-fade-in-up text-left flex flex-col items-center">
      <div className="flex items-center justify-end mb-8 w-full max-w-4xl px-4">
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase transition-colors flex items-center gap-1 hover:bg-slate-100 px-3 py-1.5 rounded-xl">
          <ArrowLeft className="w-3.5 h-3.5" /> Exit Form
        </button>
      </div>

      <div className="flex w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        {/* Left Side Navigation - Red Backgrounds with WHITE text */}
        <div className="w-64 bg-red-600 border-r border-red-700 flex flex-col justify-between overflow-y-auto">
          <nav className="p-4 space-y-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSectionId(s.id)}
                className={`w-full text-left px-5 py-4 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-between group ${
                  activeSectionId === s.id 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-white hover:bg-red-700'
                }`}
              >
                <span>{s.label}</span>
                <ChevronRight className={`w-3 h-3 transition-transform text-white ${activeSectionId === s.id ? 'translate-x-1' : 'group-hover:translate-x-1 opacity-0'}`} />
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-red-700">
            <button 
              onClick={() => setShowCFModal(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-white/20 text-[9px] font-bold uppercase text-white hover:border-white transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-3 h-3 text-white" />
              Add Custom Field
            </button>
          </div>
        </div>

        {/* Right Side Content Area - Soft Grey Background */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
          <form className="flex-1 overflow-y-auto p-10 custom-scrollbar" onSubmit={handleFormSubmit}>
            {activeSectionId === 'personal' && (
              <div className="animate-fade-in">
                {wrapFieldsWithCustom('personal', [
                  <div key="name" className="space-y-1"><label className={labelClass}>Full Name</label><input type="text" placeholder="Enter full name" value={formData.fullName} onChange={handleFullNameChange} className={inputClass} required /></div>,
                  <div key="gender" className="space-y-1"><label className={labelClass}>Gender</label><select className={inputClass} value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option></select></div>,
                  <div key="dob" className="space-y-1"><label className={labelClass}>Date of Birth</label><input type="date" placeholder="DD/MM/YYYY" value={formData.dob} onChange={handleDobChange} className={inputClass} /></div>,
                  <div key="age" className="space-y-1"><label className={labelClass}>Age</label><input type="text" value={formData.age} readOnly className={readOnlyInputClass} placeholder="Calculated Age" /></div>,
                  <div key="nat" className="space-y-1"><label className={labelClass}>Nationality</label><input type="text" className={inputClass} placeholder="Zambian" value={formData.nationality} onChange={(e) => setFormData({...formData, nationality: e.target.value})} /></div>,
                  <div key="nrc" className="space-y-1"><label className={labelClass}>NRC / National ID Number</label><input type="text" value={formData.nrc} onChange={handleNrcChange} placeholder="123456/12/1" className={inputClass} required /></div>,
                  <div key="phone" className="space-y-1"><label className={labelClass}>Mobile Phone Number</label><input type="tel" value={formData.phone} onChange={handlePhoneChange} placeholder="0978343434" className={inputClass} required /></div>,
                  <div key="email" className="space-y-1"><label className={labelClass}>Email Address</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputClass} placeholder="example@domain.com" required /></div>,
                ])}
              </div>
            )}

            {activeSectionId === 'address' && (
              <div className="animate-fade-in">
                {wrapFieldsWithCustom('address', [
                  <div key="addr" className="space-y-1 col-span-full"><label className={labelClass}>Address / Plot:</label><input type="text" placeholder="House or Plot No." className={inputClass} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} /></div>,
                  <div key="area" className="space-y-1"><label className={labelClass}>Area / Compound:</label><input type="text" placeholder="Neighborhood" className={inputClass} value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} /></div>,
                  <div key="dist" className="space-y-1"><label className={labelClass}>District:</label><input type="text" placeholder="District name" className={inputClass} value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} /></div>,
                  <div key="prov" className="space-y-1"><label className={labelClass}>Province:</label><input type="text" placeholder="Province name" className={inputClass} value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} /></div>,
                  <div key="count" className="space-y-1"><label className={labelClass}>Country:</label><input type="text" placeholder="Country" className={inputClass} value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} /></div>,
                ])}
              </div>
            )}

            {activeSectionId === 'employment' && (
              <div className="animate-fade-in">
                <div className="mb-10 max-w-xs">
                   <label className={labelClass}>Employment Type</label>
                   <select className={inputClass} value={empType} onChange={(e) => setEmpType(e.target.value)}>
                     <option value="">Select Type</option>
                     <option value="Employed">Employed</option>
                     <option value="Self-Employed">Self-Employed</option>
                   </select>
                </div>
                {empType && wrapFieldsWithCustom('employment', empType === 'Employed' ? [
                  <div key="e1" className="space-y-1"><label className={labelClass}>Employer Name</label><input type="text" placeholder="Company Name" className={inputClass} value={formData.employerName} onChange={(e) => setFormData({...formData, employerName: e.target.value})} /></div>,
                  <div key="e2" className="space-y-1"><label className={labelClass}>Job Title</label><input type="text" placeholder="Your role" className={inputClass} value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} /></div>,
                  <div key="e3" className="space-y-1"><label className={labelClass}>Work Station</label><input type="text" placeholder="Office location" className={inputClass} value={formData.workStation} onChange={(e) => setFormData({...formData, workStation: e.target.value})} /></div>,
                  <div key="e4" className="space-y-1"><label className={labelClass}>Employee Number</label><input type="text" placeholder="Staff ID" className={inputClass} value={formData.employeeNumber} onChange={(e) => setFormData({...formData, employeeNumber: e.target.value})} /></div>,
                ] : [
                  <div key="s1" className="space-y-1"><label className={labelClass}>Business Name</label><input type="text" placeholder="Business name" className={inputClass} value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} /></div>,
                  <div key="s2" className="space-y-1"><label className={labelClass}>Type of Business</label><input type="text" placeholder="Industry" className={inputClass} value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})} /></div>,
                  <div key="s3" className="space-y-1"><label className={labelClass}>Business Address</label><input type="text" placeholder="Physical location" className={inputClass} value={formData.businessAddress} onChange={(e) => setFormData({...formData, businessAddress: e.target.value})} /></div>,
                  <div key="s4" className="space-y-1">
                    <label className={labelClass}>Monthly Income</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200">
                      <span className="bg-slate-50 px-3 flex items-center text-[13px] font-bold text-slate-500">K</span>
                      <input type="text" placeholder="0.00" value={formData.monthlyIncome} onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value.replace(/[^0-9.]/g, '') })} onBlur={() => handleAmountBlur('monthlyIncome')} className="w-full px-4 py-3 text-[13px] outline-none font-normal bg-white text-slate-500" />
                    </div>
                  </div>,
                ])}
              </div>
            )}

            {activeSectionId === 'payment' && (
              <div className="animate-fade-in space-y-12">
                <div className="space-y-8">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Primary Bank Account</h4>
                  {wrapFieldsWithCustom('payment_bank', [
                    <div key="b1" className="space-y-1"><label className={labelClass}>Bank Name</label><input type="text" placeholder="Select Bank" className={inputClass} /></div>,
                    <div key="b2" className="space-y-1"><label className={labelClass}>Branch</label><input type="text" placeholder="Branch name" className={inputClass} /></div>,
                    <div key="b3" className="space-y-1"><label className={labelClass}>Account Name</label><input type="text" placeholder="Full account name" className={inputClass} /></div>,
                    <div key="b4" className="space-y-1"><label className={labelClass}>Account Number</label><input type="text" placeholder="Account no." className={inputClass} /></div>,
                    <div key="b5" className="space-y-1"><label className={labelClass}>Sort Code</label><input type="text" placeholder="6 digits" className={inputClass} /></div>,
                  ])}
                </div>

                <div className="space-y-8 pt-8 border-t border-slate-200">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Primary Mobile Money</h4>
                  {wrapFieldsWithCustom('payment_momo', [
                    <div key="m1" className="space-y-1"><label className={labelClass}>Provider</label><input type="text" className={inputClass} placeholder="Airtel / MTN / Zamtel" /></div>,
                    <div key="m2" className="space-y-1"><label className={labelClass}>Mobile Money Number</label><input type="tel" placeholder="09XXXXXXXX" className={inputClass} /></div>,
                    <div key="m3" className="space-y-1"><label className={labelClass}>Registered Name</label><input type="text" placeholder="Owner name" className={inputClass} /></div>,
                  ])}
                </div>

                <div className="pt-8 border-t border-slate-200">
                   <label className="flex items-center gap-3 cursor-pointer group w-fit mb-6">
                     <input type="checkbox" className="w-4 h-4 rounded text-red-600 focus:ring-red-500" checked={altSlot.active} onChange={(e) => updateAltSlot({ active: e.target.checked })} />
                     <span className="text-[10px] font-bold uppercase text-slate-500 group-hover:text-red-600 transition-colors">{altSlot.active ? "Remove alternative payment method" : "Add alternative payment method"}</span>
                   </label>
                   {altSlot.active && (
                     <div className="p-8 rounded-3xl bg-white border border-slate-200 animate-fade-in space-y-8">
                        <div className="space-y-4">
                          <label className={labelClass}>Payment Type Choice</label>
                          <div className="flex gap-10">
                            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-slate-600">
                              <input type="radio" name="altType" checked={altSlot.type === 'Bank'} onChange={() => updateAltSlot({ type: 'Bank' })} /> Bank Account
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-slate-600">
                              <input type="radio" name="altType" checked={altSlot.type === 'MoMo'} onChange={() => updateAltSlot({ type: 'MoMo' })} /> Mobile Money
                            </label>
                          </div>
                        </div>
                        {altSlot.type === 'Bank' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1"><label className={labelClass}>Bank Name</label><input type="text" placeholder="Bank name" className={inputClass} value={altSlot.bankName} onChange={(e) => updateAltSlot({ bankName: e.target.value })} /></div>
                            <div className="space-y-1"><label className={labelClass}>Branch</label><input type="text" placeholder="Branch" className={inputClass} value={altSlot.branch} onChange={(e) => updateAltSlot({ branch: e.target.value })} /></div>
                            <div className="space-y-1"><label className={labelClass}>Account Name</label><input type="text" placeholder="Acc name" className={inputClass} value={altSlot.accName} onChange={(e) => updateAltSlot({ accName: e.target.value })} /></div>
                            <div className="space-y-1"><label className={labelClass}>Account Number</label><input type="text" placeholder="Acc no." className={inputClass} value={altSlot.accNum} onChange={(e) => updateAltSlot({ accNum: e.target.value })} /></div>
                            <div className="space-y-1"><label className={labelClass}>Sort Code</label><input type="text" placeholder="Sort code" className={inputClass} value={altSlot.sortCode} onChange={(e) => updateAltSlot({ sortCode: e.target.value })} /></div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1"><label className={labelClass}>Provider</label><input type="text" className={inputClass} placeholder="Airtel / MTN / Zamtel" value={altSlot.provider} onChange={(e) => updateAltSlot({ provider: e.target.value })} /></div>
                            <div className="space-y-1"><label className={labelClass}>Mobile Money Number</label><input type="tel" placeholder="Number" className={inputClass} value={altSlot.momoNum} onChange={(e) => updateAltSlot({ momoNum: e.target.value })} /></div>
                            <div className="space-y-1"><label className={labelClass}>Registered Name</label><input type="text" placeholder="Owner name" className={inputClass} value={altSlot.regName} onChange={(e) => updateAltSlot({ regName: e.target.value })} /></div>
                          </div>
                        )}
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeSectionId === 'uploads' && (
              <div className="animate-fade-in">
                {wrapFieldsWithCustom('uploads', [
                  <div key="f1" className="p-8 border-2 border-dashed border-slate-200 rounded-3xl hover:border-red-600 transition-colors bg-white">
                    <label className={labelClass}>NRC / ID (Front)</label>
                    <input type="file" className="block w-full text-[10px] text-slate-400 file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer" />
                  </div>,
                  <div key="f2" className="p-8 border-2 border-dashed border-slate-200 rounded-3xl hover:border-red-600 transition-colors bg-white">
                    <label className={labelClass}>NRC / ID (Back)</label>
                    <input type="file" className="block w-full text-[10px] text-slate-400 file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer" />
                  </div>,
                  <div key="f3" className="p-8 border-2 border-dashed border-slate-200 rounded-3xl hover:border-red-600 transition-colors bg-white">
                    <label className={labelClass}>Proof of Residence</label>
                    <input type="file" className="block w-full text-[10px] text-slate-400 file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer" />
                  </div>,
                  <div key="f4" className="p-8 border-2 border-dashed border-slate-200 rounded-3xl hover:border-red-600 transition-colors bg-white">
                    <label className={labelClass}>Proof of Income</label>
                    <input type="file" className="block w-full text-[10px] text-slate-400 file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer" />
                  </div>,
                ])}
              </div>
            )}

            {/* Render Custom Sections */}
            {customSections.some(cs => cs.id === activeSectionId) && (
              <div className="animate-fade-in">
                {wrapFieldsWithCustom(activeSectionId, [])}
              </div>
            )}

            <div className="pt-16 mt-16 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                Structured Information Panel • Section {sections.findIndex(s => s.id === activeSectionId) + 1}
              </div>
              <button type="submit" className="px-10 py-4 bg-red-600 text-white rounded-2xl font-bold text-[10px] uppercase shadow-xl shadow-red-900/10 hover:bg-black transition-all transform active:scale-[0.98]">
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Add Custom Field Modal */}
      {showCFModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-10 animate-fade-in-up text-left">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-serif font-bold text-slate-900">Add Field to Form</h3>
              <button onClick={() => setShowCFModal(false)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <label className={labelClass}>Field Label</label>
                <input type="text" className={inputClass} value={cfData.label} onChange={e => setCfData({...cfData, label: e.target.value})} placeholder="e.g. Spouse Name" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClass}>Input Type</label>
                  <select className={inputClass} value={cfData.type} onChange={e => setCfData({...cfData, type: e.target.value})}>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="dropdown">Dropdown</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Add to Section</label>
                  <div className="flex flex-col gap-2">
                    <select 
                      className={inputClass} 
                      disabled={cfData.isNewSection}
                      value={cfData.section} 
                      onChange={e => setCfData({...cfData, section: e.target.value})}
                    >
                      {sections.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                    <label className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-400 cursor-pointer">
                      <input type="checkbox" className="w-3 h-3 rounded" checked={cfData.isNewSection} onChange={e => setCfData({...cfData, isNewSection: e.target.checked})} />
                      Or create new section
                    </label>
                  </div>
                </div>
              </div>

              {cfData.isNewSection && (
                <div className="space-y-1 animate-fade-in">
                  <label className={labelClass}>New Section Name</label>
                  <input type="text" className={inputClass} value={cfData.newSectionName} onChange={e => setCfData({...cfData, newSectionName: e.target.value})} placeholder="e.g. Extra References" />
                </div>
              )}

              {cfData.type === 'dropdown' && (
                <div className="space-y-1 animate-fade-in">
                  <label className={labelClass}>Options (comma separated)</label>
                  <input type="text" className={inputClass} value={cfData.options} onChange={e => setCfData({...cfData, options: e.target.value})} placeholder="Option 1, Option 2" />
                </div>
              )}

              <div className="space-y-1">
                <label className={labelClass}>Exact Placement</label>
                <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex gap-4">
                    {['Top', 'Bottom', 'After Field'].map(pos => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setCfData({...cfData, position: pos as any})}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${cfData.position === pos ? 'bg-red-600 text-white shadow-sm' : 'bg-white text-slate-400 border border-slate-100'}`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                  {cfData.position === 'After Field' && !cfData.isNewSection && (
                    <select 
                      className={inputClass}
                      value={cfData.afterFieldId}
                      onChange={e => setCfData({...cfData, afterFieldId: e.target.value})}
                    >
                      <option value="">Select Preceding Field</option>
                      {Object.keys(initialFormData).map(k => (
                        <option key={k} value={k}>{k.replace(/([A-Z])/g, ' $1').trim()}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button onClick={() => setShowCFModal(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold text-[10px] uppercase hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={addCustomField} disabled={!cfData.label || (cfData.isNewSection && !cfData.newSectionName)} className="flex-[2] py-4 rounded-2xl bg-red-600 text-white font-bold text-[10px] uppercase shadow-xl hover:bg-black transition-all disabled:opacity-50">Add to Form</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- LOAN MODULE PAGES ---

const ViewAllLoansPage = ({ onAction, onBack }: { onAction: (a: string) => void, onBack: () => void }) => {
  const mockLoans = [
    { id: 'LN-4021', customer: 'ABINALA SICHALWE', amount: 15000, balance: 14250, start: '10/01/2024', due: '10/02/2024', status: 'Active' },
    { id: 'LN-3892', customer: 'ABRAHAM MUTWALE', amount: 5000, balance: 0, start: '15/10/2023', due: '15/04/2024', status: 'Closed' },
    { id: 'LN-4105', customer: 'MOSES MULENGA', amount: 12000, balance: 12000, start: '01/02/2024', due: '01/03/2024', status: 'Due Soon' },
    { id: 'LN-3990', customer: 'AGNESS CHAMA', amount: 25000, balance: 22000, start: '20/12/2023', due: '20/01/2024', status: 'Overdue' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-600';
      case 'Due Soon': return 'bg-yellow-50 text-yellow-600';
      case 'Overdue': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  return (
    <div className="animate-fade-in-up text-left">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold text-slate-900">All Loans Portfolio</h1>
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back</button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <div className="relative flex-1 max-w-sm">
              <input type="text" placeholder="Search Loan ID, Customer..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none text-[12px] outline-none" />
              <SearchIcon className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
           </div>
           <button onClick={() => onAction('AddLoan')} className="px-5 py-2 bg-red-600 text-white rounded-xl font-bold text-[10px] uppercase flex items-center gap-2"><Plus className="w-3 h-3" /> Add Loan</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[9px] font-bold uppercase">
              <tr>
                <th className="px-8 py-4">Loan ID</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Balance</th>
                <th className="px-8 py-4">Start</th>
                <th className="px-8 py-4">Due</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4 text-[11px] font-mono text-slate-500">{loan.id}</td>
                  <td className="px-8 py-4 text-[11px] font-bold text-slate-900">{loan.customer}</td>
                  <td className="px-8 py-4 text-[12px] text-slate-600">K {loan.amount.toLocaleString()}</td>
                  <td className="px-8 py-4 text-[12px] font-bold text-red-600">K {loan.balance.toLocaleString()}</td>
                  <td className="px-8 py-4 text-[11px] text-slate-500">{loan.start}</td>
                  <td className="px-8 py-4 text-[11px] text-slate-500">{loan.due}</td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${getStatusStyle(loan.status)}`}>{loan.status}</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-all" title="View Loan"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => onAction('ReceivePayment')} className="p-1.5 text-slate-400 hover:text-green-600 rounded-lg hover:bg-slate-100 transition-all" title="Receive Payment"><DollarSign className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all" title="Reschedule"><Calendar className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-all" title="Close Loan"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AddLoanPage = ({ onBack }: { onBack: () => void }) => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('15');
  const [term, setTerm] = useState('1');
  const [frequency, setFrequency] = useState('monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const mockCustomers = [
    { id: 'CUST-1001', name: 'ABINALA SICHALWE', nrc: '456789/11/1', phone: '0770535221' },
    { id: 'CUST-1002', name: 'ABRAHAM MUTWALE', nrc: '123456/10/1', phone: '0973358899' },
  ];

  const summary = useMemo(() => {
    const p = parseFloat(amount) || 0;
    const r = parseFloat(rate) || 0;
    const t = parseInt(term) || 0;
    const totalInterest = p * (r / 100) * (t / 12);
    const totalPayable = p + totalInterest;
    
    let installmentsCount = t;
    if (frequency === 'weekly') installmentsCount = t * 4;
    if (frequency === 'bi-weekly') installmentsCount = t * 2;
    
    const installment = installmentsCount > 0 ? totalPayable / installmentsCount : 0;
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + t);

    return { totalInterest, totalPayable, installment, endDate: endDate.toLocaleDateString() };
  }, [amount, rate, term, frequency]);

  const inputStyle = "w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] outline-none text-slate-400 font-normal placeholder:text-slate-300";
  const labelStyle = "text-[10px] font-bold uppercase text-black mb-1.5 block";
  const readOnlyStyle = "w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-[13px] text-slate-400 font-normal cursor-not-allowed";

  return (
    <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold text-slate-900">New Loan Application</h1>
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back</button>
      </div>

      <div className="space-y-8">
        {/* Borrower Info Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-[11px] font-bold uppercase text-red-600 mb-6 flex items-center gap-2"><User className="w-3 h-3" /> Borrower Information</h3>
          <div className="space-y-6">
            <div className="relative">
              <label className={labelStyle}>Search Customer</label>
              <input 
                type="text" 
                placeholder="Name, Phone, or ID..." 
                className={inputStyle}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && !selectedCustomer && (
                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl mt-1 shadow-xl z-10 overflow-hidden">
                  {mockCustomers.map(c => (
                    <button key={c.id} onClick={() => { setSelectedCustomer(c); setSearchQuery(''); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-[12px] font-bold border-b last:border-0">{c.name} ({c.id})</button>
                  ))}
                </div>
              )}
            </div>
            {selectedCustomer && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
                <div><label className={labelStyle}>Full Name</label><div className={readOnlyStyle}>{selectedCustomer.name}</div></div>
                <div><label className={labelStyle}>Customer ID</label><div className={readOnlyStyle}>{selectedCustomer.id}</div></div>
                <div><label className={labelStyle}>NRC / ID</label><div className={readOnlyStyle}>{selectedCustomer.nrc}</div></div>
                <div><label className={labelStyle}>Phone Number</label><div className={readOnlyStyle}>{selectedCustomer.phone}</div></div>
              </div>
            )}
          </div>
        </div>

        {/* Loan Details Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-[11px] font-bold uppercase text-red-600 mb-6 flex items-center gap-2"><Briefcase className="w-3 h-3" /> Loan Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelStyle}>Loan Amount (ZMW)</label>
              <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-red-600">
                <span className="px-3 bg-slate-50 flex items-center text-[12px] text-slate-400 border-r border-slate-200">K</span>
                <input type="number" step="0.01" className="w-full px-3 py-3 text-[13px] outline-none text-slate-400 font-normal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelStyle}>Loan Type</label>
              <select className={inputStyle}>
                <option>Personal Loan</option>
                <option>Business Loan</option>
                <option>Salaried Loan</option>
                <option>Collateral Loan</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <label className={labelStyle}>Loan Purpose</label>
              <input type="text" className={inputStyle} placeholder="e.g. Medical, Scaling Business" />
            </div>
            <div>
              <label className={labelStyle}>Loan Term (Months)</label>
              <select className={inputStyle} value={term} onChange={(e) => setTerm(e.target.value)}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m} Month{m > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Interest Rate (%)</label>
              <input type="number" className={inputStyle} value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>Repayment Frequency</label>
              <select className={inputStyle} value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Start Date</label>
              <input type="date" className={inputStyle} min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
        </div>

        {/* Repayment Summary */}
        <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
          <h3 className="text-[11px] font-bold uppercase text-red-500 mb-6">Repayment Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div><p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Total Interest</p><p className="text-xl font-bold">K {summary.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
            <div><p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Total Payable</p><p className="text-xl font-bold text-red-500">K {summary.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
            <div><p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Installment Amount</p><p className="text-xl font-bold">K {summary.installment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
            <div><p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Loan End Date</p><p className="text-xl font-bold">{summary.endDate}</p></div>
          </div>
        </div>

        {/* Collateral (Optional) */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
           <h3 className="text-[11px] font-bold uppercase text-slate-400 mb-6 flex items-center gap-2"><Lock className="w-3 h-3" /> Collateral Information (Optional)</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className={labelStyle}>Collateral Type</label><input type="text" className={inputStyle} placeholder="e.g. Vehicle, Property" /></div>
              <div><label className={labelStyle}>Estimated Value</label><input type="number" className={inputStyle} placeholder="K 0.00" /></div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Upload Document</label>
                <div className="border-2 border-dashed border-slate-100 rounded-xl p-6 text-center hover:border-red-600 transition-colors group cursor-pointer">
                  <FileUp className="w-8 h-8 text-slate-200 mx-auto mb-2 group-hover:text-red-600" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Click to browse or drop file</p>
                </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8">
          <button onClick={onBack} className="px-10 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-[10px] uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
          <button className="px-10 py-4 rounded-2xl bg-white border border-slate-900 font-bold text-[10px] uppercase text-slate-900 hover:bg-slate-900 hover:text-white transition-all">Save as Draft</button>
          <button onClick={() => { if(!selectedCustomer) return alert('Select a customer first'); alert('Application submitted successfully'); onBack(); }} className="px-10 py-4 rounded-2xl bg-red-600 font-bold text-[10px] uppercase text-white hover:bg-black shadow-xl shadow-red-200 transition-all">Submit Loan Application</button>
        </div>
      </div>
    </div>
  );
};

const DueLoansPage = ({ onBack }: { onBack: () => void }) => {
  const mockDue = [
    { customer: 'MOSES MULENGA', id: 'LN-4105', days: 0, balance: 12000, risk: 'Low' },
    { customer: 'AGNESS CHAMA', id: 'LN-3990', days: 12, balance: 22000, risk: 'High' },
    { customer: 'JOHN PHIRI', id: 'LN-4221', days: 5, balance: 4500, risk: 'Medium' },
  ];

  return (
    <div className="animate-fade-in-up text-left">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Due & Overdue Loans</h1>
          <p className="text-[10px] font-bold text-red-600 uppercase mt-1">Real-time collections monitor</p>
        </div>
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back</button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 bg-red-50/30 border-b border-slate-100">
           <p className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2"><AlertOctagon className="w-4 h-4 text-red-600" /> These loans require immediate attention to maintain portfolio quality.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase">
              <tr>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Loan ID</th>
                <th className="px-8 py-5">Days Overdue</th>
                <th className="px-8 py-5">Balance</th>
                <th className="px-8 py-5">Risk Level</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockDue.map((loan, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-8 py-5 text-[11px] font-bold text-slate-900">{loan.customer}</td>
                  <td className="px-8 py-5 text-[11px] font-mono text-slate-500">{loan.id}</td>
                  <td className="px-8 py-5">
                    <span className={`text-[11px] font-black ${loan.days > 0 ? 'text-red-600' : 'text-slate-400'}`}>{loan.days} Days</span>
                  </td>
                  <td className="px-8 py-5 text-[12px] font-bold text-red-600">K {loan.balance.toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      loan.risk === 'High' ? 'bg-red-50 text-red-600' : loan.risk === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                    }`}>{loan.risk} Risk</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 text-slate-400 hover:text-green-600 rounded-lg hover:bg-slate-100 transition-all" title="Receive Payment"><DollarSign className="w-4 h-4" /></button>
                       <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all" title="Send Reminder"><Bell className="w-4 h-4" /></button>
                       <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-all" title="Apply Penalty"><Minus className="w-4 h-4" /></button>
                       <button className="p-2 text-slate-400 hover:text-red-900 rounded-lg hover:bg-slate-100 transition-all" title="Flag Defaulter"><UserMinus className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LoanCalculatorPage = ({ onBack }: { onBack: () => void }) => {
  const [amount, setAmount] = useState('10000');
  const [rate, setRate] = useState('15');
  const [term, setTerm] = useState('12');
  const [frequency, setFrequency] = useState('monthly');

  const calc = useMemo(() => {
    const p = parseFloat(amount) || 0;
    const r = parseFloat(rate) || 0;
    const t = parseInt(term) || 0;
    const totalInterest = p * (r / 100) * (t / 12);
    const totalPayable = p + totalInterest;
    
    let installmentsCount = t;
    if (frequency === 'weekly') installmentsCount = t * 4;
    if (frequency === 'bi-weekly') installmentsCount = t * 2;
    
    const installment = installmentsCount > 0 ? totalPayable / installmentsCount : 0;
    return { totalInterest, totalPayable, installment };
  }, [amount, rate, term, frequency]);

  const labelStyle = "text-[10px] font-bold uppercase text-black mb-1.5 block";
  const inputStyle = "w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] outline-none text-slate-400 font-normal";

  return (
    <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Loan Calculator</h1>
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back</button>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
           <h3 className="text-[11px] font-bold uppercase text-slate-400 mb-2">Calculator Inputs</h3>
           <div>
             <label className={labelStyle}>Loan Amount (K)</label>
             <input type="number" className={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value)} />
           </div>
           <div>
             <label className={labelStyle}>Annual Interest Rate (%)</label>
             <input type="number" className={inputStyle} value={rate} onChange={(e) => setRate(e.target.value)} />
           </div>
           <div>
             <label className={labelStyle}>Term (Months)</label>
             <input type="number" className={inputStyle} value={term} onChange={(e) => setTerm(e.target.value)} />
           </div>
           <div>
             <label className={labelStyle}>Repayment Frequency</label>
             <select className={inputStyle} value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
             </select>
           </div>
           <div className="pt-4 grid grid-cols-2 gap-4">
              <button onClick={() => { setAmount('10000'); setRate('15'); setTerm('12'); setFrequency('monthly'); }} className="py-3 rounded-xl border border-slate-100 font-bold text-[10px] uppercase text-slate-400 hover:bg-slate-50 transition-all">Reset</button>
              <button className="py-3 rounded-xl bg-slate-900 text-white font-bold text-[10px] uppercase hover:bg-black transition-all">Calculate</button>
           </div>
        </div>

        <div className="md:col-span-7 bg-red-600 p-10 rounded-[2.5rem] shadow-xl text-white flex flex-col justify-between">
           <div>
             <h3 className="text-[10px] font-bold uppercase text-white/60 mb-10 tracking-[0.2em]">Estimated Loan Repayments</h3>
             <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                   <div><p className="text-[9px] font-bold uppercase text-white/50 mb-1">Total Payable Amount</p><p className="text-4xl font-serif font-black">K {calc.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                   <div className="text-right text-white/40"><DollarSign className="w-10 h-10" /></div>
                </div>
                <div className="grid grid-cols-2 gap-10">
                   <div><p className="text-[9px] font-bold uppercase text-white/50 mb-1">Installment Amount</p><p className="text-2xl font-bold">K {calc.installment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                   <div><p className="text-[9px] font-bold uppercase text-white/50 mb-1">Total Interest</p><p className="text-2xl font-bold">K {calc.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                </div>
             </div>
           </div>
           <div className="mt-12 p-6 bg-black/10 rounded-2xl border border-white/5">
              <p className="text-[10px] font-medium leading-relaxed opacity-80">Disclaimer: This calculator provides an estimation only. Final loan terms, interest rates, and fees will be determined at the time of official application and approval.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const ApproveLoansPage = ({ onBack }: { onBack: () => void }) => {
  const [showApprovalModal, setShowApprovalModal] = useState<any>(null);
  const mockPending = [
    { id: 'LN-4552', customer: 'LUKWESA LTD', amount: 85000, term: 24, risk: 85, status: 'Pending Approval' },
    { id: 'LN-4553', customer: 'JAMES MWALE', amount: 3500, term: 6, risk: 32, status: 'Pending Approval' },
    { id: 'LN-4554', customer: 'SARAH BANDA', amount: 15000, term: 12, risk: 58, status: 'Pending Approval' },
  ];

  const handleApprove = () => {
    alert(`Loan ${showApprovalModal.id} has been approved by ${SYSTEM_ADMIN_EMAIL.split('@')[0]} at ${new Date().toLocaleString()}`);
    setShowApprovalModal(null);
  };

  return (
    <div className="animate-fade-in-up text-left">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Pending Loan Approvals</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Management override required</p>
        </div>
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back</button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase">
              <tr>
                <th className="px-8 py-5">Loan ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Requested Amount</th>
                <th className="px-8 py-5">Term</th>
                <th className="px-8 py-5">Risk Score</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockPending.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50/50">
                  <td className="px-8 py-5 text-[11px] font-mono text-slate-500">{loan.id}</td>
                  <td className="px-8 py-5 text-[11px] font-bold text-slate-900">{loan.customer}</td>
                  <td className="px-8 py-5 text-[12px] font-black text-slate-900">K {loan.amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-[11px] text-slate-500">{loan.term} Months</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${loan.risk > 70 ? 'bg-red-500' : loan.risk > 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${loan.risk}%` }}></div>
                       </div>
                       <span className="text-[10px] font-bold text-slate-500">{loan.risk}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-yellow-50 text-yellow-600">Pending</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1">
                       <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-all" title="View Application"><FileText className="w-4 h-4" /></button>
                       <button onClick={() => setShowApprovalModal(loan)} className="p-2 text-slate-400 hover:text-green-600 rounded-lg hover:bg-slate-100 transition-all" title="Approve"><CheckSquare className="w-4 h-4" /></button>
                       <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-all" title="Reject"><X className="w-4 h-4" /></button>
                       <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all" title="Request Info"><Info className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showApprovalModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden p-10 text-left">
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">Confirm Loan Approval</h3>
              <p className="text-[12px] text-slate-500 mb-8 leading-relaxed">You are about to approve <strong>{showApprovalModal.id}</strong> for <strong>{showApprovalModal.customer}</strong> in the amount of <strong>K {showApprovalModal.amount.toLocaleString()}</strong>. This action will disburse funds if automated.</p>
              
              <div className="bg-slate-50 p-4 rounded-xl mb-10 border border-slate-100">
                 <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Logged Approver</p>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">AM</div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-900">{SYSTEM_ADMIN_EMAIL.split('@')[0].toUpperCase()}</p>
                       <p className="text-[9px] text-slate-400 uppercase font-medium">{new Date().toLocaleString()}</p>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowApprovalModal(null)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold text-[10px] uppercase hover:bg-slate-200 transition-all">Cancel</button>
                 <button onClick={handleApprove} className="flex-[2] py-4 rounded-2xl bg-red-600 text-white font-bold text-[10px] uppercase shadow-xl shadow-red-200 hover:bg-black transition-all">Confirm Approval</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;