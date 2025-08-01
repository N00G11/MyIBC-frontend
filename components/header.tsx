import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  size?: "small" | "medium" | "large";
  showTitle?: boolean;
  title?: string;
  className?: string;
}

export function Header({ size = "medium", showTitle = true, title = "MyIBC", className = "" }: HeaderProps) {
  const logoSizes = {
    small: { width: 60, height: 60 },
    medium: { width: 80, height: 80 },
    large: { width: 120, height: 120 }
  };

  const titleSizes = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-3xl"
  };

  return (
    <header className={`flex items-center justify-center py-6 ${className}`}>
      <Link href="/" className="flex flex-col items-center space-y-3">
        <Image
          src="/CMCI.png"
          alt="CMCI Logo"
          width={logoSizes[size].width}
          height={logoSizes[size].height}
          className="object-contain"
          priority
        />
        {showTitle && (
          <h1 className={`font-bold text-[#001F5B] ${titleSizes[size]} text-center`}>
            {title}
          </h1>
        )}
      </Link>
    </header>
  );
}
