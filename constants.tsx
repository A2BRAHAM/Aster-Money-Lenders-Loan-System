
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

// Brand Colors Refined from Logo:
// Orange/Gold: #F59E0B (brand name)
// Teal/Cyan: #0891B2 (wreath/globe)
// Green: #15803D (money symbols)
// Red: #DC2626 (tagline background)

export const BRAND_COLORS = {
  primary: 'text-cyan-700',
  secondary: 'text-amber-500',
  accent: 'text-green-700',
  tagline: 'text-red-600',
  primaryBg: 'bg-cyan-700',
  secondaryBg: 'bg-amber-500',
  accentBg: 'bg-green-700',
  taglineBg: 'bg-red-600',
  primaryHover: 'hover:bg-cyan-800',
  secondaryHover: 'hover:bg-amber-600',
};

export const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#products' },
  { label: 'Services', href: '#services' },
  { label: 'Investments', href: '#investments' },
  { label: 'Who We Are', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'personal',
    title: 'Personal Loans',
    description: 'Short-term loans for emergencies and personal needs with minimal documentation.',
    icon: <UserCircle className="w-8 h-8" />,
  },
  {
    id: 'business',
    title: 'Business Loans',
    description: 'Funding solutions designed to help small and medium enterprises scale effectively.',
    icon: <Briefcase className="w-8 h-8" />,
  },
  {
    id: 'salaried',
    title: 'Salaried Loans',
    description: 'Loans tailored specifically for salaried and formally employed individuals.',
    icon: <Wallet className="w-8 h-8" />,
  },
  {
    id: 'collateral',
    title: 'Collateral Loans',
    description: 'Secure loans backed by assets, offering higher limits and lower rates.',
    icon: <Lock className="w-8 h-8" />,
  },
  {
    id: 'other',
    title: 'Other Loans',
    description: 'Flexible loan options customized to meet unique customer financial goals.',
    icon: <FileText className="w-8 h-8" />,
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
