import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  ExternalLink,
  Shield,
  Terminal,
  Gauge,
  GitBranch,
  FileDown,
  ArrowUp,
  ChevronDown,
} from "lucide-react";

const PROFILE_SRC = "/profile.jpg";
const FALLBACK_AVATAR =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='208' height='208' viewBox='0 0 208 208'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#00ff00'/>
        <stop offset='100%' stop-color='#00ff99'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' rx='104' fill='url(#g)'/>
    <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, system-ui' font-size='72' fill='black'>DK</text>
  </svg>`);

// Smooth scroll
if (typeof window !== "undefined") {
  try {
    document.documentElement.style.scrollBehavior = "smooth";
  } catch (e) {}
}

// --- Section wrapper ---
const Section = ({ id, title, subtitle, children }) => (
  <section
    id={id}
    className="max-w-6xl mx-auto px-6 py-20 scroll-mt-24"
    aria-labelledby={`${id}-title`}
  >
    <motion.h2
      id={`${id}-title`}
      className="text-3xl md:text-4xl font-bold tracking-tight text-green-400"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <p className="mt-2 text-green-300/80 text-lg">{subtitle}</p>
    )}
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  </section>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-green-500 px-3 py-1 text-sm bg-black/30 text-green-400 backdrop-blur-sm">
    {children}
  </span>
);

// --- Data ---
const projects = [
  {
    title: "ELK Stack Log Analysis",
    summary:
      "Built dashboards in Kibana to surface IOC patterns like credential stuffing and DNS tunneling; supported proactive incident response.",
    tags: ["Elasticsearch", "Logstash", "Kibana", "Threat Hunting"],
  },
  {
    title: "SOC Workflow Automation with Python",
    summary:
      "Automated log ingestion, alert enrichment, and threat intel lookups (VirusTotal, MISP) to accelerate investigations.",
    tags: ["Python", "APIs", "Automation", "MISP", "VirusTotal"],
  },
  {
    title: "Web Application Security Testing",
    summary:
      "Conducted VAPT aligned to OWASP; identified SQLi/XSS, recommended WAF, input validation, and secure config baselines.",
    tags: ["OWASP", "Burp Suite", "Metasploit", "SQLi", "XSS"],
  },
  {
    title: "Network IDS & Incident Response",
    summary:
      "Deployed Snort + Wireshark on Linux; tuned rules, investigated alerts, and implemented firewall mitigations.",
    tags: ["Snort", "Wireshark", "Linux", "Firewall"],
  },
  {
    title: "Bug Bounty Findings",
    summary:
      "Discovered SQLi, XSS, and misconfigurations in real-world apps; responsibly disclosed via HackerOne/Bugcrowd.",
    tags: ["Bug Bounty", "HackerOne", "Bugcrowd", "OWASP"],
  },
];

const skills = {
  Cybersecurity: [
    "VAPT",
    "Ethical Hacking",
    "SOC Analysis",
    "Threat Detection",
    "Incident Response",
    "Web App Security",
    "Digital Forensics",
    "Cryptography",
    "Bug Bounty Hunting",
    "Red Teaming",
    "Exploit Development",
  ],
  Programming: ["Python", "Java", "C"],
  Tools: ["Nmap", "Metasploit", "Burp Suite", "Wireshark", "ELK Stack", "Splunk", "OpenVAS"],
  "Systems & Networking": ["Linux", "Computer Networking", "Network Security"],
  Frameworks: ["OWASP", "CISCO"],
  "Automation & Analysis": ["SOC automation scripts", "Threat intel enrichment", "ELK correlation rules"],
};

const certifications = [
  "Ethical Hacking Bootcamp — Udemy",
  "Cybersecurity & Real-Time SOC Project — NULLCLASS",
  "Blue Team Junior Analyst",
  "Google Cybersecurity (Coursera)",
  "Digital Forensics",
  "Cisco Labs Crash Course — EC-Council",
  "Practical Cybersecurity — NPTEL",
  "MERN Full Stack",
];

const education = [
  {
    school: "Vignan’s University",
    place: "Guntur, Andhra Pradesh, India",
    degree: "B.Tech in Cybersecurity",
    span: "2022 – 2026",
    detail: "CGPA: 7.1 (till completion of 3rd year)",
  },
  { school: "DAV Sushil Kedia Viswa Bharati Secondary School", place: "Lalitpur, Nepal", degree: "Intermediate (PCM)", span: "2022" },
  { school: "Viswa Niketan Secondary School", place: "Kathmandu, Nepal", degree: "Secondary School", span: "2020", detail: "GPA: 3.60 / 4" },
];

const experience = [
  {
    role: "Freelance Bug Bounty Hunter",
    span: "2024 – Present",
    details: [
      "Discovered and disclosed vulnerabilities (SQLi, XSS, IDOR, Open Redirect) in real-world apps.",
      "Reported findings on HackerOne and Bugcrowd; earned acknowledgments and reputation.",
      "Specialized in manual testing, recon automation, and exploit proof-of-concepts.",
    ],
  },
  {
    role: "Offensive Security Labs — Vignan’s University",
    span: "2025 – Present",
    details: [
      "Conducted VAPT on college applications, identified misconfigurations and vulnerabilities.",
      "Submitted reports with remediation steps to improve institutional security.",
      "Hands-on with Burp Suite, Nmap, SQLMap, Metasploit.",
    ],
  },
  {
    role: "SOC/Blue Team Hands-on Projects",
    span: "2024 – Present",
    details: [
      "Built ELK dashboards to visualize intrusion attempts and detect brute-force & DNS tunneling.",
      "Wrote custom SIEM correlation rules with Threat Intel enrichment.",
      "Executed incident response playbooks: log analysis, firewall rules, and containment actions.",
    ],
  },
];

const contacts = [
  { icon: Mail, label: "dipeskush15@gmail.com", href: "mailto:dipeskush15@gmail.com" },
  { icon: Phone, label: "+91 8797596732", href: "tel:+918797596732" },
  { icon: Linkedin, label: "linkedin.com/in/dipesh-kumar-22454b262", href: "https://linkedin.com/in/dipesh-kumar-22454b262" },
  { icon: MapPin, label: "Guntur, Andhra Pradesh, India" },
];

// --- Components ---
const Nav = () => {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "skills", "education", "experience", "projects", "certs", "contact"];
      let current = "home";
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 140;
          if (window.scrollY >= el.offsetTop - offset) current = id;
        }
      });
      setActive(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const linkClass = (id) => (active === id ? "underline font-semibold text-green-400" : "hover:underline text-green-300");

  return (
    <div className="sticky top-0 z-50 w-full border-b border-green-800 backdrop-blur bg-black/80">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <a href="#home" className="font-bold tracking-tight text-lg text-green-400">Dipesh Kumar</a>
        <div className="hidden md:flex gap-6 text-sm">
          {["skills","education","experience","projects","certs","contact"].map((id) => (
            <a key={id} href={`#${id}`} aria-current={active===id?"page":undefined} className={linkClass(id)}>
              {id.charAt(0).toUpperCase()+id.slice(1)}
            </a>
          ))}
        </div>
        <a href="#contact" className="md:hidden text-sm underline text-green-400">Contact</a>
      </nav>
    </div>
  );
};

