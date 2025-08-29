
import clsx from "clsx";
import { AvatarsGroup } from "../common/AvatarsGroup";
import { Avatar } from "../common/Avatar";
import { TrackedButtonLink } from "../common/TrackedButtonLink";

// Static hero data to replace BaseHub content
const heroData = {
  customerSatisfactionBanner: {
    text: "99% customer satisfaction",
    avatars: {
      items: [
        { _id: "1", avatar: { src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" } },
        { _id: "2", avatar: { src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" } },
        { _id: "3", avatar: { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" } },
        { _id: "4", avatar: { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=32&h=32&fit=crop&crop=face" } },
      ],
    },
  },
  title: "AI-Powered Website Audit Copilot for Modern Businesses",
  subtitle: "Instantly scan your site, detect broken links, identify content gaps, and discover market opportunities with AI precision.",
  actions: [
    { _id: "1", href: "/scan", label: "Start Free Audit", type: "primary" },
    { _id: "2", href: "/login", label: "Sign In", type: "secondary" },
  ],
};

export const Hero = () => {
  return (
    <section className="relative min-h-[calc(630px-4rem)] overflow-hidden pb-10">
      <div className="absolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] border-b border-border">
        {/* Decorations */}
        <div className="col-span-1 flex h-full items-center justify-center" />
        <div className="col-span-1 flex h-full items-center justify-center border-x border-border" />
        <div className="col-span-1 flex h-full items-center justify-center" />
      </div>
      {/* --- */}
      <figure className="pointer-events-none absolute -bottom-[70%] left-1/2 z-0 block aspect-square w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[200px]" />
      <figure className="pointer-events-none absolute left-[4vw] top-[64px] z-20 hidden aspect-square w-[32vw] rounded-full bg-background/50 opacity-50 blur-[100px] md:block" />
      <figure className="pointer-events-none absolute bottom-[-50px] right-[7vw] z-20 hidden aspect-square w-[30vw] rounded-full bg-background/50 opacity-50 blur-[100px] md:block" />
      {/* --- */}
      <div className="relative z-10 flex flex-col divide-y divide-border pt-[35px]">
        <div className="flex flex-col items-center justify-end">
          <div className="flex items-center gap-2 !border !border-b-0 border-border px-4 py-2">
            <AvatarsGroup>
              {heroData.customerSatisfactionBanner.avatars.items.map(({ avatar, _id }) => (
                <Avatar key={_id} src={avatar.src} />
              ))}
            </AvatarsGroup>
            <p className="text-sm tracking-tight text-muted-foreground">
              {heroData.customerSatisfactionBanner.text}
            </p>
          </div>
        </div>
        <div>
          <div className="mx-auto flex min-h-[288px] max-w-[80vw] shrink-0 flex-col items-center justify-center gap-2 px-2 py-4 sm:px-16 lg:px-24">
            <h1 className="!max-w-screen-lg text-pretty text-center text-[clamp(32px,7vw,64px)] font-medium leading-none tracking-[-1.44px] text-foreground md:tracking-[-2.16px]">
              {heroData.title}
            </h1>
            <h2 className="text-md max-w-2xl text-pretty text-center text-muted-foreground md:text-lg">
              {heroData.subtitle}
            </h2>
          </div>
        </div>
        <div className="flex items-start justify-center px-8 sm:px-24">
          <div className="flex w-full max-w-[80vw] flex-col items-center justify-start md:!max-w-[392px]">
            {heroData.actions?.map(({ href, label, type, _id }) => (
              <TrackedButtonLink
                key={_id}
                analyticsKey="hero"
                className={clsx(
                  "!h-14 flex-col items-center justify-center rounded-none !text-base",
                  type === "primary"
                    ? "flex w-full"
                    : "max-w-sm:!border-x-0 flex w-full !border-x !border-y-0 border-border !bg-transparent backdrop-blur-xl transition-colors duration-150 hover:!bg-black/5 dark:hover:!bg-white/5",
                )}
                href={href}
                intent={type as "primary" | "secondary"}
                name="cta_click"
              >
                {label}
              </TrackedButtonLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
