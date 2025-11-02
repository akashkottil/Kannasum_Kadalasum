# Expense Tracker

A collaborative expense tracking web application for couples to manage, analyze, and share their daily expenses together.

## Features

### Core Features

- **Expense Categories**: 8 default categories (Food, Petrol, Loan, Given to Friends, Rent, Shopping, Recharge, Investments)
- **Subcategories**: Organize expenses further with customizable subcategories
- **Expense Management**: Add, edit, and delete expenses with details (amount, category, date, time, notes)
- **Partner Linking**: Connect with your partner for shared expense tracking
- **Real-time Sync**: Shared data syncs in real-time using Supabase
- **Analytics Dashboard**: Visual insights with pie charts, bar charts, and comparisons
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works seamlessly on mobile and desktop

### Default Categories

- 🍽️ Food (Breakfast, Lunch, Dinner, Snacks, Coffee)
- ⛽ Petrol (Fuel, Service, Accessories)
- 💳 Loan (EMI, Interest, Principal)
- 👥 Given to Friends (Loan, Gift, Shared Expense)
- 🏠 Rent (Monthly Rent, Utilities, Maintenance)
- 🛍️ Shopping (Clothes, Electronics, Gifts, Household, Groceries)
- 📱 Recharge (Mobile, Internet, DTH, OTT)
- 📈 Investments (Mutual Funds, Crypto, Stocks, SIPs, FD)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components inspired by shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API + Zustand
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from Settings > API

4. Configure environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up the database:
   - Run the SQL migrations in `supabase/migrations/` in your Supabase SQL editor:
     1. `001_initial_schema.sql` - Creates all tables
     2. `002_row_level_security.sql` - Sets up RLS policies
   - Run the seed data in `supabase/config/seed.sql` to populate default categories

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Tables

- **users**: User accounts (managed by Supabase Auth)
- **partners**: Partner relationships between users
- **categories**: Main expense categories (default + custom)
- **subcategories**: Subcategories for organization
- **expenses**: Expense records
- **partner_invitations**: Invitation tracking for partner linking

### Row Level Security (RLS)

All tables have RLS enabled to ensure users can only access their own data and shared partner data.

## Project Structure

```
expense-tracker/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── layout.tsx
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── expenses/
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── charts/              # Chart components
│   ├── expenses/            # Expense-related components
│   ├── categories/          # Category management
│   ├── dashboard/           # Dashboard widgets
│   └── shared/              # Shared components
├── context/                 # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   ├── ThemeContext.tsx     # Theme management
│   └── PartnerContext.tsx   # Partner state
├── lib/                     # Utilities and helpers
│   ├── supabase/           # Supabase client configs
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript definitions
├── supabase/               # Database files
│   ├── migrations/         # SQL migrations
│   └── config/             # Seed data
├── middleware.ts           # Auth middleware
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Future Enhancements

- Budget goals per category
- PDF export for monthly reports
- Split expense functionality
- Push notifications/reminders
- Receipt photo attachments
- Multi-currency support
- Recurring expenses
- Advanced analytics and predictions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Deployment

This project can be easily deployed to Vercel. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Support

For issues and questions, please open an issue on the repository.
