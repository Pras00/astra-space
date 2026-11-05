import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  readonly index?: string;
  readonly tag?: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly align?: "left" | "center";
  readonly className?: string;
}

export function SectionHeading({
  index,
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
      {(index || tag) && (
        <div className="flex items-center gap-3 font-mono text-2xs uppercase tracking-widest text-ash">
          {index && <span className="text-signal font-semibold">{index}</span>}
          {index && tag && <span className="w-4 h-px bg-hairline-strong" />}
          {tag && <span>{tag}</span>}
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-bone uppercase leading-none">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-xl text-ash text-sm sm:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
