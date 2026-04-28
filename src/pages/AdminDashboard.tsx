import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Plus, 
  Search, 
  MoreVertical,
  Mail,
  Info,
  CheckCircle,
  Clock,
  TrendingUp,
  ShieldCheck,
  Image as ImageIcon,
  Upload,
  Trash2,
  Edit2,
  Book,
  Heart,
  Settings,
  Phone,
  Layout,
  Globe,
  Cloud,
  X
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
import { Logo } from "../components/UI";

// --- Types ---
interface Student { id: number; name: string; email: string; plan: string; status: string; joinDate: string; }
interface Doc { id: number; title: string; category: string; downloads: number; date: string; }
interface Tariff { id: number; name: string; price: string; features: string[]; popular: boolean; }
interface Subject { id: number; name: string; teacher: string; studentsCount: number; }
interface Testimonial { id: number; name: string; role: string; content: string; avatar?: string; }
interface SiteSection { id: string; title: string; subtitle: string; content: string; }
interface ContactInfo { phone: string; email: string; address: string; facebook: string; instagram: string; }

export default function AdminDashboard({ onLogoChange }: { onLogoChange?: (logo: string) => void }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedUser = localStorage.getItem("m_user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    const userObj = JSON.parse(savedUser);
    if (!userObj.isAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState("users");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Data States (Loaded from LocalStorage or Defaults)
  const [students, setStudents] = useState<any[]>(() => JSON.parse(localStorage.getItem("m_users") || "[]"));
  const [documents, setDocuments] = useState<Doc[]>(() => JSON.parse(localStorage.getItem("m_docs") || "[]"));
  const [tariffs, setTariffs] = useState<Tariff[]>(() => JSON.parse(localStorage.getItem("m_tariffs") || "[]"));
  const [subjects, setSubjects] = useState<Subject[]>(() => JSON.parse(localStorage.getItem("m_subjects") || "[]"));

  const [staff, setStaff] = useState<any[]>(() => JSON.parse(localStorage.getItem("m_staff") || "[]"));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => JSON.parse(localStorage.getItem("m_testimonials") || "[]"));
  const [sections, setSections] = useState<SiteSection[]>(() => JSON.parse(localStorage.getItem("m_sections") || "[]"));
  const [gallery, setGallery] = useState<any[]>(() => JSON.parse(localStorage.getItem("m_gallery") || "[]"));
  const [contact, setContact] = useState<ContactInfo>(() => JSON.parse(localStorage.getItem("m_contact") || JSON.stringify({
    phone: "+216 22 000 000",
    email: "contact@merkez.tn",
    address: "Tunis, Tunisie",
    facebook: "#",
    instagram: "#"
  })));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [webmailUrl, setWebmailUrl] = useState(localStorage.getItem("m_webmail_url") || "https://webmail.merkez.com");

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("m_webmail_url", webmailUrl);
    alert("Paramètres enregistrés ! Le lien Webmail a été mis à jour.");
  };

  const generateProEmail = () => {
    if (nameInputRef.current && emailInputRef.current) {
      const name = nameInputRef.current.value.trim();
      if (name) {
        const generated = `${name.toLowerCase().replace(/\s+/g, '.')}@merkez.com`;
        emailInputRef.current.value = generated;
      } else {
        alert("Veuillez d'abord saisir un nom.");
      }
    }
  };

  // Initialize defaults if empty
  useEffect(() => {
    if (students.length === 0) {
      const defaults = [
        { id: 1001, name: "Fatma K.", email: "fatma@uvt.tn", password: "123", phone: "+216 22 123 456", role: "Session Femme", status: "Actif", date: "12/01/2024" },
        { id: 1002, name: "Ahmed B.", email: "ahmed@gmail.com", password: "123", phone: "+216 55 987 654", role: "Session Enfant", status: "En attente", date: "05/03/2024" }
      ];
      setStudents(defaults);
      localStorage.setItem("m_users", JSON.stringify(defaults));
    }
    if (staff.length === 0) {
      const defaults = [
        { id: 2001, name: "Dr. Ahmed", email: "ahmed@merkez.com", password: "password123", role: "Enseignant", subject: "Maths" },
        { id: 2002, name: "Admin Fatma", email: "fatma@admin.com", password: "admin", role: "Administrateur", subject: "Administration" }
      ];
      setStaff(defaults);
      localStorage.setItem("m_staff", JSON.stringify(defaults));
    }
    if (documents.length === 0) {
      const defaults = [
        { id: 3001, title: "Algèbre Linéaire", category: "Maths", downloads: 154, date: "2024-04-15" }
      ];
      setDocuments(defaults);
      localStorage.setItem("m_docs", JSON.stringify(defaults));
    }
    if (tariffs.length === 0) {
      const defaults = [
        { id: 4001, name: "Base", price: "29€", features: ["Accès Docs"], popular: false },
        { id: 4002, name: "Premium", price: "59€", features: ["Tout illimité"], popular: true }
      ];
      setTariffs(defaults);
      localStorage.setItem("m_tariffs", JSON.stringify(defaults));
    }
    if (subjects.length === 0) {
      const defaults = [
        { id: 5001, name: "Anglais", teacher: "Mme. Sarah", studentsCount: 20 },
        { id: 5002, name: "Français", teacher: "M. Jean", studentsCount: 15 }
      ];
      setSubjects(defaults);
      localStorage.setItem("m_subjects", JSON.stringify(defaults));
    }
    if (testimonials.length === 0) {
      const defaults = [
        { id: 6001, name: "Sonia M.", role: "Mère d'élève", content: "Mon fils a fait d'énormes progrès en arabe grâce au centre." },
        { id: 6002, name: "Youssef K.", role: "Étudiant", content: "Les cours enregistrés m'aident beaucoup pour réviser à mon rythme." }
      ];
      setTestimonials(defaults);
      localStorage.setItem("m_testimonials", JSON.stringify(defaults));
    }
    if (sections.length === 0) {
      const defaults = [
        { id: "kids", title: "Sessions Enfants", subtitle: "Éveil et Apprentissage", content: "Programmes ludiques adaptés aux enfants." },
        { id: "women", title: "Sessions Femmes", subtitle: "Épanouissement Personnel", content: "Cours réservés aux femmes dans un cadre serein." },
        { id: "ortho", title: "Orthophonie", subtitle: "Accompagnement Spécialisé", content: "Séances individuelles pour les troubles du langage." }
      ];
      setSections(defaults);
      localStorage.setItem("m_sections", JSON.stringify(defaults));
    }
  }, []);

  // Persistence
  useEffect(() => { localStorage.setItem("m_users", JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem("m_staff", JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem("m_docs", JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem("m_tariffs", JSON.stringify(tariffs)); }, [tariffs]);
  useEffect(() => { localStorage.setItem("m_subjects", JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem("m_testimonials", JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem("m_sections", JSON.stringify(sections)); }, [sections]);
  useEffect(() => { localStorage.setItem("m_gallery", JSON.stringify(gallery)); }, [gallery]);
  useEffect(() => { localStorage.setItem("m_contact", JSON.stringify(contact)); }, [contact]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (onLogoChange) onLogoChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // CRUD Handlers
  const deleteItem = (id: number | string, type: string) => {
    if (type === "users") {
      setStudents(students.filter(s => s.id !== id));
      localStorage.setItem("m_users", JSON.stringify(students.filter(s => s.id !== id)));
    }
    if (type === "staff") setStaff(staff.filter(s => s.id !== id));
    if (type === "docs") setDocuments(documents.filter(d => d.id !== id));
    if (type === "tariffs") setTariffs(tariffs.filter(t => t.id !== id));
    if (type === "subjects") setSubjects(subjects.filter(s => s.id !== id));
    if (type === "testimonials") setTestimonials(testimonials.filter(t => t.id !== id));
    if (type === "gallery") setGallery(gallery.filter(g => g.id !== id));
  };

  const handleStatusUpdate = (id: number, newStatus: string) => {
    const updated = students.map(s => s.id === id ? { ...s, status: newStatus } : s);
    setStudents(updated);
    localStorage.setItem("m_users", JSON.stringify(updated));

    if (newStatus === "Actif") {
      const targetUser = students.find(s => s.id === id);
      if (targetUser) {
        // Send a welcome message from Admin to Student
        const welcomeMessage = {
          room: targetUser.name,
          text: `Bienvenue ${targetUser.name} ! Votre inscription a été acceptée. Vous avez maintenant accès à tous vos cours et supports.`,
          senderName: "Support Admin",
          timestamp: new Date().toISOString(),
        };
        const currentMessages = JSON.parse(localStorage.getItem(`chat_${targetUser.name}`) || "[]");
        localStorage.setItem(`chat_${targetUser.name}`, JSON.stringify([...currentMessages, welcomeMessage]));
      }
    }
  };

  const openForm = (item: any = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const saveItem = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data: any = Object.fromEntries(formData.entries());
    
    const id = editingItem ? editingItem.id : Date.now();
    
    if (activeTab === "users") {
      const newUser = { 
        ...data, 
        id, 
        date: editingItem?.date || new Date().toLocaleDateString("fr-FR"), 
        status: editingItem?.status || "En attente",
        email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@merkez.com`
      };
      setStudents(editingItem ? students.map(s => s.id === id ? newUser : s) : [...students, newUser]);
    } else if (activeTab === "staff") {
      const newStaff = { 
        ...data, 
        id,
        email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@merkez.com`
      };
      setStaff(editingItem ? staff.map(s => s.id === id ? newStaff : s) : [...staff, newStaff]);
    } else if (activeTab === "testimonials") {
      const newT = { ...data, id };
      setTestimonials(editingItem ? testimonials.map(t => t.id === id ? newT : t) : [...testimonials, newT]);
    } else if (activeTab === "sections") {
      const newS = { ...data, id: editingItem?.id || data.id };
      setSections(sections.map(s => s.id === newS.id ? newS : s));
    } else if (activeTab === "docs") {
      let fileData = editingItem?.fileData || null;
      let size = editingItem?.size || "0 KB";
      
      const fileInput = e.target.querySelector('input[type="file"]');
      const file = fileInput?.files?.[0];
      
      if (file) {
        size = (file.size / 1024 / 1024).toFixed(1) + " MB";
        fileData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result);
          reader.readAsDataURL(file);
        });
      }

      const newDoc = { 
        ...data, 
        id, 
        downloads: editingItem?.downloads || 0, 
        date: new Date().toISOString().split('T')[0],
        size,
        format: file?.name?.split('.').pop()?.toUpperCase() || "PDF",
        fileData
      };
      setDocuments(editingItem ? documents.map(d => d.id === id ? newDoc : d) : [...documents, newDoc]);
    } else if (activeTab === "subjects") {
      const newSub = { ...data, id, studentsCount: editingItem?.studentsCount || 0 };
      setSubjects(editingItem ? subjects.map(s => s.id === id ? newSub : s) : [...subjects, newSub]);
    } else if (activeTab === "tariffs") {
      const newTariff = { ...data, id, features: data.features.split(','), popular: data.popular === "on" };
      setTariffs(editingItem ? tariffs.map(t => t.id === id ? newTariff : t) : [...tariffs, newTariff]);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-96px)] bg-slate-50 relative">
      <aside className="w-64 bg-accent text-white p-6 hidden lg:block sticky top-24 h-[calc(100vh-96px)]">
        <div className="flex items-center gap-2 mb-10 px-2">
          <ShieldCheck className="text-secondary" />
          <span className="font-bold tracking-wider">ADMIN PANEL</span>
        </div>
        
        <nav className="space-y-2 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          {[
            { id: "users", label: "Utilisateurs", icon: Users },
            { id: "staff", label: "Maitresses", icon: ShieldCheck },
            { id: "docs", label: "Documents", icon: FileText },
            { id: "subjects", label: "Matières", icon: Book },
            { id: "tariffs", label: "Tarifs", icon: CreditCard },
            { id: "testimonials", label: "Témoignages", icon: Heart },
            { id: "sections", label: "Contenu Site", icon: Layout },
            { id: "gallery", label: "Galerie Photos", icon: ImageIcon },
            { id: "support", label: "Support Chat", icon: MessageSquare },
            { id: "settings", label: "Paramètres", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">Gestion de {activeTab}</h1>
            <p className="text-slate-500 italic">Modifier, ajouter ou supprimer des éléments de la plateforme.</p>
          </div>
          <div className="flex gap-4">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <a 
              href={webmailUrl} 
              target="_blank" 
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-full transition-all"
              onClick={(e) => {
                if (webmailUrl.includes("merkez.com")) {
                  alert("Note: Le domaine merkez.com est fictif. Configurez votre propre lien Webmail dans l'onglet Paramètres.");
                }
              }}
            >
              <Mail size={18} />
              Webmail
            </a>
            {activeTab !== "support" && (
              <button 
                onClick={() => activeTab === "settings" ? fileInputRef.current?.click() : openForm()}
                className="flex items-center gap-2 px-6 py-3 bg-secondary text-black font-black rounded-full shadow-lg hover:translate-y-[-2px] transition-all"
              >
                <Plus size={20} /> {activeTab === "settings" ? "LOGO" : "AJOUTER"}
              </button>
            )}
          </div>
        </header>

        {/* Dynamic List */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          {activeTab === "support" ? (
             <div className="p-20 text-center text-slate-400">
               <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
               <p className="italic">Le centre de support est disponible via l'onglet de chat principal.</p>
             </div>
          ) : activeTab === "settings" ? (
            <div className="p-12 space-y-12">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Guide Section */}
                <div className="bg-blue-600 p-8 md:p-12 rounded-[40px] text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                      <Info size={24} /> Créer vos comptes réels
                    </h3>
                    <p className="text-blue-100 mb-8 max-w-xl leading-relaxed">
                      L'application permet à vos élèves de se connecter avec une adresse @merkez.com. Pour que ces boîtes existent réellement, vous devez :
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                        <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-black mb-4">1</div>
                        <h4 className="font-bold mb-2">Domaine</h4>
                        <p className="text-[11px] text-blue-100">Acheter "merkez.com" sur OVH ou Gandi.</p>
                      </div>
                      <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                        <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-black mb-4">2</div>
                        <h4 className="font-bold mb-2">Hébergeur</h4>
                        <p className="text-[11px] text-blue-100">Prendre un pack Mail (Zoho, Outlook, etc).</p>
                      </div>
                      <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                        <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-black mb-4">3</div>
                        <h4 className="font-bold mb-2">Configuration</h4>
                        <p className="text-[11px] text-blue-100">Lier le domaine et créer vos utilisateurs.</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Deployment Guide Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[40px] text-white shadow-xl relative overflow-hidden md:col-span-2">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                        <Globe size={28} className="text-secondary" /> Mettre mon site en ligne
                      </h3>
                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-secondary">
                            <Plus size={24} />
                          </div>
                          <h4 className="font-black uppercase tracking-widest text-sm">1. Partage Rapide</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            C'est la méthode la plus simple. Cliquez sur le bouton <span className="text-white font-bold">"Share"</span> en haut à droite de votre écran. Vous obtiendrez un lien public que vous pouvez envoyer directement à vos élèves.
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                            <Cloud size={24} />
                          </div>
                          <h4 className="font-black uppercase tracking-widest text-sm">2. Hébergement Pro</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Exportez votre code vers <span className="text-white font-bold">GitHub</span> via le menu Paramètres de l'éditeur, puis liez-le à <span className="text-white font-bold">Vercel</span> ou <span className="text-white font-bold">Netlify</span> pour avoir votre propre adresse (ex: ma-plateforme.vercel.app).
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400">
                            <ShieldCheck size={24} />
                          </div>
                          <h4 className="font-black uppercase tracking-widest text-sm">3. Via Firebase</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Puisque votre site utilise Firebase, vous pouvez utiliser <span className="text-white font-bold">Firebase Hosting</span>. C'est rapide, sécurisé et totalement intégré à votre base de données.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                  </div>

                  {/* Logo Card */}
                  <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-sm">
                   <div className="mb-8">
                     <h3 className="font-black text-xl mb-6 uppercase tracking-tight flex items-center gap-2">
                       <Mail size={20} className="text-primary" /> Configuration Webmail
                     </h3>
                      <form onSubmit={saveSettings} className="space-y-4">
                        <div>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">URL de votre Webmail PRO</label>
                          <input 
                            name="webmail_url" 
                            value={webmailUrl} 
                            onChange={(e) => setWebmailUrl(e.target.value)}
                            placeholder="Ex: https://mail.google.com" 
                            className="w-full p-4 bg-white rounded-xl border border-slate-100" 
                          />
                          <p className="text-[10px] text-slate-400 mt-2 italic px-1">Le domaine merkez.com est fictif. Pour utiliser de vrais emails, entrez ici l'URL de votre fournisseur (ex: Gmail, Outlook).</p>
                        </div>
                        <button type="submit" className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                          Mettre à jour le lien
                        </button>
                      </form>
                   </div>

                   <h3 className="font-black text-xl mb-6 uppercase tracking-tight flex items-center gap-2">
                     <ImageIcon size={20} className="text-primary" /> Logo du Centre
                   </h3>
                   <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-3xl shadow-xl flex items-center justify-center p-4 border border-slate-50">
                    <Logo customLogo={localStorage.getItem("m_logo")} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-white border border-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                      <Upload size={18} /> Changer Logo
                    </button>
                    <button onClick={() => { if (onLogoChange) onLogoChange(""); localStorage.removeItem("m_logo"); }} className="w-full py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">Supprimer</button>
                  </div>
                </div>

                {/* Contact Info Card */}
                <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-sm">
                  <h3 className="font-black text-xl mb-6 uppercase tracking-tight flex items-center gap-2">
                     <Phone size={20} className="text-primary" /> Coordonnées
                  </h3>
                  <form className="space-y-4" onSubmit={(e: any) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    const newContact = Object.fromEntries(fd.entries()) as any;
                    setContact(newContact);
                    alert("Coordonnées mises à jour !");
                  }}>
                    <input name="phone" defaultValue={contact.phone} placeholder="Téléphone" className="w-full p-3 bg-white rounded-xl border border-slate-100" />
                    <input name="email" defaultValue={contact.email} placeholder="Email" className="w-full p-3 bg-white rounded-xl border border-slate-100" />
                    <input name="address" defaultValue={contact.address} placeholder="Adresse" className="w-full p-3 bg-white rounded-xl border border-slate-100" />
                    <input name="facebook" defaultValue={contact.facebook} placeholder="Lien Facebook" className="w-full p-3 bg-white rounded-xl border border-slate-100" />
                    <button type="submit" className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-lg">Enregistrer</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          ) : activeTab === "gallery" ? (
             <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                   {gallery.map(img => (
                     <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-slate-100">
                        <img src={img.url} className="w-full h-full object-cover" />
                        <button onClick={() => deleteItem(img.id, "gallery")} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={16} />
                        </button>
                     </div>
                   ))}
                   <button 
                    onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setGallery([...gallery, { id: Date.now(), url: ev.target?.result }]);
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                    }}
                    className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary hover:text-primary transition-all bg-slate-50/50"
                   >
                     <Plus /> <span className="text-[10px] font-bold uppercase">Ajouter Photo</span>
                   </button>
                </div>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-black uppercase text-slate-400">Détails</th>
                    <th className="px-8 py-4 text-xs font-black uppercase text-slate-400">
                      {activeTab === "users" ? "Statut" : activeTab === "docs" ? "Catégorie" : activeTab === "subjects" ? "Professeur" : activeTab === "staff" ? "Rôle" : activeTab === "testimonials" ? "Profil" : "Type"}
                    </th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(
                    activeTab === "users" ? students : 
                    activeTab === "staff" ? staff : 
                    activeTab === "docs" ? documents : 
                    activeTab === "subjects" ? subjects : 
                    activeTab === "tariffs" ? tariffs : 
                    activeTab === "testimonials" ? testimonials :
                    activeTab === "sections" ? sections :
                    []
                  ).map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold">{item.name || item.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1 italic">
                          {item.email || item.date || item.content || (item.studentsCount !== undefined ? item.studentsCount + " élèves" : item.features?.length + " avantages")}
                        </div>
                        {item.phone && activeTab === "users" && (
                          <div className="text-[10px] text-primary font-black mt-1 uppercase tracking-tighter">Tel: {item.phone}</div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "text-[10px] font-black uppercase px-2 py-1 rounded-md",
                          item.status === "Actif" ? "bg-green-100 text-green-700" : 
                          item.status === "Refusé" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {item.status || item.role || item.plan || item.category || item.price || item.teacher || item.subtitle}
                        </span>
                        {item.role && activeTab === "users" && (
                           <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{item.role}</div>
                        )}
                        {item.subject && activeTab === "staff" && (
                          <div className="text-[10px] text-slate-400 uppercase font-bold">{item.subject}</div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {activeTab === "users" && item.status === "En attente" && (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(item.id, "Actif")}
                                className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase rounded-lg hover:bg-green-600 transition-all"
                              >
                                Accepter
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(item.id, "Refusé")}
                                className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-black uppercase rounded-lg hover:bg-slate-300 transition-all"
                              >
                                Refuser
                              </button>
                            </>
                          )}
                          <button onClick={() => openForm(item)} className="p-2 text-slate-400 hover:text-primary"><Edit2 size={18} /></button>
                          {activeTab !== "sections" && (
                            <button onClick={() => deleteItem(item.id, activeTab)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase">{editingItem ? "Modifier" : "Ajouter"} {activeTab}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X /></button>
            </div>
            <form onSubmit={saveItem} className="p-8 space-y-4">
              {activeTab === "users" && (
                <>
                  <input ref={nameInputRef} name="name" defaultValue={editingItem?.name} placeholder="Nom Complet" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <div className="space-y-2">
                    <div className="relative">
                      <input ref={emailInputRef} name="email" defaultValue={editingItem?.email} placeholder="Email" type="email" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">PRO</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={generateProEmail}
                      className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline px-1"
                    >
                      + Générer E-mail @merkez.com
                    </button>
                  </div>
                  <input name="password" defaultValue={editingItem?.password} placeholder="Mot de passe" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="phone" defaultValue={editingItem?.phone} placeholder="Téléphone" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <select name="role" defaultValue={editingItem?.role} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <option>Session Enfant</option>
                    <option>Session Femme</option>
                    <option>Orthophonie</option>
                  </select>
                  <select name="status" defaultValue={editingItem?.status} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <option>Actif</option>
                    <option>En attente</option>
                    <option>Refusé</option>
                  </select>
                </>
              )}
              {activeTab === "staff" && (
                <>
                  <input ref={nameInputRef} name="name" defaultValue={editingItem?.name} placeholder="Nom Complet" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <div className="space-y-2">
                    <div className="relative">
                      <input ref={emailInputRef} name="email" defaultValue={editingItem?.email} placeholder="Email" type="email" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">PRO</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={generateProEmail}
                      className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline px-1"
                    >
                      + Générer E-mail @merkez.com
                    </button>
                  </div>
                  <input name="password" defaultValue={editingItem?.password} placeholder="Mot de passe" type="text" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <select name="role" defaultValue={editingItem?.role} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <option>Enseignant</option>
                    <option>Administrateur</option>
                  </select>
                  <input name="subject" defaultValue={editingItem?.subject} placeholder="Matière (ex: Maths)" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                </>
              )}
              {activeTab === "docs" && (
                <>
                  <input name="title" defaultValue={editingItem?.title} placeholder="Titre du document" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="category" defaultValue={editingItem?.category} placeholder="Catégorie (Maths, Langues...)" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 px-1">Fichier du document</label>
                    <input 
                      type="file" 
                      name="file"
                      className="w-full p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-sm" 
                    />
                  </div>
                </>
              )}
              {activeTab === "subjects" && (
                <>
                  <input name="name" defaultValue={editingItem?.name} placeholder="Nom de la matière" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="teacher" defaultValue={editingItem?.teacher} placeholder="Nom du professeur" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                </>
              )}
              {activeTab === "tariffs" && (
                <>
                  <input name="name" defaultValue={editingItem?.name} placeholder="Nom du pack" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="price" defaultValue={editingItem?.price} placeholder="Prix (ex: 29€)" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="features" defaultValue={editingItem?.features?.join(',')} placeholder="Avantages (séparés par virgule)" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <label className="flex items-center gap-2 p-2 font-bold text-sm">
                    <input name="popular" type="checkbox" defaultChecked={editingItem?.popular} className="w-5 h-5 accent-primary" /> Mettre en avant ce pack
                  </label>
                </>
              )}
              {activeTab === "testimonials" && (
                <>
                  <input name="name" defaultValue={editingItem?.name} placeholder="Nom du client" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="role" defaultValue={editingItem?.role} placeholder="Rôle (ex: Parent, Étudiant)" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <textarea name="content" defaultValue={editingItem?.content} placeholder="Le témoignage..." className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 h-32" required />
                </>
              )}
              {activeTab === "sections" && (
                <>
                  <input name="title" defaultValue={editingItem?.title} placeholder="Titre principal" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="subtitle" defaultValue={editingItem?.subtitle} placeholder="Sous-titre" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <textarea name="content" defaultValue={editingItem?.content} placeholder="Description complète..." className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 h-32" required />
                </>
              )}
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-all">ANNULER</button>
                <button type="submit" className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all">ENREGISTRER</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
