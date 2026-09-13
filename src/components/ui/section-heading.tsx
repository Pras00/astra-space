import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  tag?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  tag,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {tag && (
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-sky-400">
          <span className="w-6 h-[1px] bg-sky-500/50" />
          <span>{tag}</span>
        </div>
      )}
      <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-slate-400 text-sm sm:text-base leading-relaxed font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
}
