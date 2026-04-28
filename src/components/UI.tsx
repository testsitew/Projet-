import { cn } from "../lib/utils";
import { useState } from "react";

export const Button = ({ className, variant = "primary", ...props }: any) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-slate-600 hover:bg-slate-100"
  };
  return (
    <button 
      className={cn(
        "px-6 py-2.5 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2",
        variants[variant as keyof typeof variants],
        className
      )} 
      {...props} 
    />
  );
};

export const Logo = ({ className, customLogo }: { className?: string, customLogo?: string | null }) => {
  const [logoError, setLogoError] = useState(false);
  const logoSrc = customLogo || "/logo.png";

  return (
    <div className={cn("flex items-center select-none", className)}>
      {(!logoError || customLogo) ? (
        <img 
          src={logoSrc} 
          alt="Merkez Allimni" 
          className="h-16 w-auto object-contain"
          onError={() => !customLogo && setLogoError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex items-end">
          <div className="relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <div className="w-5 h-5 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-black rotate-[-15deg] rounded-sm" />
                <div className="absolute -right-1 top-1 w-1.5 h-1.5 bg-black rounded-full" />
                <div className="absolute bottom-1 left-1.5 w-2 h-1 bg-black/80 rounded-b-sm" />
              </div>
            </div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-secondary rotate-45 z-0" />
            <div className="text-primary text-5xl font-black italic transform -skew-x-12 leading-none flex items-baseline">
              <span className="relative">A</span>
              <span className="text-secondary -ml-2 font-serif font-bold italic">'</span>
            </div>
          </div>
          <div className="flex flex-col ml-1 -space-y-1">
            <div className="flex items-center">
              {"LLIMNI".split("").map((char, i) => (
                <div key={i} className="relative">
                  {(char === "I" || char === "L" || char === "M") && (
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-secondary rotate-45" />
                  )}
                  <span className="text-primary font-black text-3xl tracking-tighter uppercase leading-none">
                    {char}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-black font-bold text-[10px] uppercase tracking-[0.2em] self-end pr-1 mt-1">
              en ligne
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
