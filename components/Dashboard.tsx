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
  RotateCcw, Landmark, List, ClipboardCheck
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
  const [showPaymentWidget, setShowPaymentWidget] = useState(false);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearchActive, setGlobalSearchActive] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);
  
  const isSystemAdmin = user.email === SYSTEM_ADMIN_EMAIL;
  const userRole = isSystemAdmin ? 'Admin' : (user.user_metadata?.role || 'customer');
  const isEmployer = userRole !== 'customer' && userRole !== 'borrower';

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

  const updateStatus = async (id: string, newStatus: string) => {
    if (userRole === 'customer') return;
    const { error } = await supabase.from('loan_applications').update({ status: newStatus, updated_at: new Date() }).eq('id', id);
    if (!error) fetchApplications();
  };

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
    else if (action === 'AddLoan' || action === 'CreateLoan') setCurrentView('AddBorrower');
    else if (action === 'ReviewLoanRequest' || action === 'ApproveLoan') setCurrentView('ViewAllLoans');
    else if (action === 'ViewCustomersList') setCurrentView('ViewBorrowers');
    else if (action === 'RegisterCustomer') setCurrentView('AddBorrower');
    else if (action === 'Calendar') setCurrentView('calendar_view');
  };

  const handleViewBorrower = (borrower: Borrower) => {
    setSelectedBorrower(borrower);
    setCurrentView('borrower-profile');
  };

  const renderContent = () => {
    if (currentView === 'AddBorrower') return <AddBorrowerPage user={user} onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ViewBorrowers') return <BorrowerListPage onViewBorrower={handleViewBorrower} onBack={() => setCurrentView('overview')} />;
    if (currentView === 'borrower-profile' && selectedBorrower) return <BorrowerProfilePage borrower={selectedBorrower} user={user} onBack={() => setCurrentView('ViewBorrowers')} />;
    
    if (currentView === 'overview') {
      return (
        <div className="animate-fade-in space-y-8">
          {/* Dashboard Summary Header */}
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

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KPICard title="Total Customers" value="1,422" icon={<Users />} color="blue" />
            <KPICard title="Active Loans" value="894" icon={<Briefcase />} color="green" />
            <KPICard title="Total Portfolio" value="K 4.2M" icon={<Wallet />} color="green" />
            <KPICard title="Total Collected" value="K 1.8M" icon={<CheckCircle />} color="green" />
            <KPICard title="Outstanding Balance" value="K 2.4M" icon={<BarChart3 />} color="yellow" />
            <KPICard title="Loans In Arrears" value="K 425K" icon={<AlertTriangle />} color="red" />
          </div>

          {/* Quick Actions Panel */}
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <h3 className="text-[11px] font-bold uppercase text-slate-400">Quick Actions</h3>
                <div className="h-px bg-slate-100 flex-1"></div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Loans & Payments Group */}
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg">Loans & Payments</p>
                   <ActionButton icon={<Plus />} label="Create Loan" onClick={() => handleAction('CreateLoan')} />
                   <ActionButton icon={<ClipboardCheck />} label="Review Loan Request" onClick={() => handleAction('Review Loan Request')} />
                   <ActionButton icon={<CheckCircle />} label="Approve Loan" onClick={() => handleAction('Approve Loan')} />
                   <ActionButton icon={<DollarSign />} label="Receive Payment" onClick={() => handleAction('Receive Payment')} />
                   <ActionButton icon={<RotateCcw />} label="Create Refund" onClick={() => handleAction('Create Refund')} />
                </div>

                {/* Customers & Accounts Group */}
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg">Customers & Accounts</p>
                   <ActionButton icon={<List />} label="View Customers List" onClick={() => handleAction('ViewCustomersList')} />
                   <ActionButton icon={<Download />} label="Deposit Money" onClick={() => handleAction('DepositMoney')} />
                   <ActionButton icon={<ArrowRightLeft />} label="Transfer Fund" onClick={() => handleAction('TransferFund')} />
                   <ActionButton icon={<UserPlus />} label="Register Customer" onClick={() => handleAction('Register Customer')} />
                </div>

                {/* Finance & Expenses Group */}
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg">Finance & Expenses</p>
                   <ActionButton icon={<Receipt />} label="Enter Expense" onClick={() => handleAction('EnterExpense')} />
                   <ActionButton icon={<Calendar />} label="Calendar" onClick={() => handleAction('Calendar')} />
                   <ActionButton icon={<History />} label="Audit Log" onClick={() => handleAction('AuditLog')} />
                </div>

                {/* Employees & HR Group */}
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg">Employees & HR</p>
                   <ActionButton icon={<Clock />} label="Employee Clocking" onClick={() => handleAction('EmployeeClocking')} />
                   <ActionButton icon={<CreditCard />} label="Pay Employee" onClick={() => handleAction('Pay Employee')} />
                   <ActionButton icon={<ClipboardList />} label="Assign Task" onClick={() => handleAction('Assign Task')} />
                   <ActionButton icon={<HeartHandshake />} label="HR Management" onClick={() => handleAction('HR Management')} />
                </div>
             </div>
          </div>

          {/* Charts & Table Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[11px] font-bold uppercase text-slate-400">Loan Disbursement Trend</h3>
                    <div className="flex bg-slate-50 p-1 rounded-lg">
                      <button className="px-3 py-1 text-[9px] font-bold uppercase rounded bg-white shadow-sm">Monthly</button>
                      <button className="px-3 py-1 text-[9px] font-bold uppercase text-slate-400">Weekly</button>
                    </div>
                  </div>
                  <div className="h-48 flex items-end justify-between gap-3 pt-4">
                    {[40, 65, 30, 85, 45, 95, 60, 50, 70, 40, 80, 55].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-red-50 rounded-t-lg transition-all duration-300 hover:bg-red-600 relative" style={{ height: `${h}%` }}>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">K{h*10}K</div>
                        </div>
                        <span className="text-[8px] font-medium text-slate-400 uppercase">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
                      </div>
                    ))}
                  </div>
               </div>

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
                  <button className="w-full mt-6 py-3.5 text-[9px] font-bold uppercase text-red-600 border border-dashed border-red-200 rounded-xl hover:bg-slate-100 transition-all">View All Defaulters</button>
               </div>

               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[11px] font-bold uppercase text-slate-400">Notifications & Alerts</h3>
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                  </div>
                  <div className="space-y-4">
                    <NotificationItem type="Payment" text="K 2,500 received from AM-9982" time="2m ago" />
                    <NotificationItem type="KYC" text="New submission from Sarah Soko" time="15m ago" />
                    <NotificationItem type="Alert" text="Loan LN-4042 is now 14 days overdue" time="1h ago" />
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
    <div className="flex min-h-screen bg-slate-50 relative overflow-x-hidden">
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

      {/* Header */}
      <header className={`fixed top-0 right-0 z-30 bg-white border-b border-slate-200 flex items-center justify-between px-8 transition-all duration-300 h-16 pt-0`} style={{ left: sidebarWidth === 'w-64' ? '16rem' : '5rem', marginTop: '4rem' }}>
        <div className="flex items-center gap-6">
          <button onClick={() => setGlobalSearchActive(true)} className="flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors group">
            <Search className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase group-hover:text-red-600">Global Search</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
          </button>
          <button onClick={() => setHelpPanelOpen(true)} className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className={`flex-1 ${mainMargin} pt-36 pb-12 px-8 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Receive Payment Modal */}
      {showPaymentWidget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
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
                   <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">Reference Number</label>
                      <input type="text" placeholder="TX-998273645" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] outline-none focus:ring-1 focus:ring-red-600" />
                   </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setShowPaymentWidget(false)} className="flex-1 py-3.5 rounded-xl border border-slate-200 text-[10px] font-bold uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-[2] py-3.5 rounded-xl bg-red-600 text-white text-[10px] font-bold uppercase shadow-xl shadow-red-200 hover:bg-black transition-all">Submit Payment</button>
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
      `}} />
    </div>
  );
};

