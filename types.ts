
import React from 'react';

export interface Product {
  id: string;
  title: string;
  description: string;
  // Fix: Added React import to satisfy the React namespace requirement
  icon: React.ReactNode;
}

export interface Service {
  id: string;
  title: string;
  // Fix: Added React import to satisfy the React namespace requirement
  icon: React.ReactNode;
}

export interface TrustPoint {
  id: string;
  title: string;
  description: string;
  // Fix: Added React import to satisfy the React namespace requirement
  icon: React.ReactNode;
}
