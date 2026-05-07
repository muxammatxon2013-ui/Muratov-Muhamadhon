import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Info, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown,
  User,
  Heart,
  Plus,
  Minus,
  Maximize,
  Minimize,
  TreeDeciduous,
  X,
  Maximize2,
  Minimize2,
  Leaf,
  Video,
  Lock,
  Unlock,
  FolderLock,
  FolderOpen,
  Image as ImageIcon,
  BookOpen,
  History as HistoryIcon,
  Calendar,
  Settings as SettingsIcon,
  Palette,
  Type
} from 'lucide-react';
import { hierarchy, tree, HierarchyPointNode } from 'd3-hierarchy';
import { linkVertical } from 'd3-shape';
import { MURATOV_DATA, MURATOV_GALLERY, MURATOV_HISTORY } from './data';
import { FamilyMember, GalleryItem, HistoryEntry } from './types';

// --- Types ---
interface ThemeConfig {
  primary: string;
  background: string;
  cardBg: string;
  text: string;
  accent: string;
  treeBgImage?: string;
}

// --- Components ---

const FallingLeaf: React.FC<{ delay: number; color?: string }> = ({ delay, color }) => {
  const randomX = Math.random() * 100;
  const duration = 15 + Math.random() * 25;
  const size = 10 + Math.random() * 15;
  
  return (
    <motion.div
      initial={{ y: -100, x: `${randomX}vw`, rotate: 0, opacity: 0 }}
      animate={{ 
        y: '110vh', 
        x: [`${randomX}vw`, `${randomX + (Math.random() * 15 - 7.5)}vw`, `${randomX}vw`],
        rotate: [0, 90, 180, 270, 360],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      className={`fixed pointer-events-none z-0`}
      style={{ color: color || '#10b98120' }}
    >
      <Leaf size={size} fill="currentColor" />
    </motion.div>
  );
};

const MemberNode = ({ member, x, y, isSelected, onClick, theme }: 
  { member: FamilyMember; x: number; y: number; isSelected: boolean; onClick: () => void; theme: ThemeConfig }) => {
  const isMale = member.gender === 'male';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, x: x - 75, y: y - 50 }}
      whileHover={{ scale: 1.05, zIndex: 30 }}
      onClick={onClick}
      style={{ 
        backgroundColor: theme.cardBg,
        borderColor: isSelected ? theme.primary : (isMale ? `${theme.primary}30` : `${theme.accent}30`),
        boxShadow: isSelected ? `0 0 0 4px ${theme.primary}20, 0 20px 40px -10px rgba(0,0,0,0.2)` : '0 10px 20px -5px rgba(0,0,0,0.1)'
      }}
      className={`absolute w-[150px] h-[100px] cursor-pointer rounded-2xl border-2 flex flex-row items-center p-3 transition-all duration-500
        ${isSelected ? 'z-20' : ''}`}
    >
      <div className="flex flex-row items-center text-left w-full space-x-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner shrink-0`} 
          style={{ 
            backgroundColor: isMale ? `${theme.primary}10` : `${theme.accent}10`, 
            color: isMale ? theme.primary : theme.accent 
          }}>
          <User size={24} />
        </div>
        <div className="overflow-hidden">
          <h3 className="text-[13px] font-black leading-tight truncate" style={{ color: theme.text }}>{member.firstName}</h3>
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 truncate">{member.lastName}</p>
          {(member.birthYear || member.deathYear) && (
            <p className="text-[9px] font-mono opacity-40 mt-0.5 truncate">
              {member.birthYear || '?'}{member.deathYear ? ` — ${member.deathYear}` : ''}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SettingsSection = ({ theme, setTheme }: { theme: ThemeConfig; setTheme: (t: ThemeConfig) => void }) => {
  const presets = [
    { name: 'Tabiat (Yashil)', primary: '#059669', background: '#fcfdfa', text: '#111827', accent: '#e11d48', cardBg: '#ffffff' },
    { name: 'Kuz (Tilla)', primary: '#d97706', background: '#fffbeb', text: '#451a03', accent: '#92400e', cardBg: '#ffffff' },
    { name: 'Tungi (Qora)', primary: '#10b981', background: '#09090b', text: '#f4f4f5', accent: '#f43f5e', cardBg: '#18181b' },
    { name: 'Dengiz (Moviy)', primary: '#0284c7', background: '#f0f9ff', text: '#0c4a6e', accent: '#4f46e5', cardBg: '#ffffff' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight italic" style={{ color: theme.text }}>LOYIHA SOZLAMALARI</h2>
        <p className="font-bold uppercase tracking-widest text-xs" style={{ color: theme.primary }}>Dizayn va ranglarni boshqarish</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Color Customizer */}
        <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-emerald-100 shadow-xl space-y-8" style={{ backgroundColor: `${theme.cardBg}80`, borderColor: `${theme.primary}20` }}>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="text-emerald-500" style={{ color: theme.primary }} />
            <h3 className="font-black text-lg italic" style={{ color: theme.text }}>Ranglar Paneli</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'Asosiy rang', key: 'primary' },
              { label: 'Fon rangi', key: 'background' },
              { label: 'Matn rangi', key: 'text' },
              { label: 'Karta foni', key: 'cardBg' },
              { label: 'Urg\'u (Ayollar) rangi', key: 'accent' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm font-bold opacity-70" style={{ color: theme.text }}>{item.label}</span>
                <input 
                  type="color" 
                  value={(theme as any)[item.key]} 
                  onChange={(e) => setTheme({ ...theme, [item.key]: e.target.value })}
                  className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                />
              </div>
            ))}
            
            <div className="space-y-2 pt-4">
              <span className="text-sm font-bold opacity-70" style={{ color: theme.text }}>Shajara fon rasmi (URL)</span>
              <input 
                type="text" 
                placeholder="Rasm havola manzili..."
                value={theme.treeBgImage || ''}
                onChange={(e) => setTheme({ ...theme, treeBgImage: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all text-sm"
                style={{ backgroundColor: `${theme.cardBg}50`, borderColor: `${theme.primary}20`, color: theme.text }}
              />
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Maximize2 className="text-emerald-500" style={{ color: theme.primary }} />
            <h3 className="font-black text-lg italic" style={{ color: theme.text }}>Tayyor Mavzular</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {presets.map((p) => (
              <button 
                key={p.name}
                onClick={() => setTheme(p)}
                className="flex items-center justify-between p-6 rounded-3xl border-2 transition-all hover:scale-105 group"
                style={{ backgroundColor: p.background, borderColor: theme.primary === p.primary ? p.primary : `${theme.primary}10` }}
              >
                <span className="font-bold italic" style={{ color: p.text }}>{p.name}</span>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: p.primary }}></div>
                  <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: p.background }}></div>
                  <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: p.text }}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


const GallerySection = ({ theme }: { theme: ThemeConfig }) => {
  const [galleryTab, setGalleryTab] = useState<'open' | 'secret' | 'video'>('open');
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const SECRET_CODE = '1991-1993';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_CODE) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const renderLockedContent = (title: string, message: string) => (
    <motion.div 
      key="locked-overlay"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] border-2 border-dashed border-rose-200 shadow-2xl text-center space-y-8">
        <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto text-rose-500 shadow-xl shadow-rose-100">
          <FolderLock size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-gray-900 italic uppercase">{title}</h3>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{message}</p>
        </div>
        <form onSubmit={handleUnlock} className="space-y-4">
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol..."
            className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 outline-none transition-all text-center font-black tracking-[0.5em] focus:ring-4
              ${error ? 'border-rose-500 animate-shake focus:ring-rose-100' : 'border-gray-100 focus:border-rose-400 focus:ring-rose-50'}`}
          />
          <button 
            type="submit"
            className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black italic shadow-xl shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            BO'LIMNI OCHISH
          </button>
          {error && <p className="text-rose-500 text-xs font-black uppercase">Noto'g'ri kod! Qaytadan urinib ko'ring.</p>}
        </form>
      </div>
    </motion.div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight italic" style={{ color: theme.text }}>OILAVIY GALAREYA</h2>
          <p className="font-bold uppercase tracking-widest text-xs" style={{ color: theme.primary }}>O'tmishdan yorqin xotiralar</p>
        </div>
        
        {/* Gallery Tabs */}
        <div className="inline-flex p-2 rounded-[2rem] bg-gray-100/50 backdrop-blur-md border border-gray-200/50 flex-wrap justify-center gap-2">
          <button 
            onClick={() => setGalleryTab('open')}
            className={`px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all flex items-center gap-2
              ${galleryTab === 'open' ? 'bg-white shadow-lg text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
            style={galleryTab === 'open' ? { color: theme.primary } : {}}
          >
            <FolderOpen size={18} /> OCHIQ BO'LIM
          </button>
          <button 
            onClick={() => setGalleryTab('secret')}
            className={`px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all flex items-center gap-2
              ${galleryTab === 'secret' ? 'bg-white shadow-lg text-rose-600' : 'text-gray-400 hover:text-gray-600'}`}
            style={galleryTab === 'secret' ? { color: theme.accent } : {}}
          >
            {isUnlocked ? <Unlock size={18} /> : <Lock size={18} />} MAXFIY BO'LIM
          </button>
          <button 
            onClick={() => setGalleryTab('video')}
            className={`px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all flex items-center gap-2
              ${galleryTab === 'video' ? 'bg-white shadow-lg text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            style={galleryTab === 'video' ? { color: '#2563eb' } : {}}
          >
            {isUnlocked ? <Unlock size={18} /> : <Lock size={18} />} VIDEO BO'LIM
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {galleryTab === 'open' && (
          <motion.div 
            key="open-gallery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {MURATOV_GALLERY.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all border"
                style={{ backgroundColor: theme.cardBg, borderColor: `${theme.primary}10` }}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-lg uppercase leading-tight italic" style={{ color: theme.text }}>{item.title}</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black" style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}>{item.year}</span>
                  </div>
                  <p className="text-sm leading-relaxed italic opacity-70" style={{ color: theme.text }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {galleryTab === 'secret' && (
          !isUnlocked ? 
            renderLockedContent("MAXFIY ARXIV", "Kirish uchun kodni kiriting") : (
            <motion.div 
              key="secret-unlocked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="bg-emerald-50 p-8 rounded-[3rem] border-2 border-emerald-100 inline-block">
                 <p className="text-emerald-700 font-black italic">Maxfiy arxiv muvaffaqiyatli ochildi!</p>
                 <p className="text-emerald-500 text-xs mt-2 uppercase tracking-widest">Hozircha bu yer bo'sh. Tez orada yangi arxivlar qo'shiladi.</p>
              </div>
              <button 
                onClick={() => setIsUnlocked(false)}
                className="block mx-auto px-6 py-2 text-xs font-black text-gray-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
              >
                Bo'limni qayta qulflash
              </button>
            </motion.div>
          )
        )}

        {galleryTab === 'video' && (
          !isUnlocked ? 
            renderLockedContent("VIDEO ARXIV", "Videolarni ko'rish uchun kodni kiriting") : (
            <motion.div 
              key="video-unlocked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="bg-blue-50 p-8 rounded-[3rem] border-2 border-blue-100 inline-block">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                   <Video size={32} />
                 </div>
                 <p className="text-blue-700 font-black italic">Video arxiv muvaffaqiyatli ochildi!</p>
                 <p className="text-blue-500 text-xs mt-2 uppercase tracking-widest">Hozircha videolar mavjud emas. Tez orada yuklanadi.</p>
              </div>
              <button 
                onClick={() => setIsUnlocked(false)}
                className="block mx-auto px-6 py-2 text-xs font-black text-gray-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
              >
                Bo'limni qayta qulflash
              </button>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

const HistorySection = ({ theme }: { theme: ThemeConfig }) => (
  <div className="p-8 max-w-4xl mx-auto space-y-12 mb-20">
    <div className="text-center space-y-4">
      <h2 className="text-4xl font-black tracking-tight italic" style={{ color: theme.text }}>SULOLA TARIXI</h2>
      <p className="font-bold uppercase tracking-widest text-xs" style={{ color: theme.primary }}>Ajdodlarimiz bosib o'tgan yo'l</p>
    </div>
    <div className="space-y-16 relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden md:block opacity-20" style={{ backgroundColor: theme.primary }}></div>
      {MURATOV_HISTORY.map((entry, i) => (
        <motion.div 
          key={entry.id}
          initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
          <div className="flex-1 text-center md:text-right">
             {i % 2 === 0 ? (
               <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-black italic shadow-lg" style={{ backgroundColor: theme.primary, color: '#ffffff' }}>
                    <Calendar size={14} /> {entry.year}-YIL
                 </div>
                 <h3 className="text-2xl font-black italic tracking-tight" style={{ color: theme.text }}>{entry.title}</h3>
                 <p className="leading-relaxed text-sm md:text-base italic p-6 rounded-[2rem] shadow-sm border" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.primary}10`, color: theme.text }}>"{entry.content}"</p>
               </div>
             ) : null}
          </div>
          <div className="w-12 h-12 rounded-full border-4 shadow-xl z-10 flex items-center justify-center text-white shrink-0" style={{ backgroundColor: theme.primary, borderColor: theme.background }}>
             <HistoryIcon size={20} />
          </div>
          <div className="flex-1 text-center md:text-left">
             {i % 2 !== 0 ? (
               <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-black italic shadow-lg" style={{ backgroundColor: theme.primary, color: '#ffffff' }}>
                    <Calendar size={14} /> {entry.year}-YIL
                 </div>
                 <h3 className="text-2xl font-black italic tracking-tight" style={{ color: theme.text }}>{entry.title}</h3>
                 <p className="leading-relaxed text-sm md:text-base italic p-6 rounded-[2rem] shadow-sm border" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.primary}10`, color: theme.text }}>"{entry.content}"</p>
               </div>
             ) : null}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
const MemberDetail = ({ member, onClose, onSelectRelative, theme }: 
  { member: FamilyMember; onClose: () => void; onSelectRelative: (id: string) => void; theme: ThemeConfig }) => {
  const spouse = member.spouses.length > 0 ? MURATOV_DATA[member.spouses[0]] : null;
  const children = member.children.map(id => MURATOV_DATA[id]).filter(Boolean);
  const parents = member.parents.map(id => MURATOV_DATA[id]).filter(Boolean);

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      className="fixed right-0 top-0 h-full w-full sm:w-[400px] shadow-2xl z-[100] overflow-y-auto border-l backdrop-blur-xl"
      style={{ backgroundColor: `${theme.cardBg}f2`, borderColor: `${theme.primary}20` }}
    >
      <div className="p-8 space-y-10">
        <div className="flex justify-between items-center">
          <button onClick={onClose} className="p-3 bg-gray-50/50 hover:bg-gray-100/50 rounded-full transition-colors">
            <X size={20} style={{ color: theme.text }} className="opacity-50" />
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.primary }}>Oila A'zosi</span>
        </div>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center border-4 rotate-3 shadow-xl`} style={{ backgroundColor: member.gender === 'male' ? `${theme.primary}10` : `${theme.accent}10`, borderColor: member.gender === 'male' ? `${theme.primary}20` : `${theme.accent}20`, color: member.gender === 'male' ? theme.primary : theme.accent }}>
            <User size={64} />
          </div>
          <div>
            <h2 className="text-3xl font-black leading-tight mb-2 italic" style={{ color: theme.text }}>{member.firstName} <br /> {member.lastName}</h2>
            <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: theme.primary }}>{member.occupation || 'Shajarasi Davomchisi'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl border shadow-sm flex flex-col items-center text-center" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.primary}10` }}>
            <p className="text-[10px] font-black uppercase mb-1 opacity-40">Tug'ilgan</p>
            <p className="font-black text-lg italic" style={{ color: theme.text }}>{member.birthYear || "—"}</p>
          </div>
          <div className="p-5 rounded-3xl border shadow-sm flex flex-col items-center text-center" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.accent}10` }}>
            <p className="text-[10px] font-black uppercase mb-1 opacity-40">Vafot etgan</p>
            <p className="font-black text-lg italic" style={{ color: theme.text }}>{member.deathYear || 'Hayot'}</p>
          </div>
        </div>

        {member.bio && (
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest border-l-4 pl-4 py-1" style={{ borderColor: theme.primary, color: theme.text }}>Biografiya</h4>
            <p className="text-sm leading-relaxed italic p-6 rounded-[2rem] border" style={{ backgroundColor: `${theme.primary}05`, borderColor: `${theme.primary}10`, color: theme.text }}>"{member.bio}"</p>
          </div>
        )}

        <div className="space-y-6 pb-10">
          {parents.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Ota-onasi</h4>
              <div className="grid grid-cols-1 gap-2">
                {parents.map(p => (
                  <button key={p.id} onClick={() => onSelectRelative(p.id)} className="flex items-center p-4 rounded-3xl transition-all text-left border group" style={{ backgroundColor: `${theme.cardBg}50`, borderColor: `${theme.primary}05` }}>
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform">
                      <User size={20} className={p.gender === 'male' ? 'text-emerald-500' : 'text-rose-500'} />
                    </div>
                    <span className="text-sm font-black italic" style={{ color: theme.text }}>{p.firstName} {p.lastName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {spouse && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Hamrohi</h4>
              <button onClick={() => onSelectRelative(spouse.id)} className="w-full flex items-center p-4 rounded-3xl transition-all text-left border group" style={{ backgroundColor: `${theme.cardBg}50`, borderColor: `${theme.primary}05` }}>
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Heart size={18} className="text-amber-500 fill-amber-500" />
                </div>
                <span className="text-sm font-black italic" style={{ color: theme.text }}>{spouse.firstName} {spouse.lastName}</span>
              </button>
            </div>
          )}
          {children.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Farzandlari</h4>
              <div className="grid grid-cols-1 gap-2">
                {children.map(c => (
                  <button key={c.id} onClick={() => onSelectRelative(c.id)} className="flex items-center p-4 rounded-3xl transition-all text-left border group" style={{ backgroundColor: `${theme.cardBg}50`, borderColor: `${theme.primary}05` }}>
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform">
                      <User size={20} className={c.gender === 'male' ? 'text-emerald-500' : 'text-rose-500'} />
                    </div>
                    <span className="text-sm font-black italic" style={{ color: theme.text }}>{c.firstName} {c.lastName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'tree' | 'gallery' | 'history' | 'settings'>('tree');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<ThemeConfig>({
    primary: '#4E342E',
    background: '#fdf8f0',
    text: '#3E2723',
    cardBg: '#ffffff',
    accent: '#8d6e63',
    treeBgImage: 'https://www.transparenttextures.com/patterns/cream-paper.png'
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const { nodes, links } = useMemo(() => {
    const buildNode = (id: string): any => {
      const member = MURATOV_DATA[id];
      if (!member) return null;
      return { ...member, children: (member.children || []).map(cid => buildNode(cid)).filter(Boolean) };
    };
    const d3Hierarchy = hierarchy(buildNode('1'));
    const d3Tree = tree().nodeSize([180, 260]);
    const root = d3Tree(d3Hierarchy) as HierarchyPointNode<any>;
    const treeNodes = root.descendants();
    treeNodes.forEach(node => { node.y = node.depth * 300; });
    return { nodes: treeNodes, links: root.links() };
  }, []);

  const filteredMembers = Object.values(MURATOV_DATA).filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden relative transition-colors duration-500" style={{ backgroundColor: theme.background, color: theme.text }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t" style={{ backgroundImage: `linear-gradient(to top, ${theme.primary}20, transparent)` }}></div>
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: `${theme.primary}20` }}></div>
        {[...Array(15)].map((_, i) => ( <FallingLeaf key={i} delay={i * 2} color={`${theme.primary}40`} /> ))}
      </div>

      {/* Navigation Sidebar */}
      <nav className="w-full lg:w-24 bg-white/60 backdrop-blur-xl border border-emerald-100/50 flex flex-row lg:flex-col items-center justify-between lg:justify-start p-4 lg:py-8 z-[60] shadow-xl lg:m-4 lg:rounded-[2.5rem] transition-all duration-500" style={{ backgroundColor: `${theme.cardBg}90`, borderColor: `${theme.primary}20` }}>
        <div className="hidden lg:flex items-center justify-center mb-12">
          <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: theme.primary }}>
            <TreeDeciduous size={32} />
          </div>
        </div>
        <div className="flex flex-row lg:flex-col gap-4 lg:gap-8 flex-1 justify-center lg:justify-start">
          {[
            { id: 'tree', icon: TreeDeciduous, label: 'Shajara' },
            { id: 'gallery', icon: ImageIcon, label: 'Galareya' },
            { id: 'history', icon: BookOpen, label: 'Tarix' },
            { id: 'settings', icon: SettingsIcon, label: 'Sozlamalar' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`p-4 rounded-3xl transition-all relative group flex flex-col items-center gap-1
                ${activeTab === tab.id ? 'text-white' : 'hover:bg-emerald-50 text-gray-400'}`}
              style={{ 
                backgroundColor: activeTab === tab.id ? theme.primary : 'transparent',
                boxShadow: activeTab === tab.id ? `0 10px 20px -5px ${theme.primary}40` : 'none'
              }}>
              <tab.icon size={28} />
              <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex overflow-hidden relative z-10">
          
          {activeTab === 'tree' && (
            <>
              {/* Sidebar Search */}
              <div className="w-80 border border-emerald-100/30 bg-white/40 backdrop-blur-xl hidden lg:flex flex-col relative z-20 shadow-xl lg:my-4 lg:mr-4 lg:rounded-[2.5rem] overflow-hidden transition-all duration-500" style={{ backgroundColor: `${theme.cardBg}40`, borderColor: `${theme.primary}20` }}>
                <div className="p-8 border-b border-emerald-50 space-y-6" style={{ borderColor: `${theme.primary}10` }}>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black italic tracking-tighter" style={{ color: theme.text }}>MURATOVLAR</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.primary }}>Avlodlar Davomi</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: theme.primary }} size={18} />
                    <input type="text" placeholder="Ism bo'yicha..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 border border-emerald-100 rounded-3xl text-sm focus:ring-2 outline-none transition-all" 
                      style={{ backgroundColor: `${theme.cardBg}50`, borderColor: `${theme.primary}20`, focusRingColor: theme.primary, color: theme.text }} />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                  {filteredMembers.map(member => (
                    <button key={member.id} onClick={() => setSelectedId(member.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all border
                        ${selectedId === member.id ? 'shadow-xl text-white' : 'hover:bg-white/80'}`}
                      style={{ 
                        backgroundColor: selectedId === member.id ? theme.primary : `${theme.cardBg}40`,
                        borderColor: selectedId === member.id ? theme.primary : 'transparent'
                      }}>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 ${selectedId === member.id ? 'bg-white/20 border-white/40' : 'bg-emerald-50 border-emerald-100'}`}>
                        <User size={20} style={{ color: selectedId === member.id ? 'white' : theme.primary }} />
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="text-sm font-black italic truncate">{member.firstName}</p>
                        <p className="text-[10px] font-bold uppercase tracking-tighter opacity-60 truncate">{member.lastName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tree Area */}
              <main 
                className={`flex-1 relative overflow-auto custom-scrollbar scroll-smooth p-10 cursor-grab active:cursor-grabbing transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[200]' : ''}`} 
                ref={containerRef}
                style={{ 
                  backgroundColor: theme.background,
                  backgroundImage: theme.treeBgImage ? `url(${theme.treeBgImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundAttachment: 'fixed'
                }}
              >
                {isFullscreen && (
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="fixed top-8 right-8 z-[210] p-5 rounded-full bg-white shadow-2xl border-2 border-rose-100 hover:scale-110 active:scale-95 transition-all text-rose-500 flex items-center justify-center"
                  >
                    <X size={32} />
                  </button>
                )}
                
                <div 
                  className="min-w-[1500px] min-h-[1500px] relative origin-top transition-transform duration-300"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" style={{ minWidth: '2000px', minHeight: '2000px' }}>
                    <defs>
                      <filter id="leafShadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
                      </filter>
                      <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#86efac" />
                        <stop offset="50%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#166534" />
                      </linearGradient>
                      <radialGradient id="foliageVolume">
                        <stop offset="0%" stopColor="rgba(34, 197, 94, 0.6)" />
                        <stop offset="70%" stopColor="rgba(21, 128, 61, 0.2)" />
                        <stop offset="100%" stopColor="rgba(20, 83, 45, 0)" />
                      </radialGradient>
                    </defs>
                    <g transform="translate(750, 100)">
                      {/* Clean Connecting Lines */}
                      {links.map((link, i) => {
                        const sourceX = (link.source as any).x;
                        const sourceY = (link.source as any).y + 60;
                        const targetX = (link.target as any).x;
                        const targetY = (link.target as any).y - 60;
                        
                        const midY = (sourceY + targetY) / 2;
                        
                        const d = `M ${sourceX} ${sourceY} 
                                   L ${sourceX} ${midY} 
                                   L ${targetX} ${midY} 
                                   L ${targetX} ${targetY}`;

                        return (
                          <g key={`link-${i}`}>
                            {/* Line glow/shadow */}
                            <motion.path 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              d={d} 
                              fill="none" 
                              stroke="rgba(0,0,0,0.05)" 
                              strokeWidth={6} 
                              strokeLinecap="round"
                              style={{ transform: 'translate(1px, 2px)' }}
                            />
                            {/* Main connector line */}
                            <motion.path 
                              initial={{ pathLength: 0, opacity: 0 }} 
                              animate={{ pathLength: 1, opacity: 1 }} 
                              transition={{ duration: 1.5, delay: i * 0.05 }}
                              d={d} 
                              fill="none" 
                              stroke="#6D4C41" 
                              strokeWidth={3} 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                            {/* Connection dots */}
                            <circle cx={sourceX} cy={sourceY} r="4" fill="#6D4C41" />
                            <circle cx={targetX} cy={targetY} r="4" fill="#6D4C41" />
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="relative" style={{ transform: 'translate(750px, 100px)' }}>
                      {/* Nodes rendered here */}
                      {nodes.map(node => (
                        <div key={node.data.id} className="pointer-events-auto">
                          <MemberNode member={node.data} x={node.x} y={node.y} isSelected={selectedId === node.data.id} onClick={() => setSelectedId(node.data.id)} theme={theme} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Floating controls - Now Top Right and Smaller */}
                <div className={`fixed top-6 right-6 transition-all ${isFullscreen ? 'z-[250]' : 'z-[110]'}`}>
                   <div className="p-3 rounded-[1.5rem] border shadow-2xl flex flex-col gap-3 items-center backdrop-blur-xl" style={{ backgroundColor: `${theme.cardBg}cc`, borderColor: `${theme.primary}20` }}>
                     
                     <div className="flex flex-col gap-1 border-b pb-2" style={{ borderColor: `${theme.primary}20` }}>
                       <button 
                         onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
                         className="p-2 rounded-xl transition-all hover:bg-emerald-50"
                         style={{ color: theme.primary }}
                         title="Yaqinlashtirish"
                       >
                         <Plus size={18} />
                       </button>
                       <button 
                         onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                         className="p-2 rounded-xl transition-all hover:bg-emerald-50"
                         style={{ color: theme.primary }}
                         title="Uzoqlashtirish"
                       >
                         <Minus size={18} />
                       </button>
                       <button 
                         onClick={() => setIsFullscreen(!isFullscreen)}
                         className="p-2 rounded-xl transition-all hover:bg-emerald-50"
                         style={{ color: theme.primary }}
                         title={isFullscreen ? "Kichraytirish" : "Yoyish"}
                       >
                         {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                       </button>
                     </div>

                     <div className="flex flex-col items-center py-1">
                       <span className="text-[7px] font-black uppercase tracking-widest leading-none mb-1 opacity-50" style={{ color: theme.primary }}>Oqim</span>
                       <button onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} className="p-2 rounded-lg transition-all" style={{ color: theme.primary }}>
                         <ChevronUp size={16} />
                       </button>
                       <button onClick={() => containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })} className="p-2 rounded-lg transition-all" style={{ color: theme.primary }}>
                         <ChevronDown size={16} />
                       </button>
                     </div>
                   </div>
                </div>
              </main>
            </>
          )}

          {activeTab === 'gallery' && (
            <main className="flex-1 overflow-y-auto custom-scrollbar">
              <GallerySection theme={theme} />
            </main>
          )}

          {activeTab === 'history' && (
            <main className="flex-1 overflow-y-auto custom-scrollbar">
              <HistorySection theme={theme} />
            </main>
          )}

          {activeTab === 'settings' && (
            <main className="flex-1 overflow-y-auto custom-scrollbar">
              <SettingsSection theme={theme} setTheme={setTheme} />
            </main>
          )}

          <AnimatePresence>
            {selectedId && MURATOV_DATA[selectedId] && (
              <MemberDetail member={MURATOV_DATA[selectedId]} onClose={() => setSelectedId(null)} onSelectRelative={setSelectedId} theme={theme} />
            )}
          </AnimatePresence>

        </motion.div>
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.4); }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}} />
    </div>
  );
}
