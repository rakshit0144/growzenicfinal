import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { 
  Video, 
  Upload, 
  Layout, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  User, 
  LogOut, 
  Plus, 
  Layers, 
  Zap, 
  Shield,
  Menu,
  X,
  ExternalLink,
  Mic,
  Link as LinkIcon,
  MessageSquare,
  Phone,
  Send,
  Bot,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Pointer,
  Minimize2,
  Maximize2,
  CreditCard,
  Receipt,
  Wallet,
  Star
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface User {
  id: number;
  email: string;
  name: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  video_url: string;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
}

// --- Components ---

const AnimatedBackground = () => (
  <div className="animated-bg">
    <div className="bg-blob" style={{ top: '-10%', left: '-5%', width: '800px', height: '800px', opacity: 0.15 }} />
    <div className="bg-blob-2" style={{ opacity: 0.1 }} />
    <div className="bg-blob" style={{ bottom: '0%', right: '0%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', width: '1000px', height: '1000px' }} />
  </div>
);

const Logo = () => (
  <div className="flex items-center gap-2 group">
    <div className="w-10 h-10 bg-[#634497] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500 overflow-hidden">
      <span className="text-white font-black text-xl tracking-tighter">GZ</span>
    </div>
    <span className="text-xl font-bold tracking-tight text-white">Grow<span className="text-[#8b5cf6]">zenic</span></span>
  </div>
);

const Reveal = ({ children, delay = 0, width = "fit-content" }: { children: React.ReactNode, delay?: number, width?: "fit-content" | "100%", key?: React.Key }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};

const Navbar = ({ user, onLogout }: { user: User | null; onLogout: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
      isScrolled ? "bg-black/60 backdrop-blur-2xl border-white/5 py-4" : "bg-transparent border-transparent py-8"
    )}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {['Services', 'Portfolio', 'Process'].map((item) => (
            <Link 
              key={item}
              to={`/#${item.toLowerCase()}`} 
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-wide"
            >
              {item}
            </Link>
          ))}
          <div className="h-4 w-px bg-white/10 mx-2" />
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Dashboard</Link>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-xl">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-3xl border-b border-white/10 overflow-hidden md:hidden"
          >
            <div className="p-8 flex flex-col gap-6">
              {['Services', 'Portfolio', 'Process'].map((item) => (
                <Link key={item} to={`/#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-gray-300">{item}</Link>
              ))}
              <div className="h-px bg-white/10 w-full" />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-indigo-400">Dashboard</Link>
                  <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="text-xl font-medium text-red-400 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-gray-300">Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-indigo-600 text-white p-4 rounded-2xl text-center font-bold">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LandingPage = () => {
  return (
    <div className="bg-transparent text-white min-h-screen">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-6 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="max-w-3xl">
              <Reveal>
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <span className="w-6 md:w-8 h-px bg-indigo-500" />
                  <span className="text-indigo-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
                    Global Creative Post-Production
                  </span>
                </div>
              </Reveal>
              
              <Reveal delay={0.1}>
                <h1 className="text-5xl md:text-7xl lg:text-[120px] font-bold tracking-tighter leading-[0.9] md:leading-[0.8] mb-8 md:mb-12">
                  Post <br />
                  <span className="text-white/20">Production</span> <br />
                  <span className="italic font-light">Refined.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-lg md:text-2xl text-gray-400 mb-10 md:mb-14 max-w-xl leading-relaxed font-light">
                  We partner with world-class creators and brands to deliver cinematic video editing that scales with your ambition.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6">
                  <Link to="/register" className="group bg-white text-black px-8 md:px-12 py-4 md:py-6 rounded-full font-bold text-base md:text-lg hover:bg-indigo-600 hover:text-white transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl">
                    Start Collaboration
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <ChevronRight size={20} />
                    </motion.div>
                  </Link>
                  <Link to="/#portfolio" className="group border border-white/10 px-8 md:px-12 py-4 md:py-6 rounded-full font-bold text-base md:text-lg hover:bg-white/5 hover:border-white/30 transition-all duration-500 text-center">
                    View Showreel
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.4} width="100%">
              <div className="relative aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                <img 
                  src="https://picsum.photos/seed/creative/1200/1200" 
                  alt="Creative Studio" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10">
                  <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Featured Project</div>
                  <div className="text-2xl font-bold">The Art of Storytelling</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 md:py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-8 md:mb-12 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-gray-500">Trusted by industry leaders</div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {['Google', 'Netflix', 'Spotify', 'Adobe', 'YouTube'].map(brand => (
              <div key={brand} className="text-xl md:text-2xl font-bold tracking-tighter">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 md:py-40 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-16 md:mb-24 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">How We Scale Your Content</h2>
              <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto font-light">A streamlined workflow designed for high-volume post-production.</p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Share your raw footage via our secure dashboard.' },
              { step: '02', title: 'Strategy', desc: 'We assign a lead editor to match your brand style.' },
              { step: '03', title: 'Production', desc: 'Post-production, sound design, and color grading.' },
              { step: '04', title: 'Delivery', desc: 'Review and download your high-quality assets.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="relative p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.02] border border-white/5 h-full group hover:bg-white/[0.04] transition-all duration-500">
                  <div className="text-4xl md:text-5xl font-black text-white/5 mb-6 md:mb-8 group-hover:text-indigo-500/20 transition-colors">{item.step}</div>
                  <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-xs md:text-sm font-light">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-24 md:py-40 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-16 md:mb-24 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">Client Perspectives</h2>
              <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto font-light">Join the ranks of creators who have transformed their production value with Growzenic.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: 'Alex Rivera', role: 'Tech YouTuber', text: 'Growzenic turned my raw 2-hour streams into 15-minute high-retention masterpieces. My views increased by 40% in two months.' },
              { name: 'Sarah Chen', role: 'Agency Director', text: 'The turnaround time is unbelievable. We can now offer our clients premium video services without the overhead of a full-time team.' },
              { name: 'Marcus Thorne', role: 'Brand Manager', text: 'Professional, cinematic, and consistent. They understand our brand voice better than any freelancer we’ve ever hired.' },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-500">
                  <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 font-light italic">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-sm md:text-base">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm md:text-base">{t.name}</div>
                      <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-40 px-6 md:px-8 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-12 md:mb-16 text-center tracking-tight">Common Inquiries</h2>
          </Reveal>
          <div className="space-y-4 md:space-y-6">
            {[
              { q: 'What is the typical turnaround time?', a: 'Our standard turnaround is 48 hours for most projects. Professional and Enterprise plans offer 24-hour delivery.' },
              { q: 'How do I share my footage?', a: 'Once you register, you can upload footage directly to our secure dashboard or share links from Google Drive, Dropbox, or Frame.io.' },
              { q: 'Can I request specific editing styles?', a: 'Absolutely. During the onboarding process, we analyze your brand style and assign editors who specialize in your specific niche.' },
            ].map((faq, i) => (
              <Reveal key={i} delay={i * 0.1} width="100%">
                <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300">
                  <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{faq.q}</h3>
                  <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40 px-6 md:px-8">
        <Reveal width="100%">
          <div className="max-w-6xl mx-auto bg-white rounded-[2rem] md:rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10 transition-colors duration-1000 group-hover:text-white text-black">
              <h2 className="text-3xl md:text-8xl font-bold mb-8 md:mb-12 leading-tight tracking-tighter">Let's build something <br className="hidden md:block" /> extraordinary.</h2>
              <Link to="/register" className="inline-block bg-black text-white px-10 md:px-14 py-5 md:py-7 rounded-full font-bold text-base md:text-xl hover:scale-105 transition-all duration-500 shadow-2xl group-hover:bg-white group-hover:text-black">
                Start Your Project
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo />
          <div className="text-gray-500 text-sm">
            © 2024 Growzenic Studio. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AuthPage = ({ type }: { type: 'login' | 'register' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (type === 'login') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('user', JSON.stringify(data));
          window.location.href = '/dashboard';
        } else {
          setError(data.error || 'Invalid credentials');
        }
      } catch (err) {
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch('/api/auth/register-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password, name: name.trim() }),
        });
        const data = await res.json();
        if (res.ok) {
          setStep('otp');
          setSimulatedOtp(data.simulatedOtp);
        } else {
          setError(data.error || 'Registration failed');
        }
      } catch (err) {
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        url,
        'google-auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        setError('Popup blocked. Please allow popups for this site.');
        setLoading(false);
        return;
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          const user = event.data.user;
          localStorage.setItem('user', JSON.stringify(user));
          window.location.href = '/dashboard';
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (err) {
      setError('Failed to initiate Google login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-40 pb-20 px-4 md:px-8 flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-xl relative z-10">
        <Reveal width="100%">
          <div className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
            <div className="text-center mb-10 md:mb-12">
              <div className="flex justify-center mb-6 md:mb-8 scale-90 md:scale-100">
                <Logo />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">
                {type === 'login' ? 'Welcome Back' : step === 'otp' ? 'Verify Email' : 'Create Account'}
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-light">
                {type === 'login' ? 'Access your creative dashboard' : step === 'otp' ? `We've sent a code to ${email}` : 'Start your post-production journey'}
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm mb-8 text-center"
              >
                {error}
              </motion.div>
            )}

            {simulatedOtp && step === 'otp' && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-4 rounded-2xl mb-8 text-sm text-center">
                Demo Mode: Your OTP is <strong>{simulatedOtp}</strong>
              </div>
            )}

            {step === 'details' ? (
              <form onSubmit={handleInitialSubmit} className="space-y-6">
                {type === 'register' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 hover:text-white transition-all duration-500 disabled:opacity-50 shadow-xl"
                >
                  {loading ? 'Processing...' : type === 'login' ? 'Sign In' : 'Continue'}
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest">
                    <span className="bg-[#0a0a0a] px-4 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerify} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-3xl font-bold tracking-[0.5em] focus:outline-none focus:border-indigo-500/50 transition-colors"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 hover:text-white transition-all duration-500 disabled:opacity-50 shadow-xl"
                >
                  {loading ? 'Verifying...' : 'Verify & Create'}
                </button>
                <button 
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-full text-gray-500 text-sm font-medium hover:text-white transition-colors"
                >
                  Back to details
                </button>
              </form>
            )}

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                {type === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <Link to={type === 'login' ? '/register' : '/login'} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                  {type === 'login' ? 'Sign Up' : 'Sign In'}
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

// --- Cute AI Component (Chatbot Version) ---

const CuteAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hi! I'm Zenic, your creative assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are Zenic, a friendly and professional creative assistant for Growzenic, a high-volume video post-production agency. Your goal is to help users understand our services, guide them through the project request process, and answer any questions about video editing. Keep your responses concise, helpful, and slightly playful. Use emojis occasionally.",
        },
      });

      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await chat.sendMessage({
        message: userMessage,
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Oops! I'm having a bit of trouble connecting. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[300] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] md:h-[550px] bg-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden mb-4 md:mb-6"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Bot className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-tight">Zenic AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <Minimize2 size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "px-5 py-3.5 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-white/5 text-gray-200 rounded-tl-none border border-white/5"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-500 px-2">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-white/[0.01]">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Zenic anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-600"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500",
          isOpen ? "bg-white text-black rotate-90" : "bg-indigo-600 text-white"
        )}
      >
        {isOpen ? <X size={24} /> : (
          <>
            <Bot size={28} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full" />
          </>
        )}
      </motion.button>
    </div>
  );
};

