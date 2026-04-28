import { Search, FileText, Download, Filter, BookOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

const CATEGORIES = ["Tous", "Mathématiques", "Langues", "Sciences", "Histoire", "Informatique", "Économie"];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [docs, setDocs] = useState<any[]>(() => {
    const saved = localStorage.getItem("m_docs");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: "Algèbre Linéaire - Cours Complet", category: "Mathématiques", format: "PDF", size: "2.4 MB", date: "2024-04-15" },
      { id: 2, title: "Grammaire Française Niveau C1", category: "Langues", format: "PDF", size: "1.8 MB", date: "2024-04-10" },
    ];
  });

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || doc.category === selectedCategory || (selectedCategory === "Mathématiques" && doc.category === "Maths");
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4">
            <BookOpen size={16} /> Bibliothèque Digitale
          </div>
          <h1 className="text-4xl font-black mb-4">Bibliothèque de Documents</h1>
          <p className="text-slate-500 italic">Accédez à des centaines de supports de cours et d'exercices préparés par nos experts.</p>
        </div>
        
        <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-2 w-full max-w-md shadow-sm">
          <Search className="text-slate-400 ml-2" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un document..." 
            className="flex-grow p-2 focus:outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-6 py-2 rounded-full font-medium transition-all text-sm",
              selectedCategory === cat 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-white text-slate-600 border border-slate-200 hover:border-primary/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div 
            key={doc.id} 
            className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-slate-50 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <FileText size={28} />
              </div>
              <div className="px-3 py-1 bg-secondary/10 text-secondary-foreground rounded-full text-[10px] font-bold uppercase tracking-tight">
                {doc.format}
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-2 leading-tight min-h-[56px]">{doc.title}</h3>
            <div className="text-slate-400 text-xs font-semibold uppercase mb-6">{doc.category}</div>
            
            <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
              <div className="text-xs text-slate-400 font-medium">{doc.date} • {doc.size}</div>
              {doc.fileData ? (
                <a 
                  href={doc.fileData} 
                  download={doc.title}
                  className="flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                >
                  <Download size={16} /> Télécharger
                </a>
              ) : (
                <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                  <Download size={16} /> Télécharger
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
          <BookOpen size={48} className="mx-auto text-slate-200 mb-6" />
          <h3 className="text-xl font-bold text-slate-400">Aucun document trouvé</h3>
          <p className="text-slate-400 mt-2 italic">Essayez un autre terme de recherche ou une autre catégorie.</p>
        </div>
      )}
    </div>
  );
}
