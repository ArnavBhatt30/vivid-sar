import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
    ],
  },
  {
    title: "Project",
    links: [
      { label: "About", href: "#about" },
      { label: "Team", href: "#about" },
      { label: "Contact", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative pt-20 pb-10">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="relative h-7 w-7">
                <div className="absolute inset-0 rounded-lg bg-primary/15" />
                <div className="absolute inset-1.5 rounded-md bg-primary" />
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.02em]">
                SAR<span className="text-primary">Chroma</span>
              </span>
            </Link>
            <p className="text-[13px] text-muted-foreground/50 leading-[1.7] max-w-[200px] font-light">
              Deep learning SAR colorization — a college research project.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground/35 mb-5">
                {group.title}
              </p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") || link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        className="text-[13px] text-muted-foreground/50 hover:text-foreground/80 transition-colors duration-300 font-light"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-[13px] text-muted-foreground/50 hover:text-foreground/80 transition-colors duration-300 font-light"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-border/20 to-transparent mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground/30 font-light">
            © 2026 SARChroma. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[11px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors font-light">
              Privacy Policy
            </a>
            <a href="#" className="text-[11px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors font-light">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
