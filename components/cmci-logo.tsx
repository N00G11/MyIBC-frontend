import Image from 'next/image'

export function CmciLogo({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center">
        <Image 
          src="/CMCI.png" 
          alt="CMCI Logo" 
          width={64} 
          height={64}
          className="object-contain rounded-full"
        />
      </div>
      <span className="text-[#001F5B] font-semibold mt-2 text-sm text-center">Camps Bibliques Internationaux</span>
    </div>
  )
}
