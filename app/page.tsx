import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <main className="w-full max-w-4xl space-y-12 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Expense Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track, manage, and analyze your daily expenses together. Share your spending with your partner and stay on top of your finances.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize your spending patterns with interactive charts and insights
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Shared Access</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Collaborate with your partner in real-time on expense tracking
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold mb-2">Organized Categories</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Customize categories and subcategories to match your needs
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
