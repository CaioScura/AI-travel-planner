import { siteConfig } from "@/app/lib/content";

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-[10px] bg-gmap-blue shadow-[0_4px_12px_-4px_rgb(26_115_232/0.7)]">
        <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
          <path d="M12 21c-.4-1.4-6-5.6-6-10.2a6 6 0 1 1 12 0C18 15.4 12.4 19.6 12 21Z" fill="#fff" />
          <circle cx="12" cy="10.6" r="2.4" fill="#1a73e8" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight">{siteConfig.name}</span>
    </span>
  );
}