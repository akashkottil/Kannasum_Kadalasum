export const metadata = {
  title: 'Login | Expense Tracker',
  description: 'Sign in to your expense tracker account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-foreground">
            Expense Tracker
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Manage your expenses together
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

