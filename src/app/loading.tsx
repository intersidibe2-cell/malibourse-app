export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-green-200 border-t-green-700 animate-spin" />
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );
}