// --- Dashboard Component Internals ---

const KPICard = ({ title, value, icon, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
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
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-3.5 rounded-2xl border border-slate-100 transition-all ${baseColor} hover:bg-slate-100`}>
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
        <thead>
          <tr className="bg-slate-50/50 text-slate-400 text-[8px] font-bold uppercase">
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
            <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-8 py-4 text-[12px] font-mono text-slate-500">LN-{app.id.substring(0,4)}</td>
              <td className="px-8 py-4">
                <p className="text-[12px] font-bold text-slate-900">{app.customer_name}</p>
                <p className="text-[8px] text-slate-400 font-medium">Verified Profile</p>
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
      <div>
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

const NotificationItem = ({ type, text, time }: any) => (
  <div className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-600"></div>
    <div>
      <p className="text-[11px] font-bold text-slate-900 group-hover:text-red-600 transition-colors">{text}</p>
      <p className="text-[9px] text-slate-400 font-normal">{time} • {type}</p>
    </div>
  </div>
);

// --- Sub-Pages ---

const BorrowerListPage = ({ onViewBorrower, onBack }: { onViewBorrower: (b: Borrower) => void, onBack: () => void }) => {
  const mockBorrowers: Borrower[] = [
    { id: '1', customerNumber: 'CUST-100224-0001', fullName: 'Moses Mulenga', gender: 'Male', dob: '1985-05-12', nrc: '456789/11/1', phone: '976853030', email: 'moses.m@test.com', address: 'Plot 12, Chililabombwe', employmentType: 'Employed', status: 'Current', branch: 'Nchelenge' },
    { id: '2', customerNumber: 'CUST-110224-0002', fullName: 'Agness Chama', gender: 'Female', dob: '1992-08-22', nrc: '123456/10/1', phone: '965443322', email: 'agness.c@test.com', address: 'House 4, Mwansabombwe', employmentType: 'Self-employed', status: 'In arrears', branch: 'Nchelenge' },
  ];
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-serif font-bold text-slate-900">Borrower Directory</h1></div>
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase transition-colors flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-lg"><ArrowLeft className="w-3 h-3" /> Back To Map</button>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
           <div className="relative flex-1 max-md:max-w-md">
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none text-[12px] font-normal outline-none focus:ring-1 focus:ring-red-600" />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
           </div>
           <button className="p-2 text-slate-400 hover:text-red-600 border border-slate-100 rounded-lg hover:bg-slate-100"><Filter className="w-4 h-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-bold uppercase">
                <th className="px-8 py-4">Borrower Info</th><th className="px-8 py-4">ID / NRC</th><th className="px-8 py-4">Phone</th><th className="px-8 py-4">Status</th><th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockBorrowers.map((borrower) => (
                <tr key={borrower.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4"><p className="text-[13px] font-bold text-slate-900">{borrower.fullName}</p></td>
                  <td className="px-8 py-4 text-[11px] text-slate-600 font-normal">{borrower.nrc}</td>
                  <td className="px-8 py-4 text-[11px] text-slate-600 font-normal">+260 {borrower.phone}</td>
                  <td className="px-8 py-4"><span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${borrower.status === 'Current' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{borrower.status}</span></td>
                  <td className="px-8 py-4 text-right"><button onClick={() => onViewBorrower(borrower)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold uppercase text-slate-600 hover:border-red-600 hover:text-red-600 hover:bg-slate-100">View Profile</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const BorrowerProfilePage = ({ borrower, user, onBack }: { borrower: Borrower, user: any, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Loans', 'Repayments', 'Savings', 'Investments', 'Documents', 'Activity History'];
  const labelClass = "text-[9px] font-bold uppercase text-slate-400 mb-1";
  const valueClass = "text-[12px] text-slate-900 font-medium";
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-serif font-bold text-slate-900">Borrower Profile</h1></div>
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-lg"><ArrowLeft className="w-3 h-3" /> Back To Directory</button>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8 p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div><p className={labelClass}>Customer Number</p><p className="text-base font-mono text-red-600 font-normal">{borrower.customerNumber}</p></div>
          <div><p className={labelClass}>Full Name</p><p className={valueClass}>{borrower.fullName}</p></div>
          <div><p className={labelClass}>Status</p><span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${borrower.status === 'Current' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{borrower.status}</span></div>
          <div><p className={labelClass}>Contact Details</p><p className={valueClass}>+260 {borrower.phone}</p></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}>{tab}</button>
        ))}
      </div>
      <div className="space-y-8 pb-12">
        {(activeTab === 'All' || activeTab === 'Loans') && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
             <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between"><h3 className="text-xs font-bold text-slate-900 uppercase">Active Loans</h3></div>
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-bold uppercase text-slate-400"><tr><th className="px-8 py-4">Loan ID</th><th className="px-8 py-4">Principal</th><th className="px-8 py-4">Status</th></tr></thead>
                <tbody className="divide-y divide-slate-100"><tr className="hover:bg-slate-50/30"><td className="px-8 py-4 text-[12px] font-mono font-normal">LN-4042-01</td><td className="px-8 py-4 text-[13px] font-medium">K 15,000.00</td><td className="px-8 py-4"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-bold uppercase">Disbursed</span></td></tr></tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

const AddBorrowerPage = ({ user, onBack }: { user: any, onBack: () => void }) => {
  const [form, setForm] = useState({ fullName: '', nrc: '', phone: '' });
  const handleSave = (e: React.FormEvent) => { e.preventDefault(); alert(`Borrower Saved Successfully`); onBack(); };
  const labelClass = "text-[12px] text-slate-700 font-normal mb-1 block";
  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-normal outline-none focus:ring-1 focus:ring-red-600 transition-all placeholder:text-slate-300";

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Add Borrower Record</h1>
        <button onClick={onBack} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-lg"><ArrowLeft className="w-3 h-3" /> Back</button>
      </div>
      <div className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-200 p-10 animate-fade-in-up">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} className={inputClass} placeholder="John Doe" />
          </div>
          <div>
            <label className={labelClass}>NRC Number</label>
            <input type="text" value={form.nrc} onChange={(e) => setForm({...form, nrc: e.target.value})} className={inputClass} placeholder="123456/11/1" />
          </div>
          <div className="pt-2">
            <button type="submit" className="px-12 py-4 rounded-xl bg-red-600 text-white text-[10px] font-bold uppercase shadow-xl hover:bg-black transition-all">Save Borrower</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;