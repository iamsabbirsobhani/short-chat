import '../styles/typing.scss';

export default function TypingIndicator() {
  return (
    <div className="absolute bottom-full left-4 mb-2 z-20">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-2 border border-white/20 shadow-lg">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
          <span className="text-white/60 text-xs ml-2">typing...</span>
        </div>
      </div>
    </div>
  );
}
