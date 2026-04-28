import { useState, useEffect } from "react";
import { 
  Play, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Clock,
  ChevronRight,
  TrendingUp,
  X
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
import { Button } from "../components/UI";
import { Link, useNavigate } from "react-router-dom";

export default function TeacherDashboard({ user }: { user: any }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user && !localStorage.getItem("m_user")) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState("recordings");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Data States
  const [recordings, setRecordings] = useState<any[]>(() => JSON.parse(localStorage.getItem("m_recordings") || "[]"));
  const [materials, setMaterials] = useState<any[]>(() => JSON.parse(localStorage.getItem("m_materials") || "[]"));
  const [corrections, setCorrections] = useState<any[]>(() => JSON.parse(localStorage.getItem("m_corrections") || "[]"));
  const [schedule, setSchedule] = useState<any[]>(() => JSON.parse(localStorage.getItem("m_schedule") || "[]"));

  // Default data for demo if empty
  useEffect(() => {
    if (recordings.length === 0) {
      const defaults = [
        { id: 1, title: "Session Live - Grammaire", date: "2024-04-20", duration: "45 min", teacher: user?.name },
        { id: 2, title: "Correction TD 3 - Algèbre", date: "2024-04-22", duration: "1h 10min", teacher: user?.name },
      ];
      setRecordings(defaults);
      localStorage.setItem("m_recordings", JSON.stringify(defaults));
    }
    if (materials.length === 0) {
      const defaults = [
        { id: 1, title: "Support de Cours - Unité 1", subject: user?.subject || "Anglais", teacher: user?.name },
        { id: 2, title: "Fiches de Révision - Chapitre 4", subject: user?.subject || "Maths", teacher: user?.name },
      ];
      setMaterials(defaults);
      localStorage.setItem("m_materials", JSON.stringify(defaults));
    }
  }, []);

  // Save to localStorage
  useEffect(() => localStorage.setItem("m_recordings", JSON.stringify(recordings)), [recordings]);
  useEffect(() => localStorage.setItem("m_materials", JSON.stringify(materials)), [materials]);
  useEffect(() => localStorage.setItem("m_corrections", JSON.stringify(corrections)), [corrections]);
  useEffect(() => localStorage.setItem("m_schedule", JSON.stringify(schedule)), [schedule]);

  const deleteItem = (id: number, type: string) => {
    if (type === "recordings") setRecordings(recordings.filter(r => r.id !== id));
    if (type === "materials") setMaterials(materials.filter(m => m.id !== id));
    if (type === "corrections") setCorrections(corrections.filter(c => c.id !== id));
    if (type === "schedule") setSchedule(schedule.filter(s => s.id !== id));
  };

  const addItem = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const id = Date.now();

    if (activeTab === "recordings") {
      setRecordings([...recordings, { ...data, id, date: new Date().toISOString().split('T')[0], teacher: user?.name }]);
    } else if (activeTab === "materials") {
      setMaterials([...materials, { ...data, id, subject: user?.subject || "Général", teacher: user?.name }]);
    } else if (activeTab === "corrections") {
      setCorrections([...corrections, { ...data, id, date: new Date().toISOString().split('T')[0], teacher: user?.name }]);
    } else if (activeTab === "schedule") {
      setSchedule([...schedule, { ...data, id }]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-accent text-white p-6 hidden lg:block sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-black font-bold">
            {user?.name?.[0] || "E"}
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-sm uppercase">{user?.name}</span>
            <span className="text-[10px] text-secondary font-black uppercase tracking-widest">{user?.subject || "ENSEIGNANTE"}</span>
          </div>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: "recordings", label: "Cours Enregistrés", icon: Play },
            { id: "materials", label: "Supports", icon: FileText },
            { id: "corrections", label: "Corrections Élèves", icon: ShieldCheck },
            { id: "schedule", label: "Planning / Horaires", icon: Calendar },
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
          <div className="pt-8 space-y-2">
             <Link to="/chat" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/10">
                <MessageSquare size={20} />
                Chat Élèves
             </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">Espace {activeTab}</h1>
            <p className="text-slate-500 italic">Gérez vos contenus pédagogiques et interagissez avec vos élèves.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-secondary text-black font-black rounded-full shadow-lg hover:translate-y-[-2px] transition-all uppercase tracking-widest text-sm"
          >
            <Plus size={20} /> Ajouter
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                <Play size={24} />
              </div>
              <div className="text-3xl font-black">{recordings.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cours postés</div>
           </div>
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <div className="text-3xl font-black">{corrections.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Corrections transmises</div>
           </div>
           <Link to="/chat" className="bg-white p-8 rounded-[40px] border-2 border-primary/20 shadow-sm hover:border-primary transition-all group">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                  <MessageSquare size={24} />
                </div>
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              </div>
              <div className="text-3xl font-black">
                {Object.keys(localStorage).filter(k => k.startsWith('chat_private_room_') && k.includes(String(user?.id))).length}
              </div>
              <div className="text-[10px] text-primary font-black uppercase tracking-widest group-hover:underline">Boîte aux lettres (Conversations)</div>
           </Link>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8">
           {activeTab === "recordings" && (
             <div className="grid md:grid-cols-2 gap-6">
                {recordings.map(rec => (
                   <div key={rec.id} className="relative p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                          <Play size={24} />
                        </div>
                        <div>
                          <div className="font-bold">{rec.title}</div>
                          <div className="text-xs text-slate-500 italic">{rec.date} • {rec.duration}</div>
                        </div>
                      </div>
                      <button onClick={() => deleteItem(rec.id, "recordings")} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={18} />
                      </button>
                   </div>
                ))}
                {recordings.length === 0 && <div className="col-span-2 text-center py-10 text-slate-400 italic">Aucun cours posté.</div>}
             </div>
           )}

           {activeTab === "materials" && (
             <div className="grid md:grid-cols-2 gap-6">
                {materials.map(mat => (
                   <div key={mat.id} className="relative p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                          <FileText size={24} />
                        </div>
                        <div>
                          <div className="font-bold">{mat.title}</div>
                          <div className="text-xs text-slate-500 italic">{mat.subject}</div>
                        </div>
                      </div>
                      <button onClick={() => deleteItem(mat.id, "materials")} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={18} />
                      </button>
                   </div>
                ))}
             </div>
           )}

           {activeTab === "corrections" && (
             <div className="grid md:grid-cols-2 gap-6">
                {corrections.map(corr => (
                   <div key={corr.id} className="relative p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <div className="font-bold">{corr.title}</div>
                          <div className="text-xs text-slate-500 italic">{corr.date}</div>
                        </div>
                      </div>
                      <button onClick={() => deleteItem(corr.id, "corrections")} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={18} />
                      </button>
                   </div>
                ))}
             </div>
           )}

           {activeTab === "schedule" && (
             <div className="space-y-4">
                {schedule.map(s => (
                   <div key={s.id} className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center gap-6">
                        <div className="bg-primary text-white px-4 py-2 rounded-xl font-black text-sm">
                           {s.day}
                        </div>
                        <div>
                          <div className="font-bold">{s.subject}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
                             <Clock size={12} /> {s.time}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteItem(s.id, "schedule")} className="p-2 text-slate-300 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                   </div>
                ))}
                {schedule.length === 0 && <div className="text-center py-10 text-slate-400 italic">Aucun horaire défini.</div>}
             </div>
           )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-tight">Ajouter {activeTab}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X /></button>
            </div>
            <form onSubmit={addItem} className="p-8 space-y-4">
              {activeTab === "recordings" && (
                <>
                  <input name="title" placeholder="Titre du cours enregistré" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="duration" placeholder="Durée (ex: 45 min)" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                </>
              )}
              {activeTab === "materials" && (
                <>
                  <input name="title" placeholder="Titre du support" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                </>
              )}
              {activeTab === "corrections" && (
                <>
                  <input name="title" placeholder="Titre de la correction" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                </>
              )}
              {activeTab === "schedule" && (
                <>
                  <select name="day" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <option>Lundi</option>
                    <option>Mardi</option>
                    <option>Mercredi</option>
                    <option>Jeudi</option>
                    <option>Vendredi</option>
                    <option>Samedi</option>
                    <option>Dimanche</option>
                  </select>
                  <input name="time" placeholder="Heure (ex: 14:00 - 16:00)" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                  <input name="subject" defaultValue={user?.subject} placeholder="Matière" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" required />
                </>
              )}
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-all">ANNULER</button>
                <button type="submit" className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all">AJOUTER</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
