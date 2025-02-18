import { X } from "lucide-react";

export default function WelcomeModal({ isOpen, onClose, userName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-bl-full -z-1"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-tr-full -z-1"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <img
            src="https://indigenous.arunachal.gov.in/assets/images/logo_ap.png"
            alt="DIA Logo"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, {userName}! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your account has been created successfully. Get ready to explore the rich
            cultural heritage of Arunachal Pradesh.
          </p>
        </div>

        {/* Quick links */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Here's what you can do:
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-left rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 hover:from-blue-100 hover:to-teal-100 dark:hover:from-blue-900/30 dark:hover:to-teal-900/30 transition-colors">
              <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-1">
                Explore Tribes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Discover indigenous communities
              </p>
            </button>
            <button className="p-4 text-left rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-colors">
              <h4 className="font-medium text-purple-600 dark:text-purple-400 mb-1">
                Watch Videos
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View cultural performances
              </p>
            </button>
            <button className="p-4 text-left rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-colors">
              <h4 className="font-medium text-amber-600 dark:text-amber-400 mb-1">
                Browse Festivals
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Find upcoming celebrations
              </p>
            </button>
            <button className="p-4 text-left rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-colors">
              <h4 className="font-medium text-green-600 dark:text-green-400 mb-1">
                Listen Music
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Experience traditional songs
              </p>
            </button>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:from-blue-700 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
}