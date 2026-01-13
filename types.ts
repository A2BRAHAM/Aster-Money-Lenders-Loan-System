
import React from 'react';

export interface Product {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  eligibility?: string[];
  requirements?: string[];
  additionalInfo?: {
    duration: string;
    repayment: string;
    notes: string;
  };
}

export interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export interface TrustPoint {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}