// --- Hero with animated name & typewriter ---
const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Cybersecurity Professional | Ethical Hacking | Bug Bounty";
  const [src, setSrc] = useState(PROFILE_SRC);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="home" className="relative overflow-hidden bg-black min-h-[90vh] flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-600 to-green-800 animate-gradient-x opacity-20 -z-10" />
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-200 to-green-400 animate-text"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Dipesh Kumar Kushwaha
          </motion.h1>
          <motion.p className="mt-4 text-lg md:text-xl text-green-400 font-mono h-8">
            {typedText}
          </motion.p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Pill><Shield className="mr-2 h-4 w-4" /> Threat Detection</Pill>
            <Pill><Terminal className="mr-2 h-4 w-4" /> VAPT</Pill>
            <Pill><Gauge className="mr-2 h-4 w-4" /> ELK Dashboards</Pill>
            <Pill><GitBranch className="mr-2 h-4 w-4" /> SOC Automation</Pill>
          </div>
          <div className="mt-10 flex justify-center md:justify-start">
            <ChevronDown className="h-8 w-8 animate-bounce text-green-400 opacity-70" />
          </div>
        </div>
        <motion.img
          src={src}
          onError={() => setSrc(FALLBACK_AVATAR)}
          alt="Dipesh Kumar Kushwaha"
          className="w-52 h-52 rounded-full border-4 border-green-400 shadow-lg object-cover"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </header>
  );
};

