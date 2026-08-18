import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Send, CheckCircle2, Download, ExternalLink, Code2, Cpu, Globe, Sparkles, User, Briefcase, Rocket, FileText } from 'lucide-react';

interface InfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

type TabType = 'MENU' | 'ABOUT' | 'PROJECTS' | 'EXPERIENCE' | 'RESUME' | "LET'S BUILD";

export const InfoDrawer: React.FC<InfoDrawerProps> = ({
  isOpen,
  onClose,
  initialTab = 'MENU',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('MENU');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Web Application',
    budget: '$5k - $10k',
    message: '',
  });

  useEffect(() => {
    if (initialTab && initialTab !== 'MENU') {
      setActiveTab(initialTab as TabType);
    } else {
      setActiveTab('MENU');
    }
  }, [initialTab, isOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        projectType: 'Web Application',
        budget: '$5k - $10k',
        message: '',
      });
    }, 4000);
  };

  const navItems = [
    { id: 'ABOUT', label: 'ABOUT', desc: 'Background & Philosophy', icon: User },
    { id: 'PROJECTS', label: 'PROJECTS', desc: 'Featured Work & Case Studies', icon: Rocket },
    { id: 'EXPERIENCE', label: 'EXPERIENCE', desc: 'Leadership & Engineering', icon: Briefcase },
    { id: 'RESUME', label: 'RESUME', desc: 'Technical Skills & CV', icon: FileText },
    { id: "LET'S BUILD", label: "LET'S BUILD", desc: 'Commission & Consultation', icon: Sparkles },
  ];

  const projects = [
    {
      title: 'Aether Canvas',
      category: 'WebGL & Generative AI',
      desc: 'Real-time node-based shader synth combining 3D WebGL scenes with generative AI texture synthesis.',
      tech: ['React', 'Three.js', 'WebGL', 'Tailwind'],
      link: '#',
    },
    {
      title: 'NeuronFlow OS',
      category: 'Distributed Systems',
      desc: 'High-throughput real-time stream processor for high-frequency data pipelines and AI agent orchestration.',
      tech: ['TypeScript', 'Rust', 'WebSockets', 'Tailwind'],
      link: '#',
    },
    {
      title: 'Hyperion Design System',
      category: 'UI/UX & Design Tokens',
      desc: 'Ultra-fast, high-contrast dark-mode component architecture built for high-scale enterprise tools.',
      tech: ['React', 'Framer Motion', 'Tailwind CSS'],
      link: '#',
    },
    {
      title: 'OmniVanguard AI',
      category: 'LLM Multi-Agent System',
      desc: 'Autonomous multi-agent system executing real-time code refactoring and performance profiling.',
      tech: ['Python', 'TypeScript', 'Docker', 'OpenAI'],
      link: '#',
    },
  ];

  const experience = [
    {
      role: 'Team Lead & Creative Director',
      company: 'Apex Vanguard Labs',
      period: '2024 — Present',
      desc: 'Directing frontend architecture and engineering teams for real-time 3D and AI-driven client dashboards.',
    },
    {
      role: 'Full Stack Engineer Intern',
      company: 'Quantum Dynamics',
      period: '2023 — 2024',
      desc: 'Architected micro-frontend systems, reducing web bundle sizes by 42% and implementing custom WebGL visualizers.',
    },
    {
      role: 'Hackathon Lead & Open Source Dev',
      company: 'Global Tech Community',
      period: '2022 — Present',
      desc: 'Won 4 national hackathons building AI tools; active maintainer of generative UI open-source packages.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-xl md:max-w-2xl bg-[#333333] border-l border-white/10 text-white shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#333333]/90 backdrop-blur-md border-b border-white/10">
              <div className="flex items-center gap-3">
                {activeTab !== 'MENU' && (
                  <button
                    onClick={() => setActiveTab('MENU')}
                    className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-[#CCFF00] transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h3 className="font-display text-xl tracking-wider text-white uppercase flex items-center gap-2">
                    {activeTab === 'MENU' ? 'NAVIGATION' : activeTab}
                  </h3>
                  <p className="font-mono text-xs text-[#CCFF00]">ARPAN // DIGITAL PORTFOLIO</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-white/20 hover:border-[#CCFF00] bg-white/5 hover:bg-[#CCFF00] text-white hover:text-black flex items-center justify-center transition-all duration-300 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {/* MENU TAB */}
              {activeTab === 'MENU' && (
                <div className="space-y-4">
                  <p className="font-mono text-xs text-white/50 tracking-widest uppercase mb-6">
                    // SELECT DESTINATION
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id as TabType)}
                          className="group relative flex items-center justify-between p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-[#CCFF00] hover:text-black transition-all duration-300 text-left overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-lg border border-white/20 group-hover:border-black/30 flex items-center justify-center bg-black/20 group-hover:bg-black text-[#CCFF00] group-hover:text-[#CCFF00]">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-display text-2xl tracking-wider uppercase">
                                {item.label}
                              </h4>
                              <p className="font-sans text-xs text-white/60 group-hover:text-black/80 font-medium">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-lg group-hover:translate-x-1 transition-transform relative z-10">
                            →
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ABOUT TAB */}
              {activeTab === 'ABOUT' && (
                <div className="space-y-6 font-sans">
                  <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                    <h4 className="font-display text-2xl text-[#CCFF00] uppercase tracking-wide">
                      BIO & VISION
                    </h4>
                    <p className="text-white/80 leading-relaxed text-sm md:text-base">
                      I am Arpan — a Computer Science undergrad, engineering team lead, and creative technologist. I bridge high-level system architecture with extreme UI aesthetic precision.
                    </p>
                    <p className="text-white/70 leading-relaxed text-sm">
                      My work revolves around real-time 3D graphics, generative UI systems, distributed micro-architectures, and high-impact digital experiences. I lead cross-functional engineering teams to build software that scales effortlessly and looks legendary.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <span className="text-white/40 block">ROLE</span>
                      <span className="text-white font-semibold text-sm">Team Lead & Developer</span>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <span className="text-white/40 block">FOCUS</span>
                      <span className="text-[#CCFF00] font-semibold text-sm">WebGL & AI Systems</span>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <span className="text-white/40 block">EDUCATION</span>
                      <span className="text-white font-semibold text-sm">B.S. Computer Science</span>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <span className="text-white/40 block">LOCATION</span>
                      <span className="text-white font-semibold text-sm">Global / Remote</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === 'PROJECTS' && (
                <div className="space-y-6">
                  <p className="font-mono text-xs text-white/50 tracking-widest uppercase">
                    // SELECTED WORKS & ARCHITECTURE
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl border border-white/10 bg-white/5 hover:border-[#CCFF00]/50 transition-all space-y-3 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-[#CCFF00] uppercase tracking-wider">
                            {proj.category}
                          </span>
                          <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-[#CCFF00] transition-colors" />
                        </div>
                        <h4 className="font-display text-xl tracking-wide uppercase text-white group-hover:text-[#CCFF00] transition-colors">
                          {proj.title}
                        </h4>
                        <p className="font-sans text-xs text-white/70 leading-relaxed">
                          {proj.desc}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {proj.tech.map((t, i) => (
                            <span
                              key={i}
                              className="font-mono text-[10px] px-2.5 py-1 rounded bg-white/10 text-white/80"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXPERIENCE TAB */}
              {activeTab === 'EXPERIENCE' && (
                <div className="space-y-6">
                  <p className="font-mono text-xs text-white/50 tracking-widest uppercase">
                    // LEADERSHIP & CAREER TRACK
                  </p>
                  <div className="relative border-l border-white/20 pl-6 space-y-8 ml-2">
                    {experience.map((item, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#333333] border-2 border-[#CCFF00] group-hover:bg-[#CCFF00] transition-colors" />
                        <span className="font-mono text-xs text-[#CCFF00]">{item.period}</span>
                        <h4 className="font-display text-xl uppercase text-white mt-1">
                          {item.role}
                        </h4>
                        <p className="font-mono text-xs text-white/50 uppercase mb-2">
                          {item.company}
                        </p>
                        <p className="font-sans text-xs text-white/70 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RESUME TAB */}
              {activeTab === 'RESUME' && (
                <div className="space-y-6 font-sans">
                  <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-2xl text-white uppercase">CURRICULUM VITAE</h4>
                      <button
                        onClick={() => alert("Downloading Arpan's Resume (PDF)...")}
                        className="font-mono text-xs px-4 py-2 rounded-lg bg-[#CCFF00] text-black font-bold flex items-center gap-2 hover:bg-white transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>DOWNLOAD CV</span>
                      </button>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Comprehensive technical skill set spanning frontend architecture, WebGL graphics programming, distributed cloud backends, and creative direction.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-mono text-xs text-[#CCFF00] uppercase tracking-widest">// CORE COMPETENCIES</h5>
                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      {[
                        'React & Next.js',
                        'Three.js & WebGL',
                        'TypeScript & ESNext',
                        'Tailwind CSS v4',
                        'Node.js & Python',
                        'Framer Motion',
                        'System Architecture',
                        'Team Leadership',
                      ].map((skill, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-white/10 bg-white/5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
                          <span className="text-white/90">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LET'S BUILD / CONTACT TAB */}
              {activeTab === "LET'S BUILD" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-display text-3xl text-[#CCFF00] uppercase">START A PROJECT</h4>
                    <p className="font-sans text-xs text-white/70">
                      Have a vision for a world-class application or creative system? Drop a line and let's craft something extraordinary.
                    </p>
                  </div>

                  {formSubmitted ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-8 rounded-2xl border border-[#CCFF00] bg-[#CCFF00]/10 text-center space-y-4"
                    >
                      <CheckCircle2 className="w-12 h-12 text-[#CCFF00] mx-auto" />
                      <h4 className="font-display text-2xl text-white uppercase">MESSAGE TRANSMITTED</h4>
                      <p className="font-sans text-xs text-white/80">
                        Thank you! Your message has been routed to Arpan's direct inbox. You will receive a response within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-6 pt-2">
                      {/* Name Input */}
                      <div className="space-y-1">
                        <label className="font-mono text-xs text-white/60 uppercase block">YOUR NAME *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Alex Vance"
                          className="w-full bg-transparent border-b border-white/30 focus:border-[#CCFF00] outline-none transition-colors py-3 text-white placeholder-white/30 font-sans text-sm"
                        />
                      </div>

                      {/* Email Input */}
                      <div className="space-y-1">
                        <label className="font-mono text-xs text-white/60 uppercase block">EMAIL ADDRESS *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="w-full bg-transparent border-b border-white/30 focus:border-[#CCFF00] outline-none transition-colors py-3 text-white placeholder-white/30 font-sans text-sm"
                        />
                      </div>

                      {/* Project Type Select */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-mono text-xs text-white/60 uppercase block">PROJECT TYPE</label>
                          <select
                            value={formData.projectType}
                            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                            className="w-full bg-transparent border-b border-white/30 focus:border-[#CCFF00] outline-none transition-colors py-3 text-white font-sans text-sm cursor-pointer [&>option]:bg-[#333333] [&>option]:text-white"
                          >
                            <option value="Web Application">Web Application</option>
                            <option value="3D / WebGL Experience">3D / WebGL Experience</option>
                            <option value="AI Integration">AI Integration</option>
                            <option value="Full System Lead">Full System Lead</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-xs text-white/60 uppercase block">BUDGET RANGE</label>
                          <select
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full bg-transparent border-b border-white/30 focus:border-[#CCFF00] outline-none transition-colors py-3 text-white font-sans text-sm cursor-pointer [&>option]:bg-[#333333] [&>option]:text-white"
                          >
                            <option value="<$5k">&lt;$5k</option>
                            <option value="$5k - $10k">$5k - $10k</option>
                            <option value="$10k - $25k">$10k - $25k</option>
                            <option value="$25k+">$25k+</option>
                          </select>
                        </div>
                      </div>

                      {/* Message Textarea */}
                      <div className="space-y-1">
                        <label className="font-mono text-xs text-white/60 uppercase block">PROJECT DETAILS *</label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell me about your goals, timelines, and technical requirements..."
                          className="w-full bg-transparent border-b border-white/30 focus:border-[#CCFF00] outline-none transition-colors py-3 text-white placeholder-white/30 font-sans text-sm resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-[#CCFF00] text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                      >
                        <Send className="w-4 h-4" />
                        <span>SUBMIT COMMISSION REQUEST</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
