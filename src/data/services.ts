import { Service } from '../types';

export const services: Service[] = [
  {
    id: 'web-dev',
    name: 'Web Development',
    category: 'Development',
    baseRate: 75,
    complexity: 'high'
  },
  {
    id: 'mobile-dev',
    name: 'Mobile App Development',
    category: 'Development',
    baseRate: 85,
    complexity: 'high'
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    category: 'Design',
    baseRate: 65,
    complexity: 'medium'
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    category: 'Design',
    baseRate: 45,
    complexity: 'medium'
  },
  {
    id: 'content-writing',
    name: 'Content Writing',
    category: 'Writing',
    baseRate: 35,
    complexity: 'low'
  },
  {
    id: 'copywriting',
    name: 'Copywriting',
    category: 'Writing',
    baseRate: 55,
    complexity: 'medium'
  },
  {
    id: 'seo-marketing',
    name: 'SEO & Digital Marketing',
    category: 'Marketing',
    baseRate: 60,
    complexity: 'medium'
  },
  {
    id: 'social-media',
    name: 'Social Media Management',
    category: 'Marketing',
    baseRate: 40,
    complexity: 'low'
  },
  {
    id: 'consulting',
    name: 'Business Consulting',
    category: 'Consulting',
    baseRate: 120,
    complexity: 'high'
  },
  {
    id: 'tutoring',
    name: 'Online Tutoring',
    category: 'Education',
    baseRate: 30,
    complexity: 'low'
  }
];