import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  ExternalLink,
  Shield,
  Terminal,
  ArrowUp,
  ChevronDown,
  Network,
  Eye,
  Activity,
  Cpu,
  Lock,
  Server,
  Zap,
  Radar,
  Binary,
  Code2,
  Award,
  Briefcase,
  Bug,
  Target,
  Brain,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Database,
  Cloud,
  Key,
  BarChart3,
  Workflow,
  Github,
  Globe,
  Fingerprint,
  Scan,
  Wifi,
  Wrench,
  GitBranch,
  Gauge,
} from "lucide-react";

// ==================== Particle Background ====================
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let mouseX = 0, mouseY = 0;
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    class Particle {
      constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(0, ${Math.random() * 100 + 155}, 0, ${Math.random() * 0.3 + 0.1})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 1000;
          this.x -= Math.cos(angle) * force;
          this.y -= Math.sin(angle) * force;
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(150, Math.floor(window.innerWidth * window.innerHeight / 8000));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 0, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    setCanvasSize();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
      setCanvasSize();
      initParticles();
    });
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.4 }} />;
};

// ==================== Glowing Orb Effect ====================
const GlowingOrb = () => {
  return (
    <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-green-500/10 blur-[100px] animate-pulse pointer-events-none z-0" />
  );
};

// ==================== Animated Counter ====================
const AnimatedCounter = ({ value, label, icon: Icon }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = value / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  
  return (
    <motion.div
      ref={ref}
      className="text-center p-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-green-500/30"
      whileHover={{ scale: 1.05, borderColor: "#00ff00", boxShadow: "0 0 30px rgba(0,255,0,0.2)" }}
    >
      <Icon className="h-8 w-8 text-green-400 mx-auto mb-3" />
      <div className="text-3xl md:text-4xl font-bold text-green-400 font-mono">{count}+</div>
      <div className="text-sm text-green-300 mt-2">{label}</div>
    </motion.div>
  );
};

// ==================== 3D Card Component ====================
const CyberCard3D = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setRotate({ x: rotateX, y: rotateY });
  };
  
  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm rounded-2xl border border-green-500/30 overflow-hidden transition-all duration-300 ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.1s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </motion.div>
  );
};

// ==================== Typing Effect ====================
const AdvancedTypingEffect = () => {
  const [displayText, setDisplayText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const lines = [
    "> Network Security Analyst @ Nepal Telecom as an Intern",
    "> SOC Analyst Intern @ NullClass EduTech as an Intern",
    "> Building Nepal Threat Intel Platform",
    "> Creating Advanced Network Scanner",
    "> Ethical Hacker | Bug Bounty Hunter",
  ];
  
  useEffect(() => {
    const currentLine = lines[lineIndex];
    
    let timer;
    
    if (!isDeleting && charIndex < currentLine.length) {
      // Typing
      timer = setTimeout(() => {
        setDisplayText(currentLine.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 100);
    } else if (!isDeleting && charIndex === currentLine.length) {
      // Finished typing, wait 2 seconds before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      timer = setTimeout(() => {
        setDisplayText(currentLine.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 50);
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next line
      setIsDeleting(false);
      setLineIndex((prev) => (prev + 1) % lines.length);
    }
    
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, lineIndex, lines]);
  
  return (
    <div className="text-lg md:text-xl text-green-400 font-mono min-h-[3rem]">
      {displayText}
      <span className="animate-pulse">_</span>
    </div>
  );
};

// ==================== Skill Bar ====================
const SkillBar = ({ skill, percentage, icon: Icon }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(percentage);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [percentage]);
  
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-green-400" />
          <span className="text-sm text-green-300">{skill}</span>
        </div>
        <span className="text-sm text-green-400 font-mono">{percentage}%</span>
      </div>
      <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-green-500/30">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// ==================== Navigation ====================
const Nav = () => {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["home", "about", "skills", "experience", "projects", "certifications", "contact"];
      let current = "home";
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 100;
          if (window.scrollY >= el.offsetTop - offset) current = id;
        }
      });
      setActive(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certs" },
    { id: "contact", label: "Contact" },
  ];
  
  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/90 backdrop-blur-xl border-b border-green-500/30" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.a
            href="#home"
            className="text-xl font-bold font-mono"
            whileHover={{ textShadow: "0 0 10px #00ff00" }}
          >
            <span className="text-white">Dipesh</span>
            <span className="text-green-400">_Kumar</span>
          </motion.a>
          
          <div className="hidden md:flex gap-2 lg:gap-4">
            {navItems.map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className={`px-3 py-2 text-sm font-mono transition-all duration-300 ${
                  active === item.id
                    ? "text-green-400 border-b-2 border-green-400"
                    : "text-green-300 hover:text-green-400"
                }`}
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>
          
          <motion.a
            href="#contact"
            className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg text-sm text-green-400 hover:bg-green-500/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hire Me
          </motion.a>
        </div>
      </nav>
    </motion.div>
  );
};

