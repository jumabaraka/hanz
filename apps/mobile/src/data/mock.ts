// apps/mobile/src/data/mock.ts
// Sample data for the prototype. Names and businesses are invented.
// Prices are integer pesewas. This file is replaced by API calls once the backend endpoints exist.

import type { PriceType } from '@/lib/money';

import type { IconName } from '@/components/styled';

export type { IconName };

export type Category = { id: string; name: string; icon: IconName; color: string };

export const categories: Category[] = [
  { id: 'tutoring', name: 'Tutoring', icon: 'school', color: '#3D6FD9' },
  { id: 'repairs', name: 'Phone & laptop repairs', icon: 'construct', color: '#0E4F4C' },
  { id: 'tailoring', name: 'Tailoring & fashion', icon: 'cut', color: '#B5477A' },
  { id: 'errands', name: 'Errands & delivery', icon: 'bicycle', color: '#E07A1F' },
  { id: 'beauty', name: 'Beauty & grooming', icon: 'sparkles', color: '#8A55C9' },
  { id: 'printing', name: 'Printing & design', icon: 'print', color: '#2E8B6E' },
];

export const locations = [
  'UMaT Main Gate',
  'UMaT Library',
  'Lecture block',
  'Student halls',
  'Tarkwa Station',
  'Other (add in notes)',
];

export type Listing = { id: string; title: string; price: number; priceType: PriceType; duration: string };
export type Work = { id: string; title: string; icon: IconName; tint: string };
export type Review = { id: string; author: string; rating: number; date: string; text: string };

export type Provider = {
  id: string;
  name: string;
  business: string;
  categoryId: string;
  initials: string;
  color: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  followers: number;
  completedJobs: number;
  area: string;
  availableToday: boolean;
  following: boolean;
  bio: string;
  hours: { day: string; time: string }[];
  listings: Listing[];
  works: Work[];
  reviews: Review[];
};

const weekdays = (time: string, sat = '10:00am – 4:00pm', sun = 'Closed') => [
  { day: 'Monday', time },
  { day: 'Tuesday', time },
  { day: 'Wednesday', time },
  { day: 'Thursday', time },
  { day: 'Friday', time },
  { day: 'Saturday', time: sat },
  { day: 'Sunday', time: sun },
];

