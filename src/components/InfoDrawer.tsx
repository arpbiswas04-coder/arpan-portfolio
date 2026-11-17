import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Send, CheckCircle2, Download, ExternalLink, Code2, Cpu, Globe, Sparkles, User, Briefcase, Rocket, FileText, Github, Linkedin, Award } from 'lucide-react';
import { MediaLightbox } from './MediaLightbox';
import { supabase } from '../lib/supabase';

const projectImages = import.meta.glob<string>('../../projects/*.{png,jpg,jpeg}', { eager: true, query: '?url', import: 'default' });
const certificateImages = import.meta.glob<string>('../../certificates/*.{png,jpg,jpeg}', { eager: true, query: '?url', import: 'default' });
const gallery = (prefix: string) => Object.entries(projectImages)
  .filter(([path]) => path.split('/').pop()!.toLowerCase().startsWith(prefix.toLowerCase()))
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url);
// Original media stays available in the lightbox; cards use smaller previews.
const thumbnailByUrl = Object.fromEntries(
  [...Object.entries(projectImages), ...Object.entries(certificateImages)].map(([path, url]) =>
    [url, `/thumbnails/${encodeURIComponent(path.split('/').pop()!)}.jpg`])
);
const thumbnail = (url: string) => thumbnailByUrl[url] ?? `/thumbnails/${encodeURIComponent(url.split('/').pop()!)}.jpg`;

const certificates = [
  { title: "Bharatiya Antariksh Hackathon", src: certificateImages["../../certificates/Bhartiya Antariksh Hackathon.jpeg"] },
  { title: "Build with Bharat 2.0", src: certificateImages["../../certificates/Build wih Bharat 2.0.jpg"] },
  { title: "Codevoyage 2026", src: certificateImages["../../certificates/Codevoyage 2026.jpeg"] },
  { title: "Hack4Haldia 2026 (MLH)", src: certificateImages["../../certificates/Hack4Haldia.jpeg"] },
  { title: "Hackyard 2026", src: certificateImages["../../certificates/Hackyard 2026.jpg"] },
  { title: "MLH Hacktoberfest 2026", src: certificateImages["../../certificates/MLH Hacktoberfest 2026.png"] },
  { title: "NASA Space Apps Challenge 2026, Haldia", src: certificateImages["../../certificates/Nasa Space Apps Challenge 2026.jpeg"] },
  { title: "Tejas India Hackathon 2026", src: certificateImages["../../certificates/Tejas India Hackathon 2026.jpg"] },
  { title: "WhyCode4U × IIT Guwahati Hackathon 2026", src: certificateImages["../../certificates/WhyCode4U.png"] },
  { title: "Artificial Intelligence Fundamentals — IBM", src: certificateImages["../../certificates/IBM.jpeg"] },
  { title: "Engineer AI Agents with Agent Development Kit (ADK) — Google Cloud", src: certificateImages["../../certificates/Google Cloud.png"] },
  { title: "Build with AI Agent Builder Camp — GeeksforGeeks × Google for Developers", src: certificateImages["../../certificates/Geeks for Geeks.jpeg"] },
  { title: "Introduction to Model Context Protocol — Anthropic", src: certificateImages["../../certificates/Anthropic.png"] },
];

interface InfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

type TabType = 'MENU' | 'ABOUT' | 'PROJECTS' | 'EXPERIENCE' | 'CERTIFICATES' | 'RESUME' | "LET'S BUILD";

type TimelineItem =
  | { type: 'year'; role: string; company: string; period: string }
  | { type: 'event'; title: string; desc: string };

