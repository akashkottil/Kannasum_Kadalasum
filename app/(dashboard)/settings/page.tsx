export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-lg font-semibold mb-4">Partner Management</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Connect with your partner to share expenses
        </p>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Partner linking coming soon
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Category management coming soon
        </div>
      </div>
    </div>
  );
}

