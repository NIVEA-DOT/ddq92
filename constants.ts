import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'pattern_self',
    title: "Why do I repeat the same patterns?",
    price: 14.99,
    description: "Analyze your inner patterns & outer impressions.",
    features: ["Self-Analysis", "Inner Pattern (Saju)", "Outer Impression (Face)", "Conflict Origins"]
  },
  {
    id: 'relationship_check',
    title: "Is this person right for me?",
    price: 24.99,
    description: "Compatibility check & red flag detection.",
    features: ["Two-person Analysis", "Attraction Logic", "Conflict Points", "Communication Guide"]
  },
  {
    id: 'marriage_timing',
    title: "Is marriage in our future?",
    price: 29.99,
    description: "Long-term commitment & timing analysis.",
    features: ["Marriage Timing", "Long-term Risks", "Critical Conversations"]
  },
  {
    id: 'breakup_recovery',
    title: "Why did we break up?",
    price: 34.99,
    description: "Closure & recovery strategy.",
    features: ["Breakup Autopsy", "Reconnection Risk", "Recovery Plan"]
  },
  {
    id: 'comprehensive_pack',
    title: "Total Relationship Reset (All-in-One)",
    price: 49.99,
    badge: "Most Popular",
    description: "Full analysis package + PDF download.",
    features: ["Pattern + Compatibility + Timing", "Comprehensive Strategy", "PDF Download", "Priority Support"]
  },
  {
    id: 'deep_dive',
    title: "Deep Dive Simulation",
    price: 89.99,
    description: "Premium detailed report with specific simulations.",
    features: ["10+ Page Report", "Specific Scenario Sims", "Detailed Q&A"]
  }
];

export const ISSUES = [
  { id: 'repeat_pattern', label: "I always meet similar types of people." },
  { id: 'loss_interest', label: "I lose interest as time goes on." },
  { id: 'avoidant_partner', label: "My partners avoid responsibility/commitment." },
  { id: 'marriage_fear', label: "We drift apart when marriage is mentioned." },
  { id: 'unbalanced_love', label: "I always end up loving them more." },
  { id: 'cant_forget', label: "I can't forget my ex." },
  { id: 'uncertainty', label: "I'm unsure if this relationship is right." },
];
