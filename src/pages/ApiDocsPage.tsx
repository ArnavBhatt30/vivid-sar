import { motion } from "framer-motion";
import { Copy, Check, Code, Terminal, Globe, Key } from "lucide-react";
import { useState } from "react";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const endpoints = [
  {
    method: "POST",
    path: "/v1/colorize",
    desc: "Submit a SAR image for colorization",
    code: `curl -X POST https://api.sarchroma.ai/v1/colorize \\
  -H "Authorization: Bearer sk-sar-..." \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@sentinel1_scan.tiff" \\
  -F "source=sentinel1" \\
  -F "resolution=4096"`,
  },
  {
    method: "GET",
    path: "/v1/status/:id",
    desc: "Check colorization job status",
    code: `curl https://api.sarchroma.ai/v1/status/job_abc123 \\
  -H "Authorization: Bearer sk-sar-..."`,
  },
  {
    method: "GET",
    path: "/v1/results/:id",
    desc: "Download the colorized output",
    code: `curl https://api.sarchroma.ai/v1/results/job_abc123 \\
  -H "Authorization: Bearer sk-sar-..." \\
  -o colorized_output.tiff`,
  },
];

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

const ApiDocsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-radial-hero" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80 mb-4">Developer</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] mb-6">API Reference</h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">Integrate SAR colorization into your pipeline with our REST API.</p>
          </motion.div>
        </div>
      </section>

      {/* Auth section */}
      <section className="pb-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }} className="glass-elevated rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key size={16} className="text-primary" />
              <h2 className="text-sm font-semibold">Authentication</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-3">All requests require a Bearer token. Get your API key from Settings → API Access.</p>
            <div className="bg-secondary/60 rounded-lg p-3 flex items-center justify-between">
              <code className="text-xs text-foreground/80 font-mono">Authorization: Bearer sk-sar-your-api-key</code>
              <CopyButton text="Authorization: Bearer sk-sar-your-api-key" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="pb-28">
        <div className="container mx-auto px-6 max-w-3xl space-y-5">
          {endpoints.map((ep, i) => (
            <motion.div
              key={ep.path}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease }}
              className="glass-elevated rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-border/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    ep.method === "POST" ? "bg-emerald-400/10 text-emerald-400" : "bg-primary/10 text-primary"
                  }`}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-foreground">{ep.path}</code>
                </div>
                <p className="text-xs text-muted-foreground">{ep.desc}</p>
              </div>
              <div className="p-4 bg-secondary/30 relative">
                <div className="absolute top-3 right-3">
                  <CopyButton text={ep.code} />
                </div>
                <pre className="text-xs text-foreground/80 font-mono whitespace-pre-wrap overflow-x-auto">{ep.code}</pre>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ApiDocsPage;
