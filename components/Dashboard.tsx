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
  AlertOctagon, UserMinus, FileUp, Lock, FileType, CheckSquare as CheckSquareIcon,
  BookOpen, Scale, Landmark as BankIcon, Percent, Shield as AuditIcon, PieChart,
  Target, Globe, PiggyBank, Settings as SettingsIcon, BarChart, Send, Smile, Paperclip as AttachIcon,
  Phone, Settings2 as Settings2Icon, ClipboardList as TaskIcon, Bell as NotificationIcon, 
  LayoutGrid, Timer, ShieldHalf, UserCog, UserCheck as UserCheckIcon, Building2, Save,
  Users2, Landmark as CollateralIcon, ShieldPlus, FileCheck, FileWarning, Gavel, Files,
  MoveUp, MoveDown, MapPin as GpsIcon, CopyPlus, Layers2
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
  city: string;
  province: string;
  age: string;
  employmentStatus: { employed: boolean; selfEmployed: boolean };
  employmentType: string;
  employerName: string;
  empContactPosition: string;
  income: string;
  primaryPaymentType: string;
  bankName: string;
  bankAccNumber: string;
  momoNetwork: string;
  momoPhone: string;
  gps?: { lat: number; lng: number } | null;
  customFields: any[];
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
  const [borrowerRecords, setBorrowerRecords] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [currentView, setCurrentView] = useState('overview');
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Task Notification State
  const [hasPendingTask, setHasPendingTask] = useState(true);
  const [showTaskNag, setShowTaskNag] = useState(false);

  const isSystemAdmin = user.email === SYSTEM_ADMIN_EMAIL;
  const userRole = isSystemAdmin ? 'Admin' : (user.user_metadata?.role || 'customer');

  useEffect(() => {
    let nagInterval: any;
    if (hasPendingTask) {
      nagInterval = setInterval(() => {
        setShowTaskNag(true);
      }, 30000); 
    } else {
      setShowTaskNag(false);
    }
    return () => clearInterval(nagInterval);
  }, [hasPendingTask]);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubItemClick = (viewId: string) => {
    setCurrentView(viewId);
  };

  const sidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleAction = (action: string) => {
    if (action === 'ReceivePayment' || action === 'Receive Payment') {
      setShowPaymentWidget(true);
    } else if (action === 'CreateLoan') {
      setCurrentView('AddLoan');
    } else if (action === 'RegisterCustomer') {
      setCurrentView('AddBorrower');
    } else {
      alert(`Action "${action}" triggered.`);
    }
  };

  const [showPaymentWidget, setShowPaymentWidget] = useState(false);

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
        customer_name: app.user_email?.split('@')[0] || 'Customer'
      }));
      setApplications(supplemented);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
    // Initialize some mock borrowers
    setBorrowerRecords([
      {
        id: '1',
        customerNumber: 'CUST-001',
        fullName: 'Abraham Mutwale',
        gender: 'M',
        dob: '1990-01-01',
        age: '36',
        nrc: '123456/78/9',
        phone: '971122334',
        email: 'abraham@example.com',
        address: 'Nchelenge Street 10',
        city: 'Nchelenge',
        province: 'Luapula',
        employmentStatus: { employed: true, selfEmployed: false },
        employmentType: 'Permanent',
        employerName: 'Aster Money Lenders',
        empContactPosition: 'Manager',
        income: '25000',
        primaryPaymentType: 'Bank',
        bankName: 'Absa',
        bankAccNumber: '1029384756',
        momoNetwork: '',
        momoPhone: '',
        customFields: []
      }
    ]);
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
      { id: 'AdvancedLoanOffer', label: 'Advanced Loan Offer' },
      { id: 'DueLoans', label: 'Due Loans' },
      { id: 'LoanCalculator', label: 'Loan Calculator' },
      { id: 'ApproveLoans', label: 'Approve Loans' },
      { id: 'LoanGuarantors', label: 'Loan Guarantors' },
      { id: 'LoanCollateral', label: 'Loan Collateral' },
      { id: 'LoanRescheduling', label: 'Loan Rescheduling' },
      { id: 'LoanWriteOffs', label: 'Loan Write-Offs' },
      { id: 'LoanRecovery', label: 'Loan Recovery' },
      { id: 'LoanDocuments', label: 'Loan Documents' }
    ]},
    { id: 'repayments', label: 'Repayments', icon: <DollarSign className="w-4 h-4" />, subItems: [
      { id: 'ViewRepayments', label: 'View Repayments' },
      { id: 'AddBulkRepayments', label: 'Add Bulk Repayments' },
      { id: 'ApproveRepayments', label: 'Approve Repayments' }
    ]},
    { id: 'savings', label: 'Savings', icon: <PiggyBank className="w-4 h-4" />, subItems: [
      { id: 'ViewSavingsAccounts', label: 'View Savings Accounts' },
      { id: 'AddSavingsAccount', label: 'Add Savings Account' },
      { id: 'SavingsDeposits', label: 'Savings Deposits' },
      { id: 'SavingsWithdrawals', label: 'Savings Withdrawals' },
      { id: 'SavingsTransfers', label: 'Savings Transfers' },
      { id: 'SavingsInterestConfig', label: 'Savings Interest Config' },
      { id: 'SavingsStatements', label: 'Savings Statements' },
      { id: 'DormantAccounts', label: 'Dormant Savings Accounts' },
      { id: 'SavingsProducts', label: 'Savings Products' },
      { id: 'SavingsFees', label: 'Savings Fees & Penalties' },
      { id: 'SavingsApprovals', label: 'Savings Account Approvals' },
      { id: 'SavingsInterestLog', label: 'Savings Interest Posting Log' },
      { id: 'SavingsTxHistory', label: 'Savings Transaction History' },
      { id: 'SavingsClosure', label: 'Savings Account Closure' },
      { id: 'SavingsReports', label: 'Savings Reports' }
    ]},
    { id: 'investments', label: 'Investments', icon: <TrendingUp className="w-4 h-4" />, subItems: [
      { id: 'ViewInvestments', label: 'View Investments' },
      { id: 'CreateInvestment', label: 'Create Investment' },
      { id: 'InvestmentContributions', label: 'Investment Contributions' },
      { id: 'InvestmentPayouts', label: 'Investment Payouts' },
      { id: 'InvestmentMaturity', label: 'Investment Maturity' },
      { id: 'InvestmentReturnsConfig', label: 'Investment Returns Config' },
      { id: 'InvestmentStatements', label: 'Investment Statements' },
      { id: 'RiskPerformanceOverview', label: 'Risk & Performance Overview' },
      { id: 'InvestmentProducts', label: 'Investment Products' },
      { id: 'InvestmentApprovals', label: 'Investment Approvals' },
      { id: 'InvestmentContribSchedule', label: 'Investment Contribution Schedule' },
      { id: 'InvestmentReturnLog', label: 'Investment Returns Calculation Log' },
      { id: 'InvestmentPayoutApprovals', label: 'Investment Payout Approvals' },
      { id: 'InvestmentPerformanceAnalytics', label: 'Investment Performance Analytics' },
      { id: 'InvestmentMaturityClosure', label: 'Investment Maturity & Closure' },
      { id: 'InvestmentReports', label: 'Investment Reports' }
    ]},
    { id: 'chat', label: 'Customer Chat', icon: <MessageSquare className="w-4 h-4" />, subItems: [
      { id: 'ChatInbox', label: 'Inbox' },
      { id: 'ChatQuickReplies', label: 'Quick Replies' },
      { id: 'ChatAuditLog', label: 'Chat Audit Log' }
    ]},
    { id: 'clocking', label: 'Clocking Management', icon: <Clock className="w-4 h-4" />, subItems: [
      { id: 'ClockInOut', label: 'Clock In / Clock Out' },
      { id: 'DailyAttendance', label: 'Daily Attendance View' },
      { id: 'ClockingSummary', label: 'Clocking Summary' },
      { id: 'OvertimeCalculation', label: 'Overtime Calculation' },
      { id: 'AbsenceTracking', label: 'Absence & Late Tracking' }
    ]},
    { id: 'payroll', label: 'Payroll Management', icon: <Briefcase className="w-4 h-4" />, subItems: [
      { id: 'PayrollSetup', label: 'Payroll Setup' },
      { id: 'PayrollProcessing', label: 'Payroll Processing' },
      { id: 'PayslipGeneration', label: 'Payslip Generation' },
      { id: 'PayrollApproval', label: 'Payroll Approval' },
      { id: 'PayrollHistory', label: 'Payroll History' }
    ]},
    { id: 'hr', label: 'HR Management', icon: <UserCog className="w-4 h-4" />, subItems: [
      { id: 'EmployeeManagement', label: 'Employee Management' },
      { id: 'UserAccounts', label: 'User Accounts' },
      { id: 'RolesPermissions', label: 'Roles & Permissions' },
      { id: 'DepartmentManagement', label: 'Department Management' },
      { id: 'HRReports', label: 'HR Reports' }
    ]},
    { id: 'tasks', label: 'Task Management', icon: <TaskIcon className="w-4 h-4" />, subItems: [
      { id: 'AssignTask', label: 'Assign Task' },
      { id: 'EmployeeTasks', label: 'Employee Tasks' },
      { id: 'TaskReports', label: 'Task Reports' }
    ]},
    { id: 'accounting', label: 'Accounting', icon: <Calculator className="w-4 h-4" />, subItems: [
      { id: 'BalanceSheet', label: 'Balance Sheet' },
      { id: 'TrialBalance', label: 'Trial Balance' },
      { id: 'ChartOfAccounts', label: 'Chart of Accounts' },
      { id: 'ManualJournal', label: 'Manual Journal' },
      { id: 'GeneralLedger', label: 'General Ledger' },
      { id: 'JournalApproval', label: 'Journal Approval' },
      { id: 'ExpenseManagement', label: 'Expense Management' },
      { id: 'RevenueManagement', label: 'Revenue Management' },
      { id: 'FixedAssets', label: 'Fixed Assets' },
      { id: 'BankReconciliation', label: 'Bank Reconciliation' },
      { id: 'TaxManagement', label: 'Tax Management' },
      { id: 'Financial Periods', label: 'Financial Periods' },
      { id: 'AuditTrail', label: 'Audit Trail' }
    ]},
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" />, subItems: [
      { id: 'LoanReport', label: 'Loan Report' },
      { id: 'BorrowersReport', label: 'Borrowers Report' },
      { id: 'CollectionsReport', label: 'Collections Report' },
      { id: 'PortfolioPerformance', label: 'Portfolio Performance Report' },
      { id: 'RepaymentPerformance', label: 'Repayment Performance Report' },
      { id: 'ArrearsDefault', label: 'Arrears & Default Report' },
      { id: 'IncomeRevenue', label: 'Income & Revenue Report' },
      { id: 'ExpenseReport', label: 'Expense Report' },
      { id: 'CashFlowReport', label: 'Cash Flow Report' },
      { id: 'CustomerActivity', label: 'Customer Activity Report' },
      { id: 'LoanOfficerPerformance', label: 'Loan Officer Performance Report' },
      { id: 'BranchPerformance', label: 'Branch Performance Report' },
      { id: 'AuditCompliance', label: 'Audit & Compliance Report' }
    ]},
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" />, subItems: [
      { id: 'SystemSettings', label: 'System Settings' },
      { id: 'BranchSettings', label: 'Branch Settings' },
      { id: 'UserPreferences', label: 'User Preferences' },
      { id: 'SecuritySettings', label: 'Security Settings' },
      { id: 'AuditLogs', label: 'Audit & Logs' }
    ]}
  ];

  const handleEnrollBorrower = (newBorrower: Borrower) => {
    setBorrowerRecords(prev => [...prev, newBorrower]);
    setCurrentView('ViewBorrowers');
  };

  const renderContent = () => {
    if (currentView === 'AddLoan') return <AddLoanPage onBack={() => setCurrentView('ViewAllLoans')} />;
    if (currentView === 'ViewAllLoans') return <ViewAllLoansPage applications={applications} onAction={handleAction} onBack={() => setCurrentView('overview')} />;
    if (currentView === 'AdvancedLoanOffer') return <AdvancedLoanOfferPage onBack={() => setCurrentView('ViewAllLoans')} />;
    if (currentView === 'LoanCalculator') return <LoanCalculatorPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'DueLoans') return <DueLoansPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ApproveLoans') return <ApproveLoansPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'LoanGuarantors') return <LoanGuarantorsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'LoanCollateral') return <LoanCollateralPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'LoanRescheduling') return <LoanReschedulingPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'LoanWriteOffs') return <LoanWriteOffsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'LoanRecovery') return <LoanRecoveryPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'LoanDocuments') return <LoanDocumentsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'RegisterNextOfKin') return <RegisterNextOfKinPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ViewNextOfKin') return <ViewNextOfKinPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'NextOfKinVerification') return <NextOfKinVerificationPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'RegisterGuarantor') return <RegisterGuarantorPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ViewGuarantors') return <ViewGuarantorsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'GuarantorCommitment') return <GuarantorCommitmentPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'GuarantorVerification') return <GuarantorVerificationPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'RegisterCollateral') return <RegisterCollateralPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ViewCollateral') return <ViewCollateralPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'CollateralValuation') return <CollateralValuationPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'CollateralRelease') return <CollateralReleasePage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ViewRepayments') return <ViewRepaymentsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'AddBulkRepayments') return <AddBulkRepaymentsPage onBack={() => setCurrentView('ViewRepayments')} />;
    if (currentView === 'ApproveRepayments') return <ApproveRepaymentsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ManualJournal') return <ManualJournalPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'GeneralLedger') return <GeneralLedgerPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'JournalApproval') return <JournalApprovalPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ExpenseManagement') return <ExpenseManagementPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'RevenueManagement') return <RevenueManagementPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'FixedAssets') return <FixedAssetsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'BankReconciliation') return <BankReconciliationPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'TaxManagement') return <TaxManagementPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'FinancialPeriods') return <FinancialPeriodsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'AuditTrail') return <AuditTrailPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'BalanceSheet') return <BalanceSheetPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'TrialBalance') return <TrialBalancePage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ChartOfAccounts') return <ChartOfAccountsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'LoanReport') return <ReportView title="Loan Report" onBack={() => setCurrentView('overview')} />;
    if (currentView === 'BorrowersReport') return <ReportView title="Borrowers Report" onBack={() => setCurrentView('overview')} />;
    if (currentView === 'CollectionsReport') return <ReportView title="Collections Report" onBack={() => setCurrentView('overview')} />;
    if (currentView.includes('Performance') || currentView.includes('Report')) return <ReportView title={currentView.replace(/([A-Z])/g, ' $1').trim()} onBack={() => setCurrentView('overview')} />;
    if (currentView === 'AddSavingsAccount') return <AddSavingsAccountPage onBack={() => setCurrentView('ViewSavingsAccounts')} />;
    if (currentView === 'SavingsDeposits') return <SavingsDepositsPage onBack={() => setCurrentView('ViewSavingsAccounts')} />;
    if (currentView === 'SavingsWithdrawals') return <SavingsWithdrawalsPage onBack={() => setCurrentView('ViewSavingsAccounts')} />;
    if (currentView === 'SavingsTransfers') return <SavingsTransfersPage onBack={() => setCurrentView('ViewSavingsAccounts')} />;
    if (currentView === 'SavingsInterestConfig') return <SavingsInterestConfigPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'SavingsStatements') return <SavingsStatementsPage onBack={() => setCurrentView('ViewSavingsAccounts')} />;
    if (currentView === 'SavingsClosure') return <SavingsClosurePage onBack={() => setCurrentView('overview')} />;
    if (currentView.startsWith('Savings')) return <SavingsModuleStub title={currentView.replace(/([A-Z])/g, ' $1').trim()} onBack={() => setCurrentView('overview')} />;
    if (currentView === 'CreateInvestment') return <CreateInvestmentPage onBack={() => setCurrentView('ViewInvestments')} />;
    if (currentView === 'InvestmentContributions') return <InvestmentContributionsPage onBack={() => setCurrentView('ViewInvestments')} />;
    if (currentView === 'InvestmentPayouts') return <InvestmentPayoutsPage onBack={() => setCurrentView('ViewInvestments')} />;
    if (currentView === 'InvestmentApprovals') return <InvestmentApprovalsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'InvestmentPerformanceAnalytics') return <InvestmentPerformancePage onBack={() => setCurrentView('overview')} />;
    if (currentView.startsWith('Investment')) return <InvestmentModuleStub title={currentView.replace(/([A-Z])/g, ' $1').trim()} onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ClockInOut') return <ClockInOutPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'DailyAttendance') return <DailyAttendancePage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ClockingSummary') return <ClockingSummaryPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'OvertimeCalculation' || currentView === 'AbsenceTracking') return <ClockingAnalyticsPage title={currentView} onBack={() => setCurrentView('overview')} />;
    if (currentView === 'PayrollSetup') return <PayrollSetupPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'PayrollProcessing') return <PayrollProcessingPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'PayslipGeneration') return <PayslipGenerationPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'PayrollApproval') return <PayrollApprovalPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'PayrollHistory') return <PayrollHistoryPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'EmployeeManagement') return <EmployeeManagementPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'UserAccounts') return <UserAccountsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'RolesPermissions') return <RolesPermissionsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'DepartmentManagement') return <DepartmentManagementPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'HRReports') return <HRReportsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'AssignTask') return <AssignTaskPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'EmployeeTasks') return <EmployeeTasksPage onBack={() => setCurrentView('overview')} onComplete={() => setHasPendingTask(false)} />;
    if (currentView === 'TaskReports') return <TaskReportsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'SystemSettings') return <SystemSettingsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'BranchSettings') return <BranchSettingsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'UserPreferences') return <UserPreferencesPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'SecuritySettings') return <SecuritySettingsPage onBack={() => setCurrentView('overview')} />;
    if (currentView === 'AuditLogs') return <AuditLogsPage onBack={() => setCurrentView('overview')} />;

    // BORROWERS - Actual implementation
    if (currentView === 'AddBorrower') return <AddBorrowerPage onBack={() => setCurrentView('overview')} onEnroll={handleEnrollBorrower} />;
    if (currentView === 'ViewBorrowers') return <BorrowerListPage borrowers={borrowerRecords} onViewBorrower={(b: Borrower) => { setSelectedBorrower(b); setCurrentView('ViewBorrowerProfile'); }} onBack={() => setCurrentView('overview')} />;
    if (currentView === 'ViewBorrowerProfile' && selectedBorrower) return <ViewBorrowerProfile borrower={selectedBorrower} onBack={() => setCurrentView('ViewBorrowers')} />;

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
            <KPICard title="Total Customers" value={borrowerRecords.length.toString()} icon={<Users />} color="blue" />
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
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg text-center">Customers & Accounts</p>
                   <ActionButton icon={<List />} label="View Customers List" onClick={() => setCurrentView('ViewBorrowers')} />
                   <ActionButton icon={<Download />} label="Deposit Money" onClick={() => handleAction('DepositMoney')} />
                   <ActionButton icon={<ArrowRightLeft />} label="Transfer Fund" onClick={() => handleAction('TransferFund')} />
                   <ActionButton icon={<UserPlus />} label="Register Customer" onClick={() => handleAction('RegisterCustomer')} />
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg text-center">Finance & Expenses</p>
                   <ActionButton icon={<Receipt />} label="Enter Expense" onClick={() => setCurrentView('ExpenseManagement')} />
                   <ActionButton icon={<Calendar />} label="Calendar" onClick={() => alert('Calendar active')} />
                   <ActionButton icon={<History />} label="Audit Log" onClick={() => setCurrentView('AuditLogs')} />
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-2">
                   <p className="text-[13px] font-bold text-white bg-red-600 uppercase mb-3 px-3 py-1.5 rounded-lg text-center">Employees & HR</p>
                   <ActionButton icon={<Clock />} label="Employee Clocking" onClick={() => setCurrentView('ClockInOut')} />
                   <ActionButton icon={<CreditCard />} label="Pay Employee" onClick={() => setCurrentView('PayrollProcessing')} />
                   <ActionButton icon={<ClipboardList />} label="Assign Task" onClick={() => setCurrentView('AssignTask')} />
                   <ActionButton icon={<HeartHandshake />} label="HR Management" onClick={() => setCurrentView('EmployeeManagement')} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase text-slate-400">Active Loans Overview</h3>
                </div>
                <ActiveLoansTable applications={applications} onAction={handleAction} />
            </div>
            <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase text-slate-400 mb-6">Recent Delinquencies</h3>
                <div className="space-y-4">
                  <OverdueRow name="Moses Mulenga" days={14} balance="K 8,420" risk="High" />
                  <OverdueRow name="Agness Chama" days={5} balance="K 12,500" risk="Medium" />
                  <OverdueRow name="John Phiri" days={2} balance="K 3,200" risk="Low" />
                </div>
            </div>
          </div>
        </div>
      );
    }
    return <div className="p-20 text-center text-slate-300 font-bold uppercase">Restoration error. Module logic is missing.</div>;
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
          <button onClick={() => setCurrentView('overview')} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'} py-2.5 rounded-lg text-sm transition-all ${currentView === 'overview' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Home className="w-4 h-4 flex-shrink-0" />{!isSidebarCollapsed && <span>Dashboard</span>}
          </button>
          <div className="h-px bg-slate-800 my-4"></div>
          {menuItems.slice(1).map((item) => (
            <div key={item.id} className="space-y-1">
              <button onClick={() => !isSidebarCollapsed && toggleMenu(item.id)} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'} py-2.5 rounded-lg text-sm transition-all ${expandedMenus[item.id] && !isSidebarCollapsed ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
                <div className={`flex items-center ${isSidebarCollapsed ? '' : 'space-x-3'}`}><span className={`${expandedMenus[item.id] && !isSidebarCollapsed ? 'text-red-500' : 'text-slate-500'} flex-shrink-0`}>{item.icon}</span>{!isSidebarCollapsed && <span>{item.label}</span>}</div>
                {!isSidebarCollapsed && (expandedMenus[item.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
              </button>
              {expandedMenus[item.id] && !isSidebarCollapsed && (
                <div className="ml-9 space-y-1 py-1 animate-fade-in">
                  {item.subItems?.map((sub, idx) => (
                    <button key={idx} onClick={() => handleSubItemClick(sub.id)} className={`w-full text-left px-3 py-1.5 text-[11px] border-l border-slate-700 transition-all ${currentView === sub.id ? 'text-red-500 border-red-500 f-4' : 'text-slate-400 hover:text-red-500 hover:pl-4'}`}>{sub.label}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className={`flex-1 ${mainMargin} pt-36 pb-12 px-8 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>

      {showTaskNag && (
        <div className="fixed bottom-10 right-10 z-[2000] animate-fade-in-up">
           <div className="bg-red-600 text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border-4 border-white">
              <div className="bg-white/20 p-3 rounded-2xl"><Bell className="w-6 h-6 animate-bounce" /></div>
              <div><p className="text-[11px] font-black uppercase mb-1">Attention Required</p><p className="text-[13px] font-medium leading-tight">You have a pending task to complete.</p></div>
              <button onClick={async () => { setShowTaskNag(false); setCurrentView('EmployeeTasks'); }} className="px-6 py-2.5 bg-white text-red-600 rounded-xl font-bold text-[10px] uppercase shadow-lg hover:bg-black hover:text-white transition-all">Resolve</button>
              <button onClick={() => setShowTaskNag(false)} className="p-2 text-white/50 hover:text-white transition-all"><X className="w-5 h-5" /></button>
           </div>
        </div>
      )}

      {showPaymentWidget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up text-left">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div><h3 className="text-xl font-serif font-bold text-slate-900">Receive Payment</h3><p className="text-[10px] font-bold text-red-600 uppercase mt-1">Operational Module</p></div>
                <button onClick={() => setShowPaymentWidget(false)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 transition-all shadow-sm"><X className="w-5 h-5" /></button>
              </div>
              <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Payment Recorded Successfully'); setShowPaymentWidget(false); }}>
                <div className="space-y-4">
                   <FormInput label="Customer / Loan ID" placeholder="LN-XXXX" />
                   <div className="grid grid-cols-2 gap-4">
                      <FormInput label="Amount Received" prefix="K" type="number" />
                      <FormSelect label="Method" options={[{label:'Mobile Money', value:'MM'}, {label:'Cash', value:'C'}, {label:'Bank', value:'B'}]} />
                   </div>
                </div>
                <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-[10px] uppercase shadow-xl hover:bg-black transition-all">Submit Payment</button>
              </form>
           </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }`}} />
    </div>
  );
};

// --- FORM HELPERS ---

const ActionButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-slate-600 hover:text-red-600 border border-transparent hover:border-slate-100 group"
  >
    <span className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
    </span>
    <span className="text-[11px] font-bold uppercase tracking-tight">{label}</span>
  </button>
);

const FormInput = ({ label, type = 'text', placeholder, value, onChange, prefix, suffix }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold uppercase text-black mb-1.5 block">{label}</label>
    <div className="flex border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-red-600 bg-white shadow-sm transition-all">
      {prefix && <span className="px-4 bg-slate-50 flex items-center text-[12px] font-bold text-slate-400 border-r border-slate-200">{prefix}</span>}
      <input type={type} className="w-full px-5 py-3.5 text-[12px] outline-none font-normal placeholder:text-slate-300" placeholder={placeholder} value={value} onChange={onChange} />
      {suffix && <span className="px-4 bg-slate-50 flex items-center text-[12px] font-bold text-slate-400 border-l border-slate-200">{suffix}</span>}
    </div>
  </div>
);

const FormSelect = ({ label, options, value, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold uppercase text-black mb-1.5 block">{label}</label>
    <select className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-[12px] outline-none font-normal focus:ring-1 focus:ring-red-600 bg-white shadow-sm" value={value} onChange={onChange}>
      {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const ReportHeader = ({ title, subtitle, onBack }: { title: string, subtitle?: string, onBack: () => void }) => (
  <div className="flex items-center justify-between mb-10">
    <div className="flex items-center gap-6">
      <button onClick={onBack} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 transition-all shadow-sm"><ArrowLeft className="w-5 h-5" /></button>
      <div><h2 className="text-3xl font-serif font-black text-slate-900">{title}</h2>{subtitle && <p className="text-[10px] font-black text-red-600 uppercase mt-1 tracking-widest">{subtitle}</p>}</div>
    </div>
    <div className="flex items-center gap-3 print:hidden">
      <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"><PrinterIcon className="w-3.5 h-3.5" /> Print</button>
      <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-200"><FileDown className="w-3.5 h-3.5" /> Export</button>
    </div>
  </div>
);

const KPICard = ({ title, value, icon, color }: any) => {
  const colorMap: any = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', yellow: 'bg-yellow-50 text-yellow-600', red: 'bg-red-50 text-red-600' };
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className={`w-12 h-12 rounded-2xl ${colorMap[color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>{React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

// --- OPERATIONAL VIEWS ---

const ActiveLoansTable = ({ applications, onAction }: { applications: any[], onAction: (a: string) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
        <tr>
          <th className="px-8 py-5">Customer</th>
          <th className="px-8 py-5">Amount</th>
          <th className="px-8 py-5">Status</th>
          <th className="px-8 py-5">Date</th>
          <th className="px-8 py-5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {applications.length > 0 ? applications.map((app) => (
          <tr key={app.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-8 py-4">
              <p className="text-sm font-bold text-slate-900">{app.customer_name}</p>
              <p className="text-[10px] text-slate-400 uppercase">{app.loan_type}</p>
            </td>
            <td className="px-8 py-4 text-sm font-medium text-slate-700">K {app.amount.toLocaleString()}</td>
            <td className="px-8 py-4">
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${app.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                {app.status}
              </span>
            </td>
            <td className="px-8 py-4 text-sm text-slate-500">{new Date(app.created_at).toLocaleDateString()}</td>
            <td className="px-8 py-4 text-right">
              <button onClick={() => onAction('Review Loan Request')} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={5} className="px-8 py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No Active Loan Records</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const OverdueRow = ({ name, days, balance, risk }: { name: string, days: number, balance: string, risk: string }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`w-1.5 h-1.5 rounded-full ${risk === 'High' ? 'bg-red-600' : risk === 'Medium' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
      <div>
        <p className="text-sm font-bold text-slate-900">{name}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{days} Days Overdue</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-red-600">{balance}</p>
      <p className={`text-[8px] font-black uppercase ${risk === 'High' ? 'text-red-400' : risk === 'Medium' ? 'text-orange-400' : 'text-yellow-400'}`}>{risk} Risk</p>
    </div>
  </div>
);

const AddLoanPage = ({ onBack }: { onBack: () => void }) => (
  <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
    <ReportHeader title="Loan Origination" subtitle="Credit Facility Entry" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput label="Borrower Unique Identifier" placeholder="CUST-XXXX" />
        <FormSelect label="Loan Product Type" options={[{label:'Personal Growth', value:'P'}, {label:'Business Bridge', value:'B'}, {label:'Statutory Salaried', value:'S'}]} />
        <FormInput label="Capital Amount" prefix="K" type="number" />
        <FormInput label="Interest Yield" suffix="%" type="number" />
        <FormInput label="Facility Window" suffix="Months" type="number" />
        <FormSelect label="Repayment Frequency" options={[{label:'Monthly Installments', value:'M'}, {label:'Bi-Weekly', value:'BW'}]} />
        <FormInput label="Disbursement Date" type="date" />
        <FormSelect label="Decision Branch" options={[{label:'AML HQ Nchelenge', value:'HQ'}]} />
      </div>
      <div className="pt-10 border-t border-slate-50 flex gap-6">
        <button onClick={onBack} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase transition-all hover:bg-slate-100">Cancel</button>
        <button className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl shadow-red-200 hover:bg-black transition-all">Commit Facility</button>
      </div>
    </div>
  </div>
);

const LoanCalculatorPage = ({ onBack }: { onBack: () => void }) => {
  const [calc, setCalc] = useState({ amount: 10000, rate: 10, time: 12 });
  const monthly = (calc.amount + (calc.amount * (calc.rate/100))) / calc.time;
  return (
    <div className="animate-fade-in-up text-left max-w-2xl mx-auto">
      <ReportHeader title="Credit Amortizer" subtitle="Repayment projection tool" onBack={onBack} />
      <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-10">
        <FormInput label="Target Capital" prefix="K" value={calc.amount} onChange={(e: any) => setCalc({...calc, amount: Number(e.target.value)})} />
        <FormInput label="Interest Rate" suffix="%" value={calc.rate} onChange={(e: any) => setCalc({...calc, rate: Number(e.target.value)})} />
        <FormInput label="Duration" suffix="Months" value={calc.time} onChange={(e: any) => setCalc({...calc, time: Number(e.target.value)})} />
        <div className="p-10 bg-slate-900 rounded-[2.5rem] text-center text-white shadow-2xl">
          <p className="text-[10px] font-black uppercase text-red-500 mb-4 tracking-widest">Monthly Installment</p>
          <h4 className="text-5xl font-serif font-black">K {monthly.toLocaleString(undefined, {minimumFractionDigits: 2})}</h4>
          <p className="text-[11px] text-slate-400 mt-6 font-medium italic">Total Repayment: K {(monthly * calc.time).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const ManualJournalPage = ({ onBack }: { onBack: () => void }) => (
  <div className="animate-fade-in-up text-left max-w-5xl mx-auto">
    <ReportHeader title="Double-Entry Journal" subtitle="Manual Accounting Entry" onBack={onBack} />
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
       <div className="p-10 border-b border-slate-50 grid grid-cols-3 gap-8 bg-slate-50/50">
          <FormInput label="Entry Date" type="date" />
          <FormInput label="Reference" placeholder="e.g. JRN-2024-001" />
          <FormInput label="Description" placeholder="Narrative..." />
       </div>
       <table className="w-full text-left">
          <thead className="bg-slate-900 text-white"><tr className="text-[9px] font-black uppercase tracking-widest"><th className="px-8 py-5">General Ledger Account</th><th className="px-8 py-5 text-right">Debit (K)</th><th className="px-8 py-5 text-right">Credit (K)</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
             {[1, 2].map(i => (
                <tr key={i} className="hover:bg-slate-50/30">
                  <td className="px-8 py-5"><select className="w-full bg-transparent outline-none text-[12px] font-bold text-slate-900"><option>Select Account...</option><option>Bank - Operating</option><option>Loan Interest Receivable</option></select></td>
                  <td className="px-8 py-5 text-right"><input type="number" className="bg-transparent outline-none text-right font-normal text-slate-900 w-32" placeholder="0.00" /></td>
                  <td className="px-8 py-5 text-right"><input type="number" className="bg-transparent outline-none text-right font-normal text-slate-900 w-32" placeholder="0.00" /></td>
                </tr>
             ))}
          </tbody>
       </table>
       <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="flex gap-8"><p className="text-[10px] font-black uppercase">Dr Total: <span className="text-slate-900 ml-2">K 0.00</span></p><p className="text-[10px] font-black uppercase">Cr Total: <span className="text-slate-900 ml-2">K 0.00</span></p></div>
          <button className="px-10 py-3.5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-black transition-all flex items-center gap-3"><Save className="w-4 h-4" /> Post Entry</button>
       </div>
    </div>
  </div>
);

const EmployeeManagementPage = ({ onBack }: { onBack: () => void }) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Staff Registry" subtitle="Human Resources Module" onBack={onBack} />
    <div className="grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl space-y-8 h-fit">
        <h3 className="text-[11px] font-black uppercase text-red-600 border-b border-red-50 pb-4">Enroll New Employee</h3>
        <FormInput label="Full Legal Name" placeholder="..." />
        <FormInput label="NRC Number" placeholder="XXXXXX/XX/X" />
        <FormSelect label="Organization Unit" options={[{label:'Lending Operations', value:'1'}, {label:'Risk Compliance', value:'2'}]} />
        <FormInput label="Official Position" placeholder="e.g. Senior Officer" />
        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-black transition-all">Add to System</button>
      </div>
      <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest"><tr><th className="px-8 py-5">Staff Identity</th><th className="px-8 py-5">Position</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50/50"><td className="px-8 py-6"><p className="font-bold text-slate-900">Abraham Mutwale</p><p className="text-[9px] text-slate-400 uppercase">AML-001</p></td><td className="px-8 py-6 text-slate-600 font-medium">System Admin</td><td className="px-8 py-6"><span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[8px] font-black uppercase border border-green-100">Active</span></td><td className="px-8 py-6 text-right"><button className="p-2 text-slate-400 hover:text-red-600"><Edit3 className="w-4 h-4" /></button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ClockInOutPage = ({ onBack }: { onBack: () => void }) => {
  const [status, setStatus] = useState<'In' | 'Out'>('Out');
  return (
    <div className="animate-fade-in-up text-left max-w-2xl mx-auto">
      <ReportHeader title="Attendance Terminal" subtitle="Biometric Shift Record" onBack={onBack} />
      <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-2xl space-y-12 text-center">
        <div className="space-y-4"><h3 className="text-6xl font-serif font-black text-slate-900">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h3><p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">{new Date().toDateString()}</p></div>
        <button onClick={() => setStatus(status === 'In' ? 'Out' : 'In')} className={`w-52 h-52 mx-auto rounded-full border-[12px] flex flex-col items-center justify-center transition-all shadow-2xl active:scale-95 ${status === 'Out' ? 'border-red-50 bg-red-600 text-white shadow-red-100' : 'border-slate-50 bg-slate-900 text-white shadow-slate-200'}`}>
          <Fingerprint className="w-16 h-16 mb-3" /><span className="text-[11px] font-black uppercase tracking-widest">{status === 'Out' ? 'Clock In' : 'Clock Out'}</span>
        </button>
        <div className="pt-10 border-t border-slate-50"><p className="text-[13px] text-slate-500 font-medium">Session Identity: <span className="font-bold text-slate-900 uppercase">ABRAHAM MUTWALE</span></p><p className="text-[10px] font-black text-red-600 uppercase mt-2">Aster Money Lenders • Primary HQ</p></div>
      </div>
    </div>
  );
};

const AssignTaskPage = ({ onBack }: { onBack: () => void }) => (
  <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
    <ReportHeader title="Task Origination" subtitle="Direct Task Issuance" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-10">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2"><FormInput label="Strategic Title" placeholder="e.g. Audit Compliance LN-4042" /></div>
          <FormSelect label="Assigned Personnel" options={[{label:'Sarah Banda', value:'1'}]} />
          <FormSelect label="Execution Priority" options={[{label:'Standard Delivery', value:'S'}, {label:'Urgent/High', value:'H'}, {label:'Immediate', value:'I'}]} />
          <FormInput label="Window Start" type="date" />
          <FormInput label="Hard Deadline" type="date" />
          <div className="md:col-span-2"><FormInput label="Operational Narrative" placeholder="Provide context and required outcomes..." /></div>
       </div>
       <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl shadow-red-200 hover:bg-black transition-all">Issue Official Order</button>
    </div>
  </div>
);

const EmployeeTasksPage = ({ onBack, onComplete }: { onBack: () => void, onComplete: () => void }) => {
  interface TaskItem { id: number; title: string; priority: string; due: string; status: string; }
  const [tasks, setTasks] = useState<TaskItem[]>([{ id: 1, title: 'Compliance Verification: SME Loan LN-4022', priority: 'Immediate', due: 'Today (17:00)', status: 'Pending' }]);
  const complete = (id: number) => { setTasks(tasks.map(t => t.id === id ? {...t, status: 'Completed'} : t)); onComplete(); };
  return (
    <div className="animate-fade-in-up text-left">
      <ReportHeader title="Assigned Queue" subtitle="Active Tasks Monitor" onBack={onBack} />
      <div className="space-y-6">
        {tasks.map(t => (
          <div key={t.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl flex items-center justify-between group">
             <div className="flex items-center gap-10">
                <div className={`p-6 rounded-3xl transition-all ${t.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600 shadow-xl shadow-red-50'}`}><ClipboardCheck className="w-10 h-10" /></div>
                <div><h4 className="text-lg font-bold text-slate-900 mb-2">{t.title}</h4><div className="flex gap-6"><span className="text-[9px] font-black uppercase text-red-600 border border-red-100 px-3 py-1 rounded-full">{t.priority} Task</span><span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5"><Timer className="w-4 h-4" /> Completion Required By {t.due}</span></div></div>
             </div>
             {t.status !== 'Completed' ? <button onClick={() => complete(t.id)} className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-black transition-all">Submit for Review</button> : <div className="px-10 py-3 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border border-green-100"><CheckCircle className="w-4 h-4" /> Finalized</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- NEW MODULES ---

const ViewAllLoansPage = ({ applications, onAction, onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="All Loan Records" subtitle="Master Facility Index" onBack={onBack} />
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
      <ActiveLoansTable applications={applications} onAction={onAction} />
    </div>
  </div>
);

const AdvancedLoanOfferPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
    <ReportHeader title="Advanced Credit Offer" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Structured Proposal Workspace</div>
  </div>
);

const RegisterNextOfKinPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
    <ReportHeader title="Next of Kin Registry" subtitle="Register Emergency Contact" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput label="Borrower Search" placeholder="Search by name or ID..." />
        <FormInput label="Full Legal Name" placeholder="..." />
        <FormSelect label="Relationship" options={[{label:'Spouse', value:'S'}, {label:'Sibling', value:'B'}, {label:'Parent', value:'P'}, {label:'Child', value:'C'}]} />
        <FormInput label="NRC / ID Number" placeholder="..." />
        <FormInput label="Contact Phone" placeholder="+260" />
        <FormSelect label="Status" options={[{label:'Active', value:'A'}, {label:'Inactive', value:'I'}]} />
        <div className="md:col-span-2"><FormInput label="Residential Address" placeholder="..." /></div>
      </div>
      <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-black transition-all">Save Next of Kin</button>
    </div>
  </div>
);

const ViewNextOfKinPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Next of Kin Directory" subtitle="All Registered Kin" onBack={onBack} />
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
          <tr><th className="px-8 py-5">Borrower</th><th className="px-8 py-5">Kin Name</th><th className="px-8 py-5">Relationship</th><th className="px-8 py-5">Phone</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Action</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-[11px] font-medium">
          <tr className="hover:bg-slate-50/50">
            <td className="px-8 py-6 font-bold text-slate-900">Abraham Mutwale</td>
            <td className="px-8 py-6 text-slate-600">Sarah Mutwale</td>
            <td className="px-8 py-6 text-slate-600">Spouse</td>
            <td className="px-8 py-6 text-slate-600">+260 971 000 000</td>
            <td className="px-8 py-6"><span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[8px] font-black uppercase">Active</span></td>
            <td className="px-8 py-6 text-right"><button className="p-2 text-slate-400 hover:text-red-600"><Edit3 className="w-4 h-4" /></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const NextOfKinVerificationPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Kin Verification" subtitle="Verify Registry Data" onBack={onBack} />
    <div className="bg-white p-24 rounded-[3rem] border border-slate-200 text-center text-slate-300 font-black uppercase tracking-[0.5em] shadow-xl">Verification Terminal</div>
  </div>
);

const RegisterGuarantorPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
    <ReportHeader title="Guarantor Enrollment" subtitle="Liability Backing Registry" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput label="Borrower Identity" placeholder="Search..." />
        <FormInput label="Guarantor Full Name" placeholder="..." />
        <FormInput label="NRC Number" placeholder="..." />
        <FormInput label="Phone Number" placeholder="+260" />
        <FormSelect label="Employment Status" options={[{label:'Employed', value:'E'}, {label:'Self-Employed', value:'S'}, {label:'Unemployed', value:'U'}]} />
        <FormInput label="Monthly Income" prefix="K" type="number" />
        <FormInput label="Relationship to Borrower" placeholder="..." />
        <div className="md:col-span-2"><FormInput label="Physical Address" placeholder="..." /></div>
      </div>
      <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-black transition-all">Enroll Guarantor</button>
    </div>
  </div>
);

const ViewGuarantorsPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Guarantor Directory" subtitle="Asset Backing Index" onBack={onBack} />
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
          <tr><th className="px-8 py-5">Borrower</th><th className="px-8 py-5">Guarantor Name</th><th className="px-8 py-5">Phone</th><th className="px-8 py-5">Income</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Action</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-[11px] font-medium">
          <tr className="hover:bg-slate-50/50">
            <td className="px-8 py-6 font-bold text-slate-900">Moses Mulenga</td>
            <td className="px-8 py-6 text-slate-600">John Banda</td>
            <td className="px-8 py-6 text-slate-600">+260 966 111 222</td>
            <td className="px-8 py-6 text-slate-900">K 15,000</td>
            <td className="px-8 py-6"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase">Verified</span></td>
            <td className="px-8 py-6 text-right"><button className="p-2 text-slate-400 hover:text-red-600"><Eye className="w-4 h-4" /></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const GuarantorCommitmentPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
    <ReportHeader title="Guarantee Commitment" subtitle="Binding Agreement Log" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput label="Guarantee Amount" prefix="K" type="number" />
        <FormInput label="Commencement Date" type="date" />
        <FormInput label="Termination Date" type="date" />
        <div className="md:col-span-2 border-2 border-dashed border-slate-100 p-8 rounded-3xl text-center text-slate-400 font-bold uppercase text-[9px] cursor-pointer hover:border-red-600 transition-all flex flex-col items-center gap-2">
          <Upload className="w-5 h-5" /> Upload Signed Guarantee Agreement
        </div>
      </div>
      <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-black transition-all">Submit Commitment</button>
    </div>
  </div>
);

const GuarantorVerificationPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Verification Terminal" subtitle="Risk Mitigation Check" onBack={onBack} />
    <div className="bg-white p-24 rounded-[3rem] border border-slate-200 text-center text-slate-300 font-black uppercase tracking-[0.5em] shadow-xl">Compliance Review Queue</div>
  </div>
);

const RegisterCollateralPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
    <ReportHeader title="Collateral Registry" subtitle="Asset Security Entry" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput label="Borrower Search" placeholder="Search..." />
        <FormInput label="Loan Reference" placeholder="LN-XXXX" />
        <FormSelect label="Collateral Type" options={[{label:'Real Estate (House/Land)', value:'RE'}, {label:'Motor Vehicle', value:'MV'}, {label:'Household Appliance', value:'HA'}, {label:'Business Inventory', value:'BI'}]} />
        <FormInput label="Estimated Market Value" prefix="K" type="number" />
        <FormSelect label="Ownership Status" options={[{label:'Fully Owned', value:'FO'}, {label:'Jointly Owned', value:'JO'}, {label:'Under Finance', value:'UF'}]} />
        <FormInput label="Asset Location" placeholder="..." />
        <div className="md:col-span-2"><FormInput label="Asset Description" placeholder="Detailed specifications..." /></div>
        <div className="md:col-span-2 border-2 border-dashed border-slate-100 p-8 rounded-3xl text-center text-slate-400 font-bold uppercase text-[9px] cursor-pointer hover:border-red-600 transition-all flex flex-col items-center gap-2">
          <Upload className="w-5 h-5" /> Upload Ownership Documents / Title
        </div>
      </div>
      <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-black transition-all">Register Asset</button>
    </div>
  </div>
);

const ViewCollateralPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Collateral Inventory" subtitle="Secured Assets Master" onBack={onBack} />
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
          <tr><th className="px-8 py-5">Borrower</th><th className="px-8 py-5">Loan Reference</th><th className="px-8 py-5">Asset Type</th><th className="px-8 py-5">Value (K)</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Action</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-[11px] font-medium">
          <tr className="hover:bg-slate-50/50">
            <td className="px-8 py-6 font-bold text-slate-900">Chilufya Banda</td>
            <td className="px-8 py-6 text-slate-500 font-mono">LN-4022-A</td>
            <td className="px-8 py-6 text-slate-600">Motor Vehicle (Toyota)</td>
            <td className="px-8 py-6 text-slate-900">K 85,000</td>
            <td className="px-8 py-6"><span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[8px] font-black uppercase">Valuation Pending</span></td>
            <td className="px-8 py-6 text-right"><button className="p-2 text-slate-400 hover:text-red-600"><Eye className="w-4 h-4" /></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const CollateralValuationPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left max-w-3xl mx-auto">
    <ReportHeader title="Asset Valuation" subtitle="Market Price Verification" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput label="Valuation Date" type="date" />
        <FormInput label="Certified Valuer Name" placeholder="..." />
        <FormInput label="Valuation Amount" prefix="K" type="number" />
        <div className="md:col-span-2 border-2 border-dashed border-slate-100 p-8 rounded-3xl text-center text-slate-400 font-bold uppercase text-[9px] cursor-pointer hover:border-red-600 transition-all flex flex-col items-center gap-2">
          <Upload className="w-5 h-5" /> Upload Valuation Report (PDF)
        </div>
      </div>
      <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-black transition-all">Submit Valuation</button>
    </div>
  </div>
);

const CollateralReleasePage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left max-w-3xl mx-auto">
    <ReportHeader title="Asset Release" subtitle="Lien Discharge Terminal" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput label="Loan Reference" placeholder="LN-XXXX" />
        <FormInput label="Release Date" type="date" />
        <FormInput label="Authorized By" placeholder="..." />
        <div className="md:col-span-2"><FormInput label="Release Narrative / Notes" placeholder="..." /></div>
      </div>
      <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-black transition-all">Discharge Asset</button>
    </div>
  </div>
);

// --- LOAN EXTENSION VIEWS ---

const LoanGuarantorsPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Loan Guarantors" subtitle="Link Liability Backers" onBack={onBack} />
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
          <tr><th className="px-8 py-5">Loan ID</th><th className="px-8 py-5">Guarantor</th><th className="px-8 py-5">Guaranteed Amount</th><th className="px-8 py-5">Status</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-[11px]">
          <tr className="hover:bg-slate-50/50"><td className="px-8 py-6 font-mono">LN-4042</td><td className="px-8 py-6 font-bold">John Phiri</td><td className="px-8 py-6">K 10,000</td><td className="px-8 py-6"><span className="status-approved px-2 py-0.5 rounded text-[8px] font-black">ACTIVE</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const LoanCollateralPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Loan Collateral" subtitle="Linked Security Assets" onBack={onBack} />
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
          <tr><th className="px-8 py-5">Loan ID</th><th className="px-8 py-5">Asset Type</th><th className="px-8 py-5">Value</th><th className="px-8 py-5">Coverage Ratio</th><th className="px-8 py-5">Status</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-[11px]">
          <tr className="hover:bg-slate-50/50"><td className="px-8 py-6 font-mono">LN-4042</td><td className="px-8 py-6 font-bold">Toyota Camry 2012</td><td className="px-8 py-6">K 45,000</td><td className="px-8 py-6">142%</td><td className="px-8 py-6"><span className="status-approved px-2 py-0.5 rounded text-[8px] font-black">SECURED</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const LoanReschedulingPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
    <ReportHeader title="Loan Rescheduling" subtitle="Repayment Plan Adjustment" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput label="Loan Reference" placeholder="LN-XXXX" />
        <FormInput label="Current Maturity" type="date" />
        <FormInput label="New Maturity / Repayment Period" suffix="Months" type="number" />
        <FormInput label="Approval Authority" placeholder="..." />
        <div className="md:col-span-2"><FormInput label="Adjustment Justification" placeholder="..." /></div>
      </div>
      <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-black transition-all">Submit Rescheduling Request</button>
    </div>
  </div>
);

const LoanWriteOffsPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left max-w-4xl mx-auto">
    <ReportHeader title="Loan Write-Off" subtitle="Impairment Recognition" onBack={onBack} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput label="Loan ID" placeholder="LN-XXXX" />
        <FormInput label="Outstanding Exposure" prefix="K" type="number" />
        <FormInput label="Write-Off Amount" prefix="K" type="number" />
        <FormInput label="Decision Authority" placeholder="..." />
        <div className="md:col-span-2"><FormInput label="Provision Reason" placeholder="..." /></div>
      </div>
      <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-black transition-all">Execute Write-Off</button>
    </div>
  </div>
);

const LoanRecoveryPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Recovery Monitor" subtitle="Default Asset Tracking" onBack={onBack} />
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
          <tr><th className="px-8 py-5">Loan ID</th><th className="px-8 py-5">Recovery Stage</th><th className="px-8 py-5">Action Taken</th><th className="px-8 py-5">Recovery Officer</th><th className="px-8 py-5">Exposure</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-[11px]">
          <tr className="hover:bg-slate-50/50"><td className="px-8 py-6 font-mono text-red-600">LN-DEFAULT-01</td><td className="px-8 py-6 font-bold">Auction/Sale</td><td className="px-8 py-6">Lien enforced</td><td className="px-8 py-6">M. Phiri</td><td className="px-8 py-6 font-black text-red-600">K 22,500</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const LoanDocumentsPage = ({ onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Loan Document Vault" subtitle="Master Facility Archive" onBack={onBack} />
    <div className="grid md:grid-cols-3 gap-8">
      <div className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-xl flex flex-col items-center text-center">
        <FileCheck className="w-12 h-12 text-green-600 mb-6" />
        <h4 className="text-sm font-black uppercase text-slate-900 mb-2">Loan Agreements</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">842 Secure Artifacts</p>
      </div>
      <div className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-xl flex flex-col items-center text-center">
        <ShieldPlus className="w-12 h-12 text-blue-600 mb-6" />
        <h4 className="text-sm font-black uppercase text-slate-900 mb-2">Guarantor Forms</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">410 Signed Contracts</p>
      </div>
      <div className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-xl flex flex-col items-center text-center">
        <Files className="w-12 h-12 text-orange-600 mb-6" />
        <h4 className="text-sm font-black uppercase text-slate-900 mb-2">Collateral Papers</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">320 Ownership Deeds</p>
      </div>
    </div>
  </div>
);

// --- BORROWER ENROLLMENT SUB-COMPONENTS (FIX: MOVED OUTSIDE PARENT TO PREVENT FOCUS LOSS) ---

const BorrowerLabel = ({ children }: {children: React.ReactNode}) => (
  <label className="text-[13px] font-bold text-black block mb-2">{children}</label>
);

const toSentenceCase = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const BorrowerInput = ({ type = 'text', placeholder, value, onChange, prefix, max, readOnly, isEmail }: any) => {
  const handleValChange = (e: any) => {
    let val = e.target.value;
    if (isEmail) val = val.toLowerCase();
    else if (type === 'text') val = toSentenceCase(val);
    onChange(val);
  };

  return (
    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-1 focus-within:ring-red-600">
      {prefix && <span className="px-3 py-2 bg-slate-50 text-[11px] font-bold text-slate-500 border-r border-slate-200">{prefix}</span>}
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={handleValChange}
        max={max}
        readOnly={readOnly}
        className="w-full px-4 py-2.5 text-[12px] font-normal text-slate-700 outline-none placeholder:text-slate-400"
      />
    </div>
  );
};

const BorrowerSelect = ({ options, value, onChange }: any) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[12px] font-normal text-slate-700 outline-none focus:ring-1 focus:ring-red-600 bg-white shadow-sm"
  >
    {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);

// --- BORROWER ENROLLMENT PAGE ---

interface CustomField {
  id: string;
  label: string;
  type: 'Text' | 'Number' | 'Date' | 'Dropdown';
  scope: 'This Borrower Only' | 'All Borrowers (global)';
  section: string;
  order: number; // for manual position tracking
  value: string;
  options?: string[];
}

const INITIAL_FORM_DATA = {
  fullName: '', gender: 'M', dob: '', nrc: '', phone: '', email: '', age: '',
  address: '', city: '', province: '', gps: null as {lat: number, lng: number} | null,
  employmentStatus: { employed: false, selfEmployed: false },
  employmentType: 'Permanent',
  empStartDate: '', empEndDate: '', empNumber: '', employerName: '',
  empContactPerson: '', empContactPosition: '', empContactPhone: '',
  empWorkStation: '', employerAddress: '',
  selfCompanyName: '', selfRegNumber: '',
  primaryPaymentType: 'Bank',
  bankName: '', bankBranch: '', bankAccNumber: '', bankSortCode: '', bankAccHolder: '',
  momoNetwork: 'Airtel', momoPhone: '', momoRegisteredName: '',
  hasAlternativeAccount: false,
  altPaymentType: 'Bank',
  altBankName: '', altBankBranch: '', altBankAccNumber: '', altBankSortCode: '', altBankAccHolder: '',
  altMomoNetwork: 'Airtel', altMomoPhone: '', altMomoRegisteredName: '',
  income: ''
};

// Fixed typing: Use Record for nested objects to ensure proper inference
const STANDARD_FIELD_ORDER: Record<string, Record<string, number>> = {
  personal: { fullName: 10, gender_dob: 20, phone_nrc: 30, email: 40 },
  residential: { address: 10, city_prov: 20, gps: 30 },
  employment: { status: 10, emp_details: 20, self_details: 30, income: 40 },
  bank: { account_type: 10, prime_fields: 20, alt_acc: 30 },
  upload: { id: 10, docs: 20 }
};

// --- SECTION WRAPPER MOVED OUT TO FIX FOCUS BUG ---
const SectionWrapper = ({ sectionId, children, customFields, setCustomFields }: { sectionId: string, children: React.ReactNode[], customFields: CustomField[], setCustomFields: any }) => {
  const sectionCfs = customFields.filter(cf => cf.section === sectionId);
  // Ensure we explicitly cast to avoid index signature issues
  const stdOrders = (STANDARD_FIELD_ORDER as Record<string, Record<string, number>>)[sectionId] || {};
  
  const items = [
    ...Object.keys(stdOrders).map(key => ({ 
      id: key, 
      isStd: true, 
      order: (stdOrders as Record<string, number>)[key], 
      obj: null as CustomField | null 
    })),
    ...sectionCfs.map(cf => ({ 
      id: cf.id, 
      isStd: false, 
      order: cf.order, 
      obj: cf 
    }))
  ].sort((a,b) => a.order - b.order);

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const list = [...customFields].sort((a,b) => a.order - b.order);
    const index = list.findIndex(f => f.id === fieldId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const prev = list[index - 1];
      const curr = list[index];
      const temp = prev.order;
      prev.order = curr.order;
      curr.order = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const next = list[index + 1];
      const curr = list[index];
      const temp = next.order;
      next.order = curr.order;
      curr.order = temp;
    }
    setCustomFields([...list]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {items.map(item => {
        if (item.isStd) {
          const childMap: Record<string, Record<string, number>> = {
            personal: { fullName: 0, gender_dob: 1, phone_nrc: 2, email: 3 },
            residential: { address: 0, city_prov: 1, gps: 2 },
            employment: { status: 0, emp_details: 1, self_details: 2, income: 3 },
            bank: { account_type: 0, prime_fields: 1, alt_acc: 2 },
            upload: { id: 0, docs: 1 }
          };
          const idx = childMap[sectionId]?.[item.id];
          return React.isValidElement(children[idx]) ? React.cloneElement(children[idx] as React.ReactElement, { key: item.id }) : null;
        } else {
          return (
            <div key={item.id} className="relative group/cf">
              <CustomFieldInput field={item.obj!} setCustomFields={setCustomFields} allFields={customFields} />
              <div className="absolute -left-10 top-8 flex flex-col gap-1 opacity-0 group-hover/cf:opacity-100 transition-all">
                <button onClick={() => moveField(item.id, 'up')} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 shadow-sm"><MoveUp className="w-3 h-3" /></button>
                <button onClick={() => moveField(item.id, 'down')} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 shadow-sm"><MoveDown className="w-3 h-3" /></button>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

const AddBorrowerPage = ({ onBack, onEnroll }: any) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<any>(INITIAL_FORM_DATA);
  const [cfForm, setCfForm] = useState({ 
    id: null as string | null,
    label: '', 
    type: 'Text' as any, 
    scope: 'This Borrower Only' as any, 
    section: 'personal', 
    newSectionName: '',
    bulkNames: ''
  });

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setFormData(prev => ({ ...prev, age: age >= 0 ? age.toString() : '' }));
    }
  }, [formData.dob]);

  const baseSections = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'residential', label: 'Residential Address' },
    { id: 'employment', label: 'Employment Details' },
    { id: 'bank', label: 'Bank Details' },
    { id: 'upload', label: 'File Upload' },
    { id: 'custom', label: 'Custom Field' }
  ];

  const sections = useMemo(() => {
    const extra = customFields
      .filter(cf => cf.section && !baseSections.find(s => s.id === cf.section))
      .map(cf => ({ id: cf.section, label: cf.section }));
    const uniqueExtras = Array.from(new Set(extra.map(e => e.id))).map(id => extra.find(e => e.id === id)!);
    return [...baseSections, ...uniqueExtras];
  }, [customFields]);

  const handlePhoneChange = (key: string, val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 9);
    setFormData({...formData, [key]: digits});
  };

  const handleNumericOnly = (key: string, val: string, maxLen?: number) => {
    let digits = val.replace(/\D/g, '');
    if (maxLen) digits = digits.substring(0, maxLen);
    setFormData({...formData, [key]: digits});
  };

  const pickGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData({ ...formData, gps: { lat: pos.coords.latitude, lng: pos.coords.longitude }});
        alert('GPS Coordinates Captured Successfully');
      }, () => alert('Unable to capture GPS location.'));
    }
  };

  const upsertCustomField = () => {
    const targetSection = cfForm.section === 'NEW' ? cfForm.newSectionName : cfForm.section;
    if (!targetSection) return;

    if (cfForm.id) {
      setCustomFields(customFields.map(f => f.id === cfForm.id ? { ...f, label: cfForm.label, type: cfForm.type, scope: cfForm.scope, section: targetSection } : f));
      setCfForm({ ...cfForm, id: null, label: '', bulkNames: '' });
    } else if (cfForm.bulkNames.trim()) {
      const names = cfForm.bulkNames.split('\n').filter(n => n.trim());
      const newFields = names.map((name, idx) => ({
        id: Math.random().toString(36).substr(2, 9) + idx,
        label: name.trim(),
        type: cfForm.type,
        scope: cfForm.scope,
        section: targetSection,
        order: (customFields.length > 0 ? Math.max(...customFields.map(f => f.order)) : 1000) + idx + 1,
        value: ''
      }));
      setCustomFields([...customFields, ...newFields]);
      setCfForm({ ...cfForm, label: '', bulkNames: '' });
    } else if (cfForm.label) {
      const newField: CustomField = { 
        id: Math.random().toString(36).substr(2, 9), 
        label: cfForm.label, 
        type: cfForm.type, 
        scope: cfForm.scope, 
        section: targetSection, 
        order: (customFields.length > 0 ? Math.max(...customFields.map(f => f.order)) : 1000) + 1, 
        value: '' 
      };
      setCustomFields([...customFields, newField]);
      setCfForm({ ...cfForm, label: '', bulkNames: '' });
    }
  };

  const applyPreset = (presetType: 'nok' | 'guarantor' | 'collateral') => {
    let presets: string[] = [];
    let section = 'personal';
    if (presetType === 'nok') { presets = ['Full Name', 'Relationship', 'Phone Number', 'Address']; section = 'personal'; }
    if (presetType === 'guarantor') { presets = ['Full Name', 'NRC / ID', 'Phone Number', 'Address', 'Relationship']; section = 'personal'; }
    if (presetType === 'collateral') { presets = ['Collateral Type', 'Estimated Value', 'Description', 'Ownership Details']; section = 'personal'; }

    const newFields = presets.map((name, idx) => ({
      id: Math.random().toString(36).substr(2, 9) + idx,
      label: name,
      type: 'Text' as const,
      scope: 'This Borrower Only' as const,
      section: section,
      order: (customFields.length > 0 ? Math.max(...customFields.map(f => f.order)) : 1000) + idx + 1,
      value: ''
    }));
    setCustomFields([...customFields, ...newFields]);
  };

  const clearForm = () => {
    if (confirm('Clear all entries?')) {
      setFormData(INITIAL_FORM_DATA);
      setCustomFields([]);
      setActiveSection('personal');
    }
  };

  if (showPreview) return <PreviewPage data={formData} customFields={customFields} onBack={() => setShowPreview(false)} />;

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <SectionWrapper sectionId="personal" customFields={customFields} setCustomFields={setCustomFields}>
            <div><BorrowerLabel>Full Name</BorrowerLabel><BorrowerInput placeholder="Enter full name" value={formData.fullName} onChange={(val:string) => { const lettersOnly = val.replace(/[^a-zA-Z\s]/g, ''); setFormData({...formData, fullName: toSentenceCase(lettersOnly)}); }} /></div>
            <div className="grid grid-cols-3 gap-6">
              <div><BorrowerLabel>Gender</BorrowerLabel><BorrowerSelect options={[{label:'Male', value:'M'}, {label:'Female', value:'F'}]} value={formData.gender} onChange={(val:any) => setFormData({...formData, gender: val})} /></div>
              <div><BorrowerLabel>Date of Birth</BorrowerLabel><BorrowerInput type="date" max={new Date().toISOString().split('T')[0]} value={formData.dob} onChange={(val:any) => setFormData({...formData, dob: val})} /></div>
              <div><BorrowerLabel>Age</BorrowerLabel><BorrowerInput readOnly value={formData.age} /></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div><BorrowerLabel>Phone Number</BorrowerLabel><BorrowerInput prefix="+260" placeholder="Last 9 digits" value={formData.phone} onChange={(val:any) => handlePhoneChange('phone', val)} /></div>
              <div><BorrowerLabel>NRC Number</BorrowerLabel><BorrowerInput placeholder="XXXXXX/XX/X" value={formData.nrc} onChange={(val:any) => { let digits = val.replace(/\D/g, '').substring(0, 9); let f = digits; if(digits.length>6){f=digits.substring(0,6)+'/'+digits.substring(6,8); if(digits.length>8)f+='/'+digits.substring(8,9);} setFormData({...formData, nrc: f}); }} /></div>
            </div>
            <div><BorrowerLabel>Email Address</BorrowerLabel><BorrowerInput isEmail placeholder="john@example.com" value={formData.email} onChange={(val:any) => setFormData({...formData, email: val})} /></div>
          </SectionWrapper>
        );
      case 'residential':
        return (
          <SectionWrapper sectionId="residential" customFields={customFields} setCustomFields={setCustomFields}>
            <div><BorrowerLabel>Residential Address</BorrowerLabel><BorrowerInput placeholder="House No, Street Name" value={formData.address} onChange={(val:any) => setFormData({...formData, address: val})} /></div>
            <div className="grid grid-cols-2 gap-6">
              <div><BorrowerLabel>City / Town</BorrowerLabel><BorrowerInput placeholder="..." value={formData.city} onChange={(val:any) => setFormData({...formData, city: val})} /></div>
              <div><BorrowerLabel>Province</BorrowerLabel><BorrowerInput placeholder="..." value={formData.province} onChange={(val:any) => setFormData({...formData, province: val})} /></div>
            </div>
            <button onClick={pickGPS} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-black transition-all">
              <GpsIcon className="w-3.5 h-3.5" /> Pick GPS Location {formData.gps && '✓'}
            </button>
          </SectionWrapper>
        );
      case 'employment':
        return (
          <SectionWrapper sectionId="employment" customFields={customFields} setCustomFields={setCustomFields}>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <BorrowerLabel>Employment Status</BorrowerLabel>
              <div className="flex flex-wrap gap-6 mt-4">
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-600" checked={formData.employmentStatus.employed} onChange={(e) => setFormData({...formData, employmentStatus: {...formData.employmentStatus, employed: e.target.checked}})} /><span className="text-[11px] font-bold text-slate-700">Employed</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-600" checked={formData.employmentStatus.selfEmployed} onChange={(e) => setFormData({...formData, employmentStatus: {...formData.employmentStatus, selfEmployed: e.target.checked}})} /><span className="text-[11px] font-bold text-slate-700">Self Employed</span></label>
              </div>
            </div>
            <div className="space-y-6">
              {formData.employmentStatus.employed && (
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <h4 className="text-[11px] font-black uppercase text-red-600">Employment Details</h4>
                  <div className="flex gap-8 mb-4"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="empType" checked={formData.employmentType === 'Permanent'} onChange={() => setFormData({...formData, employmentType: 'Permanent'})} className="w-4 h-4 text-red-600 focus:ring-red-600" /><span className="text-[11px] font-bold text-slate-700">Permanent</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="empType" checked={formData.employmentType === 'Contract'} onChange={() => setFormData({...formData, employmentType: 'Contract'})} className="w-4 h-4 text-red-600 focus:ring-red-600" /><span className="text-[11px] font-bold text-slate-700">Contract</span></label></div>
                  <div className="grid grid-cols-2 gap-6"><div><BorrowerLabel>{formData.employmentType === 'Permanent' ? 'Employment Start Date' : 'Contract Start Date'}</BorrowerLabel><BorrowerInput type="date" value={formData.empStartDate} onChange={(val:any) => setFormData({...formData, empStartDate: val})} /></div>{formData.employmentType === 'Contract' && <div><BorrowerLabel>Contract End Date</BorrowerLabel><BorrowerInput type="date" value={formData.empEndDate} onChange={(val:any) => setFormData({...formData, empEndDate: val})} /></div>}</div>
                  <div className="grid grid-cols-2 gap-6"><div><BorrowerLabel>Employee Number</BorrowerLabel><BorrowerInput value={formData.empNumber} onChange={(val:any) => setFormData({...formData, empNumber: val})} /></div><div><BorrowerLabel>Employer / Business Name</BorrowerLabel><BorrowerInput value={formData.employerName} onChange={(val:any) => setFormData({...formData, employerName: val})} /></div></div>
                  <div className="grid grid-cols-2 gap-6"><div><BorrowerLabel>Employer Contact Person (Full Name)</BorrowerLabel><BorrowerInput value={formData.empContactPerson} onChange={(val:any) => setFormData({...formData, empContactPerson: val})} /></div><div><BorrowerLabel>Contact Person Position</BorrowerLabel><BorrowerInput value={formData.empContactPosition} onChange={(val:any) => setFormData({...formData, empContactPosition: val})} /></div></div>
                  <div className="grid grid-cols-2 gap-6"><div><BorrowerLabel>Contact Person Phone Number</BorrowerLabel><BorrowerInput prefix="+260" value={formData.empContactPhone} onChange={(val:any) => handlePhoneChange('empContactPhone', val)} /></div><div><BorrowerLabel>Work Station</BorrowerLabel><BorrowerInput value={formData.empWorkStation} onChange={(val:any) => setFormData({...formData, empWorkStation: val})} /></div></div>
                  <div><BorrowerLabel>Employer Address</BorrowerLabel><BorrowerInput value={formData.employerAddress} onChange={(val:any) => setFormData({...formData, employerAddress: val})} /></div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              {formData.employmentStatus.selfEmployed && (
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <h4 className="text-[11px] font-black uppercase text-red-600">Self Employment / Business</h4>
                  <div className="grid grid-cols-2 gap-6"><div><BorrowerLabel>Company Name</BorrowerLabel><BorrowerInput value={formData.selfCompanyName} onChange={(val:any) => setFormData({...formData, selfCompanyName: val})} /></div><div><BorrowerLabel>Company Registration Number</BorrowerLabel><BorrowerInput value={formData.selfRegNumber} onChange={(val:any) => setFormData({...formData, selfRegNumber: val})} /></div></div>
                </div>
              )}
            </div>
            <div className="pt-6 border-t border-slate-100"><BorrowerLabel>Monthly Income</BorrowerLabel><BorrowerInput prefix="K" type="number" placeholder="0.00" value={formData.income} onChange={(val:any) => setFormData({...formData, income: val})} /></div>
          </SectionWrapper>
        );
      case 'bank':
        return (
          <SectionWrapper sectionId="bank" customFields={customFields} setCustomFields={setCustomFields}>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100"><BorrowerLabel>Primary Account Type</BorrowerLabel><div className="flex gap-8 mt-4"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="primePay" checked={formData.primaryPaymentType === 'Bank'} onChange={() => setFormData({...formData, primaryPaymentType: 'Bank'})} className="w-4 h-4 text-red-600 focus:ring-red-600" /><span className="text-[11px] font-bold text-slate-700">Bank</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="primePay" checked={formData.primaryPaymentType === 'Mobile Money'} onChange={() => setFormData({...formData, primaryPaymentType: 'Mobile Money'})} className="w-4 h-4 text-red-600 focus:ring-red-600" /><span className="text-[11px] font-bold text-slate-700">Mobile Money</span></label></div></div>
            <div className="space-y-6">
              {formData.primaryPaymentType === 'Bank' ? (
                <div className="grid grid-cols-2 gap-6 animate-fade-in">
                  <div><BorrowerLabel>Bank Name</BorrowerLabel><BorrowerInput value={formData.bankName} onChange={(val:any) => setFormData({...formData, bankName: val})} /></div>
                  <div><BorrowerLabel>Branch</BorrowerLabel><BorrowerInput value={formData.bankBranch} onChange={(val:any) => setFormData({...formData, bankBranch: val})} /></div>
                  <div><BorrowerLabel>Account Number</BorrowerLabel><BorrowerInput value={formData.bankAccNumber} onChange={(val:any) => handleNumericOnly('bankAccNumber', val, 13)} /></div>
                  <div><BorrowerLabel>Sort Code</BorrowerLabel><BorrowerInput value={formData.bankSortCode} onChange={(val:any) => handleNumericOnly('bankSortCode', val)} /></div>
                  <div className="col-span-2"><BorrowerLabel>Account Holder Name</BorrowerLabel><BorrowerInput value={formData.bankAccHolder} onChange={(val:any) => setFormData({...formData, bankAccHolder: val})} /></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 animate-fade-in">
                  <div><BorrowerLabel>Mobile Network</BorrowerLabel><BorrowerSelect options={[{label:'Airtel', value:'Airtel'}, {label:'MTN', value:'MTN'}, {label:'Zamtel', value:'Zamtel'}]} value={formData.momoNetwork} onChange={(val:any) => setFormData({...formData, momoNetwork: val})} /></div>
                  <div><BorrowerLabel>Phone Number</BorrowerLabel><BorrowerInput prefix="+260" value={formData.momoPhone} onChange={(val:any) => handlePhoneChange('momoPhone', val)} /></div>
                  <div className="col-span-2"><BorrowerLabel>Registered Names on Account</BorrowerLabel><BorrowerInput value={formData.momoRegisteredName} onChange={(val:any) => setFormData({...formData, momoRegisteredName: val})} /></div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              {!formData.hasAlternativeAccount ? (
                <button onClick={() => setFormData({...formData, hasAlternativeAccount: true})} className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase text-[10px] rounded-2xl hover:border-red-600 transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Alternative Account</button>
              ) : (
                <div className="bg-red-50/30 p-8 rounded-[2rem] border border-red-100 relative animate-fade-in">
                  <button onClick={() => setFormData({...formData, hasAlternativeAccount: false})} className="absolute top-6 right-6 p-1.5 rounded-lg bg-white border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                  <BorrowerLabel>Alternative Account Type</BorrowerLabel>
                  <div className="flex gap-8 mt-4 mb-6"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="altPay" checked={formData.altPaymentType === 'Bank'} onChange={() => setFormData({...formData, altPaymentType: 'Bank'})} className="w-4 h-4 text-red-600 focus:ring-red-600" /><span className="text-[11px] font-bold text-slate-700">Bank</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="altPay" checked={formData.altPaymentType === 'Mobile Money'} onChange={() => setFormData({...formData, altPaymentType: 'Mobile Money'})} className="w-4 h-4 text-red-600 focus:ring-red-600" /><span className="text-[11px] font-bold text-slate-700">Mobile Money</span></label></div>
                  {formData.altPaymentType === 'Bank' ? (
                    <div className="grid grid-cols-2 gap-6 animate-fade-in">
                      <div><BorrowerLabel>Bank Name</BorrowerLabel><BorrowerInput value={formData.altBankName} onChange={(val:any) => setFormData({...formData, altBankName: val})} /></div>
                      <div><BorrowerLabel>Branch</BorrowerLabel><BorrowerInput value={formData.altBankBranch} onChange={(val:any) => setFormData({...formData, altBankBranch: val})} /></div>
                      <div><BorrowerLabel>Account Number</BorrowerLabel><BorrowerInput value={formData.altBankAccNumber} onChange={(val:any) => handleNumericOnly('altBankAccNumber', val, 13)} /></div>
                      <div><BorrowerLabel>Sort Code</BorrowerLabel><BorrowerInput value={formData.altBankSortCode} onChange={(val:any) => handleNumericOnly('altBankSortCode', val)} /></div>
                      <div className="col-span-2"><BorrowerLabel>Account Holder Name</BorrowerLabel><BorrowerInput value={formData.altBankAccHolder} onChange={(val:any) => setFormData({...formData, altBankAccHolder: val})} /></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6 animate-fade-in">
                      <div><BorrowerLabel>Mobile Network</BorrowerLabel><BorrowerSelect options={[{label:'Airtel', value:'Airtel'}, {label:'MTN', value:'MTN'}, {label:'Zamtel', value:'Zamtel'}]} value={formData.altMomoNetwork} onChange={(val:any) => setFormData({...formData, altMomoNetwork: val})} /></div>
                      <div><BorrowerLabel>Phone Number</BorrowerLabel><BorrowerInput prefix="+260" value={formData.altMomoPhone} onChange={(val:any) => handlePhoneChange('altMomoPhone', val)} /></div>
                      <div className="col-span-2"><BorrowerLabel>Registered Names on Account</BorrowerLabel><BorrowerInput value={formData.altMomoRegisteredName} onChange={(val:any) => setFormData({...formData, altMomoRegisteredName: val})} /></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </SectionWrapper>
        );
      case 'upload':
        return (
          <SectionWrapper sectionId="upload" customFields={customFields} setCustomFields={setCustomFields}>
            <div><BorrowerLabel>Upload ID (NRC/Passport)</BorrowerLabel><div className="border-2 border-dashed border-slate-100 p-8 rounded-xl text-center text-slate-300 font-bold uppercase text-[9px] cursor-pointer hover:border-red-600 transition-all flex flex-col items-center gap-2"><Upload className="w-6 h-6" /> Select File</div></div>
            <div><BorrowerLabel>Supporting Documents</BorrowerLabel><div className="border-2 border-dashed border-slate-100 p-8 rounded-xl text-center text-slate-300 font-bold uppercase text-[9px] cursor-pointer hover:border-red-600 transition-all flex flex-col items-center gap-2"><FileText className="w-6 h-6" /> Upload PDF/Images</div></div>
          </SectionWrapper>
        );
      case 'custom':
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="bg-slate-100 p-8 rounded-[2.5rem] border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[11px] font-black uppercase text-black">Advanced Custom Field Module</h4>
                {cfForm.id && <button onClick={() => setCfForm({...cfForm, id: null, label: '', bulkNames: ''})} className="text-[9px] font-bold text-red-600 underline">Cancel Edit</button>}
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <BorrowerLabel>Field Label / Single Name</BorrowerLabel>
                    <BorrowerInput placeholder="e.g. Next of Kin Reference" value={cfForm.label} onChange={(val:any) => setCfForm({...cfForm, label: val})} />
                  </div>
                  <div className="space-y-4">
                    <BorrowerLabel>Bulk Creation (Line Separated Names)</BorrowerLabel>
                    <textarea 
                      className="w-full h-[3.1rem] px-4 py-3 rounded-lg border border-slate-200 text-[12px] font-normal text-slate-700 outline-none focus:ring-1 focus:ring-red-600 bg-white shadow-sm resize-none"
                      placeholder="Name 1&#10;Name 2&#10;Name 3"
                      value={cfForm.bulkNames}
                      onChange={(e) => setCfForm({...cfForm, bulkNames: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div><BorrowerLabel>Field Type</BorrowerLabel><BorrowerSelect options={[{label:'Text', value:'Text'}, {label:'Number', value:'Number'}, {label:'Date', value:'Date'}, {label:'Dropdown', value:'Dropdown'}]} value={cfForm.type} onChange={(val:any) => setCfForm({...cfForm, type: val})} /></div>
                  <div><BorrowerLabel>Field Scope</BorrowerLabel><BorrowerSelect options={[{label:'This Borrower Only', value:'This Borrower Only'}, {label:'All Borrowers (global)', value:'All Borrowers (global)'}]} value={cfForm.scope} onChange={(val:any) => setCfForm({...cfForm, scope: val})} /></div>
                  <div><BorrowerLabel>Placement Section</BorrowerLabel><BorrowerSelect options={[...baseSections.filter(s => s.id !== 'custom').map(s => ({label: s.label, value: s.id})), {label: '+ Create New Section', value: 'NEW'}]} value={cfForm.section} onChange={(val:any) => setCfForm({...cfForm, section: val})} /></div>
                </div>
                {cfForm.section === 'NEW' && <div><BorrowerLabel>New Section Name</BorrowerLabel><BorrowerInput placeholder="Section Title..." value={cfForm.newSectionName} onChange={(val:any) => setCfForm({...cfForm, newSectionName: val})} /></div>}
                <div className="flex flex-wrap gap-3 py-4 border-t border-slate-200">
                  <span className="text-[9px] font-black uppercase text-slate-400 w-full mb-2">Preset Bulk Groups:</span>
                  <button onClick={() => applyPreset('nok')} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-bold uppercase hover:bg-slate-50 transition-all flex items-center gap-2"><UserPlus className="w-3 h-3" /> Next of Kin</button>
                  <button onClick={() => applyPreset('guarantor')} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-bold uppercase hover:bg-slate-50 transition-all flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Guarantor</button>
                  <button onClick={() => applyPreset('collateral')} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-bold uppercase hover:bg-slate-50 transition-all flex items-center gap-2"><Layers2 className="w-3 h-3" /> Collateral</button>
                </div>
                <button onClick={upsertCustomField} className="w-full py-4 bg-black text-white rounded-2xl font-bold text-[10px] uppercase shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  {cfForm.id ? <><Save className="w-4 h-4" /> Save Field Changes</> : <><Plus className="w-4 h-4" /> Add Field(s) to Form</>}
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase text-slate-400">Section Navigator & Reordering</h4>
              {customFields.length === 0 ? <div className="py-20 text-center text-slate-300 font-bold uppercase text-[9px] border-2 border-dashed border-slate-100 rounded-[2.5rem]">No custom fields defined</div> : 
                <div className="space-y-3">
                  {[...customFields].sort((a,b) => a.order - b.order).map((field) => (
                    <div key={field.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between group shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <button onClick={() => {
                            const list = [...customFields].sort((a,b) => a.order - b.order);
                            const idx = list.findIndex(f => f.id === field.id);
                            if (idx > 0) {
                              const prev = list[idx - 1];
                              const curr = list[idx];
                              const temp = prev.order;
                              prev.order = curr.order;
                              curr.order = temp;
                              setCustomFields([...list]);
                            }
                          }} className="p-1 text-slate-300 hover:text-red-600 transition-all"><MoveUp className="w-3.5 h-3.5" /></button>
                          <button onClick={() => {
                            const list = [...customFields].sort((a,b) => a.order - b.order);
                            const idx = list.findIndex(f => f.id === field.id);
                            if (idx < list.length - 1) {
                              const next = list[idx + 1];
                              const curr = list[idx];
                              const temp = next.order;
                              next.order = curr.order;
                              curr.order = temp;
                              setCustomFields([...list]);
                            }
                          }} className="p-1 text-slate-300 hover:text-red-600 transition-all"><MoveDown className="w-3.5 h-3.5" /></button>
                        </div>
                        <div><p className="text-[11px] font-bold text-black">{field.label}</p><p className="text-[9px] text-slate-400 uppercase font-medium">{field.type} • {field.section} • {field.scope}</p></div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => setCfForm({ ...cfForm, id: field.id, label: field.label, type: field.type, scope: field.scope, section: field.section, bulkNames: '' })} className="p-2 text-slate-300 hover:text-slate-900"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setCustomFields(customFields.filter(f => f.id !== field.id))} className="p-2 text-slate-300 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        );
      default: 
        return (
          <SectionWrapper sectionId={activeSection} customFields={customFields} setCustomFields={setCustomFields}>
             <h4 className="text-[11px] font-black uppercase text-red-600 mb-6">{activeSection}</h4>
             {[null, null, null, null]}
          </SectionWrapper>
        );
    }
  };

  const handleFinalEnroll = () => {
    const newBorrower: Borrower = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      customerNumber: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      customFields: [...customFields]
    };
    onEnroll(newBorrower);
  };

  return (
    <div className="animate-fade-in-up text-left max-w-[800px] mx-auto overflow-hidden rounded-[2rem] border border-slate-200 shadow-2xl bg-white">
      <div className="bg-red-600 p-6 flex items-center gap-6">
        <button onClick={onBack} className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white hover:text-red-600 transition-all"><ArrowLeft className="w-5 h-5" /></button>
        <div><h2 className="text-[15px] font-bold text-white uppercase leading-tight">Customer Registry</h2><p className="text-[13px] font-bold text-white uppercase leading-tight">New Borrower Enrollment</p></div>
      </div>
      <div className="flex p-8 gap-10">
        <div className="w-52 space-y-2 border-r border-slate-50 pr-6 h-fit sticky top-0"><p className="text-[10px] font-black text-black uppercase mb-4 tracking-widest">Navigation</p>
          {sections.map((section) => (<button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full p-4 rounded-xl text-[13px] font-bold text-left transition-all uppercase tracking-tight ${activeSection === section.id ? 'bg-slate-200 text-black shadow-inner ring-2 ring-slate-100 scale-[1.02]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{section.label}</button>))}
        </div>
        <div className="flex-1">
          <div className="min-h-[400px] pb-20">{renderSectionContent()}</div>
          <div className="mt-12 pt-8 border-t border-slate-50 flex flex-wrap gap-4 items-center">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-[10px] font-bold uppercase shadow-lg hover:bg-green-700 transition-all flex items-center gap-2" onClick={handleFinalEnroll}><CheckCircle className="w-3.5 h-3.5" />Enroll Customer</button>
            <button className="px-6 py-2 bg-amber-500 text-white rounded-lg text-[10px] font-bold uppercase shadow-lg hover:bg-amber-600 transition-all flex items-center gap-2" onClick={() => setShowPreview(true)}><Eye className="w-3.5 h-3.5" />Preview</button>
            <button className="px-6 py-2 bg-slate-400 text-white rounded-lg text-[10px] font-bold uppercase shadow-lg hover:bg-slate-500 transition-all flex items-center gap-2" onClick={clearForm}><RotateCcw className="w-3.5 h-3.5" />Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreviewPage = ({ data, customFields, onBack }: any) => {
  const print = () => window.print();
  const sortedCustomFields = useMemo(() => [...customFields].sort((a,b) => a.order - b.order), [customFields]);

  return (
    <div className="animate-fade-in bg-white min-h-screen p-8 md:p-20 text-black font-normal">
      <div className="max-w-4xl mx-auto border-2 border-slate-100 rounded-[2.5rem] p-12 shadow-sm bg-white print:border-0 print:shadow-none print:p-0">
        <div className="flex justify-between items-start mb-12 print:hidden">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase hover:text-red-600 transition-all"><ArrowLeft className="w-4 h-4" /> Edit Form</button>
          <div className="flex gap-4">
            <button onClick={print} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-black transition-all flex items-center gap-2"><Printer className="w-3.5 h-3.5" /> Print</button>
            <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-red-700 transition-all flex items-center gap-2"><Download className="w-3.5 h-3.5" /> Download</button>
          </div>
        </div>
        <div className="text-center mb-16 border-b-2 border-slate-900 pb-10">
          <h1 className="text-4xl font-serif font-black mb-2 uppercase">Borrower Enrollment Summary</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Aster Money Lenders Official Document</p>
        </div>
        <div className="grid grid-cols-2 gap-x-20 gap-y-12 mb-20">
          <PreviewSection title="Personal Details">
            <PreviewRow label="Full Name" value={data.fullName} />
            <PreviewRow label="Gender" value={data.gender === 'M' ? 'Male' : 'Female'} />
            <PreviewRow label="DOB" value={data.dob} />
            <PreviewRow label="Age" value={data.age} />
            <PreviewRow label="NRC" value={data.nrc} />
            <PreviewRow label="Phone" value={'+260 ' + data.phone} />
            <PreviewRow label="Email" value={data.email} />
            {sortedCustomFields.filter(f => f.section === 'personal').map(f => <PreviewRow key={f.id} label={f.label} value={f.value} />)}
          </PreviewSection>
          <PreviewSection title="Residential Info">
            <PreviewRow label="Address" value={data.address} />
            <PreviewRow label="City" value={data.city} />
            <PreviewRow label="Province" value={data.province} />
            <PreviewRow label="GPS" value={data.gps ? `${data.gps.lat}, ${data.gps.lng}` : 'Not Captured'} />
            {sortedCustomFields.filter(f => f.section === 'residential').map(f => <PreviewRow key={f.id} label={f.label} value={f.value} />)}
          </PreviewSection>
          <PreviewSection title="Employment Details">
            <PreviewRow label="Status" value={`${data.employmentStatus.employed ? 'Employed' : ''} ${data.employmentStatus.selfEmployed ? 'Self-Employed' : ''}`} />
            {data.employmentStatus.employed && <><PreviewRow label="Type" value={data.employmentType} /><PreviewRow label="Employer" value={data.employerName} /><PreviewRow label="Job Title" value={data.empContactPosition} /></>}
            <PreviewRow label="Income" value={'K ' + data.income} />
            {sortedCustomFields.filter(f => f.section === 'employment').map(f => <PreviewRow key={f.id} label={f.label} value={f.value} />)}
          </PreviewSection>
          <PreviewSection title="Payment Method">
            <PreviewRow label="Primary" value={data.primaryPaymentType} />
            {data.primaryPaymentType === 'Bank' ? <><PreviewRow label="Bank" value={data.bankName} /><PreviewRow label="Account" value={data.bankAccNumber} /></> : <><PreviewRow label="Momo" value={data.momoNetwork} /><PreviewRow label="Phone" value={'+260 ' + data.momoPhone} /></>}
            {sortedCustomFields.filter(f => f.section === 'bank').map(f => <PreviewRow key={f.id} label={f.label} value={f.value} />)}
          </PreviewSection>
          {sortedCustomFields.length > 0 && <PreviewSection title="All Custom Data" colSpan={2}>
            <div className="grid grid-cols-2 gap-x-20 gap-y-4">
              {sortedCustomFields.map((cf:any) => <PreviewRow key={cf.id} label={cf.label} value={cf.value || 'N/A'} />)}
            </div>
          </PreviewSection>}
        </div>
        <div className="mt-24 pt-8 border-t border-slate-200 text-black">
          <div className="text-[12px] leading-relaxed">
            <p>Aster Money Lenders</p>
            <p>Email: info@astermoneylenders.com</p>
            <p>Phone: +260976853030 | +260772899184</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreviewSection = ({ title, children, colSpan = 1 }: any) => (<div className={colSpan === 2 ? 'col-span-2' : ''}><h4 className="text-[11px] font-black uppercase text-slate-400 mb-6 border-b border-slate-100 pb-2">{title}</h4><div className="space-y-4">{children}</div></div>);
const PreviewRow = ({ label, value }: any) => (<div className="flex justify-between items-baseline gap-4"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter shrink-0">{label}</span><span className="text-[12px] text-black font-medium text-right break-words">{value || '—'}</span></div>);

const CustomFieldInput = ({ field, setCustomFields, allFields }: { field: CustomField, setCustomFields: any, allFields: CustomField[] }) => {
  const updateValue = (val: string) => { const updated = allFields.map(f => f.id === field.id ? { ...f, value: val } : f); setCustomFields(updated); };
  return (<div><BorrowerLabel>{field.label} <span className="text-[9px] font-medium text-slate-400 normal-case ml-2">({field.scope})</span></BorrowerLabel>
      {field.type === 'Dropdown' ? <BorrowerSelect options={field.options?.map(o => ({label: o, value: o})) || []} value={field.value} onChange={updateValue} /> : <BorrowerInput type={field.type.toLowerCase()} value={field.value} onChange={updateValue} />}
    </div>);
};

const BorrowerListPage = ({ borrowers, onViewBorrower, onBack }: any) => (
  <div className="animate-fade-in-up text-left">
    <ReportHeader title="Borrower Master" subtitle="Customer Directory" onBack={onBack} />
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
          <tr>
            <th className="px-8 py-5">Customer #</th>
            <th className="px-8 py-5">Full Name</th>
            <th className="px-8 py-5">Phone</th>
            <th className="px-8 py-5">NRC</th>
            <th className="px-8 py-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {borrowers.length === 0 ? (
            <tr><td colSpan={5} className="p-20 text-center text-slate-300 uppercase font-black tracking-widest">No borrowers enrolled</td></tr>
          ) : borrowers.map((b: any) => (
            <tr key={b.id} className="hover:bg-slate-50 transition-all group">
              <td className="px-8 py-5 font-bold text-slate-900 text-sm">{b.customerNumber}</td>
              <td className="px-8 py-5">
                <p className="font-bold text-slate-900 text-sm">{b.fullName}</p>
                <p className="text-[10px] text-slate-400 uppercase">{b.email}</p>
              </td>
              <td className="px-8 py-5 text-sm text-slate-600">+260 {b.phone}</td>
              <td className="px-8 py-5 text-sm text-slate-600">{b.nrc}</td>
              <td className="px-8 py-5 text-right">
                <button onClick={() => onViewBorrower(b)} className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-black transition-all">View Customer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ViewBorrowerProfile = ({ borrower, onBack }: { borrower: Borrower, onBack: () => void }) => {
  return (
    <div className="animate-fade-in text-left">
       <div className="flex items-center gap-6 mb-10">
          <button onClick={onBack} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 transition-all shadow-sm"><ArrowLeft className="w-5 h-5" /></button>
          <div><h2 className="text-3xl font-serif font-black text-slate-900">{borrower.fullName}</h2><p className="text-[10px] font-black text-red-600 uppercase mt-1 tracking-widest">{borrower.customerNumber} • Customer Profile</p></div>
       </div>

       <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 border-b border-slate-50 pb-2">Personal Identity</h4>
                <div className="space-y-4">
                   <ProfileData label="Full Name" value={borrower.fullName} />
                   <ProfileData label="NRC Number" value={borrower.nrc} />
                   <ProfileData label="Phone" value={`+260 ${borrower.phone}`} />
                   <ProfileData label="Email" value={borrower.email} />
                   <ProfileData label="Date of Birth" value={borrower.dob} />
                   <ProfileData label="Calculated Age" value={borrower.age} />
                   <ProfileData label="Gender" value={borrower.gender === 'M' ? 'Male' : 'Female'} />
                </div>
             </div>
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 border-b border-slate-50 pb-2">Location & Residential</h4>
                <div className="space-y-4">
                   <ProfileData label="Address" value={borrower.address} />
                   <ProfileData label="City" value={borrower.city} />
                   <ProfileData label="Province" value={borrower.province} />
                   <ProfileData label="GPS" value={borrower.gps ? `${borrower.gps.lat}, ${borrower.gps.lng}` : 'Not Set'} />
                </div>
             </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
             <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 border-b border-slate-50 pb-2">Employment Details</h4>
                   <div className="space-y-4">
                      <ProfileData label="Status" value={`${borrower.employmentStatus.employed ? 'Employed' : ''} ${borrower.employmentStatus.selfEmployed ? 'Self-Employed' : ''}`} />
                      <ProfileData label="Type" value={borrower.employmentType} />
                      <ProfileData label="Employer" value={borrower.employerName} />
                      <ProfileData label="Position" value={borrower.empContactPosition} />
                      <ProfileData label="Income" value={`K ${borrower.income}`} />
                   </div>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 border-b border-slate-50 pb-2">Bank & Payouts</h4>
                   <div className="space-y-4">
                      <ProfileData label="Method" value={borrower.primaryPaymentType} />
                      {borrower.primaryPaymentType === 'Bank' ? (
                        <>
                           <ProfileData label="Bank Name" value={borrower.bankName} />
                           <ProfileData label="Acc Number" value={borrower.bankAccNumber} />
                        </>
                      ) : (
                        <>
                           <ProfileData label="Mobile Net" value={borrower.momoNetwork} />
                           <ProfileData label="Phone" value={`+260 ${borrower.momoPhone}`} />
                        </>
                      )}
                   </div>
                </div>
             </div>

             {borrower.customFields.length > 0 && (
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 border-b border-slate-50 pb-2">Additional Metadata</h4>
                   <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                      {borrower.customFields.map((f: any) => (
                         <ProfileData key={f.id} label={f.label} value={f.value || 'N/A'} />
                      ))}
                   </div>
                </div>
             )}

             {/* Financial Modules Sections */}
             <div className="space-y-6">
                <FinancialSection title="Loan Facilities" icon={<Briefcase className="w-4 h-4" />}>
                   <div className="py-10 text-center text-slate-300 font-bold uppercase text-[9px] tracking-widest">No active or past loans found</div>
                </FinancialSection>
                <FinancialSection title="Repayment History" icon={<DollarSign className="w-4 h-4" />}>
                   <div className="py-10 text-center text-slate-300 font-bold uppercase text-[9px] tracking-widest">No repayment records available</div>
                </FinancialSection>
                <FinancialSection title="Savings & Deposits" icon={<PiggyBank className="w-4 h-4" />}>
                   <div className="py-10 text-center text-slate-300 font-bold uppercase text-[9px] tracking-widest">No savings accounts active</div>
                </FinancialSection>
                <FinancialSection title="Investment Portfolio" icon={<TrendingUp className="w-4 h-4" />}>
                   <div className="py-10 text-center text-slate-300 font-bold uppercase text-[9px] tracking-widest">No managed investments</div>
                </FinancialSection>
             </div>
          </div>
       </div>
    </div>
  );
};

const ProfileData = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-baseline gap-4 border-b border-slate-50 pb-1">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter shrink-0">{label}</span>
    <span className="text-[12px] text-slate-900 font-medium text-right">{value || '—'}</span>
  </div>
);

const FinancialSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
     <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
        <span className="text-red-600">{icon}</span>
        <h4 className="text-[10px] font-black uppercase text-slate-900">{title}</h4>
     </div>
     <div className="p-8">{children}</div>
  </div>
);

// --- RESTORED BASE PAGE STUBS (FOR INFRASTRUCTURE CONSISTENCY) ---

const SavingsModuleStub = ({ title, onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title={title} onBack={onBack} /><div className="bg-white p-24 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase tracking-[0.5em] shadow-xl">Account Terminal Logged</div></div>);
const InvestmentModuleStub = ({ title, onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title={title} onBack={onBack} /><div className="bg-white p-24 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase tracking-[0.5em] shadow-xl">Portfolio Interface Logged</div></div>);
const ReportView = ({ title, onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title={title} onBack={onBack} /><div className="bg-white p-24 rounded-[3rem] border border-slate-200 text-center text-slate-300 font-black uppercase tracking-[0.5em] shadow-xl">Data Intelligence Workspace</div></div>);
const ViewRepaymentsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Repayment Records" onBack={onBack} /><div className="bg-white p-24 rounded-[3rem] border border-slate-200 text-center text-slate-300 font-black uppercase shadow-xl">Historical Payment Ledger</div></div>);
const GeneralLedgerPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="General Ledger" onBack={onBack} /><div className="bg-white p-24 rounded-[3rem] border border-slate-200 text-center text-slate-300 font-black uppercase shadow-xl">Account Activity Log</div></div>);
const PayrollSetupPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Payroll Configuration" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-10 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Statutory Rules Definition</div></div>);
const ClockingSummaryPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Time Aggregate" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Employee Hour Summarization</div></div>);
const UserAccountsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-2xl mx-auto"><ReportHeader title="System Access" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Account Provisioning</div></div>);
const SystemSettingsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Master Configuration" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Global Operational Settings</div></div>);
const DueLoansPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Collections Queue" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Facility Aging Tracker</div></div>);
const ApproveLoansPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Review Terminal" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Pending Decision Queue</div></div>);
const AddBulkRepaymentsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Bulk Settlement" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Batch Import terminal</div></div>);
const ApproveRepaymentsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Verification Terminal" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Incoming Payment Review</div></div>);
const JournalApprovalPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Post Verification" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Journal Posting Queue</div></div>);
const ExpenseManagementPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Expenditure Record" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Opex Recording Workspace</div></div>);
const RevenueManagementPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Income Record" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Non-Loan Revenue entry</div></div>);
const BankReconciliationPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Statement Matching" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Reconciliation Terminal</div></div>);
const TaxManagementPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Statutory Compliance" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">TPIN & Tax Rule Config</div></div>);
const FinancialPeriodsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Period Management" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Opening/Closing Terminal</div></div>);
const AuditTrailPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Traceability Log" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">System Activity monitor</div></div>);
const BalanceSheetPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Balance Sheet" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Position Statement</div></div>);
const TrialBalancePage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Trial Balance" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Verification Statement</div></div>);
const ChartOfAccountsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Ledger Definition" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">COA Structure</div></div>);
const AddSavingsAccountPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Savings Account Origination" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Customer account issuance</div></div>);
const FixedAssetsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Fixed Asset Register" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Asset Depreciation Terminal</div></div>);
const SavingsDepositsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-2xl mx-auto"><ReportHeader title="Deposit Terminal" onBack={onBack} /><div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Inflow Recording</div></div>);
const SavingsWithdrawalsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-2xl mx-auto"><ReportHeader title="Withdrawal Terminal" onBack={onBack} /><div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Outflow Recording</div></div>);
const SavingsTransfersPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-2xl mx-auto"><ReportHeader title="Internal Transfer" onBack={onBack} /><div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Ledger movement terminal</div></div>);
const SavingsInterestConfigPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-2xl mx-auto"><ReportHeader title="Yield Schemes" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Interest rate maintenance</div></div>);
const SavingsStatementsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Savings History" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Customer ledger statements</div></div>);
const SavingsClosurePage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Facility Termination" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Savings closure workflow</div></div>);
const CreateInvestmentPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Contract Issuance" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">New investment entry</div></div>);
const InvestmentContributionsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-2xl mx-auto"><ReportHeader title="Capital Receipt" onBack={onBack} /><div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Investment contribution terminal</div></div>);
const InvestmentPayoutsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-2xl mx-auto"><ReportHeader title="Dividend Disbursement" onBack={onBack} /><div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Investment exit/payout entry</div></div>);
const InvestmentApprovalsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Investment Decisions" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Contract verification queue</div></div>);
const InvestmentPerformancePage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Yield Intelligence" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Portfolio performance analytics</div></div>);
const DailyAttendancePage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Attendance Logs" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Daily shift register</div></div>);
const ClockingAnalyticsPage = ({ title, onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title={title.replace(/([A-Z])/g, ' $1').trim()} onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Time Management analytics</div></div>);
const PayrollProcessingPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-5xl mx-auto"><ReportHeader title="Cycle Generation" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Salary processing terminal</div></div>);
const PayslipGenerationPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Payment Slips" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Payslip inventory portal</div></div>);
const PayrollApprovalPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Verification Terminal" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Payroll cycle decision queue</div></div>);
const PayrollHistoryPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Disbursement Archives" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Historical Payroll logs</div></div>);
const RolesPermissionsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Capability Matrix" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Role based access configuration</div></div>);
const DepartmentManagementPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Organization Unit" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Departmental structure workspace</div></div>);
const HRReportsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Staff Analytics" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">HR demographic data</div></div>);
const TaskReportsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Productivity Intelligence" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Employee resolution analytics</div></div>);
const BranchSettingsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-4xl mx-auto"><ReportHeader title="Branch Configuration" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Location identity maintenance</div></div>);
const UserPreferencesPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-2xl mx-auto"><ReportHeader title="UI/UX Preference" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Personal system configuration</div></div>);
const SecuritySettingsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left max-w-3xl mx-auto"><ReportHeader title="Security Rule Set" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Policy management terminal</div></div>);
const AuditLogsPage = ({ onBack }: any) => (<div className="animate-fade-in-up text-left"><ReportHeader title="Security Activity" onBack={onBack} /><div className="bg-white p-12 rounded-[3rem] border border-slate-200 py-24 text-center text-slate-300 font-black uppercase shadow-xl">Immutable audit records</div></div>);

export default Dashboard;