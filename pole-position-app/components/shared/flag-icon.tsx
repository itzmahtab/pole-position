import { cn } from "@/lib/utils";

const COUNTRY_ISO: Record<string, string> = {
  Bahrain: "bh", "Saudi Arabia": "sa", Australia: "au", Japan: "jp",
  China: "cn", USA: "us", "United States": "us", Italy: "it",
  Monaco: "mc", Canada: "ca", Spain: "es", Austria: "at", UK: "gb",
  "United Kingdom": "gb", Hungary: "hu", Belgium: "be", Netherlands: "nl",
  Azerbaijan: "az", Singapore: "sg", Mexico: "mx", Brazil: "br",
  Qatar: "qa", UAE: "ae", "United Arab Emirates": "ae", France: "fr",
  Germany: "de", Portugal: "pt", Turkey: "tr", Russia: "ru",
};

interface FlagIconProps {
  country: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-3 w-5",
  md: "h-4 w-6",
  lg: "h-6 w-10",
};

export function FlagIcon({ country, className, size = "md" }: FlagIconProps) {
  const iso = COUNTRY_ISO[country] ?? "un";

  return (
    <img
      src={`https://flagcdn.com/w160/${iso}.png`}
      alt={`${country} flag`}
      loading="lazy"
      className={cn(
        "rounded-sm object-cover ring-1 ring-white/10",
        sizeMap[size],
        className
      )}
    />
  );
}

export { COUNTRY_ISO };
