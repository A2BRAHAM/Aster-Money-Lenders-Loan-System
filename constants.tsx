
import React from 'react';
import { 
  UserCircle, 
  Briefcase, 
  Wallet, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Handshake, 
  Lock, 
  HeartHandshake,
  TrendingUp,
  FileText,
  BadgeCheck,
  Headset
} from 'lucide-react';
import { Product, Service, TrustPoint } from './types';

export const BRAND_COLORS = {
  primary: 'text-white',
  primaryBg: 'bg-red-600',
  primaryBorder: 'border-white',
  primaryHover: 'hover:bg-black',
  secondary: 'text-white',
  accent: 'text-white',
  accentBg: 'bg-black',
  buttonBase: 'px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border-2 active:scale-95',
  buttonPrimary: 'border-white text-white bg-transparent hover:bg-white hover:text-red-600',
  buttonSecondary: 'border-black text-black bg-transparent hover:bg-black hover:text-white',
};

export const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#products' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'personal',
    title: 'Personal Loans',
    description: 'Short-term loans for emergencies and personal needs with minimal documentation.',
    icon: <UserCircle className="w-8 h-8" />,
    eligibility: [
      'Minimum age of 21 years',
      'Zambian Resident with valid NRC',
      'Proof of consistent monthly income',
      'Clean credit history'
    ],
    requirements: [
      'Original NRC and a clear photocopy',
      'Latest 3 months Bank Statements',
      'Utility bill as proof of residence',
      'One recent passport-sized photo'
    ],
    additionalInfo: {
      duration: '1 to 12 Months',
      repayment: 'Fixed monthly installments',
      notes: 'Quick processing within 24-48 hours upon full document submission.'
    }
  },
  {
    id: 'business',
    title: 'Business Loans',
    description: 'Funding solutions designed to help small and medium enterprises scale effectively.',
    icon: <Briefcase className="w-8 h-8" />,
    eligibility: [
      'Registered business with PACRA',
      'Operational for at least 6 months',
      'Business bank account holders',
      'Verifiable business premises'
    ],
    requirements: [
      'Certificate of Incorporation',
      'Valid TPIN Certificate',
      '6 months Business Bank Statements',
      'Director identification documents'
    ],
    additionalInfo: {
      duration: '3 to 24 Months',
      repayment: 'Flexible based on business cashflow',
      notes: 'Collateral may be required depending on the loan volume.'
    }
  },
  {
    id: 'salaried',
    title: 'Salaried Loans',
    description: 'Loans tailored specifically for salaried and formally employed individuals.',
    icon: <Wallet className="w-8 h-8" />,
    eligibility: [
      'Confirmed employee in a recognized organization',
      'Minimum 6 months in current employment',
      'Salary must be remitted through a bank account',
      'Company must be on our approved employer list'
    ],
    requirements: [
      'Latest 3 months Payslips',
      'Bank statement showing last 3 salary deposits',
      'Introduction letter from HR department',
      'Copy of NRC'
    ],
    additionalInfo: {
      duration: 'Up to 36 Months',
      repayment: 'Direct payroll deduction available',
      notes: 'Low interest rates compared to general personal loans.'
    }
  },
  {
    id: 'collateral',
    title: 'Collateral Loans',
    description: 'Secure loans backed by assets, offering higher limits and lower rates.',
    icon: <Lock className="w-8 h-8" />,
    eligibility: [
      'Ownership of an asset (Car, Real Estate, Machinery)',
      'Clear title or proof of ownership',
      'Asset must be in good, verifiable condition',
      'Insurance cover for the asset'
    ],
    requirements: [
      'Certificate of Title or Motor Vehicle White Book',
      'Valuation report from an approved valuer',
      'Physical inspection of the asset',
      'NRC of the asset owner'
    ],
    additionalInfo: {
      duration: '12 to 60 Months',
      repayment: 'Negotiable structure',
      notes: 'Loans up to 50% of the forced sale value of the asset.'
    }
  },
  {
    id: 'other',
    title: 'Other Loans',
    description: 'Flexible loan options customized to meet unique customer financial goals.',
    icon: <FileText className="w-8 h-8" />,
    eligibility: [
      'Case-by-case review',
      'Financial need must be justifiable',
      'Ability to repay must be demonstrated',
      'Valid identification'
    ],
    requirements: [
      'Relevant financial documentation',
      'Project or need proposal',
      'Income verification documents',
      'Contact information for character references'
    ],
    additionalInfo: {
      duration: 'Custom terms',
      repayment: 'Bespoke agreements',
      notes: 'Ideal for specialized projects, education, or niche financing needs.'
    }
  },
];

export const SERVICES: Service[] = [
  { id: '1', title: 'Quick Loan Approval', icon: <Zap className="w-6 h-6" /> },
  { id: '2', title: 'Flexible Repayment Plans', icon: <Handshake className="w-6 h-6" /> },
  { id: '3', title: 'Competitive Interest Rates', icon: <TrendingUp className="w-6 h-6" /> },
  { id: '4', title: 'Secure Online Application', icon: <ShieldCheck className="w-6 h-6" /> },
  { id: '5', title: 'Dedicated Customer Support', icon: <Headset className="w-6 h-6" /> },
  { id: '6', title: 'Transparent Loan Terms', icon: <BadgeCheck className="w-6 h-6" /> },
];

export const TRUST_POINTS: TrustPoint[] = [
  {
    id: '1',
    title: 'Trusted & Compliant',
    description: 'We adhere to the highest regulatory standards in financial lending.',
    icon: <ShieldCheck className="w-8 h-8" />,
  },
  {
    id: '2',
    title: 'Customer-First Approach',
    description: 'Our solutions are built around your specific financial needs and timeline.',
    icon: <HeartHandshake className="w-8 h-8" />,
  },
  {
    id: '3',
    title: 'Privacy Protection',
    description: 'Your data is encrypted and protected with enterprise-grade security.',
    icon: <Lock className="w-8 h-8" />,
  },
  {
    id: '4',
    title: 'Fast Support',
    description: 'Our team is available to assist you at every step of your application.',
    icon: <Clock className="w-8 h-8" />,
  },
  {
    id: '5',
    title: 'Community Focused',
    description: 'We are committed to financial inclusion and empowering our local communities.',
    icon: <TrendingUp className="w-8 h-8" />,
  },
];
