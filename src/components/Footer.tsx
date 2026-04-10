import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Colorizer", href: "#colorizer" },
      { label: "API", href: "/docs" },
      { label: "Pricing", href: "/pricing" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Research",
    links: [
      { label: "How It Works", href: "/research" },
      { label: "Architecture", href: "/research" },
      { label: "Metrics", href: "/research" },
      { label: "Paper", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Team", href: "#about" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "GDPR", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative pt-20 pb-10 border-t border-border/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="relative h-7 w-7">
                <div className="absolute inset-0 rounded-md bg-primary/20" />
                <div className="absolute inset-1.5 rounded-sm bg-primary" />
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.02em]">
                SAR<span className="text-primary">Chroma</span>
              </span>
            </a>
            <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-[200px]">
              Deep learning SAR colorization platform for researchers and enterprises.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/40 mb-4">
                {group.title}
              </p>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-border/30 to-transparent mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground/40">
            © 2026 SARChroma. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[11px] text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[11px] text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
