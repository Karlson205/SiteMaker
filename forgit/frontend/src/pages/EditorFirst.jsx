import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/api';

const Editor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const canvasRef = useRef(null);
    
    // --- СОСТОЯНИЯ ---
    const [projectName, setProjectName] = useState('GreenBuild Project');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [activeTab, setActiveTab] = useState('content');

    // --- ИСТОРИЯ (UNDO/REDO) ---
    const [history, setHistory] = useState([[]]); 
    const [historyIndex, setHistoryIndex] = useState(0);

    const saveToHistory = useCallback((newBlocks) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newBlocks)));
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setHistoryIndex(prevIndex);
            setBlocks(JSON.parse(JSON.stringify(history[prevIndex])));
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setHistoryIndex(nextIndex);
            setBlocks(JSON.parse(JSON.stringify(history[nextIndex])));
        }
    }, [history, historyIndex]);

    // --- ЗАГРУЗКА ДАННЫХ ПРОЕКТА ---
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await API.get(`/projects/${id}`);
                setProjectName(data.name);
                setBlocks(data.blocks || []);
                setHistory([JSON.parse(JSON.stringify(data.blocks || []))]);
                setHistoryIndex(0);
            } catch (err) {
                console.error("Ошибка загрузки проекта:", err);
            }
        };
        if (id) {
            fetchProject();
        }
    }, [id]);

    // --- СОХРАНЕНИЕ (РУЧНОЕ И АВТОСОХРАНЕНИЕ) ---
    const handleSave = useCallback(async () => {
        try {
            await API.put(`/projects/${id}`, { blocks, name: projectName });
            console.log("Проект успешно сохранен вручную!");
        } catch (err) {
            console.error("Ошибка при ручном сохранении проекта:", err);
        }
    }, [id, blocks, projectName]);

    const stateRef = useRef({ blocks, projectName });
    useEffect(() => {
        stateRef.current = { blocks, projectName };
    }, [blocks, projectName]);

    useEffect(() => {
        const interval = setInterval(() => {
            const { blocks: currentBlocks, projectName: currentName } = stateRef.current;
            if (id) {
                API.put(`/projects/${id}`, { blocks: currentBlocks, name: currentName })
                    .then(() => console.log("Автосохранение выполнено успешно."))
                    .catch(err => console.error("Ошибка автосохранения:", err));
            }
        }, 300000); // 5 минут (300 000 мс)

        return () => clearInterval(interval);
    }, [id]);

    // --- ПЕРЕМЕЩЕНИЕ И ГОРЯЧИЕ КЛАВИШИ ---
    const [draggingBlockId, setDraggingBlockId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    useEffect(() => {
        const down = (e) => {
            if (e.key === 'Shift') setIsShiftPressed(true);
            if (e.ctrlKey && (e.key === 'z' || e.key === 'я')) { e.preventDefault(); undo(); }
            if (e.ctrlKey && (e.key === 'y' || e.key === 'н')) { e.preventDefault(); redo(); }
        };
        const up = (e) => { if (e.key === 'Shift') setIsShiftPressed(false); };
        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
        };
    }, [undo, redo]);

    // --- ЛОГИКА БЛОКОВ ---
    const addBlock = (type) => {
        const offset = blocks.length * 25;
        const newBlock = {
            id: Date.now().toString(),
            type: type,
            tag: type === 'heading' ? 'h1' : 'p',
            x: 100 + offset, y: 100 + offset,
            content: type === 'heading' ? 'Новый заголовок' : 
                     type === 'paragraph' ? 'Введите текст...' : 'Кнопка действия',
            link: '',
            styles: {
                color: '#1a202c',
                backgroundColor: type === 'button' ? '#10b981' : 'transparent',
                fontSize: type === 'heading' ? '36px' : '16px',
                fontFamily: 'sans-serif',
                fontWeight: type === 'heading' ? '800' : '400',
                lineHeight: '1.4',
                textAlign: 'left',
                padding: '12px',
                borderRadius: type === 'button' ? '12px' : '0px',
                borderWidth: '0px',
                borderColor: '#000000',
                opacity: '1',
                textTransform: 'none'
            }
            
        };
        const updated = [...blocks, newBlock];
        setBlocks(updated);
        saveToHistory(updated);
        setSelectedId(newBlock.id);
    };

    const updateBlock = (field, value, isStyle = false) => {
        const updated = blocks.map(b => {
            if (b.id === selectedId) {
                if (isStyle) return { ...b, styles: { ...b.styles, [field]: value } };
                return { ...b, [field]: value };
            }
            return b;
        });
        setBlocks(updated);
        saveToHistory(updated);
    };

    const deleteBlock = (id) => {
        const updated = blocks.filter(b => b.id !== id);
        setBlocks(updated);
        saveToHistory(updated);
        if (selectedId === id) setSelectedId(null);
    };

    const selectedBlock = blocks.find(b => b.id === selectedId);

    return (
        <div className="h-screen flex flex-col bg-slate-200 font-sans overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
            
            {/* PROJECT BAR (ВЕРХНЯЯ СТРОКА) */}
            <div className="bg-emerald-950 text-white px-6 py-2 flex justify-between items-center text-[10px] font-black tracking-[0.2em] border-b border-emerald-800">
                <div className="flex items-center gap-4">
                    <span className="text-emerald-700">PROJECT:</span>
                    {isEditingTitle ? (
                        <input autoFocus className="bg-emerald-900 border-none rounded px-2 py-0.5 outline-none text-emerald-200"
                            value={projectName} onChange={(e) => setProjectName(e.target.value)}
                            onBlur={() => setIsEditingTitle(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)} />
                    ) : (
                        <span onClick={() => setIsEditingTitle(true)} className="text-emerald-400 cursor-pointer hover:underline underline-offset-4">{projectName.toUpperCase()}</span>
                    )}
                </div>
                <div className="flex gap-6">
                    <button onClick={undo} disabled={historyIndex === 0} className="hover:text-emerald-400 disabled:opacity-20 transition">↩ UNDO</button>
                    <button onClick={redo} disabled={historyIndex === history.length - 1} className="hover:text-emerald-400 disabled:opacity-20 transition">REDO ↪</button>
                </div>
            </div>

            {/* HEADER (ЕМЕРАЛЬД) */}
            <header className="bg-emerald-900 text-white p-4 flex justify-between items-center shadow-2xl z-30">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-black tracking-tighter">GREEN<span className="text-emerald-400">BUILD</span></h1>
                    <div className="bg-emerald-800 px-3 py-1 rounded-full flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isShiftPressed ? 'bg-emerald-400 animate-ping' : 'bg-emerald-600'}`}></div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-100">
                            {isShiftPressed ? 'Drag Mode' : 'Shift + Drag to move'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={() => navigate('/dashboard')} className="text-sm font-medium hover:text-emerald-300 transition">В панель</button>
                    <button onClick={handleSave} className="bg-white text-emerald-900 px-5 py-1.5 rounded-full text-sm font-medium hover:bg-emerald-50 transition shadow-lg active:scale-95">
                        Сохранить
                    </button>
                    <button className="bg-white text-emerald-900 px-6 py-2 rounded-full text-sm font-black hover:bg-emerald-50 transition shadow-lg active:scale-95">
                        ОПУБЛИКОВАТЬ
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* LEFT PANEL (КАРТОЧКИ) */}
                <aside className="w-72 bg-white border-r border-slate-300 p-6 flex flex-col gap-4 z-20 shadow-2xl overflow-y-auto">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Библиотека</h2>
                    
                    <button onClick={() => addBlock('heading')} className="group p-5 bg-slate-50 hover:bg-emerald-600 border border-slate-200 rounded-2xl transition-all text-left">
                        <div className="text-2xl font-black group-hover:text-white transition-colors">H1</div>
                        <div className="text-[10px] text-slate-400 group-hover:text-emerald-100 uppercase mt-1 font-bold">Заголовок</div>
                    </button>

                    <button onClick={() => addBlock('paragraph')} className="group p-5 bg-slate-50 hover:bg-emerald-600 border border-slate-200 rounded-2xl transition-all text-left">
                        <div className="text-2xl font-serif group-hover:text-white transition-colors">Aa</div>
                        <div className="text-[10px] text-slate-400 group-hover:text-emerald-100 uppercase mt-1 font-bold">Текстовый блок</div>
                    </button>

                    <button onClick={() => addBlock('button')} className="group p-5 bg-slate-50 hover:bg-emerald-600 border border-slate-200 rounded-2xl transition-all text-left">
                        <div className="inline-block px-3 py-1 bg-emerald-500 rounded-lg text-[10px] text-white font-bold mb-2 group-hover:bg-white group-hover:text-emerald-600 transition-all">ACTION</div>
                        <div className="text-[10px] text-slate-400 group-hover:text-emerald-100 uppercase font-bold">Кнопка</div>
                    </button>

                    
                </aside>

                {/* CANVAS */}
                <main className="flex-1 overflow-auto flex justify-center p-12 bg-slate-200"
                    onMouseMove={(e) => {
                        if (!draggingBlockId) return;
                        const rect = canvasRef.current.getBoundingClientRect();
                        setBlocks(blocks.map(b => b.id === draggingBlockId ? { ...b, x: e.clientX - rect.left - dragOffset.x, y: e.clientY - rect.top - dragOffset.y } : b));
                    }} 
                    onMouseUp={() => { if(draggingBlockId) { saveToHistory(blocks); setDraggingBlockId(null); } }} 
                    onClick={() => setSelectedId(null)}>
                    
                    <div ref={canvasRef} className="bg-white w-[850px] min-h-[1100px] shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)] relative transition-all">
                        {blocks.map(block => {
                            const Tag = block.tag;
                            return (
                                <div key={block.id} 
                                    onMouseDown={(e) => {
                                        if (e.shiftKey && e.button === 0) {
                                            e.preventDefault(); setDraggingBlockId(block.id);
                                            const rect = canvasRef.current.getBoundingClientRect();
                                            setDragOffset({ x: e.clientX - rect.left - block.x, y: e.clientY - rect.top - block.y });
                                        }
                                    }}
                                    onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedId(block.id); }}
                                    style={{
                                        position: 'absolute', left: `${block.x}px`, top: `${block.y}px`,
                                        zIndex: selectedId === block.id ? 10 : 1,
                                        cursor: isShiftPressed ? 'grab' : 'default', userSelect: 'none'
                                    }}
                                    className={`group p-2 transition-all ${selectedId === block.id ? 'ring-4 ring-emerald-500/30 border-2 border-emerald-500 shadow-2xl' : 'border-2 border-transparent hover:border-emerald-200'}`}
                                >
                                    <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                                        className="absolute -top-4 -right-4 bg-rose-500 text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl flex items-center justify-center text-sm font-bold z-50 hover:scale-110 active:scale-90">✕</button>
                                    
                                    <Tag style={{...block.styles, pointerEvents: block.type === 'button' ? 'none' : 'auto'}}>
                                        {block.content}
                                    </Tag>
                                </div>
                            );
                        })}
                    </div>
                </main>

                {/* RIGHT INSPECTOR (ЕМЕРАЛЬД ВКЛАДКИ) */}
                <aside className={`w-80 bg-white border-l border-slate-300 flex flex-col z-20 shadow-2xl transition-transform duration-300 ${selectedId ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
                    {selectedBlock && (
                        <>
                            <div className="flex border-b border-slate-100 bg-slate-50">
                                <button onClick={() => setActiveTab('content')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'text-emerald-700 bg-white border-b-2 border-emerald-600' : 'text-slate-400'}`}>Контент</button>
                                <button onClick={() => setActiveTab('style')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'style' ? 'text-emerald-700 bg-white border-b-2 border-emerald-600' : 'text-slate-400'}`}>Стиль</button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 space-y-8">
                                {activeTab === 'content' ? (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Текст</label>
                                            <textarea className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:border-emerald-500 outline-none resize-none min-h-[120px]"
                                                value={selectedBlock.content} onChange={(e) => updateBlock('content', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO Тег</label>
                                            <select className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold"
                                                value={selectedBlock.tag} onChange={(e) => updateBlock('tag', e.target.value)}>
                                                <option value="h1">Заголовок H1</option>
                                                <option value="h2">Заголовок H2</option>
                                                <option value="h3">Заголовок H3</option>
                                                <option value="p">Обычный текст P</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ссылка</label>
                                            <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs"
                                                placeholder="https://..." value={selectedBlock.link || ''} onChange={(e) => updateBlock('link', e.target.value)} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* TYPOGRAPHY */}
                                        <section className="space-y-4">
                                            <h3 className="text-[10px] font-black text-emerald-600 border-b border-emerald-50 pb-2 uppercase tracking-widest">Типографика</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Размер</label>
                                                    <input type="text" className="w-full p-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold"
                                                        value={selectedBlock.styles.fontSize} onChange={(e) => updateBlock('fontSize', e.target.value, true)} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Вес</label>
                                                    <select className="w-full p-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold"
                                                        value={selectedBlock.styles.fontWeight} onChange={(e) => updateBlock('fontWeight', e.target.value, true)}>
                                                        <option value="300">Light</option>
                                                        <option value="400">Regular</option>
                                                        <option value="600">SemiBold</option>
                                                        <option value="800">Bold</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase">Регистр</label>
                                                <select className="w-full p-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold"
                                                    value={selectedBlock.styles.textTransform} onChange={(e) => updateBlock('textTransform', e.target.value, true)}>
                                                    <option value="none">Обычный</option>
                                                    <option value="uppercase">ВСЕ ЗАГЛАВНЫЕ</option>
                                                    <option value="capitalize">С Большой Буквы</option>
                                                </select>
                                            </div>
                                        </section>

                                        {/* COLORS */}
                                        <section className="space-y-4">
                                            <h3 className="text-[10px] font-black text-emerald-600 border-b border-emerald-50 pb-2 uppercase tracking-widest">Цвета и Эффекты</h3>
                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Цвет текста</span>
                                                <input type="color" className="w-8 h-8 border-none bg-transparent cursor-pointer"
                                                    value={selectedBlock.styles.color} onChange={(e) => updateBlock('color', e.target.value, true)} />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between"><label className="text-[10px] font-bold text-slate-400 uppercase">Прозрачность</label><span className="text-[10px] font-bold text-emerald-600">{selectedBlock.styles.opacity}</span></div>
                                                <input type="range" min="0" max="1" step="0.1" className="w-full accent-emerald-500" value={selectedBlock.styles.opacity}
                                                    onChange={(e) => updateBlock('opacity', e.target.value, true)} />
                                            </div>
                                        </section>

                                        {/* BOX MODEL */}
                                        <section className="space-y-4 pb-10">
                                            <h3 className="text-[10px] font-black text-emerald-600 border-b border-emerald-50 pb-2 uppercase tracking-widest">Геометрия</h3>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase">Радиус углов</label>
                                                <input type="range" min="0" max="100" className="w-full accent-emerald-500" value={parseInt(selectedBlock.styles.borderRadius)}
                                                    onChange={(e) => updateBlock('borderRadius', `${e.target.value}px`, true)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase">Внутренний отступ</label>
                                                <input type="range" min="0" max="100" className="w-full accent-emerald-500" value={parseInt(selectedBlock.styles.padding)}
                                                    onChange={(e) => updateBlock('padding', `${e.target.value}px`, true)} />
                                            </div>
                                        </section>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default Editor;