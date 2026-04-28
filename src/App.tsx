/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  MessageSquare, 
  LayoutDashboard, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronRight,
  FileText,
  Download,
  Users,
  Play,
  Book
} from "lucide-react";
import { cn } from "./lib/utils";
import { Logo, Button } from "./components/UI";

import DocumentsPage from "./pages/DocumentsPage";
import ChatRoom from "./components/ChatRoom";
import AdminDashboard from "./pages/AdminDashboard";

// --- Components ---

const Navbar = ({ user, onLogout, customLogo }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-secondary shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo customLogo={customLogo} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-accent hover:text-primary font-bold uppercase text-sm tracking-wide">Accueil</Link>
          <Link to="/documents" className="text-accent hover:text-primary font-bold uppercase text-sm tracking-wide">Documents</Link>
          <Link to="/tarifs" className="text-accent hover:text-primary font-bold uppercase text-sm tracking-wide">Tarifs</Link>
          {user && <Link to="/chat" className="text-accent hover:text-primary font-bold uppercase text-sm tracking-wide">Chat</Link>}
          {user ? (
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-full border border-slate-200">
              {user.isAdmin && (
                <Link to="/admin" className="px-4 py-2 text-accent hover:text-primary font-black uppercase text-xs border-r border-slate-200">
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-bold text-sm shadow-md">
                <LayoutDashboard size={16} /> DASHBOARD
              </Link>
              <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-accent hover:text-primary font-bold uppercase text-sm">Connexion</Link>
              <Link to="/register">
                <Button className="bg-secondary text-black shadow-lg hover:bg-secondary/90 border-b-4 border-black/10">S'inscrire</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-slate-200 p-4 flex flex-col gap-4 font-medium"
          >
            <Link to="/" onClick={() => setIsOpen(false)}>Accueil</Link>
            <Link to="/documents" onClick={() => setIsOpen(false)}>Documents</Link>
            <Link to="/tarifs" onClick={() => setIsOpen(false)}>Tarifs</Link>
            {user && <Link to="/chat" onClick={() => setIsOpen(false)}>Chat</Link>}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="text-left text-red-500">Deconnexion</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <Link to="/login" onClick={() => setIsOpen(false)}>Connexion</Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">S'inscrire</Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const LandingPage = () => {
  const [tariffs, setTariffs] = useState<any[]>(() => {
    const saved = localStorage.getItem("m_tariffs");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Base", price: "29€", features: ["Accès aux documents", "Soutien par mail", "1 cours live / mois"], popular: false },
      { name: "Premium", price: "59€", features: ["Tout le pack Base", "Chat illimité profs", "Cours live illimités"], popular: true },
    ];
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 text-secondary-foreground rounded-full text-sm font-semibold mb-6">
              <Users size={16} /> +1000 Étudiants nous font confiance
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Apprenez sans <span className="text-primary italic">limites</span> avec Merkez Allimni
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              Une plateforme éducative complète pour réussir vos examens, approfondir vos connaissances et discuter en direct avec les meilleurs professeurs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button className="h-14 px-10 text-lg">Commencer maintenant</Button>
              </Link>
              <Button variant="outline" className="h-14 px-10 text-lg">Voir les cours</Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:block hidden"
          >
            <div className="aspect-square bg-primary rounded-[60px] rotate-6 relative overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
                alt="Education" 
                className="absolute inset-0 w-full h-full object-cover -rotate-6 scale-125 opacity-80 mix-blend-overlay"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-white">
                <FileText />
              </div>
              <div>
                <div className="font-bold">500+ Documents</div>
                <div className="text-sm text-slate-500">Ressources gratuites</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Cours Live", value: "24/7" },
            { label: "Professeurs", value: "50+" },
            { label: "Réussite", value: "98%" },
            { label: "Documents", value: "2k+" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Tarifs */}
      <section id="tarifs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Nos Tarifs</h2>
            <p className="text-slate-600 italic">Des forfaits adaptés à vos besoins pour un apprentissage serein.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {tariffs.map((plan, i) => (
              <div 
                key={i}
                className={cn(
                  "p-8 rounded-3xl border-2 transition-all hover:translate-y-2",
                  plan.popular ? "border-primary bg-primary/5 relative shadow-lg" : "border-slate-100 bg-white"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Plus Populaire
                  </div>
                )}
                <div className="text-xl font-bold mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-slate-500">/mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-600">
                      <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <ChevronRight size={14} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button variant={plan.popular ? "primary" : "outline"} className="w-full">Choisir ce plan</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const Dashboard = ({ user }: any) => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<any[]>(() => JSON.parse(localStorage.getItem("m_subjects") || "[]"));
  const [activeView, setActiveView] = useState("overview");

  const [materials] = useState([
    { id: 1, title: "Support de Cours - Unité 1", subject: "Anglais", type: "PDF Consult" },
    { id: 2, title: "Fiches de Révision - Chapitre 4", subject: "Maths", type: "PDF Consult" },
  ]);

  const [recordings] = useState([
    { id: 1, title: "Session Live - Grammaire", date: "2024-04-20", duration: "45 min" },
    { id: 2, title: "Correction TD 3 - Algèbre", date: "2024-04-22", duration: "1h 10min" },
  ]);

  const [corrections] = useState([
    { id: 1, title: "Correction Examen Blanc Français", date: "2024-04-25" },
    { id: 2, title: "Corrigé Devoir Surveillé Maths", date: "2024-04-26" },
  ]);

  if (!user) {
    useEffect(() => { navigate("/login"); }, []);
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">Bonjour, {user.name} 👋</h1>
          <p className="text-slate-500 italic font-medium">Prêt pour votre prochaine leçon ?</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {["overview", "materials", "recordings", "corrections"].map((v) => (
            <button 
              key={v}
              onClick={() => setActiveView(v)}
              className={cn(
                "px-6 py-2 rounded-full font-bold text-sm transition-all capitalize",
                activeView === v ? "bg-primary text-white shadow-lg" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              {v === "materials" ? "Supports" : v}
            </button>
          ))}
          <Link to="/chat">
            <Button className="gap-2 bg-secondary text-black shadow-lg hover:scale-105 transition-all">
              <MessageSquare size={18} /> Chat Professeurs
            </Button>
          </Link>
        </div>
      </div>

      {activeView === "overview" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Subjects / Matières Grid */}
            <div>
              <h3 className="font-black text-xl mb-6 uppercase flex items-center gap-2">
                <Book size={20} className="text-primary" /> Vos Matières
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map((sub, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-primary group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:m-0" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:bg-white group-hover:text-primary">
                        <Book size={24} />
                      </div>
                      <h4 className="font-black text-lg group-hover:text-white transition-colors">{sub.name}</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase mb-4 group-hover:text-white/80 transition-colors tracking-widest">{sub.teacher}</p>
                      <Link to="/chat">
                        <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1 group-hover:text-white transition-colors">
                          Message au prof <ChevronRight size={14} />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Cours suivis", value: "12", color: "bg-blue-50 text-blue-600" },
                { label: "Quizz réussis", value: "8", color: "bg-green-50 text-green-600" },
                { label: "Temps d'étude", value: "24h", color: "bg-purple-50 text-purple-600" },
              ].map((stat, i) => (
                <div key={i} className={cn("p-6 rounded-[32px] text-center", stat.color)}>
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-accent text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <h3 className="text-2xl font-black mb-4 uppercase leading-none tracking-tighter">Support Technique</h3>
              <p className="text-white/70 text-sm mb-6 leading-relaxed italic">Besoin d'aide avec la plateforme ? Notre équipe est là 24/7.</p>
              <Button className="w-full bg-secondary text-black font-black uppercase shadow-xl hover:translate-y-[-2px] transition-all">
                Contacter Support
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeView === "materials" && (
        <div className="grid md:grid-cols-3 gap-6">
          {materials.map((mat) => (
            <div key={mat.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <FileText size={24} />
              </div>
              <h4 className="font-bold text-lg mb-1">{mat.title}</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">{mat.subject}</p>
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-center text-[10px] font-black uppercase flex items-center justify-center gap-2">
                <ShieldCheck size={14} /> Consultation Uniquement (Protégé)
              </div>
              <button className="w-full mt-4 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors">
                Ouvrir le Lecteur
              </button>
            </div>
          ))}
        </div>
      )}

      {activeView === "recordings" && (
        <div className="grid md:grid-cols-2 gap-6">
          {recordings.map((rec) => (
            <div key={rec.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                  <Play size={24} />
                </div>
                <div>
                  <h4 className="font-black text-xl">{rec.title}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{rec.date} • {rec.duration}</p>
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-6 italic leading-relaxed">Visionnez l'enregistrement de la session live en différé.</p>
              <button className="w-full py-4 border-2 border-slate-100 rounded-2xl font-black uppercase text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Visionner le cours
              </button>
            </div>
          ))}
        </div>
      )}

      {activeView === "corrections" && (
        <div className="space-y-4">
          {corrections.map((corr) => (
            <div key={corr.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold">{corr.title}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{corr.date}</p>
                </div>
              </div>
              <button className="px-6 py-2 bg-slate-50 text-slate-600 font-bold rounded-full text-xs hover:bg-primary hover:text-white transition-all uppercase">
                Consulter
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App ---

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [customLogo, setCustomLogo] = useState<string | null>(() => localStorage.getItem("m_logo"));
  const navigate = useNavigate();

  useEffect(() => {
    if (customLogo) {
      localStorage.setItem("m_logo", customLogo);
    }
  }, [customLogo]);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const nameInput = e.target.querySelector('input[type="text"]');
    const email = emailInput?.value || "";
    const name = nameInput?.value || email.split('@')[0];
    
    setUser({ 
      id: "1", 
      name: name, 
      email: email,
      isAdmin: email.includes("admin") 
    });
    
    if (email.includes("admin")) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogoChange = (newLogo: string) => {
    setCustomLogo(newLogo);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar user={user} onLogout={handleLogout} customLogo={customLogo} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/login" element={
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
              <h1 className="text-3xl font-bold mb-6">Connexion</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 capitalize">email</label>
                  <input type="email" required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" placeholder="vous@exemple.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 capitalize">mot de passe</label>
                  <input type="password" required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full py-4 text-lg mt-4">Se connecter</Button>
              </form>
            </div>
          } />
          <Route path="/register" element={
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-sm border border-slate-100 text-center">
              <h1 className="text-3xl font-bold mb-4">Créer un compte</h1>
              <p className="text-slate-500 mb-8 italic">Rejoignez Merkez Allimni aujourd'hui.</p>
              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium mb-1 capitalize">nom complet</label>
                  <input type="text" required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" placeholder="Prénom Nom" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 capitalize">email</label>
                  <input type="email" required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" placeholder="vous@exemple.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 capitalize">mot de passe</label>
                  <input type="password" required className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full py-4 text-lg mt-4">S'inscrire</Button>
              </form>
            </div>
          } />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/tarifs" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard onLogoChange={handleLogoChange} />} />
          <Route path="/chat" element={
            <div className="h-[calc(100vh-80px)] p-8 flex items-center justify-center bg-slate-100">
               <ChatRoom user={user} />
            </div>
          } />
        </Routes>
      </main>

      <footer className="bg-accent text-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Logo className="brightness-0 invert" customLogo={customLogo} />
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Votre partenaire de réussite éducative. Nous transformons l'apprentissage en ligne pour les étudiants de demain.
            </p>
          </div>
          <div>
            <div className="font-bold mb-6 text-lg">Liens Rapides</div>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/documents" className="hover:text-primary transition-colors">Documents</Link></li>
              <li><Link to="/tarifs" className="hover:text-primary transition-colors">Tarifs</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-6 text-lg">Contact</div>
            <ul className="space-y-4 text-slate-400">
              <li>contact@merkez-allimni.com</li>
              <li>+33 1 23 45 67 89</li>
              <li className="text-primary italic">www.Merkez-allimni.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
          © 2026 Merkez Allimni. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