export const InfoDrawer: React.FC<InfoDrawerProps> = ({
  isOpen,
  onClose,
  initialTab = 'MENU',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('MENU');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });

  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    media: string[];
    currentIndex: number;
  }>({
    isOpen: false,
    media: [],
    currentIndex: 0,
  });

  const openLightbox = (media: string[], index: number = 0) => {
    setLightboxState({
      isOpen: true,
      media,
      currentIndex: index,
    });
  };

  const closeLightbox = () => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (initialTab && initialTab !== 'MENU') {
      setActiveTab(initialTab as TabType);
    } else {
      setActiveTab('MENU');
    }
  }, [initialTab, isOpen]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    setSendError(null);

    try {
      const { error } = await supabase.from('messages').insert({
        name: formData.name,
        email: formData.email,
        project_type: formData.projectType,
        message: formData.message,
      });

      if (error) {
        console.error('Error submitting form:', error);
        setSendError('Something went wrong — please try again or reach out directly.');
      } else {
        setFormSubmitted(true);
        setFormData({
          name: '',
          email: '',
          projectType: '',
          message: '',
        });
        setTimeout(() => {
          setFormSubmitted(false);
        }, 4000);
      }
    } catch (err) {
      console.error('Unexpected error submitting form:', err);
      setSendError('Something went wrong — please try again or reach out directly.');
    } finally {
      setIsSending(false);
    }
  };

  const navItems = [
    { id: 'ABOUT', label: 'ABOUT', desc: 'Background & Philosophy', icon: User },
    { id: 'PROJECTS', label: 'PROJECTS', desc: 'Featured Work & Case Studies', icon: Rocket },
    { id: 'EXPERIENCE', label: 'JOURNEY', desc: 'Academics, Projects & Hackathon Timeline', icon: Briefcase },
    { id: 'CERTIFICATES', label: 'CERTIFICATES', desc: 'Achievements & Learning Credentials', icon: Award },
    { id: 'RESUME', label: 'RESUME', desc: 'Technical Skills & CV', icon: FileText },
    { id: "LET'S BUILD", label: "LET'S BUILD", desc: 'Collaboration & Inquiries', icon: Sparkles },
  ];

  const projectSections = [
    { title: 'Hackathon', projects: [
      {
        title: "Aero Atlas",
        category: "NASA Space Apps Challenge 2026 — Team 4 Loops",
        desc: "A browser-based Mars exploration simulator combining 3D terrain, oxygen-aware route planning, and a mission journal.",
        tech: ["3D Terrain", "Mars Exploration"],
        link: "https://github.com/ayankrmondal2003-rgb/AeroAtlas",
        media: gallery("AeroAtlas"),
      },
      {
        title: "Type.e",
        category: "MLH Hacktoberfest 2026 — Team 4 LOOPS",
        desc: "An interactive typing platform with races, practice sessions, and performance statistics to help users improve speed and accuracy.",
        tech: ["Typing Practice", "Performance Analytics"],
        link: "https://github.com/arpbiswas04-coder/GRID-COMMUNITY-HACKTOBERFEST",
        media: gallery("Type.e "),
      },
      {
        title: "FUNBOARD",
        category: "Hack4Haldia 2026 — Team 4 LOOPS",
        desc: "A collaborative whiteboard for brainstorming, sketching, and diagramming together in real time, with shared rooms and live drawing.",
        tech: ["Real-time Collaboration", "WebSockets"],
        link: "https://github.com/arpbiswas04-coder/TEAM-B-HACK-4-HALDIA-VOYAGE",
        media: gallery("Funboard "),
      },
      {
        title: "MatchVision",
        category: "CodeVoyage 2026 — Team 4 LOOPS",
        desc: "An AI-powered football analytics platform that turns match footage into player and ball tracking, movement heatmaps, and performance insights for teams and coaches.",
        tech: ["Computer Vision", "YOLO", "React"],
        link: "https://github.com/arpbiswas04-coder/MatchVision-Codevoyage",
        media: gallery("Matchvision "),
      },
      {
        title: "Karigar",
        category: "Build with Bharat 2.0 — Team 4 LOOPS",
        desc: "A digital platform connecting traditional artisans with customers, bringing authentic crafts from hands to homes.",
        tech: ["Artisans", "Marketplace"],
        link: "https://github.com/arpbiswas04-coder/KARIGAR",
        media: gallery("karigar "),
      },
      {
        title: 'Setu',
        category: 'Tejas India Hackathon — Team 4 Loops',
        desc: 'A marketplace platform connecting tourists with local vendors — homestays, guides, artisans, and experience providers — across Bihar, with AI-assisted trip discovery and bilingual content.',
        tech: ['React', 'Node.js', 'AI Travel Assistant'],
        link: 'https://github.com/arpbiswas04-coder/SETU---TEJAS-INDIA-HACKATHON',
        media: ['/SETU1.jpeg', '/SETU2.jpeg', '/SETU3.jpeg', '/SETU4.jpeg', '/SETU5.jpeg', '/SETU6.jpeg', '/SETU7.jpeg', '/SETU8.jpeg', '/SETU9.jpeg', '/SETU10.jpeg', '/SETU11.jpeg', '/SETU12.jpeg'],
      },
      {
        title: 'Meghdrishti',
        category: 'ISRO BAH 2026 — Team Trinova',
        desc: 'GenAI-based cloud removal and reconstruction system for LISS-IV satellite imagery, built for the Bharatiya Antariksh Hackathon 2026.',
        tech: ['Python', 'GAN', 'PyTorch'],
        link: 'https://github.com/arpbiswas04-coder/Meghdrishti',
        media: ['/MEGHDRISHTI1.jpeg', '/MEGHDRISHTI2.jpeg', '/MEGHDRISHTI3.jpeg', '/MEGHDRISHTI4.jpeg'],
      },
      {
        title: 'Multiple Disease Predictor',
        category: 'HackArena HIT',
        desc: 'An AI-powered diagnostic and wellness advisory system predicting heart and kidney disease risk using custom-trained ML models, with an interactive wellness advisory dashboard.',
        tech: ['Python', 'Streamlit', 'scikit-learn'],
        link: 'https://github.com/arpbiswas04-coder/HACKARENA-HIT',
        media: [],
      },
      {
        title: 'Smart Parking System',
        category: 'Embedded Systems',
        desc: 'A smart parking system (built in Tinkercad) with automated entry/exit gating via ultrasonic sensors, real-time slot occupancy tracking, and PIR-based eco power-saving for the display.',
        tech: ['Arduino', 'C++'],
        link: 'https://github.com/arpbiswas04-coder/Smart-Parking-System',
        media: [],
      },
    ] },
    { title: 'Personal', projects: [
      {
        title: "Image Classification",
        category: "Computer Vision",
        desc: "An image classification project exploring happy and sad image recognition with machine learning.",
        tech: ["Python", "Image Classification"],
        link: "https://github.com/arpbiswas04-coder/ImageClassification-Happy-Sad-",
        media: gallery("Image Classificaation "),
      },
      {
        title: "Flappy Bird DQN",
        category: "Reinforcement Learning",
        desc: "A reinforcement learning project training a Deep Q-Network agent to play Flappy Bird and learn from its interactions with the game.",
        tech: ["Python", "Deep Q-Network", "Reinforcement Learning"],
        link: "https://github.com/arpbiswas04-coder/FlappyBird-DQN",
        media: gallery("Flappy Bird "),
      },
      {
        title: 'GitHub Developer Card Generator',
        category: 'AI Agents & Automation',
        desc: 'An AI-powered developer card generator that orchestrates intelligent agents to analyze GitHub profiles and render high-fidelity, interactive developer cards with curated aesthetic themes.',
        tech: ['Google ADK', 'FastMCP', 'FastAPI', 'Gemini'],
        link: 'https://github.com/arpbiswas04-coder/Github-card-generator',
        media: ['/GITHUB_CARD1.jpeg'],
      },
      {
        title: 'ArenaX Chess',
        category: 'AI-Powered Web App',
        desc: 'A premium, AI-powered single-page chess platform with immersive game modes, a real-time AI tutor, and multiple engine difficulty levels.',
        tech: ['React', 'Gemini AI', 'JavaScript'],
        link: 'https://github.com/arpbiswas04-coder/ArenaX-Chess',
        media: ['/ARENA1.jpeg', '/ARENA2.jpeg', '/ARENA3.jpeg', '/ARENA4.jpeg', '/ARENA5.jpeg', '/ARENA6.jpeg'],
      },
      {
        title: 'Enterprise AI Interviewer',
        category: 'Vibecodethon — Team Vector',
        desc: "An adaptive, multi-turn AI technical interview agent that conducts realistic, personalized interviews grounded in a candidate's actual learning journey — not a scripted quiz.",
        tech: ['Python', 'LLM Agents'],
        link: 'https://github.com/arpbiswas04-coder/Vibecodethon',
        media: ['/INTERVIEW1.jpeg', '/INTERVIEW2.jpeg', '/INTERVIEW3.jpeg', '/INTERVIEW4.jpeg', '/INTERVIEW5.jpeg', '/INTERVIEW6.jpeg'],
      },
    ] },
  ];

  const experience: TimelineItem[] = [
    { type: 'year', role: 'First Year', company: '2025', period: 'SGPA: 9.58' },
    { type: 'event', title: 'HackArena HIT', desc: 'Built a multiple disease predictor for heart and kidney disease risk.' },
    { type: 'event', title: 'UIDAI Hackathon 2026', desc: 'Built an Aadhaar fraud and anomaly detection system using Isolation Forest.' },
    { type: 'year', role: 'Second Year', company: 'Current', period: '2026 — Present' },
    { type: 'event', title: 'Bharatiya Antariksh Hackathon 2026 (ISRO) — Pre-Finalist', desc: 'Building Meghdrishti — GAN-based cloud removal for satellite imagery, with Team Trinova.' },
    { type: 'event', title: 'Vibecodethon (AB Talks) — Finalist', desc: 'Built an adaptive AI technical interview agent, with Team Vector.' },
    { type: 'event', title: 'Tejas India Hackathon — Finalist', desc: 'Built Setu — a Bihar tourism marketplace connecting tourists with local vendors, with Team 4 Loops.' },
    { type: 'event', title: "Build with Bharat 2.0 — Semi-Finalist", desc: 'Built Karigar — a platform connecting traditional artisans with customers, reaching the semi-finals.' },
    { type: 'event', title: "CodeVoyage 2026 — Finalist", desc: 'Built MatchVision — a football video analytics platform tracking players and the ball to reveal team performance insights, with Team 4 LOOPS.' },
    { type: 'event', title: "WhyCode4U × IIT Guwahati Hackathon 2026 — Finalist", desc: 'Qualified for the finals of the WhyCode4U × IIT Guwahati Hackathon 2026.' },
    { type: 'event', title: "Hackyard Build 2026 — Finalist", desc: 'Reached the final round of Hackyard Build 2026.' },
    { type: 'event', title: "Hack4Haldia 2026 (MLH) — Winner", desc: 'Built FUNBOARD — a real-time collaborative whiteboard for brainstorming and sketching, with Team 4 LOOPS.' },
    { type: 'event', title: "MLH Hacktoberfest 2026 — Winner", desc: 'Built Type.e — an interactive typing platform with races, practice sessions, and performance tracking, with Team 4 LOOPS.' },
    { type: 'event', title: "NASA Space Apps Challenge 2026, Haldia — Winner", desc: 'Built Aero Atlas — a Mars exploration simulator with 3D terrain and oxygen-aware route planning, with Team 4 Loops.' },

  ];

  const skillCategories = [
    {
      category: 'LANGUAGES',
      skills: ['C', 'C++', 'Python'],
    },
    {
      category: 'ML & DATA SCIENCE',
      skills: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'OpenCV'],
    },
    {
      category: 'BACKEND & APIS',
      skills: ['FastAPI'],
    },
    {
      category: 'CLOUD & DEPLOYMENT',
      skills: ['Google Cloud', 'Render', 'Firebase', 'Vercel'],
    },
    {
      category: 'DATABASE',
      skills: ['MySQL'],
    },
    {
      category: 'TOOLS',
      skills: ['Git', 'GitHub'],
    },
  ];

  return (
    <>
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
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 bg-[#333333] border-b border-white/10">
                <div className="flex items-center gap-3">
                  {activeTab !== 'MENU' && (
                    <button
                      onClick={() => setActiveTab('MENU')}
                      aria-label="Back to navigation"
                      className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-[#CCFF00] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <div>
                    <h3 className="font-display text-xl tracking-wider text-white uppercase flex items-center gap-2">
                      {activeTab === 'MENU' ? 'NAVIGATION' : activeTab === 'EXPERIENCE' ? 'JOURNEY' : activeTab}
                    </h3>
                    <p className="font-mono text-xs text-[#CCFF00]">ARPAN // DIGITAL PORTFOLIO</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close panel"
                  className="w-10 h-10 rounded-full border border-white/20 hover:border-[#CCFF00] bg-white/5 hover:bg-[#CCFF00] text-white hover:text-black flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="drawer-body flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-8 space-y-8">
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
                            className="group relative flex items-center justify-between p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-[#CCFF00] hover:text-black transition-all duration-300 text-left overflow-hidden cursor-pointer"
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
                        I'm Arpan — a second-year Computer Science student, developer, and engineering team lead. I enjoy building at the intersection of software, AI, and creative technology, turning complex ideas into practical and engaging digital experiences.
                      </p>
                      <p className="text-white/70 leading-relaxed text-sm">
                        My vision is to turn ambitious ideas into useful, accessible technology — from platforms that empower artisans and connect communities to AI agents, learning tools, and space exploration experiences. Leading teams through hackathon finals and wins at Hack4Haldia, MLH Hacktoberfest, and NASA Space Apps Haldia has strengthened my drive to build with purpose. I want to keep pushing beyond prototypes, combining thoughtful design with AI and engineering to create products that make a lasting difference.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4 font-mono text-xs">
                      <div className="p-4 rounded-xl border border-white/10 bg-white/5 group hover:bg-[#CCFF00] transition-all duration-300">
                        <span className="text-white/40 group-hover:text-black block transition-colors">ROLE</span>
                        <span className="text-white group-hover:text-black font-semibold text-sm transition-colors">Team Lead & Developer</span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/10 bg-white/5 group hover:bg-[#CCFF00] transition-all duration-300">
                        <span className="text-white/40 group-hover:text-black block transition-colors">FOCUS</span>
                        <span className="text-[#CCFF00] group-hover:text-black font-semibold text-sm transition-colors">AI Systems & ML Workflows</span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/10 bg-white/5 group hover:bg-[#CCFF00] transition-all duration-300">
                        <span className="text-white/40 group-hover:text-black block transition-colors">EDUCATION</span>
                        <span className="text-white group-hover:text-black font-semibold text-sm transition-colors">B.Tech CSE, AI/ML Specialization</span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/10 bg-white/5 group hover:bg-[#CCFF00] transition-all duration-300">
                        <span className="text-white/40 group-hover:text-black block transition-colors">LOCATION</span>
                        <span className="text-white group-hover:text-black font-semibold text-sm transition-colors">Haldia, West Bengal</span>
                      </div>
                    </div>

                    {/* GitHub & LinkedIn Link Boxes */}
                    <div className="space-y-3 pt-2">
                      <a
                        href="https://github.com/arpbiswas04-coder"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-between p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-[#CCFF00] hover:text-black transition-all duration-300 text-left overflow-hidden"
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-10 h-10 rounded-lg border border-white/20 group-hover:border-black/30 flex items-center justify-center bg-black/20 group-hover:bg-black text-[#CCFF00] group-hover:text-[#CCFF00]">
                            <Github className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-display text-2xl tracking-wider uppercase">
                              GITHUB
                            </h4>
                            <p className="font-sans text-xs text-white/60 group-hover:text-black/80 font-medium">
                              arpbiswas04-coder
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-lg group-hover:translate-x-1 transition-transform relative z-10">
                          →
                        </span>
                      </a>

                      <a
                        href="https://www.linkedin.com/in/arpan-biswas-1576a7387/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-between p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-[#CCFF00] hover:text-black transition-all duration-300 text-left overflow-hidden"
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-10 h-10 rounded-lg border border-white/20 group-hover:border-black/30 flex items-center justify-center bg-black/20 group-hover:bg-black text-[#CCFF00] group-hover:text-[#CCFF00]">
                            <Linkedin className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-display text-2xl tracking-wider uppercase">
                              LINKEDIN
                            </h4>
                            <p className="font-sans text-xs text-white/60 group-hover:text-black/80 font-medium">
                              Connect with me
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-lg group-hover:translate-x-1 transition-transform relative z-10">
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                )}

                {/* PROJECTS TAB */}
                {activeTab === 'PROJECTS' && (
                  <div className="space-y-6">
                    <p className="font-mono text-xs text-white/50 tracking-widest uppercase">
                      // SELECTED WORKS & ARCHITECTURE
                    </p>
                    {projectSections.map((section) => (
                      <section key={section.title} className="space-y-4" aria-label={`${section.title} projects`}>
                        <h4 className="font-display text-2xl text-[#CCFF00] uppercase tracking-wide">{section.title}</h4>
                        <div className="grid grid-cols-1 gap-4">
                      {section.projects.map((proj, idx) => (
                        <div
                          key={idx}
                          className="project-card group block p-4 sm:p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-[#CCFF00] hover:text-black transition-all duration-300 text-left overflow-hidden space-y-3"
                        >
                          {/* Media Gallery Preview Grid (if media.length > 0) */}
                          {proj.media && proj.media.length > 0 && (
                            <div
                              className="grid grid-cols-2 min-[440px]:grid-cols-4 gap-2 mb-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {proj.media.slice(0, 4).map((mPath, mIdx) => {
                                const isFourthAndHasMore = mIdx === 3 && proj.media.length > 4;
                                const extraCount = proj.media.length - 4;
                                const isVid = mPath.toLowerCase().endsWith('.mp4');

                                return (
                                  <button
                                    type="button"
                                    aria-label={`View ${proj.title} image ${mIdx + 1}`}
                                    key={mIdx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openLightbox(proj.media, mIdx);
                                    }}
                                    className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/40 cursor-pointer group/thumb hover:border-black transition-colors"
                                  >
                                    {isVid ? (
                                      <video
                                        src={mPath}
                                        className="w-full h-full object-cover"
                                        muted
                                      />
                                    ) : (
                                      <img
                                        src={thumbnail(mPath)}
                                        alt={`${proj.title} thumbnail ${mIdx + 1}`}
                                        loading="lazy" decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                                      />
                                    )}

                                    {isFourthAndHasMore && (
                                      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center font-mono text-sm font-bold text-[#CCFF00] group-hover/thumb:bg-black/60 transition-colors">
                                        +{extraCount}
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-[#CCFF00] group-hover:text-black/70 font-semibold uppercase tracking-wider">
                              {proj.category}
                            </span>
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:text-black transition-colors cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-black transition-colors" />
                            </a>
                          </div>

                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block font-display text-xl tracking-wide uppercase text-white group-hover:text-black transition-colors hover:underline cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {proj.title}
                          </a>

                          <p className="font-sans text-xs text-white/70 group-hover:text-black/80 leading-relaxed transition-colors">
                            {proj.desc}
                          </p>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {proj.tech.map((t, i) => (
                              <span
                                key={i}
                                className="font-mono text-[10px] px-2.5 py-1 rounded bg-white/10 group-hover:bg-black/10 text-white/80 group-hover:text-black font-medium transition-colors"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}

                {/* CERTIFICATES TAB */}
                {activeTab === 'CERTIFICATES' && (
                  <div className="space-y-6">
                    <p className="font-mono text-xs text-white/50 tracking-widest uppercase">// ACHIEVEMENTS & LEARNING CREDENTIALS</p>
                    <div className="grid grid-cols-1 gap-4">
                      {certificates.map((certificate, index) => (
                        <button key={certificate.src} type="button"
                          onClick={() => openLightbox(certificates.map((item) => item.src), index)}
                          aria-label={`View ${certificate.title}`}
                          className="certificate-card group p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-[#CCFF00] hover:text-black transition-all duration-300 text-left space-y-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#CCFF00]">
                          <img src={thumbnail(certificate.src)} alt={certificate.title} loading="lazy" decoding="async"
                            className="w-full h-auto object-contain rounded-lg bg-black/20" />
                          <h4 className="font-sans text-sm font-semibold text-white group-hover:text-black transition-colors">{certificate.title}</h4>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* EXPERIENCE TAB */}
                {activeTab === 'EXPERIENCE' && (
                  <div className="space-y-6">
                    <p className="font-mono text-xs text-white/50 tracking-widest uppercase">
                      // ACADEMICS, PROJECTS & HACKATHON TIMELINE
                    </p>
                    <div className="relative border-l border-white/20 pl-6 space-y-8 ml-2">
                      {experience.map((item, idx) => (
                        <div key={idx} className="relative group">
                          {item.type === 'year' ? (
                            <>
                              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#333333] border-2 border-[#CCFF00] group-hover:bg-[#CCFF00] transition-colors" />
                              <span className="font-mono text-xs text-[#CCFF00]">{item.period}</span>
                              <h4 className="font-display text-xl uppercase text-white mt-1">
                                {item.role}
                              </h4>
                              <p className="font-mono text-xs text-white/50 uppercase">
                                {item.company}
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#333333] border-2 border-white group-hover:bg-white transition-colors" />
                              <h5 className={`font-sans text-sm font-semibold ${item.title === 'GitHub Dev Card Generator' || item.title === 'ArenaX Chess' ? 'text-white' : 'text-[#CCFF00]'}`}>
                                {item.title}
                              </h5>
                              <p className="font-sans text-xs text-white/70 leading-relaxed mt-1">
                                {item.desc}
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* RESUME TAB */}
                {activeTab === 'RESUME' && (
                  <div className="space-y-6 font-sans">
                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                      <div className="flex flex-wrap gap-3 items-center justify-between">
                        <h4 className="font-display text-2xl text-white uppercase">CURRICULUM VITAE</h4>
                        <a
                          href="/Arpan-Biswas-CV.pdf"
                          download="Arpan-Biswas-CV.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs px-4 py-2 rounded-lg bg-[#CCFF00] text-black font-bold flex items-center gap-2 hover:bg-white transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>DOWNLOAD CV</span>
                        </a>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Computer Science undergrad specializing in AI and ML, with hands-on experience deploying Python projects using FastAPI, Docker, and Google Cloud Run, and building AI agent systems with Google ADK, Gemini, and MCP.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {skillCategories.map((catGroup, idx) => (
                        <div key={idx} className="space-y-3">
                          <h5 className="font-mono text-xs text-[#CCFF00] uppercase tracking-widest">
                            // {catGroup.category}
                          </h5>
                          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                            {catGroup.skills.map((skill, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-[#CCFF00] hover:text-black transition-all duration-300 group flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] group-hover:bg-black transition-colors" />
                                <span className="text-white/90 group-hover:text-black font-medium transition-colors">
                                  {skill}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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

                        {/* Project Type Input */}
                        <div className="space-y-1">
                          <label className="font-mono text-xs text-white/60 uppercase block">PROJECT TYPE</label>
                          <input
                            type="text"
                            value={formData.projectType}
                            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                            placeholder="e.g. Web App, AI Integration, Full System Lead..."
                            className="w-full bg-transparent border-b border-white/30 focus:border-[#CCFF00] outline-none transition-colors py-3 text-white placeholder-white/30 font-sans text-sm"
                          />
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
                          disabled={isSending}
                          className="w-full bg-[#CCFF00] text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSending ? 'SENDING...' : 'SEND MESSAGE'}</span>
                        </button>

                        {sendError && (
                          <p className="font-mono text-xs text-red-400 text-center mt-2">
                            {sendError}
                          </p>
                        )}
                      </form>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen Lightbox Modal */}
      <MediaLightbox
        isOpen={lightboxState.isOpen}
        media={lightboxState.media}
        currentIndex={lightboxState.currentIndex}
        onClose={closeLightbox}
        onNavigate={(idx) => setLightboxState((prev) => ({ ...prev, currentIndex: idx }))}
      />
    </>
  );
};
