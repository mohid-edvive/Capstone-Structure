
import { Module, ModuleStatus, Asset, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  name: "Smart Investor",
  xp: 150,
  level: 2,
  streak: 7,
  hearts: 5,
  investingoBucks: 10000,
  portfolio: {},
  completedLessons: []
};

export const MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Investment Basics',
    icon: '📊',
    status: ModuleStatus.AVAILABLE,
    requiredScore: 0.8,
    lessons: [
      {
        id: 'l1',
        title: 'Compound Interest',
        description: 'The engine of long-term wealth.',
        xpReward: 20,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            prompt: 'Compound interest is best described as:',
            options: ['Interest on the principal only', 'Interest on both principal and accumulated interest', 'A fixed annual fee', 'Government stimulus'],
            correctAnswer: 'Interest on both principal and accumulated interest',
            explanation: 'It creates a snowball effect where your earnings generate their own earnings!'
          }
        ]
      }
    ]
  },
  {
    id: 'm2',
    title: 'Equity Essentials',
    icon: '📈',
    status: ModuleStatus.AVAILABLE,
    requiredScore: 0.8,
    lessons: [
      {
        id: 'l2',
        title: 'What is a Stock?',
        description: 'Owning a piece of the corporate world.',
        xpReward: 25,
        questions: [
          {
            id: 'q2',
            type: 'multiple-choice',
            prompt: 'When you buy a share of a stock, you are buying:',
            options: ['A loan to the company', 'Partial ownership of the company', 'A guaranteed profit', 'The right to manage the company'],
            correctAnswer: 'Partial ownership of the company',
            explanation: 'You become a shareholder, meaning you own a tiny slice of that business!'
          }
        ]
      }
    ]
  },
  {
    id: 'm3',
    title: 'Diversification',
    icon: '🛡️',
    status: ModuleStatus.LOCKED,
    requiredScore: 0.8,
    lessons: []
  },
  {
    id: 'm4',
    title: 'Advanced Trading',
    icon: '⚡',
    status: ModuleStatus.LOCKED,
    requiredScore: 0.9,
    lessons: []
  }
];

export const MOCK_ASSETS: Asset[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 1.25, type: 'Stock', levelRequired: 1 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.50, change: 0.82, type: 'Stock', levelRequired: 1 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.20, change: 4.15, type: 'Stock', levelRequired: 2 },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', price: 470.12, change: 0.45, type: 'ETF', levelRequired: 1 },
  { symbol: 'BTC', name: 'Bitcoin', price: 68420.00, change: -2.10, type: 'Crypto', levelRequired: 3 },
  { symbol: 'ETH', name: 'Ethereum', price: 3450.50, change: 1.12, type: 'Crypto', levelRequired: 3 },
];