const Dashboard = ({ user }: { user: User }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'billing'>('projects');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ 
    title: '', 
    description: '', 
    audioNote: '',
    referenceLink: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects/${user.id}`);
      const data = await res.json();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newProject, userId: user.id }),
    });
    if (res.ok) {
      setIsModalOpen(false);
      setNewProject({ title: '', description: '', audioNote: '', referenceLink: '' });
      fetchProjects();
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-40 pb-20 px-4 md:px-8 relative overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal width="100%">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 md:mb-16">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Creative Workspace</h1>
              <p className="text-gray-400 text-sm md:text-base font-light">Welcome back, {user.name}. Manage your post-production pipeline.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <div className="bg-white/5 p-1 rounded-2xl flex items-center">
                <button 
                  onClick={() => setActiveTab('projects')}
                  className={cn(
                    "flex-1 sm:flex-none px-4 md:px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2",
                    activeTab === 'projects' ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-white"
                  )}
                >
                  <Layout size={14} className="md:w-4 md:h-4" />
                  Projects
                </button>
                <button 
                  onClick={() => setActiveTab('billing')}
                  className={cn(
                    "flex-1 sm:flex-none px-4 md:px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2",
                    activeTab === 'billing' ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-white"
                  )}
                >
                  <CreditCard size={14} className="md:w-4 md:h-4" />
                  Billing
                </button>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all duration-500 shadow-xl"
              >
                <Plus size={18} className="md:w-5 md:h-5" />
                New Project
              </button>
            </div>
          </div>
        </Reveal>

        {activeTab === 'projects' ? (
          loading ? (
            <div className="flex justify-center py-40">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
              />
            </div>
          ) : projects.length === 0 ? (
            <Reveal width="100%">
              <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Video className="text-gray-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-4">No active projects</h2>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto font-light">Start your first collaboration by creating a new project request.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                >
                  Create your first project →
                </button>
              </div>
            </Reveal>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.1} width="100%">
                  <motion.div 
                    layout
                    className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] hover:border-indigo-500/50 hover:bg-white/[0.04] transition-all duration-500 group"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]",
                        project.status === 'pending' ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                        project.status === 'in-progress' ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" :
                        "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      )}>
                        {project.status.replace('-', ' ')}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-400 transition-colors tracking-tight">{project.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-10 font-light leading-relaxed">{project.description}</p>
                    <div className="flex items-center justify-between pt-8 border-t border-white/5">
                      <div className="flex flex-col gap-2">
                        <a 
                          href="https://wa.openinapp.co/xg0ig"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 text-sm font-bold flex items-center gap-2 hover:text-emerald-300 transition-colors"
                        >
                          Chat with Editor <MessageSquare size={14} />
                        </a>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          {project.status === 'completed' ? <CheckCircle size={18} className="text-emerald-500" /> : <Clock size={18} />}
                          <span className="text-[10px] font-bold uppercase tracking-widest">{project.status === 'completed' ? 'Delivered' : 'In Queue'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          )
        ) : (
          <Reveal width="100%">
            <div className="space-y-8">
              {/* Billing Header Cards */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star size={80} className="text-indigo-500" />
                  </div>
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Current Plan</h3>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold">Pro</span>
                    <span className="text-gray-500 text-sm mb-1 font-light">/ monthly</span>
                  </div>
                  <div className="text-indigo-400 text-lg font-bold mb-4">$0.00 <span className="text-gray-500 text-xs font-light">USD</span></div>
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle size={14} />
                    Active until Mar 26
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wallet size={80} className="text-indigo-500" />
                  </div>
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Available Credits</h3>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-bold">12</span>
                    <span className="text-gray-500 text-sm mb-1 font-light">projects</span>
                  </div>
                  <button className="text-indigo-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors">
                    Buy more credits →
                  </button>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Receipt size={80} className="text-indigo-500" />
                  </div>
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Total Spent</h3>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-bold">$0.00</span>
                    <span className="text-gray-500 text-sm mb-1 font-light">USD</span>
                  </div>
                  <button className="text-indigo-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors">
                    View invoices →
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem]">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold tracking-tight">Payment Methods</h2>
                  <button className="bg-white text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all duration-500">
                    Add Method
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                        <CreditCard size={20} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Visa ending in 4242</p>
                        <p className="text-xs text-gray-500">Expires 12/26 • Default</p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem]">
                <h2 className="text-2xl font-bold tracking-tight mb-10">Recent Transactions</h2>
                <div className="space-y-6">
                  {[
                    { id: '#INV-001', date: 'Feb 24, 2024', amount: '$0.00', status: 'Paid' },
                    { id: '#INV-002', date: 'Jan 24, 2024', amount: '$0.00', status: 'Paid' },
                    { id: '#INV-003', date: 'Dec 24, 2023', amount: '$0.00', status: 'Paid' },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                          <Receipt size={18} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{tx.id}</p>
                          <p className="text-xs text-gray-500">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{tx.amount}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">{tx.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              
              {/* Modal Header */}
              <div className="p-6 md:p-12 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight">New Project Request</h2>
                  <p className="text-gray-500 mt-1 md:mt-2 text-xs md:text-base font-light">Tell us about your vision and provide assets.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-grow overflow-y-auto p-6 md:p-12 pt-4 space-y-6 md:space-y-8">
                <form id="project-form" onSubmit={handleCreateProject} className="space-y-6 md:space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Project Title</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm md:text-base"
                      placeholder="e.g. Summer Travel Vlog 2024"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Description & Style Notes</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none text-sm md:text-base"
                      placeholder="Describe the mood, pace, and any specific requirements..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 ml-4 flex items-center gap-2">
                      <LinkIcon size={12} className="md:w-3.5 md:h-3.5" /> Reference Reel (Optional)
                    </label>
                    <input
                      type="url"
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm md:text-base"
                      placeholder="Instagram/TikTok/YouTube"
                      value={newProject.referenceLink}
                      onChange={(e) => setNewProject({ ...newProject, referenceLink: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 ml-4 flex items-center gap-2">
                      <Mic size={12} className="md:w-3.5 md:h-3.5" /> Audio Description / Note
                    </label>
                    <div className="relative">
                      <textarea
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none text-sm md:text-base"
                        placeholder="Add an audio note or detailed verbal instructions..."
                        value={newProject.audioNote}
                        onChange={(e) => setNewProject({ ...newProject, audioNote: e.target.value })}
                      />
                      <div className="absolute right-4 bottom-4 text-[8px] md:text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        Optional
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 md:p-12 bg-white/[0.02] border-t border-white/5">
                <button
                  type="submit"
                  form="project-form"
                  className="w-full bg-white text-black py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-xl flex items-center justify-center gap-3"
                >
                  Submit Request <ChevronRight size={18} className="md:w-5 md:h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <AnimatedBackground />
      <CuteAI />
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthPage type="login" />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <AuthPage type="register" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
