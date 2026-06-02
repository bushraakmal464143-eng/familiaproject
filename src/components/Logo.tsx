type LogoProps = {
  variant?: "light" | "dark";
  showText?: boolean;
};

export default function Logo({ variant = "dark", showText = true }: LogoProps) {
  const textTone = variant === "light" ? "text-white" : "text-brand-forest";
  const accentTone = variant === "light" ? "text-brand-sun" : "text-brand-accent";

  return (
    <span className="inline-flex items-center">
      {showText ? (
        <span
          className={`text-[1.75rem] font-extrabold tracking-tight drop-shadow-sm sm:text-[1.95rem] ${textTone}`}
        >
          <span className="italic">Ofertas</span>
          <span className={accentTone}>de</span>
          <span className="italic">Camping</span>
          <span className={`ml-0.5 text-[1.05rem] align-top sm:text-[1.15rem] ${accentTone}`}>
            .com
          </span>
        </span>
      ) : (
        <span
          aria-hidden
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border-2 text-base font-black ${
            variant === "light"
              ? "border-white text-white"
              : "border-brand-green text-brand-forest"
          }`}
        >
          OC
        </span>
      )}
    </span>
  );
}