export const providers: Provider[] = [
  {
    id: 'kofi',
    name: 'Kofi Boateng',
    business: 'Kofi Fix It',
    categoryId: 'repairs',
    initials: 'KB',
    color: '#0E4F4C',
    verified: true,
    rating: 4.8,
    reviewCount: 64,
    followers: 312,
    completedJobs: 118,
    area: 'Near UMaT Main Gate',
    availableToday: true,
    following: true,
    bio: 'Final-year Electrical student. I fix cracked screens, charging ports, batteries and slow laptops. Most phone repairs are done the same day.',
    hours: weekdays('4:00pm – 9:00pm', '9:00am – 6:00pm'),
    listings: [
      { id: 'kofi-screen', title: 'Phone screen replacement', price: 15000, priceType: 'from', duration: '1–2 hrs' },
      { id: 'kofi-port', title: 'Charging port repair', price: 6000, priceType: 'fixed', duration: '1 hr' },
      { id: 'kofi-laptop', title: 'Laptop cleanup & Windows reinstall', price: 10000, priceType: 'fixed', duration: '3 hrs' },
    ],
    works: [
      { id: 'w1', title: 'Cracked screen fixed', icon: 'phone-portrait', tint: '#D7E6E5' },
      { id: 'w2', title: 'Battery swap', icon: 'battery-charging', tint: '#E6EEF9' },
      { id: 'w3', title: 'Laptop fan cleaned', icon: 'laptop', tint: '#F3E8D9' },
      { id: 'w4', title: 'Port soldering', icon: 'flash', tint: '#FBE7DA' },
      { id: 'w5', title: 'Back glass', icon: 'phone-portrait-outline', tint: '#E9E3F4' },
      { id: 'w6', title: 'SSD upgrade', icon: 'hardware-chip', tint: '#DDEFE5' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Yaw A.',
        rating: 5,
        date: '2 Oct 2026',
        text: 'Fixed my screen in an hour and it looks new. Paying through escrow made me relaxed.',
      },
      {
        id: 'r2',
        author: 'Esi K.',
        rating: 5,
        date: '27 Sep 2026',
        text: 'Charging port works perfectly now. Very honest about what was wrong.',
      },
      {
        id: 'r3',
        author: 'Daniel O.',
        rating: 4,
        date: '19 Sep 2026',
        text: 'Good job on my laptop. Took a bit longer than promised.',
      },
    ],
  },
  {
    id: 'ama',
    name: 'Ama Mensah',
    business: 'Ama Stitches',
    categoryId: 'tailoring',
    initials: 'AM',
    color: '#B5477A',
    verified: true,
    rating: 4.9,
    reviewCount: 41,
    followers: 528,
    completedJobs: 76,
    area: 'Student halls',
    availableToday: false,
    following: true,
    bio: 'Kaba and slit, dresses, shirts and quick alterations. Bring your fabric or I can help you choose one.',
    hours: weekdays('5:00pm – 9:00pm', '8:00am – 5:00pm', '2:00pm – 6:00pm'),
    listings: [
      { id: 'ama-dress', title: 'Custom dress (your fabric)', price: 18000, priceType: 'from', duration: '5 days' },
      { id: 'ama-alter', title: 'Alteration or resizing', price: 3000, priceType: 'fixed', duration: '1 day' },
      { id: 'ama-shirt', title: 'Print shirt', price: 12000, priceType: 'fixed', duration: '4 days' },
    ],
    works: [
      { id: 'w1', title: 'Kaba and slit', icon: 'shirt', tint: '#F6DDE8' },
      { id: 'w2', title: 'Graduation dress', icon: 'ribbon', tint: '#F3E8D9' },
      { id: 'w3', title: 'Print shirt', icon: 'shirt-outline', tint: '#E6EEF9' },
      { id: 'w4', title: 'Hem and resize', icon: 'cut', tint: '#E9E3F4' },
    ],
    reviews: [
      { id: 'r1', author: 'Akosua B.', rating: 5, date: '30 Sep 2026', text: 'My dress fit perfectly on the first try.' },
      { id: 'r2', author: 'Efua T.', rating: 5, date: '12 Sep 2026', text: 'Fast alteration and neat finishing.' },
    ],
  },
  {
    id: 'kwabena',
    name: 'Kwabena Asare',
    business: 'Asare Maths Clinic',
    categoryId: 'tutoring',
    initials: 'KA',
    color: '#3D6FD9',
    verified: true,
    rating: 4.7,
    reviewCount: 29,
    followers: 190,
    completedJobs: 85,
    area: 'UMaT Library',
    availableToday: true,
    following: false,
    bio: 'Mathematics and Engineering Mathematics tutor. One-on-one or small groups before exams.',
    hours: weekdays('6:00pm – 9:00pm', '10:00am – 2:00pm'),
    listings: [
      { id: 'kwabena-maths', title: 'Engineering Maths session', price: 4000, priceType: 'per_hour', duration: '1 hr' },
      { id: 'kwabena-exam', title: 'Exam prep group (up to 5)', price: 10000, priceType: 'fixed', duration: '2 hrs' },
    ],
    works: [
      { id: 'w1', title: 'Calculus revision pack', icon: 'calculator', tint: '#E6EEF9' },
      { id: 'w2', title: 'Group session', icon: 'people', tint: '#DDEFE5' },
      { id: 'w3', title: 'Past questions', icon: 'document-text', tint: '#F3E8D9' },
    ],
    reviews: [
      { id: 'r1', author: 'Nana Y.', rating: 5, date: '1 Oct 2026', text: 'Explains step by step. Passed my resit.' },
      { id: 'r2', author: 'Joseph M.', rating: 4, date: '22 Sep 2026', text: 'Very helpful, the room was a bit noisy.' },
    ],
  },
  {
    id: 'efua',
    name: 'Efua Owusu',
    business: 'Efua Braids & Nails',
    categoryId: 'beauty',
    initials: 'EO',
    color: '#8A55C9',
    verified: false,
    rating: 4.6,
    reviewCount: 18,
    followers: 240,
    completedJobs: 33,
    area: 'Student halls',
    availableToday: true,
    following: false,
    bio: 'Knotless braids, cornrows and gel nails. Home service in the halls.',
    hours: weekdays('3:00pm – 8:00pm', '7:00am – 6:00pm'),
    listings: [
      { id: 'efua-braids', title: 'Knotless braids (medium)', price: 25000, priceType: 'from', duration: '5 hrs' },
      { id: 'efua-nails', title: 'Gel nails', price: 8000, priceType: 'fixed', duration: '1 hr' },
    ],
    works: [
      { id: 'w1', title: 'Knotless braids', icon: 'sparkles', tint: '#E9E3F4' },
      { id: 'w2', title: 'Gel nails', icon: 'color-palette', tint: '#F6DDE8' },
      { id: 'w3', title: 'Cornrows', icon: 'flower', tint: '#F3E8D9' },
    ],
    reviews: [{ id: 'r1', author: 'Abena S.', rating: 5, date: '25 Sep 2026', text: 'Neat and on time. Will book again.' }],
  },
  {
    id: 'kojo',
    name: 'Kojo Appiah',
    business: 'Kojo Runs It',
    categoryId: 'errands',
    initials: 'KJ',
    color: '#E07A1F',
    verified: true,
    rating: 4.5,
    reviewCount: 52,
    followers: 160,
    completedJobs: 210,
    area: 'Tarkwa Station',
    availableToday: true,
    following: false,
    bio: 'Market runs, pickups and deliveries between town and campus by motorbike.',
    hours: weekdays('7:00am – 7:00pm', '7:00am – 7:00pm', '12:00pm – 6:00pm'),
    listings: [
      { id: 'kojo-run', title: 'Town to campus delivery', price: 2000, priceType: 'fixed', duration: '1 hr' },
      { id: 'kojo-market', title: 'Market shopping run', price: 3500, priceType: 'from', duration: '2 hrs' },
    ],
    works: [
      { id: 'w1', title: 'Grocery run', icon: 'basket', tint: '#FBE7DA' },
      { id: 'w2', title: 'Parcel pickup', icon: 'cube', tint: '#DDEFE5' },
    ],
    reviews: [{ id: 'r1', author: 'Selorm D.', rating: 4, date: '28 Sep 2026', text: 'Quick and got everything on my list.' }],
  },
  {
    id: 'abena',
    name: 'Abena Sarpong',
    business: 'Sarpong Print Hub',
    categoryId: 'printing',
    initials: 'AS',
    color: '#2E8B6E',
    verified: true,
    rating: 4.8,
    reviewCount: 37,
    followers: 205,
    completedJobs: 140,
    area: 'Lecture block',
    availableToday: true,
    following: false,
    bio: 'Printing, binding, project covers, flyers and posters. Send your file and pick up the same day.',
    hours: weekdays('8:00am – 8:00pm', '9:00am – 3:00pm'),
    listings: [
      { id: 'abena-bind', title: 'Project printing & binding', price: 5000, priceType: 'from', duration: 'Same day' },
      { id: 'abena-flyer', title: 'Flyer design', price: 8000, priceType: 'fixed', duration: '1 day' },
    ],
    works: [
      { id: 'w1', title: 'Thesis binding', icon: 'book', tint: '#DDEFE5' },
      { id: 'w2', title: 'Event flyer', icon: 'image', tint: '#E6EEF9' },
      { id: 'w3', title: 'Business cards', icon: 'card', tint: '#F3E8D9' },
    ],
    reviews: [
      { id: 'r1', author: 'Michael A.', rating: 5, date: '3 Oct 2026', text: 'Binding came out clean, ready in two hours.' },
    ],
  },
];

