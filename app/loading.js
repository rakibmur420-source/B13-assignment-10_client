export default function Loading() {
  return (
    <main className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
        </div>
        <p className="text-gray-400 mt-4 font-serif">Loading...</p>
      </div>
    </main>
  );
}