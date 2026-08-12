export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-9 bg-gray-200 rounded flex-1"></div>
        <div className="h-9 bg-gray-200 rounded w-9"></div>
        <div className="h-9 bg-gray-200 rounded w-9"></div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export function Spinner({ size = 32, color = 'white' }) {
  return (
    <div
      className="inline-block animate-spin rounded-full border-4 border-current border-t-transparent"
      style={{ width: size, height: size, color, borderTopColor: 'transparent' }}
    />
  );
}