// --- Remaining Sections ---
const Skills = () => (
  <Section id="skills" title="Skills & Abilities" subtitle="Hands-on experience across offensive testing, bug bounty, and blue-team operations.">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(skills).map(([cat, items]) => (
        <motion.div key={cat} className="neon-card rounded-2xl p-5" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="font-semibold mb-3 text-green-300">{cat}</h3>
          <div className="flex flex-wrap gap-2">
            {items.map((it) => (<Pill key={it}>{it}</Pill>))}
          </div>
        </motion.div>
      ))}
    </div>
  </Section>
);

const Education = () => (
  <Section id="education" title="Education">
    <ol className="relative border-s border-green-800 pl-6 space-y-10">
      {education.map((e, i) => (
        <li key={i} className="ms-4">
          <div className="absolute w-3 h-3 bg-green-400 rounded-full mt-2.5 -start-1.5 border" />
          <h3 className="font-semibold text-green-300">{e.degree}</h3>
          <p className="text-sm text-green-400">{e.school} — {e.place}</p>
          <div className="text-sm mt-1">{e.span}{e.detail ? ` · ${e.detail}` : ""}</div>
        </li>
      ))}
    </ol>
  </Section>
);

const Experience = () => (
  <Section id="experience" title="Experience">
    <ol className="relative border-s border-green-800 pl-6 space-y-10">
      {experience.map((ex, i) => (
        <li key={i} className="ms-4">
          <div className="absolute w-3 h-3 bg-green-400 rounded-full mt-2.5 -start-1.5 border" />
          <h3 className="font-semibold text-green-300">{ex.role}</h3>
          <p className="text-sm text-green-400">{ex.span}</p>
          <ul className="mt-2 list-disc list-inside text-sm text-green-400 space-y-1">
            {ex.details.map((d, j) => (<li key={j}>{d}</li>))}
          </ul>
        </li>
      ))}
    </ol>
  </Section>
);

const Projects = () => (
  <Section id="projects" title="Projects" subtitle="Selected work demonstrating practical security outcomes.">
    <div className="grid md:grid-cols-2 gap-6">
      {projects.map((p) => (
        <motion.article key={p.title} className="neon-card rounded-2xl p-6" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-lg font-semibold tracking-tight text-green-300">{p.title}</h3>
          <p className="mt-2 text-sm text-green-400">{p.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.tags.map((t) => (<Pill key={t}>{t}</Pill>))}
          </div>
        </motion.article>
      ))}
    </div>
  </Section>
);

const Certs = () => (
  <Section id="certs" title="Certificates">
    <ul className="grid md:grid-cols-2 gap-3">
      {certifications.map((c) => (
        <li key={c} className="neon-card rounded-xl p-4 text-sm text-green-300">{c}</li>
      ))}
    </ul>
  </Section>
);

const Footer = () => (
  <footer id="contact" className="border-t border-green-800 scroll-mt-24 bg-black/90 text-green-300">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h3 className="text-2xl font-bold text-green-400">Let’s connect</h3>
      <p className="mt-2 max-w-2xl">
        Open to internships and roles in SOC, blue team, and security engineering. Prefer hands-on environments where I can build, automate, and defend.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {contacts.slice(0, 3).map(({ icon: Icon, label, href }) => (
          <a key={label} href={href} className="inline-flex items-center gap-2 rounded-xl border border-green-400 px-4 py-2 text-green-300 hover:bg-green-900/20">
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
          </a>
        ))}
      </div>
      <p className="mt-8 text-xs text-green-500">© {new Date().getFullYear()} Dipesh Kumar Kushwaha — Cybersecurity Portfolio</p>
    </div>
  </footer>
);

export default function Portfolio() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-green-300 relative">
      <Nav />
      <Hero />
      <Skills />
      <Education />
      <Experience />
      <Projects />
      <Certs />
      <Footer />

      {showTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed right-6 bottom-6 z-50 rounded-full bg-green-600 text-black p-3 shadow-lg hover:bg-green-400 transition"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
