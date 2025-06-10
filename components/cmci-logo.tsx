export function CmciLogo({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-16 h-16 bg-[#001F5B] rounded-full flex items-center justify-center">
        <span className="text-[#D4AF37] text-2xl font-bold">CMCI</span>
      </div>
      <span className="text-[#001F5B] font-semibold mt-2 text-sm">Camps Bibliques Internationaux</span>
    </div>
  )
}
