import { createFileRoute } from "@tanstack/react-router";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useCartSync } from "@/hooks/useCartSync";
import { Reveal } from "@/components/Reveal";
import { PowderParticles } from "@/components/PowderParticles";
import productTube from "@/assets/hero-berberine-product.png";
import innerBottle from "@/assets/shop-berberine.webp";
import berberineCapsule from "@/assets/berberine-capsule.webp";
import logoLeaf from "@/assets/logo-leaf.webp";

import heroBg from "@/assets/berberine-hero-mobile.webp";
import heroDesktop from "@/assets/berberine-hero-desktop.webp";
import transparencyHero from "@/assets/transparency-hero.webp";
import {
  ArrowUpRight,
  ArrowRight,
  FlaskConical,
  Mountain,
  Plus,
  Minus,
  Instagram,
  Facebook,
  Check,
  X,
  Star,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

const SITE_URL = "https://betterhealthlabs.in";
const PRODUCT_NAME = "Herbal Berberine HCL Extract";
const PRICE = "₹999";
const MRP = "₹1749";
const PriceTag = ({ className = "" }: { className?: string }) => (
  <span className={`inline-flex items-baseline gap-2 ${className}`}>
    <span className="opacity-60 line-through">{MRP}</span>
    <span>{PRICE}</span>
  </span>
);

const FAQ_ITEMS: { q: string; a: string }[] = [
  { q: "What is berberine?", a: "A plant compound studied for healthy glucose, lipid balance and energy metabolism." },
  { q: "Why 97% purity?", a: "Most brands sit at 70–90%. At 97% HPLC-verified, you get a precise, clinically meaningful dose — not filler." },
  { q: "How do I take it?", a: "500 mg, two to three times daily with meals. Always consult your physician." },
  { q: "Is it third-party tested?", a: "Yes. Every batch is independently verified. A Certificate of Analysis is published for each lot." },
  { q: "Is it safe long-term?", a: "Berberine has a long safety record in clinical research. Consult your physician if on medication." },
  { q: "When will I feel results?", a: "Most customers notice changes in 4–8 weeks of consistent daily use." },
];

function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function ProductJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT_NAME,
    brand: { "@type": "Brand", name: "Beyond Better" },
    description: "97% HPLC-verified Berberine HCL extract. Water-only extraction. Third-party tested in India.",
    image: [productTube],
    category: "DietarySupplement",
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1024" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "999",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#shop`,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function OrgJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Beyond Better",
    url: SITE_URL,
    logo: logoLeaf,
    sameAs: ["https://www.instagram.com/", "https://www.facebook.com/"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beyond Better — 97% HPLC Verified Berberine HCL" },
      { name: "description", content: "97% HPLC-verified Berberine HCL. Water-only extraction. Third-party tested. India's transparent berberine standard." },
      { name: "keywords", content: "berberine, berberine HCL, best berberine India, HPLC berberine, metabolic health" },
      { property: "og:title", content: "Beyond Better — The Transparent Berberine Standard" },
      { property: "og:description", content: "97% HPLC-verified Berberine HCL. Third-party tested. Every batch, every number, in the open." },
      { property: "og:image", content: productTube },
      { property: "og:url", content: SITE_URL },
      { property: "og:type", content: "product" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "preload",
        as: "image",
        href: heroDesktop,
        media: "(min-width: 768px)",
      },
      {
        rel: "preload",
        as: "image",
        href: heroBg,
        media: "(max-width: 767px)",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="bg-background text-foreground pb-20 md:pb-0">
      <OrgJsonLd />
      <ProductJsonLd />
      <FaqJsonLd />
      <Nav />
      <Hero />
      <Comparison />
      <FinalCTA />
      <Benefits />
      <LabReport />
      <SocialProof />
      <Ingredients />
      <ResearchSimple />
      <FAQ />
      <Footer />
      <StickyBuy />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{children}</p>;
}

function CTAButton({ children, href = "#shop", variant = "solid" }: { children: React.ReactNode; href?: string; variant?: "solid" | "ghost" }) {
  if (variant === "ghost") {
    return (
      <a
        href={href}
        className="inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm transition hover:opacity-80"
        style={{ borderColor: "var(--forest)", color: "var(--forest)" }}
      >
        {children} <ArrowRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm transition hover:opacity-90"
      style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
    >
      {children} <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev === (y > 24) ? prev : y > 24));

      if (y > lastY && y > 80) {
        setHidden(true);
        setOpen(false);
      } else if (y < lastY) {
        setHidden(false);
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#shop", label: "Shop" },
    { href: "#benefits", label: "Benefits" },
    { href: "#lab", label: "Transparency" },
    { href: "#reviews", label: "Reviews" },
    { href: "#science", label: "Science" },
    { href: "#faq", label: "FAQ" },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        backdropFilter: scrolled || open ? "blur(14px)" : "none",
        backgroundColor: scrolled || open ? "color-mix(in oklab, var(--ivory) 78%, transparent)" : "transparent",
        borderBottom: scrolled || open ? "1px solid color-mix(in oklab, var(--charcoal) 8%, transparent)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-10">
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setOpen(false); }} className="flex items-center gap-2">
          <img src={logoLeaf} alt="" className="h-5 w-5 object-contain" />
          <span className="font-display text-[13px] tracking-tight" style={{ color: "var(--forest)" }}>
            Beyond Better
          </span>
        </a>
        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col items-end gap-[5px] p-2"
        >
          <span className="block h-px w-5 transition-transform" style={{ background: "var(--forest)", transform: open ? "translateY(6px) rotate(45deg)" : "none" }} />
          <span className="block h-px w-5 transition-opacity" style={{ background: "var(--forest)", opacity: open ? 0 : 1 }} />
          <span className="block h-px w-5 transition-transform" style={{ background: "var(--forest)", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }} />
        </button>
      </div>
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-out"
        style={{ maxHeight: open ? 400 : 0, position: "relative", zIndex: 51 }}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 pb-6 pt-2 lg:px-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={handleClick}
              className="font-display py-2 text-[18px] tracking-tight transition-opacity hover:opacity-60"
              style={{ color: "var(--forest)" }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}




function Hero() {
  return (
    <>
      <h1 className="sr-only">Beyond Better — 97% HPLC Verified Berberine HCL Supplement</h1>
      <DesktopHero />
      <MobileHero />
    </>
  );
}

function DesktopHero() {
  return (
    <section
      className="relative hidden md:block w-full overflow-hidden pointer-events-none"
      style={{
        minHeight: "100svh",
        backgroundImage: `url(${heroDesktop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Soft left vignette for text legibility */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(120,75,15,0.35) 0%, rgba(120,75,15,0.12) 28%, rgba(0,0,0,0) 45%)",
        }}
      />
      <div
        className="relative z-10 flex h-full w-full items-center justify-between pointer-events-none"
        style={{ minHeight: "100svh", paddingLeft: "1vw", paddingRight: "1vw", pointerEvents: "none" }}
      >
        <div className="max-w-[42%] min-w-[320px]" style={{ color: "#1f3a2a" }}>
          <p
            style={{
              fontSize: 8,
              letterSpacing: "0.28em",
              fontWeight: 500,
              opacity: 0.85,
              marginBottom: 16,
            }}
          >
            BEYOND BETTER · BERBERINE HCL
          </p>
          <p
            className="font-display"
            role="presentation"
            style={{
              fontWeight: 500,
              fontSize: "clamp(33px, 3.3vw, 54px)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            Better was<br />never enough.
          </p>
          <p
            style={{
              marginTop: 16,
              fontSize: 11,
              lineHeight: 1.6,
              opacity: 0.9,
              maxWidth: 285,
            }}
          >
            Pure-form berberine, HPLC-verified to 97% purity and crafted to a Japanese precision standard.
          </p>
          <div className="flex items-center gap-5" style={{ marginTop: 28 }}>
            <a
              href="#buy"
              className="flex items-center justify-center"
              style={{
                height: 52,
                padding: "0 28px",
                borderRadius: 12,
                background: "#1f3a2a",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.05em",
                pointerEvents: "auto",
              }}
            >
              Shop Now <span className="ml-2">↗</span>
            </a>
            <a
              href="#science"
              style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", color: "#1f3a2a", pointerEvents: "auto" }}
            >
              Explore the Science ↗
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0" style={{ color: "#1f3a2a" }}>
          {[
            { Icon: FlaskConical, title: "HPLC VERIFIED", sub: "Independent lab certified" },
            { Icon: Mountain, title: "JAPANESE STANDARD", sub: "Precision-grade formulation" },
            { Icon: ShieldCheck, title: "97% PURITY", sub: "Maximum active potency" },
          ].map(({ Icon, title, sub }, i) => (
            <div key={title} className="flex flex-col items-center">
              {i > 0 && (
                <div
                  aria-hidden
                  style={{
                    width: 1,
                    height: 28,
                    background: "currentColor",
                    opacity: 0.18,
                    marginTop: 11,
                    marginBottom: 11,
                  }}
                />
              )}
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 44,
                  height: 44,
                  border: "1px solid rgba(31,58,42,0.18)",
                  background: "rgba(255,253,247,0.35)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <Icon style={{ width: 22, height: 22 }} strokeWidth={1.4} />
              </div>
              <div
                className="text-center"
                style={{ marginTop: 10, fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", lineHeight: 1.2 }}
              >
                {title}
              </div>
              <div
                className="text-center"
                style={{ marginTop: 6, fontSize: 11, opacity: 0.75, letterSpacing: "0.005em", lineHeight: 1.35 }}
              >
                {sub}
              </div>
            </div>
          ))}
        </div>
      </div>



    </section>
  );
}

function MobileHero() {
  return (
    <section
      className="relative md:hidden w-full overflow-hidden pointer-events-none"
      style={{
        minHeight: "90svh",
        backgroundImage: `linear-gradient(180deg, rgba(245,210,140,0.22) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 70%, rgba(180,130,50,0.10) 100%), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="relative z-10 mx-auto flex w-full max-w-[440px] flex-col items-center px-5 text-center pointer-events-none"
        style={{ paddingTop: 76, paddingBottom: 16, minHeight: "90svh", pointerEvents: "none" }}
      >
        <p
          className="font-display"
          role="presentation"
          style={{
            color: "#1f3a2a",
            fontWeight: 500,
            fontSize: "clamp(40px, 11.5vw, 60px)",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
          }}
        >
          Better was<br />never enough.
        </p>
        <p
          style={{
            marginTop: 12,
            color: "#3a4a3a",
            fontSize: 10.5,
            fontWeight: 500,
            letterSpacing: "0.24em",
            lineHeight: 1.7,
          }}
        >
          PURE FORM. PROVEN BY SCIENCE.
          <br />
          CRAFTED FOR RESULTS.
        </p>
        <div style={{ flex: 1, minHeight: "49svh" }} />
        <div className="flex w-full items-start justify-between" style={{ marginTop: 12, color: "#1f3a2a" }}>
          {[
            { Icon: FlaskConical, title: "HPLC VERIFIED", sub: "Third-party tested" },
            { Icon: Mountain, title: "JAPANESE STANDARD", sub: "Precision tested" },
            { Icon: ShieldCheck, title: "97% PURITY", sub: "High purity extract" },
          ].map(({ Icon, title, sub }, i) => (
            <React.Fragment key={title}>
              {i > 0 && (
                <div
                  aria-hidden
                  style={{
                    width: 22,
                    height: 1,
                    background: "currentColor",
                    opacity: 0.18,
                    alignSelf: "center",
                    marginTop: 22,
                    flexShrink: 0,
                  }}
                />
              )}
              <div className="flex flex-1 flex-col items-center text-center px-1">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 44,
                    height: 44,
                    border: "1px solid rgba(31,58,42,0.18)",
                    background: "rgba(255,253,247,0.35)",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <Icon style={{ width: 20, height: 20 }} strokeWidth={1.4} />
                </div>
                <div style={{ marginTop: 8, fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", lineHeight: 1.2 }}>
                  {title}
                </div>
                <div style={{ marginTop: 4, fontSize: 9, opacity: 0.7, letterSpacing: "0.01em", lineHeight: 1.3 }}>
                  {sub}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <a
          href="#buy"
          className="flex items-center justify-center"
          style={{
            marginTop: 20,
            width: "85%",
            height: 54,
            borderRadius: 12,
            background: "#1f3a2a",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          Shop Now <span className="ml-2">↗</span>
        </a>
        <a
          href="#science"
          style={{ marginTop: 12, color: "#1f3a2a", fontSize: 12, fontWeight: 500, letterSpacing: "0.08em" }}
        >
          Explore the Science ↗
        </a>
      </div>
    </section>
  );
}



function TrustStrip() {
  const badges = [
    { icon: FlaskConical, title: "HPLC VERIFIED" },
    { icon: Mountain, title: "JAPANESE STANDARD" },
    { icon: null, label: "97%", title: "VERIFIED PURITY" },
  ];
  return (
    <section className="relative" style={{ background: "#F8F5EF" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 -top-24 md:-top-48 h-24 md:h-48 z-30"
        style={{
          background:
            "linear-gradient(to bottom, rgba(248,245,239,0) 0%, rgba(248,245,239,0.08) 30%, rgba(248,245,239,0.28) 55%, rgba(248,245,239,0.65) 80%, rgba(248,245,239,0.92) 94%, #F8F5EF 100%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-10 lg:px-10">
        <Reveal>
          <div className="flex flex-row items-center justify-center gap-6 sm:gap-16 md:gap-24">
            {badges.map((b) => (
              <div key={b.title} className="flex flex-col items-center text-center">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full border"
                  style={{ borderColor: "#B68D40", color: "#B68D40" }}
                >
                  {b.icon ? (
                    <b.icon className="h-5 w-5" strokeWidth={1.25} />
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 500 }}>{b.label}</span>
                  )}
                </span>
                <h3 className="mt-3 font-display text-[10px] sm:text-[11px]" style={{ color: "#1E1E1E", fontWeight: 500, letterSpacing: "0.18em" }}>
                  {b.title}
                </h3>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    { k: "97% HPLC Purity", us: true, them: false },
    { k: "Third-Party Tested", us: true, them: false },
    { k: "Public COA Reports", us: true, them: false },
    { k: "Water-Only Extraction", us: true, them: false },
    { k: "Japanese HPLC Standard", us: true, them: false },
  ];
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "color-mix(in oklab, var(--ivory) 70%, transparent)" }}>
              The difference
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">Why Beyond Better.</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-2xl" style={{ background: "color-mix(in oklab, var(--ivory) 10%, transparent)" }}>
            <div
              className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 px-5 py-4 text-[10px] uppercase tracking-[0.18em] md:px-8 md:text-xs"
              style={{ borderBottom: "1px solid color-mix(in oklab, var(--ivory) 18%, transparent)", color: "color-mix(in oklab, var(--ivory) 70%, transparent)" }}
            >
              <span></span>
              <span className="text-center font-medium" style={{ color: "var(--ivory)" }}>Beyond Better</span>
              <span className="text-center">Others</span>
            </div>
            {rows.map((r) => (
              <div
                key={r.k}
                className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 px-5 py-4 text-sm md:px-8 md:py-5"
                style={{ borderBottom: "1px solid color-mix(in oklab, var(--ivory) 10%, transparent)" }}
              >
                <span style={{ color: "color-mix(in oklab, var(--ivory) 92%, transparent)" }}>{r.k}</span>
                <span className="flex justify-center">
                  <Check className="h-5 w-5" style={{ color: "var(--gold-soft)" }} strokeWidth={2.5} />
                </span>
                <span className="flex justify-center" style={{ color: "color-mix(in oklab, var(--ivory) 40%, transparent)" }}>
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <a
              href="#shop"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm transition hover:opacity-90"
              style={{ backgroundColor: "var(--ivory)", color: "var(--forest)" }}
            >
              Shop Now <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    "Supports healthy glucose balance",
    "Supports daily energy",
    "Supports metabolic health",
    "Supports overall wellness",
  ];
  return (
    <section id="benefits" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
        <Reveal>
          <SectionLabel>Benefits</SectionLabel>
          <h2 className="mt-4 font-display text-3xl leading-[1.1] md:text-5xl">
            Better balance.
            <br />
            <em style={{ color: "var(--gold-deep)" }}>Better health.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Take control of your metabolic health — naturally.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mx-auto mt-12 max-w-md divide-y" style={{ borderTop: "1px solid color-mix(in oklab, var(--charcoal) 10%, transparent)", borderBottom: "1px solid color-mix(in oklab, var(--charcoal) 10%, transparent)", borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)" }}>
            {items.map((t) => (
              <li key={t} className="flex items-center gap-4 py-4 text-left text-[15px]">
                <Check className="h-4 w-4 shrink-0" style={{ color: "var(--gold-deep)" }} strokeWidth={2} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10">
            <CTAButton>Buy Now — <PriceTag /></CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LabReport() {
  
  return (
    <section id="lab" className="bg-background">
      <Reveal>
        {/* Desktop / tablet: overlay layout */}
        <div
          className="relative hidden w-full overflow-hidden md:block"
          style={{ aspectRatio: "1920 / 1071" }}
        >
          <img
            src={transparencyHero}
            alt="Beyond Better Berberine HCL — lab tested supplement"
            className="absolute inset-0 h-full w-full select-none object-cover"
            width={1920}
            height={1071}
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute z-10 flex flex-col justify-center"
            style={{
              left: "5%",
              top: "8%",
              right: "55%",
              bottom: "8%",
              gap: "clamp(10px, 1.2vw, 16px)",
            }}
          >
            <div style={{ fontSize: "clamp(9px, 1vw, 14px)", letterSpacing: "0.28em", textTransform: "uppercase", color: "#8a6b50", fontWeight: 500 }}>
              Why Beyond Better
            </div>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(20px, 4.2vw, 54px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.01em", color: "#1a1a1a", maxWidth: "450px" }}
            >
              Nothing hidden.
              <br />
              <span style={{ color: "var(--forest)" }}>Every batch verified.</span>
            </h2>

          </div>
        </div>

        {/* Mobile: text overlaid on image, button centered below */}
        <div className="md:hidden">
          <div className="relative w-full">
            <img
              src={transparencyHero}
              alt="Beyond Better Berberine HCL — lab tested supplement"
              className="block w-full h-auto select-none"
              width={1920}
              height={1071}
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-6 pb-6 pt-16"
              style={{
                background: "linear-gradient(to top, rgba(241,236,226,0.95) 0%, rgba(241,236,226,0.75) 55%, rgba(241,236,226,0) 100%)",
              }}
            >
              <div style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#8a6b50", fontWeight: 500 }}>
                Why Beyond Better
              </div>
              <h2 className="font-display" style={{ fontSize: "26px", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.01em", color: "#1a1a1a" }}>
                Nothing hidden.
                <br />
                <span style={{ color: "var(--forest)" }}>Every batch verified.</span>
              </h2>
            </div>
          </div>

        </div>

      </Reveal>
    </section>
  );
}


function SocialProof() {
  const reviews = [
    { q: "I noticed better energy levels within weeks.", n: "Priya R." },
    { q: "Finally a brand I actually trust. The COA sealed it.", n: "Arjun M." },
    { q: "Quality feels far superior to anything else I've tried.", n: "Sneha K." },
  ];
  return (
    <section id="reviews" className="py-20 md:py-28" style={{ background: "#F8F5EF" }}>
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center">
            <div className="flex justify-center gap-1" style={{ color: "var(--gold-deep)" }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="mt-3 font-display text-2xl md:text-3xl">4.8 / 5</p>
            <p className="mt-1 text-sm text-muted-foreground">Trusted by 1,000+ customers</p>
          </div>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.n} delay={i * 0.08}>
              <figure className="text-center md:text-left">
                <div className="flex justify-center gap-0.5 md:justify-start" style={{ color: "var(--gold-deep)" }}>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 font-display text-lg leading-snug">"{r.q}"</blockquote>
                <figcaption className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">— {r.n}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="mt-14 flex justify-center">
            <CTAButton>Shop Now — <PriceTag /></CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Ingredients() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Reveal>
          <img
            src={berberineCapsule}
            alt="Berberine HCL extract"
            className="w-full object-contain"
            width={700}
            height={700}
            loading="lazy"
            decoding="async"
            style={{ aspectRatio: "1 / 1" }}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <SectionLabel>Inside the bottle</SectionLabel>
            <h2 className="mt-4 font-display text-3xl leading-[1.1] md:text-5xl">One ingredient. Done right.</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              Pure Berberine HCL — extracted with water, verified at 97% by HPLC. Nothing else.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t pt-6" style={{ borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)" }}>
              {[
                { n: "97%", l: "Purity" },
                { n: "500mg", l: "Per capsule" },
                { n: "0", l: "Fillers" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-2xl md:text-3xl" style={{ color: "var(--gold-deep)" }}>{s.n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ResearchSimple() {
  const studies = [
    { t: "Glucose Metabolism", d: "Supports healthy glucose response." },
    { t: "Cardiovascular Health", d: "Supports healthy lipid profiles." },
    { t: "Metabolic Health", d: "Supports AMPK — the body's energy switch." },
  ];
  return (
    <section id="science" className="py-20 md:py-28" style={{ background: "#F8F5EF" }}>
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Reveal>
          <SectionLabel>Backed by science</SectionLabel>
          <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">
            42 clinical studies
            <br />
            <em style={{ color: "var(--gold-deep)" }}>support berberine.</em>
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {studies.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08}>
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Study 0{i + 1}</p>
                <h3 className="mt-3 font-display text-xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="mt-12">
            <CTAButton href="/research-library" variant="ghost">View Research Library</CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">Questions, answered.</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div
            className="mt-12 divide-y"
            style={{
              borderTop: "1px solid color-mix(in oklab, var(--charcoal) 10%, transparent)",
              borderBottom: "1px solid color-mix(in oklab, var(--charcoal) 10%, transparent)",
              borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)",
            }}
          >
            {FAQ_ITEMS.map((it, i) => {
              const isOpen = open === i;
              return (
                <div key={it.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="font-display text-base leading-snug md:text-lg">{it.q}</span>
                    <span className="shrink-0">{isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
                  </button>
                  <div className="grid overflow-hidden transition-all duration-500 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                    <div className="min-h-0">
                      <p className="pb-6 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  const bullets = [
    "Supports healthy blood sugar",
    "Helps reduce sugar cravings",
    "Sustained daily energy support",
  ];
  return (
    <section
      id="shop"
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, oklch(0.84 0.105 78) 0%, oklch(0.74 0.135 72) 60%, oklch(0.64 0.14 65) 100%)",
      }}
    >
      <PowderParticles count={16} />
      <div className="relative mx-auto max-w-xl px-6 text-center lg:px-10">
        <Reveal>
          <h2
            className="font-display text-[34px] leading-[1.08] md:text-5xl"
            style={{ color: "var(--forest)" }}
          >
            Supports Better Metabolism.
            <br />
            <span style={{ color: "var(--ivory)" }}>Less Cravings. More Energy.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <ul
            className="mx-auto mt-7 flex max-w-sm flex-col gap-2.5 text-[14px] md:text-[15px]"
            style={{ color: "color-mix(in oklab, var(--forest) 88%, transparent)" }}
          >
            {bullets.map((b) => (
              <li key={b} className="flex items-center justify-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px]"
                  style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
                >
                  ✓
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <img
            src={innerBottle}
            alt="Berberine capsules"
            className="mx-auto mt-10 max-w-full"
            width={384}
            height={576}
            loading="lazy"
            decoding="async"
            style={{ filter: "drop-shadow(0 30px 40px rgba(60,40,10,0.25))" }}
          />
        </Reveal>

        <Reveal delay={0.2}>
          <p
            className="mt-4 text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "color-mix(in oklab, var(--forest) 70%, transparent)" }}
          >
            60 Capsules · 30 Day Supply
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-8 flex flex-col items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]"
              style={{
                backgroundColor: "color-mix(in oklab, var(--forest) 12%, transparent)",
                color: "var(--forest)",
              }}
            >
              42% OFF · LIMITED OFFER
            </span>
            <div className="flex items-baseline justify-center gap-3">
              <span
                className="font-display text-[15px] line-through"
                style={{ color: "color-mix(in oklab, var(--forest) 55%, transparent)" }}
              >
                {MRP}
              </span>
              <span className="font-display text-4xl md:text-5xl" style={{ color: "var(--forest)" }}>
                {PRICE}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <a
            href="#"
            className="mt-7 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full px-9 py-5 text-[15px] font-medium tracking-wide transition hover:opacity-95 active:scale-[0.99]"
            style={{
              backgroundColor: "var(--forest)",
              color: "var(--ivory)",
              boxShadow: "0 14px 30px -10px rgba(30,55,35,0.45)",
            }}
          >
            Get Yours For {PRICE} <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>

        <Reveal delay={0.35}>
          <p
            className="mt-5 text-[11px] tracking-[0.14em]"
            style={{ color: "color-mix(in oklab, var(--forest) 65%, transparent)" }}
          >
            Third Party Tested · Vegan Capsules · No Fillers
          </p>
          <p
            className="mt-2 text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "color-mix(in oklab, var(--forest) 55%, transparent)" }}
          >
            97% Verified Purity · Premium Berberine HCL Extract
          </p>
        </Reveal>
      </div>
    </section>
  );
}


function StickyBuy() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 border-t px-4 py-3 md:hidden"
      style={{
        backgroundColor: "color-mix(in oklab, var(--ivory) 96%, transparent)",
        backdropFilter: "blur(14px)",
        borderColor: "color-mix(in oklab, var(--charcoal) 10%, transparent)",
      }}
    >
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Berberine HCL</span>
        <span className="font-display text-lg" style={{ color: "var(--forest)" }}><PriceTag /></span>
      </div>
      <a
        href="#shop"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition active:opacity-80"
        style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
      >
        <ShoppingBag className="h-4 w-4" /> Buy Now
      </a>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-background py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 border-b pb-10 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={logoLeaf} alt="" className="h-7 w-7 object-contain" />
              <span className="font-display text-base" style={{ color: "var(--forest)" }}>Beyond Better</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The transparent berberine standard.
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Shop</div>
              <ul className="mt-4 space-y-2">
                <li><a href="#shop" className="hover:opacity-60">Berberine HCL</a></li>
                <li><a href="#lab" className="hover:opacity-60">Lab Report</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Learn</div>
              <ul className="mt-4 space-y-2">
                <li><a href="#science" className="hover:opacity-60">Science</a></li>
                <li><a href="#faq" className="hover:opacity-60">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Beyond Better. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
        <p className="mt-4 text-center text-[10px] opacity-60 md:text-left">*These statements have not been evaluated by any food or drug authority. Not intended to diagnose, treat or cure any disease.</p>
      </div>
    </footer>
  );
}
