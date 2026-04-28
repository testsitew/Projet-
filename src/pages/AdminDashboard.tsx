import { useState, useRef, useEffect } from "react";
import { 
  Users, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Plus, 
  Search, 
  MoreVertical,
  CheckCircle,
  Clock,
  TrendingUp,
  ShieldCheck,
  Image as ImageIcon,
  Upload,
  Trash2,
  Edit2,
  Book,
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

export default function AdminDashboard({ onLogoChange }: { onLogoChange?: (logo: string) => void }) {
  const [activeTab, setActiveTab] = useState("users");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Data States (Loaded from LocalStorage or Defaults)
  const [students, setStudents] = useState<Student[]>(() => JSON.parse(localStorage.getItem("m_students") || "[]"));
  const [documents, setDocuments] = useState<Doc[]>(() => JSON.parse(localStorage.getItem("m_docs") || "[]"));
  const [tariffs, setTariffs] = useState<Tariff[]>(() => JSON.parse(localStorage.getItem("m_tariffs") || "[]"));
  const [subjects, setSubjects] = useState<Subject[]>(() => JSON.parse(localStorage.getItem("m_subjects") || "[]"));

  const [staff, setStaff] = useState<any[]>(() => JSON.parse(localStorage.getItem("m_staff") || "[]"));

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize defaults if empty
  useEffect(() => {
    if (students.length === 0) {
      const defaults = [
        { id: 1, name: "Fatma K.", email: "fatma@uvt.tn", plan: "Premium", status: "Actif", joinDate: "2024-01-12" },
        { id: 2, name: "Ahmed B.", email: "ahmed@gmail.com", plan: "Base", status: "En attente", joinDate: "2024-03-05" }
      ];
      setStudents(defaults);
      localStorage.setItem("m_students", JSON.stringify(defaults));
    }
    if (staff.length === 0) {
      const defaults = [
        { id: 1, name: "Dr. Ahmed", email: "ahmed@merkez.com", role: "Enseignant", subject: "Maths" },
        { id: 2, name: "Admin Fatma", email: "fatma@admin.com", role: "Administrateur", subject: "Administration" }
      ];
      setStaff(defaults);
      localStorage.setItem("m_staff", JSON.stringify(defaults));
    }
    if (documents.length === 0) {
      const defaults = [
        { id: 1, title: "Algèbre Linéaire", category: "Maths", downloads: 154, date: "2024-04-15" }
      ];
      setDocuments(defaults);
      localStorage.setItem("m_docs", JSON.stringify(defaults));
    }
    if (tariffs.length === 0) {
      const defaults = [
        { id: 1, name: "Base", price: "29€", features: ["Accès Docs"], popular: false },
        { id: 2, name: "Premium", price: "59€", features: ["Tout illimité"], popular: true }
      ];
      setTariffs(defaults);
      localStorage.setItem("m_tariffs", JSON.stringify(defaults));
    }
    if (subjects.length === 0) {
      const defaults = [
        { id: 1, name: "Anglais", teacher: "Mme. Sarah", studentsCount: 20 },
        { id: 2, name: "Français", teacher: "M. Jean", studentsCount: 15 }
      ];
      setSubjects(defaults);
      localStorage.setItem("m_subjects", JSON.stringify(defaults));
    }
  }, []);

  // Persistence
  useEffect(() => { localStorage.setItem("m_students", JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem("m_staff", JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem("m_docs", JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem("m_tariffs", JSON.stringify(tariffs)); }, [tariffs]);
  useEffect(() => { localStorage.setItem("m_subjects", JSON.stringify(subjects)); }, [subjects]);

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
  const deleteItem = (id: number, type: string) => {
    if (type === "users") setStudents(students.filter(s => s.id !== id));
    if (type === "staff") setStaff(staff.filter(s => s.id !== id));
    if (type === "docs") setDocuments(documents.filter(d => d.id !== id));
    if (type === "tariffs") setTariffs(tariffs.filter(t => t.id !== id));
    if (type === "subjects") setSubjects(subjects.filter(s => s.id !== id));
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
      const newUser = { ...data, id, joinDate: editingItem?.joinDate || new Date().toISOString().split('T')[0] };
      setStudents(editingItem ? students.map(s => s.id === id ? newUser : s) : [...students, newUser]);
    } else if (activeTab === "staff") {
      const newStaff = { ...data, id };
      setStaff(editingItem ? staff.map(s => s.id === id ? newStaff : s) : [...staff, newStaff]);
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
        
        <nav className="space-y-2">
          {[
            { id: "users", label: "Utilisateurs", icon: Users },
            { id: "staff", label: "Personnel", icon: ShieldCheck },
            { id: "docs", label: "Documents", icon: FileText },
            { id: "subjects", label: "Matières", icon: Book },
            { id: "tariffs", label: "Tarifs", icon: CreditCard },
            { id: "support", label: "Support Chat", icon: MessageSquare },
            { id: "settings", label: "Paramètres Logo", icon: ImageIcon },
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
            <div className="p-20 text-center">
              <div className="max-w-md mx-auto bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-110" />
                
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-8 bg-white rounded-3xl shadow-xl flex items-center justify-center p-4 border border-slate-50">
                    <Logo customLogo={localStorage.getItem("m_logo")} />
                  </div>
                  
                  <h3 className="font-black text-2xl mb-2 uppercase tracking-tighter">Personnalisation Logo</h3>
                  <p className="text-slate-500 mb-8 italic text-sm leading-relaxed">
                    Téléchargez votre logo officiel. Il sera affiché sur toutes les pages et dans le menu de navigation.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 bg-white border-2 border-slate-100 text-slate-800 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <ImageIcon size={20} className="text-primary" /> Changer l'image
                    </button>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          if (onLogoChange) onLogoChange("");
                          localStorage.removeItem("m_logo");
                          alert("Logo réinitialisé !");
                        }}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                      >
                        Réinitialiser
                      </button>
                      <button 
                        onClick={() => {
                          alert("Configuration enregistrée avec succès !");
                        }}
                        className="flex-[2] py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-black uppercase text-slate-400">Détails</th>
                    <th className="px-8 py-4 text-xs font-black uppercase text-slate-400">
                      {activeTab === "users" ? "Statut" : activeTab === "docs" ? "Catégorie" : activeTab === "subjects" ? "Professeur" : "Prix"}
                    </th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(activeTab === "users" ? students : activeTab === "staff" ? staff : activeTab === "docs" ? documents : activeTab === "subjects" ? subjects : activeTab === "tariffs" ? tariffs : []).map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold">{item.name || item.title}</div>
                        <div className="text-xs text-slate-500">
                          {item.email || item.date || (item.studentsCount !== undefined ? item.studentsCount + " élèves" : item.features?.length + " avantages")}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "text-sm font-bold",
                          item.status === "Actif" ? "text-green-600" : ""
                        )}>
                          {item.role || item.plan || item.category || item.price || item.teacher}
                        </span>
                        {item.subject && activeTab === "staff" && (
                          <div className="text-[10px] text-slate-400 uppercase font-bold">{item.subject}</div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openForm(item)} className="p-2 text-slate-400 hover:text-primary"><Edit2 size={18} /></button>
                          <button onClick={() => deleteItem(item.id, activeTab)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
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
                  <input name="name" defaultValue={editingItem?.name} placeholder="Nom Complet" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="email" defaultValue={editingItem?.email} placeholder="Email" type="email" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <select name="plan" defaultValue={editingItem?.plan} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <option>Base</option>
                    <option>Premium</option>
                    <option>Individuel</option>
                  </select>
                  <select name="status" defaultValue={editingItem?.status} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <option>Actif</option>
                    <option>En attente</option>
                  </select>
                </>
              )}
              {activeTab === "staff" && (
                <>
                  <input name="name" defaultValue={editingItem?.name} placeholder="Nom Complet" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="email" defaultValue={editingItem?.email} placeholder="Email" type="email" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
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