export const me = { name: 'Yaw Asante', initials: 'YA', area: 'Student halls', color: '#0E4F4C' };

export type Message = { id: string; from: 'me' | 'them'; text: string; time: string };
export type Chat = { id: string; providerId: string; pinned: boolean; unread: number; updated: string; messages: Message[] };

export const chats: Chat[] = [
  {
    id: 'c-kofi',
    providerId: 'kofi',
    pinned: true,
    unread: 2,
    updated: '2 hrs ago',
    messages: [
      { id: 'm1', from: 'me', text: 'Hi, my phone screen is cracked. How much for a Tecno Spark?', time: '09:20' },
      { id: 'm2', from: 'them', text: 'Hello! For Spark it is GHS 150 including the screen.', time: '09:25' },
      { id: 'm3', from: 'them', text: 'Send a booking on Hanz and I can do it this evening.', time: '09:25' },
    ],
  },
  {
    id: 'c-ama',
    providerId: 'ama',
    pinned: false,
    unread: 0,
    updated: '2 days ago',
    messages: [
      { id: 'm1', from: 'them', text: 'Your dress is ready for fitting.', time: 'Tue' },
      { id: 'm2', from: 'me', text: 'Thank you! I will come tomorrow.', time: 'Tue' },
    ],
  },
  {
    id: 'c-abena',
    providerId: 'abena',
    pinned: false,
    unread: 0,
    updated: '1 week ago',
    messages: [{ id: 'm1', from: 'them', text: 'Thanks for your booking!', time: 'Sat' }],
  },
];

export type Notice = { id: string; title: string; body: string; when: string; icon: IconName; group: 'Today' | 'Earlier' };

export const notifications: Notice[] = [
  {
    id: 'n1',
    title: 'Kofi Boateng replied',
    body: 'Send a booking on Hanz and I can do it this evening.',
    when: '2 hrs ago',
    icon: 'chatbubble-ellipses',
    group: 'Today',
  },
  {
    id: 'n2',
    title: 'Payment secured',
    body: 'GHS 83 is held safely for your booking with Sarpong Print Hub.',
    when: '5 hrs ago',
    icon: 'shield-checkmark',
    group: 'Today',
  },
  {
    id: 'n3',
    title: 'Rate your booking',
    body: 'How was your printing job with Abena Sarpong?',
    when: '3 Oct',
    icon: 'star',
    group: 'Earlier',
  },
  {
    id: 'n4',
    title: 'Welcome to Hanz',
    body: 'Find trusted people on campus and pay safely with escrow.',
    when: '1 Oct',
    icon: 'sparkles',
    group: 'Earlier',
  },
];

export const providerById = (id: string) => providers.find((p) => p.id === id);
export const categoryById = (id: string) => categories.find((c) => c.id === id);