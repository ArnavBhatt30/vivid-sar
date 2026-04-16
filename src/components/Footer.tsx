import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Colorizer", href: "#colorizer" },
      { label: "API", href: "/docs" },
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
    <footer className="relative pt-16 sm:pt-24 pb-10 sm:pb-12">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      <div className="container mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-20">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 sm:mb-6">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-primary/15" />
                <div className="absolute inset-1.5 rounded-md bg-primary" />
              </div>
              <span className="text-lg font-semibold tracking-[-0.03em]">
                SAR<span className="text-primary">Chroma</span>
              </span>
            </Link>
            <p className="text-sm sm:text-[15px] text-muted-foreground/40 leading-[1.75] max-w-[220px] font-light">
              Deep learning SAR colorization — a college research project.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/30 mb-4 sm:mb-6">
                {group.title}
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") || link.href.startsWith("http") ? (
                      <a href={link.href} className="text-sm sm:text-[15px] text-muted-foreground/40 hover:text-foreground/70 transition-colors duration-300 font-light">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-sm sm:text-[15px] text-muted-foreground/40 hover:text-foreground/70 transition-colors duration-300 font-light">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/[0.05] to-transparent mb-6 sm:mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground/25 font-light">
            © 2026 SARChroma. All rights reserved.
          </p>
          <div className="flex items-center gap-6 sm:gap-8">
            <a href="#" className="text-xs sm:text-sm text-muted-foreground/25 hover:text-muted-foreground/50 transition-colors font-light">Privacy Policy</a>
            <a href="#" className="text-xs sm:text-sm text-muted-foreground/25 hover:text-muted-foreground/50 transition-colors font-light">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
