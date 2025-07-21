export default function Login({
  handleLogin,
  isError,
  state,
  isWrong,
  isLodaing,
}) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"></div>

      {/* Lock Screen Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-[10000] p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center">
            {/* Lock Icon */}
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <ion-icon
                name="lock-closed"
                className="text-white text-3xl"
              ></ion-icon>
            </div>

            {/* Title and Description */}
            <h2 className="text-white text-2xl font-bold mb-2">
              Welcome to Chat
            </h2>
            <p className="text-white/70 text-sm mb-8">
              Enter your access code to continue
            </p>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Code Input */}
              <div className="relative">
                <input
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 pl-4 pr-12 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all duration-300 text-center text-lg font-mono tracking-wider"
                  type="password"
                  required
                  placeholder="Type code..."
                  autoFocus
                  autoComplete="off"
                  maxLength="10"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <ion-icon
                    name="key"
                    className="text-white/40 text-xl"
                  ></ion-icon>
                </div>
              </div>

              {/* Error Messages */}
              {isError ? (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-300 text-sm font-medium">
                    {isError.error}
                  </p>
                </div>
              ) : isWrong ? (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-300 text-sm font-medium">Wrong Code</p>
                </div>
              ) : null}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLodaing}
              >
                {isLodaing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <ion-icon name="unlock" className="text-lg"></ion-icon>
                    <span>Unlock Chat</span>
                  </div>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-white/50 text-xs">
                Contact admin for access code
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