// ==================== Hero Section ====================
const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  return (
    <header
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(0,255,0,0.1) 0%, transparent 50%)`,
      }}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(0,255,0,0.3)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-green-500/20 rounded-full px-4 py-2 mb-6 border border-green-500"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-mono">ACTIVE SECURITY CLEARANCE</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Dipesh Kumar <span className="text-green-400">Kushwaha</span>
            </h1>
            
            <AdvancedTypingEffect />
            
            <motion.div
              className="flex flex-wrap gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: Shield, text: "Network Security" },
                { icon: Radar, text: "Threat Intel" },
                { icon: Activity, text: "SOC Analysis" },
                { icon: Bug, text: "Bug Bounty" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-green-500/30"
                  whileHover={{ scale: 1.05, borderColor: "#00ff00" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <item.icon className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-300">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              className="mt-10 flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.a
                href="#contact"
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-black font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,255,0,0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-4 w-4" />
                Contact Me
              </motion.a>
              <motion.a
                href="#projects"
                className="px-8 py-3 border border-green-500 rounded-lg text-green-400 font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,255,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="h-4 w-4" />
                View Work
              </motion.a>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-green-300 blur-3xl animate-pulse" />
            <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden border-4 border-green-500 shadow-2xl">
              <img
                src="/profile.jpg"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300ff00'/%3E%3Cstop offset='100%25' stop-color='%2300ff99'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='100' fill='black' font-family='monospace'%3EDK%3C/text%3E%3C/svg%3E";
                }}
                alt="Dipesh Kumar"
                className="w-full h-full object-cover"
              />
            </div>
            
            <motion.div
              className="absolute -bottom-5 -right-5 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-green-500"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-mono">Open for opportunities</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="h-8 w-8 text-green-400" />
      </motion.div>
    </header>
  );
};

// ==================== Stats Section ====================
const Stats = () => {
  const stats = [
    { value: 30, label: "Vulnerabilities Found", icon: AlertTriangle },
    { value: 10, label: "Projects Completed", icon: Code2 },
    { value: 14, label: "Certifications", icon: Award },
    { value: 2, label: "Bug Bounty Programs", icon: Bug },
  ];
  
  return (
    <section className="py-12 bg-gradient-to-r from-green-500/5 to-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <AnimatedCounter key={i} value={stat.value} label={stat.label} icon={stat.icon} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== About Section ====================
const About = () => {
  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono">
            <span className="text-green-400"></span> About Me
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mt-4" />
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <CyberCard3D className="p-6">
            <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5" /> Who Am I?
            </h3>
            <p className="text-green-300/80 leading-relaxed">
              I'm a passionate Cyber Security Analyst currently working at Nepal Telecom as an Network Security Intern, with prior experience as a SOC Analyst Intern at NullClass EduTech in India. I'm dedicated to securing digital infrastructure through threat intelligence, network monitoring, and ethical hacking.
            </p>
            <p className="text-green-300/80 leading-relaxed mt-4">
            As a cybersecurity student, my journey started with bug bounty hunting, where I discovered vulnerabilities in real-world applications. Now, I combine my academic knowledge with hands-on experience to build robust security solutions and protect critical infrastructure.
            </p>
          </CyberCard3D>
          
          <CyberCard3D className="p-6">
            <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" /> Mission
            </h3>
            <p className="text-green-300/80 leading-relaxed">
              To make Nepal's cyberspace safer by building cutting-edge threat intelligence platforms, developing advanced security tools, and empowering organizations with the knowledge to defend against evolving cyber threats.
            </p>
            <div className="mt-6 space-y-2">
              {[
                "✓ Nepal's First Regional Threat Intel Platform",
                "✓ Advanced Network Scanner with Port Monitoring",
                "✓ Building Nepal's First Regional Threat Intel Platform",
                "✓ Penetration Testing on Web Applications",
                "✓ Network Intrusion Detection System (Snort/Wireshark)",
                "✓ Proactive Threat Hunting & Incident Response",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 text-sm text-green-400"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <CheckCircle className="h-4 w-4" />
                  {item}
                </motion.div>
              ))}
            </div>
          </CyberCard3D>
        </div>
      </div>
    </section>
  );
};

// ==================== Skills Section ====================
const Skills = () => {
  const skillCategories = [
    {
      title: "Network Security",
      icon: Network,
      skills: [
        "Network Monitoring",
        "IDS/IPS (Snort/Suricata)",
        "Packet Analysis",
        "Firewall Configuration",
        "Network Traffic Analysis",
      ],
    },
    {
      title: "Threat Intelligence",
      icon: Radar,
      skills: [
        "IOC Collection",
        "Threat Feed Integration",
        "MISP Platform",
        "Threat Hunting",
      ],
    },
    {
      title: "Cybersecurity",
      icon: Shield,
      skills: [
        "Vulnerability Assessment",
        "Penetration Testing",
        "Ethical Hacking",
        "Incident Response",
        "SOC Analysis",
        "Digital Forensics",
      ],
    },
    {
      title: "Programming & Scripting",
      icon: Code2,
      skills: [
        "Python",
        "Bash Scripting",
        "C Programming",
        "SQL",
      ],
    },
    {
      title: "Security Tools",
      icon: Wrench,
      skills: [
        "Nmap",
        "Metasploit",
        "Burp Suite",
        "Wireshark",
        "Snort/Suricata",
        "ELK Stack",
        "Splunk",
        "OpenVAS",
        "SQLMap",
        "John the Ripper",
      ],
    },
    {
      title: "Security Frameworks & Standards",
      icon: Shield,
      skills: [
        "OWASP Top 10",
        "OSINT (Open Source Intelligence)",
        "MITRE ATT&CK",
        "NIST Cybersecurity Framework",
        "ISO 27001",
      ],
    },
    {
      title: "Systems & Networking",
      icon: Server,
      skills: [
        "Linux (Ubuntu, Kali, ParrotOS)",
        "Windows Server",
        "TCP/IP Protocol Suite",
        "Network Architecture",
        "Routing & Switching",
      ],
    },
    {
      title: "SOC Operations",
      icon: Eye,
      skills: [
        "SIEM Management",
        "Log Analysis",
        "Alert Triage",
        "Incident Investigation",
        "Playbook Development",
        "Threat Detection Rules",
      ],
    },
  ];
  
  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-black to-green-950/20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono">
            <span className="text-green-400"></span> Technical Skills
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mt-4" />
          <p className="mt-4 text-green-300/80">Cybersecurity Arsenal & Expertise</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <CyberCard3D key={idx} className="p-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-green-500/30">
                <category.icon className="h-6 w-6 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    className="inline-flex items-center rounded-full border border-green-500/50 px-3 py-1 text-sm bg-black/40 text-green-400 backdrop-blur-sm hover:border-green-400 hover:shadow-[0_0_10px_rgba(0,255,0,0.3)] transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </CyberCard3D>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== Experience Section ====================
const Experience = () => {
  const experiences = [
    {
      title: "Network Security Analyst Intern",
      company: "Nepal Telecom",
      date: "Jan 2026 – Present",
      description: "Monitoring and analyzing network traffic for security threats across Nepal Telecom's infrastructure. Developing network monitoring tools, contributing to Nepal Threat Intelligence Platform, and implementing security measures for critical infrastructure. Assisting in incident response and generating detailed security reports.",
      icon: Network,
      highlights: ["Network Traffic Analysis", "Threat Intelligence", "Incident Response"],
    },
    {
      title: "SOC Analyst Intern",
      company: "NullClass EduTech — India",
      date: "Feb 2025 – Aug 2025",
      description: "Monitored security events using SIEM tools, analyzed logs for potential threats, and responded to security incidents. Conducted threat hunting activities, created correlation rules, and generated incident reports. Collaborated with the security team to improve detection capabilities.",
      icon: Eye,
      highlights: ["SIEM Monitoring", "Threat Hunting", "Incident Response", "Log Analysis"],
    },
    {
      title: "Offensive Security Researcher",
      company: "Vignan's University Security Lab",
      date: "Jan 2025 – Mar 2025",
      description: "Conducted thorough penetration testing across university web applications and internal systems, identifying and reporting security vulnerabilities with actionable remediation steps. Successfully discovered and documented valid bugs including SQL injection, cross-site scripting (XSS), IDOR, and authentication flaws. Provided detailed reports with proof-of-concepts and mitigation recommendations to development teams.",
      icon: Target,
      highlights: ["Vulnerability Assessment", "Bug Reporting", "Mitigation Strategies", "Proof-of-Concept Development"],
    },
    {
      title: "Freelance Bug Bounty Hunter",
      company: "HackerOne & Bugcrowd",
      date: "2024 – Present",
      description: "Discovered and responsibly disclosed vulnerabilities including SQLi, XSS, IDOR, and Open Redirect. Earned acknowledgments and reputation points from major programs. Specialized in manual testing, recon automation, and exploit proof-of-concepts.",
      icon: Bug,
      highlights: ["Vulnerability Discovery", "Responsible Disclosure", "Web App Security"],
    },
    
  ];
  
  return (
    <section id="experience" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono">
            <span className="text-green-400"></span> Experience Path
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mt-4" />
        </motion.div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <CyberCard3D className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 h-fit">
                    <exp.icon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-green-400">{exp.title}</h3>
                        <p className="text-sm text-green-400/80">{exp.company}</p>
                      </div>
                      <p className="text-xs text-green-500 font-mono whitespace-nowrap">{exp.date}</p>
                    </div>
                    <p className="mt-3 text-sm text-green-300/80">{exp.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exp.highlights.map((highlight, j) => (
                        <span key={j} className="px-2 py-1 bg-green-500/10 rounded text-xs text-green-400 border border-green-500/30">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CyberCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ==================== Projects Section ====================
// ==================== Projects Section ====================
const Projects = () => {
  const projects = [
    {
      title: "Nepal Threat Intelligence Platform",
      description:
        "Comprehensive threat intelligence platform for Nepal's cyber landscape, aggregating IOC feeds from multiple sources, analyzing regional threat patterns, and providing real-time alerts for Nepali organizations. Integrated with MISP and custom threat feeds.",
      tags: ["Python", "MISP", "ELK Stack", "Threat Intel", "API Integration"],
      icon: Radar,
      liveLink: "https://nepal-threat-intel.vercel.app/",
      github: null,
      isBlog: false,
      highlights: ["Real-time Alerts", "IOC Aggregation", "Regional Threat Analysis"],
    },
    {
      title: "Advanced Network Scanner",
      description:
        "Python-based advanced network scanning tool for network reconnaissance, open port detection, and live HTTP/HTTPS URL monitoring. Scans local networks to identify active hosts, open ports, and monitors web traffic routes. Includes features like service detection and banner grabbing.",
      tags: ["Python", "Scapy", "Socket Programming", "Network Scanning", "Port Scanner"],
      icon: Wifi,
      liveLink: null,
      github: "https://github.com/dipesh1546/Advanced-Network-Scanner-Application",
      isBlog: false,
      highlights: ["Port Scanning", "Live URL Monitoring", "Service Detection", "Network Mapping"],
    },
    {
      title: "Network Intrusion Detection System (NIDS)",
      description:
        "Built a hands-on Network Intrusion Detection System using Snort and Wireshark on Linux to monitor malicious traffic, detect suspicious activity, and analyze network packets in real time. Configured custom Snort rules, investigated alerts, and documented the complete setup and testing process in a technical blog.",
      tags: ["Snort", "Wireshark", "Linux", "IDS/IPS", "Firewall"],
      icon: Shield,
      liveLink:
        "https://dev.to/dipesh_kumar_2fa6e436346e/building-a-network-intrusion-detection-system-nids-with-snort-on-linux-a-complete-hands-on-guide-3bna",
      github: null,
      isBlog: true,
      highlights: ["Traffic Analysis", "Rule Configuration", "Incident Investigation", "Technical Blog"],
    },
    {
      title: "ELK Stack Log Analysis Dashboard",
      description:
        "Interactive Kibana dashboards for identifying credential stuffing and DNS tunneling attacks with real-time visualization. Configured Logstash pipelines for log ingestion and Elasticsearch for efficient log storage and querying.",
      tags: ["Elasticsearch", "Kibana", "Logstash", "Threat Hunting", "SIEM"],
      icon: BarChart3,
      liveLink: "https://dev.to/dipesh_kumar_2fa6e436346e/building-a-siem-style-threat-detection-dashboard-using-elk-stack-and-docker-5de6",
      github: null,
      isBlog: true,
      highlights: ["Real-time Visualization", "Threat Detection", "Log Analysis"],
    },
    {
      title: "Web Application Security Testing Suite",
      description:
        "Comprehensive security testing framework for web applications including SQL injection, XSS detection, and security misconfiguration analysis. Automated vulnerability scanning with custom payloads.",
      tags: ["OWASP", "Burp Suite", "SQL Injection", "XSS", "Security Testing"],
      icon: Bug,
      liveLink: null,
      github: null,
      isBlog: false,
      highlights: ["Automated Scanning", "Vulnerability Detection", "Security Reports"],
    },
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-green-950/20 to-black">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono">
            <span className="text-green-400"></span> Security Projects
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mt-4" />
          <p className="mt-4 text-green-300/80">Real-world security solutions I've built</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <CyberCard3D key={i} className="p-6">
              {/* Header with Icon and Action Buttons */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-black/50 rounded-lg border border-green-500/30">
                  <project.icon className="h-6 w-6 text-green-400" />
                </div>

                {/* Action Buttons Container */}
                <div className="flex gap-2 flex-wrap justify-end">
                  {/* Live Demo / Blog Button */}
                  {project.liveLink && (
                    <motion.a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500 rounded-lg text-sm text-green-400 hover:bg-green-500/20 hover:border-green-400 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {project.isBlog ? "Read Blog" : "Live Demo"}
                    </motion.a>
                  )}

                  {/* GitHub Button */}
                  {project.github && (
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-sm text-green-400 hover:bg-green-500/10 hover:border-green-400 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </motion.a>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-green-400 mb-2">{project.title}</h3>
              <p className="text-sm text-green-300/80 mb-4">{project.description}</p>

              {/* Highlights */}
              <div className="mb-3 flex flex-wrap gap-2">
                {project.highlights.map((highlight, j) => (
                  <span
                    key={j}
                    className="px-2 py-1 bg-green-500/10 rounded text-xs text-green-400"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="px-2 py-1 bg-black/50 rounded text-xs text-green-400 border border-green-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CyberCard3D>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== Certifications Section ====================
const Certifications = () => {
  const certifications = [
    "Ethical Hacking Bootcamp — Udemy",
    "Cybersecurity & Real-Time SOC Project — NULLCLASS",
    "Blue Team Junior Analyst",
    "Understanding Network for Ethical Hackers (EC-COUNCIL)",
    "Applied Live Forensics (EC-COUNCIL)",
    "Mastering Microsoft Sentinel (EC-COUNCIL)",
    "Power of Next Generation Firewalls (EC-COUNCIL)",
    "Google Cybersecurity (Coursera)",
    "Digital Forensics",
    "Cisco Labs Crash Course — EC-Council",
    "Practical Cybersecurity — NPTEL",
    "Network Security Fundamentals",
    "SOC Analyst Training",
    "Python for Network Security",
  ];
  
  return (
    <section id="certifications" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono">
            <span className="text-green-400"></span> Certifications
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mt-4" />
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <CyberCard3D className="p-4 flex items-center gap-3">
                <Award className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm text-green-300">{cert}</span>
              </CyberCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== Contact Section ====================
const Contact = () => {
  const contactMethods = [
    { icon: Mail, label: "dipeskush15@gmail.com", href: "mailto:dipeskush15@gmail.com" },
    { icon: Phone, label: "+91 8797596732 , +977 9707574101", href: "tel:+918797596732 , tel:+9779707574101" },
    { icon: Linkedin, label: "Dipesh Kumar", href: "https://linkedin.com/in/dipesh-kumar-22454b262" },
    { icon: MapPin, label: "Kathmandu, Nepal", href: null },
  ];
  
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot.trim() !== "") return;
    setSubmitError("");
    setSubmitting(true);
    const apiBase = process.env.REACT_APP_CONTACT_API_URL || "";
    try {
      const res = await fetch(`${apiBase}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _hp: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        let msg =
          Array.isArray(data.details) && data.details[0]
            ? data.details[0]
            : data.error || "Something went wrong. Please try again.";
        if (process.env.NODE_ENV === "development" && data.hint) {
          msg = `${msg} — ${data.hint}`;
        }
        setSubmitError(msg);
        return;
      }
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setHoneypot("");
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setSubmitError("Network error. Is the contact server running?");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <section id="contact" className="py-20 bg-gradient-to-t from-green-950/20 to-black">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-mono">
            <span className="text-green-400"></span> Contact Me
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mt-4" />
          <p className="mt-4 text-green-300/80">Let's secure the digital world together</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-6">Get In Touch</h3>
            <div className="space-y-4">
              {contactMethods.map((method, i) => (
                <motion.a
                  key={i}
                  href={method.href || "#"}
                  className="flex items-center gap-4 p-4 rounded-xl border border-green-500/30 transition-all duration-300 hover:bg-green-500/10 hover:border-green-500"
                  whileHover={{ x: 10 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <method.icon className="h-5 w-5 text-green-400" />
                  <span className="text-green-300">{method.label}</span>
                </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <CyberCard3D className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4 relative">
                <input
                  type="text"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-green-300 focus:outline-none focus:border-green-500 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-green-300 focus:outline-none focus:border-green-500 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-green-300 focus:outline-none focus:border-green-500 transition-all"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
                {submitError ? (
                  <p className="text-sm text-red-400" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={submitting ? {} : { scale: 1.02 }}
                  whileTap={submitting ? {} : { scale: 0.98 }}
                >
                  {submitting ? "Sending…" : submitted ? "✓ Message Sent" : "Send Message"}
                </motion.button>
              </form>
            </CyberCard3D>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== Footer ====================
const Footer = () => {
  return (
    <footer className="py-8 border-t border-green-500/30 bg-black/90">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm text-green-400/60">
          © 2024 Dipesh Kumar Kushwaha — Network Security Analyst | SOC Analyst | Cybersecurity Professional
        </p>
        <p className="text-xs text-green-500/40 mt-2 font-mono">
          SECURE • ETHICAL • VIGILANT • INNOVATIVE
        </p>
      </div>
    </footer>
  );
};

// ==================== Main Component ====================
export default function Portfolio() {
  const [showTop, setShowTop] = useState(false);
  
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <div className="min-h-screen bg-black text-green-300 relative">
      <ParticleBackground />
      <GlowingOrb />
      <Nav />
      <Hero />
      <Stats />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />
      
      <AnimatePresence>
        {showTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed right-6 bottom-6 z-50 p-3 bg-green-500 rounded-full shadow-lg hover:bg-green-400 transition-all"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="h-5 w-5 text-black" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}


//npm start ----- command to run the project