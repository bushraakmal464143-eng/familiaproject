type LogoProps = {
  variant?: "light" | "dark";
  showText?: boolean;
};

export default function Logo({ variant = "dark", showText = true }: LogoProps) {
  const textTone = variant === "light" ? "text-white" : "text-brand-forest";
  const accentTone = variant === "light" ? "text-brand-sun" : "text-brand-accent";

  return (
    <span className="inline-flex max-w-full items-center">
      {showText ? (
        <span
          className={`text-base font-extrabold leading-tight tracking-tight sm:text-lg ${textTone}`}
        >
          <span className="italic">Ofertas</span>
          <span className={accentTone}>de</span>
          <span className="italic">Camping</span>
          <span className={`ml-0.5 text-[0.65rem] align-top sm:text-xs ${accentTone}`}>
            .com
          </span>
        </span>
      ) : (
        <span
          aria-hidden
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-black ${
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
