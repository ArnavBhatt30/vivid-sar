import { motion } from "framer-motion";
import { Brain, Layers, Cpu, Zap, ArrowRight, BarChart3, Target, Clock } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const steps = [
  { icon: Layers, title: "SAR Input", desc: "Raw radar intensity data from Sentinel-1 or custom sources is ingested and preprocessed." },
  { icon: Brain, title: "GAN Processing", desc: "A conditional GAN with U-Net generator and PatchGAN discriminator performs pixel-level translation." },
  { icon: Cpu, title: "Feature Extraction", desc: "Multi-scale feature maps capture both fine textures and large-scale structures." },
  { icon: Zap, title: "RGB Output", desc: "High-fidelity colorized satellite imagery ready for analysis and interpretation." },
];

const metrics = [
  { label: "SSIM Score", value: "0.94", icon: Target, desc: "Structural similarity" },
  { label: "Inference Time", value: "2.3s", icon: Clock, desc: "Per 4K image" },
  { label: "PSNR", value: "28.7 dB", icon: BarChart3, desc: "Peak signal-to-noise" },
  { label: "FID Score", value: "12.4", icon: Zap, desc: "Fréchet inception distance" },
];

const ResearchPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-radial-hero" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80 mb-4">Research</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] mb-6">How It Works</h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Our GAN-based architecture translates SAR imagery to photorealistic RGB using adversarial training on paired satellite datasets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease }}
                  className="glass-elevated rounded-2xl p-6 relative group hover:border-border/40 transition-all duration-300"
                >
                  {i < steps.length - 1 && (
                    <ArrowRight size={14} className="absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground/30 hidden lg:block" />
                  )}
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <step.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-20 bg-mesh">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }} className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80 mb-4">Performance</p>
            <h2 className="text-3xl font-bold tracking-[-0.03em]">Model Metrics</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease }}
                className="glass-elevated rounded-2xl p-5 text-center group hover:border-primary/20 transition-all duration-300"
              >
                <m.icon size={18} className="text-primary mx-auto mb-3" />
                <p className="text-2xl font-bold tracking-[-0.03em]">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto glass-elevated rounded-2xl p-8">
            <h3 className="text-lg font-semibold tracking-[-0.02em] mb-4">Architecture Details</h3>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p><span className="text-foreground font-medium">Generator:</span> U-Net with skip connections, 8 encoder blocks, instance normalization, and LeakyReLU activation.</p>
              <p><span className="text-foreground font-medium">Discriminator:</span> PatchGAN (70×70 receptive field) with spectral normalization for training stability.</p>
              <p><span className="text-foreground font-medium">Loss:</span> Combined L1 reconstruction loss + adversarial loss (λ=100) + perceptual VGG loss for texture fidelity.</p>
              <p><span className="text-foreground font-medium">Training:</span> 200 epochs on 50K paired SAR-optical patches from Sentinel-1/2, Adam optimizer (lr=2e-4, β1=0.5).</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchPage;
