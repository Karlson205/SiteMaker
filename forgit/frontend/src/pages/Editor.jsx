import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/api';

const Editor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const canvasRef = useRef(null);
    
    //  СОСТОЯНИЯ АДАПТИВНОСТИ 
    const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop');
    const [applyStyleToAllScreen, setApplyStyleToAllScreen] = useState(true);

    //  СОСТОЯНИЯ ДЛЯ ПУБЛИКАЦИИ 
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [accessLevel, setAccessLevel] = useState('author');
    const [isPublishing, setIsPublishing] = useState(false);

    const breakpointWidths = {
        desktop: '850px',
        tablet: '600px',
        mobile: '360px'
    };

    //  ОСНОВНЫЕ СОСТОЯНИЯ 
    const [projectName, setProjectName] = useState('GreenBuild Project');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [activeTab, setActiveTab] = useState('content');

    //  ИСТОРИЯ (UNDO/REDO) 
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

    // ЗАГРУЗКА ДАННЫХ И МИГРАЦИЯ СТАРЫХ ПРОЕКТОВ 
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await API.get(`/projects/${id}`);
                setProjectName(data.name);
                
                // Переводим старые "плоские" данные в новую адаптивную структуру, если нужно
                const migratedBlocks = (data.blocks || []).map(b => {
                    if (!b.responsive) {
                        const baseStyles = b.styles || {};
                        return {
                            ...b,
                            responsive: {
                                desktop: { x: b.x ?? 100, y: b.y ?? 100, styles: { ...baseStyles } },
                                tablet: { x: b.x ?? 50, y: b.y ?? 100, styles: { ...baseStyles, fontSize: b.styles?.fontSize ? `${parseInt(b.styles.fontSize) * 0.8}px` : undefined } },
                                mobile: { x: b.x ?? 20, y: b.y ?? 100, styles: { ...baseStyles, width: ['image', 'card', 'video', 'divider', 'form'].includes(b.type) ? '100%' : baseStyles.width, fontSize: b.styles?.fontSize ? `${parseInt(b.styles.fontSize) * 0.7}px` : undefined } }
                            }
                        };
                    }
                    return b;
                });

                setBlocks(migratedBlocks);
                setHistory([JSON.parse(JSON.stringify(migratedBlocks))]);
                setHistoryIndex(0);
            } catch (err) {
                console.error("Ошибка загрузки проекта:", err);
            }
        };
        if (id) {
            fetchProject();
        }
    }, [id]);

    const handlePublishProject = async () => {
        setIsPublishing(true);
        try {
            await API.put(`/projects/${id}/publish`, { access_level: accessLevel });
            alert("Настройки приватности сохранены! Статус публикации обновлен.");
            setIsPublishModalOpen(false);
        } catch (err) {
            console.error("Ошибка публикации:", err);
            alert(err.response?.data?.error || "Не удалось изменить настройки публикации");
        } finally {
            setIsPublishing(false);
        }
    };

    //  СОХРАНЕНИЕ 
    const handleSave = useCallback(async () => {
        try {
            await API.put(`/projects/${id}`, { blocks, name: projectName });
            console.log("Проект успешно сохранен!");
        } catch (err) {
            console.error("Ошибка при сохранении:", err);
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
                    .then(() => console.log("Автосохранение выполнено."))
                    .catch(err => console.error("Ошибка автосохранения:", err));
            }
        }, 300000);
        return () => clearInterval(interval);
    }, [id]);

    //ДВИЖЕНИЕ БЛОКОВ (DRAG & DROP) 
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

    //  ХЕЛПЕРЫ ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ ТЕКУЩЕГО ЭКРАНА 
    const getBlockCoords = (block, bp = currentBreakpoint) => {
        if (block.responsive && block.responsive[bp]) {
            return { x: block.responsive[bp].x, y: block.responsive[bp].y };
        }
        return { x: block.x ?? 100, y: block.y ?? 100 };
    };

    const getBlockStyles = (block, bp = currentBreakpoint) => {
        if (block.responsive && block.responsive[bp] && block.responsive[bp].styles) {
            return block.responsive[bp].styles;
        }
        return block.styles || {};
    };

    //  ДОБАВЛЕНИЕ БЛОКОВ 
    const addBlock = (type) => {
        const offset = blocks.length * 25;
        
        const defaultStyles = {
            color: '#1a202c',
            backgroundColor: type === 'button' ? '#10b981' : type === 'form' ? '#f8fafc' : 'transparent',
            fontSize: type === 'heading' ? '36px' : '16px',
            fontFamily: 'sans-serif',
            fontWeight: type === 'heading' ? '800' : '400',
            lineHeight: '1.4',
            textAlign: 'left',
            padding: ['button', 'card', 'form', 'divider'].includes(type) ? '16px' : '0px',
            borderRadius: ['button', 'card', 'form', 'image', 'video'].includes(type) ? '12px' : '0px',
            borderWidth: type === 'divider' ? '2px' : type === 'card' || type === 'form' ? '1px' : '0px',
            borderColor: type === 'divider' ? '#cbd5e1' : '#e2e8f0',
            opacity: '1',
            textTransform: 'none',
            width: ['image', 'video', 'card', 'form', 'divider'].includes(type) ? '320px' : 'auto',
            ...(type === 'image' ? { height: '200px', objectFit: 'cover' } : {}),
            ...(type === 'video' ? { height: '180px' } : {})
        };

        const newBlock = {
            id: `${type}-${Date.now()}`,
            type: type,
            tag: type === 'heading' ? 'h1' : type === 'divider' ? 'hr' : type === 'image' ? 'img' : type === 'form' ? 'form' : 'p',
            content: type === 'heading' ? 'Новый заголовок' : 
                     type === 'paragraph' ? 'Введите текст...' : 
                     type === 'image' ? 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500' :
                     type === 'video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' :
                     type === 'card' ? 'Заголовок карточки|Описание важного преимущества или отзыв.' :
                     type === 'form' ? 'Оставить заявку|Ваше имя|Email|Отправить' : 'Кнопка действия',
            link: '',
            responsive: {
                desktop: { x: 100 + offset, y: 100 + offset, styles: { ...defaultStyles } },
                tablet: { x: 50 + offset, y: 100 + offset, styles: { ...defaultStyles, fontSize: type === 'heading' ? '28px' : '15px' } },
                mobile: { x: 20 + offset, y: 100 + offset, styles: { ...defaultStyles, fontSize: type === 'heading' ? '22px' : '14px', width: ['image', 'video', 'card', 'form', 'divider'].includes(type) ? '100%' : 'auto' } }
            }
        };

        const updated = [...blocks, newBlock];
        setBlocks(updated);
        saveToHistory(updated);
        setSelectedId(newBlock.id);
    };

    // ИЗМЕНЕНИЕ СТИЛЕЙ И КОНТЕНТА
    const updateBlock = (field, value, isStyle = false) => {
        const updated = blocks.map(b => {
            if (b.id !== selectedId) return b;
            const block = { ...b };

            if (isStyle) {
                if (applyStyleToAllScreen) {
                    ['desktop', 'tablet', 'mobile'].forEach(bp => {
                        block.responsive[bp].styles = {
                            ...block.responsive[bp].styles,
                            [field]: value
                        };
                    });
                } else {
                    block.responsive[currentBreakpoint].styles = {
                        ...block.responsive[currentBreakpoint].styles,
                        [field]: value
                    };
                }
            } else {
                block[field] = value;
            }
            return block;
        });
        setBlocks(updated);
        saveToHistory(updated);
    };

    // ОБНОВЛЕНИЕ КООРДИНАТ ПРИ DRAG-N-DROP
    const updateBlockCoords = (id, x, y) => {
        setBlocks(prevBlocks => prevBlocks.map(b => {
            if (b.id !== id) return b;
            const block = { ...b };
            block.responsive[currentBreakpoint].x = x;
            block.responsive[currentBreakpoint].y = y;
            return block;
        }));
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
            
            {/* ВЕРХНЯЯ ИНФОРМАЦИОННАЯ СТРОКА */}
            <div className="bg-emerald-950 text-white px-6 py-2 flex justify-between items-center text-[10px] font-black tracking-[0.2em] border-b border-emerald-800">
                <div className="flex items-center gap-4">
                    <span className="text-emerald-700">PROJECT:</span>
                    {isEditingTitle ? (
                        <input autoFocus className="bg-emerald-900 border-none rounded px-2 py-0.5 outline-none text-emerald-200 font-sans tracking-normal"
                            value={projectName} onChange={(e) => setProjectName(e.target.value)}
                            onBlur={() => setIsEditingTitle(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)} />
                    ) : (
                        <span onClick={() => setIsEditingTitle(true)} className="text-emerald-400 cursor-pointer hover:underline underline-offset-4 tracking-normal font-bold">{projectName.toUpperCase()}</span>
                    )}
                </div>

                {/* ПЕРЕКЛЮЧАТЕЛЬ ЭКРАНОВ */}
                <div className="flex bg-emerald-900 rounded-lg p-0.5 border border-emerald-800 tracking-normal font-bold">
                    <button onClick={() => setCurrentBreakpoint('desktop')}
                        className={`px-3 py-1 rounded-md text-[9px] transition-all ${currentBreakpoint === 'desktop' ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-300 hover:text-white'}`}>
                        🖥 Компьютер
                    </button>
                    <button onClick={() => setCurrentBreakpoint('tablet')}
                        className={`px-3 py-1 rounded-md text-[9px] transition-all ${currentBreakpoint === 'tablet' ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-300 hover:text-white'}`}>
                        平板 Планшет
                    </button>
                    <button onClick={() => setCurrentBreakpoint('mobile')}
                        className={`px-3 py-1 rounded-md text-[9px] transition-all ${currentBreakpoint === 'mobile' ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-300 hover:text-white'}`}>
                        📱 Телефон
                    </button>
                </div>

                <div className="flex gap-6">
                    <button onClick={undo} disabled={historyIndex === 0} className="hover:text-emerald-400 disabled:opacity-20 transition">↩ UNDO</button>
                    <button onClick={redo} disabled={historyIndex === history.length - 1} className="hover:text-emerald-400 disabled:opacity-20 transition">REDO ↪</button>
                </div>
            </div>

            {/* ГЛАВНЫЙ HEADER */}
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
                    <button onClick={handleSave} className="bg-white text-emerald-900 px-5 py-1.5 rounded-full text-sm font-medium hover:bg-emerald-50 transition shadow-lg active:scale-95">Сохранить</button>
                    <button 
                        onClick={() => setIsPublishModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                        Опубликовать
                    </button>
                </div>
            </header>

            {/* ОСНОВНОЙ РАБОЧИЙ ИНТЕРФЕЙС */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* ЛЕВАЯ ПАНЕЛЬ */}
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
                    <button onClick={() => addBlock('image')} className="group p-5 bg-slate-50 hover:bg-emerald-600 border border-slate-200 rounded-2xl transition-all text-left">
                        <div className="text-2xl group-hover:text-white transition-colors">🖼</div>
                        <div className="text-[10px] text-slate-400 group-hover:text-emerald-100 uppercase mt-1 font-bold">Изображение</div>
                    </button>
                    <button onClick={() => addBlock('card')} className="group p-5 bg-slate-50 hover:bg-emerald-600 border border-slate-200 rounded-2xl transition-all text-left">
                        <div className="text-2xl group-hover:text-white transition-colors">📇</div>
                        <div className="text-[10px] text-slate-400 group-hover:text-emerald-100 uppercase mt-1 font-bold">Карточка</div>
                    </button>
                    <button onClick={() => addBlock('video')} className="group p-5 bg-slate-50 hover:bg-emerald-600 border border-slate-200 rounded-2xl transition-all text-left">
                        <div className="text-2xl group-hover:text-white transition-colors">🎥</div>
                        <div className="text-[10px] text-slate-400 group-hover:text-emerald-100 uppercase mt-1 font-bold">Видео</div>
                    </button>
                    <button onClick={() => addBlock('divider')} className="group p-5 bg-slate-50 hover:bg-emerald-600 border border-slate-200 rounded-2xl transition-all text-left">
                        <div className="text-xl group-hover:text-white transition-colors">────────</div>
                        <div className="text-[10px] text-slate-400 group-hover:text-emerald-100 uppercase mt-1 font-bold">Разделитель</div>
                    </button>
                    <button onClick={() => addBlock('form')} className="group p-5 bg-slate-50 hover:bg-emerald-600 border border-slate-200 rounded-2xl transition-all text-left">
                        <div className="text-2xl group-hover:text-white transition-colors">📝</div>
                        <div className="text-[10px] text-slate-400 group-hover:text-emerald-100 uppercase mt-1 font-bold">Форма подписки</div>
                    </button>
                </aside>

                {/* CANVAS */}
                <main className="flex-1 overflow-auto flex justify-center items-start p-12 bg-slate-200"
                    onMouseMove={(e) => {
                        if (!draggingBlockId) return;
                        const rect = canvasRef.current.getBoundingClientRect();
                        const currentX = e.clientX - rect.left - dragOffset.x;
                        const currentY = e.clientY - rect.top - dragOffset.y;
                        updateBlockCoords(draggingBlockId, currentX, currentY);
                    }} 
                    onMouseUp={() => { if(draggingBlockId) { saveToHistory(blocks); setDraggingBlockId(null); } }} 
                    onClick={() => setSelectedId(null)}>
                    
                    <div ref={canvasRef} 
                        style={{ width: breakpointWidths[currentBreakpoint] }}
                        className="bg-white min-h-[1100px] shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)] relative transition-all duration-300 overflow-hidden">
                        
                        {blocks.map(block => {
                            const Tag = block.tag;
                            const { x, y } = getBlockCoords(block);
                            const currentStyles = getBlockStyles(block);

                            return (
                                <div key={block.id} 
                                    onMouseDown={(e) => {
                                        if (e.shiftKey && e.button === 0) {
                                            e.preventDefault(); setDraggingBlockId(block.id);
                                            const rect = canvasRef.current.getBoundingClientRect();
                                            setDragOffset({ x: e.clientX - rect.left - x, y: e.clientY - rect.top - y });
                                        }
                                    }}
                                    onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedId(block.id); }}
                                    style={{
                                        position: 'absolute', left: `${x}px`, top: `${y}px`,
                                        zIndex: selectedId === block.id ? 10 : 1,
                                        cursor: isShiftPressed ? 'grab' : 'default', userSelect: 'none'
                                    }}
                                    className={`group p-2 transition-all ${selectedId === block.id ? 'ring-4 ring-emerald-500/30 border-2 border-emerald-500 shadow-2xl' : 'border-2 border-transparent hover:border-emerald-200'}`}
                                >
                                    <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                                        className="absolute -top-4 -right-4 bg-rose-500 text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl flex items-center justify-center text-sm font-bold z-50">✕</button>
                                    
                                    {/* ИЗОБРАЖЕНИЕ */}
                                    {block.type === 'image' && (
                                        <img src={block.content} alt="Content"
                                            style={{
                                                width: currentStyles.width || '100%', height: currentStyles.height || 'auto',
                                                objectFit: currentStyles.objectFit || 'cover', borderRadius: currentStyles.borderRadius,
                                                opacity: currentStyles.opacity, padding: currentStyles.padding,
                                                border: `${currentStyles.borderWidth || '0px'} solid ${currentStyles.borderColor || '#000'}`,
                                                pointerEvents: 'none'
                                            }} />
                                    )}

                                    {/* КАРТОЧКА */}
                                    {block.type === 'card' && (
                                        <div style={{ ...currentStyles }}>
                                            <h4 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '8px', color: currentStyles.color }}>
                                                {block.content.split('|')[0] || 'Заголовок'}
                                            </h4>
                                            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                                                {block.content.split('|')[1] || 'Описание карточки...'}
                                            </p>
                                        </div>
                                    )}

                                    {/* ВИДЕО */}
                                    {block.type === 'video' && (
                                        <div style={{ width: currentStyles.width, height: currentStyles.height, padding: currentStyles.padding, pointerEvents: 'none' }}>
                                            <iframe width="100%" height="100%" src={block.content} title="Video iframe" frameBorder="0" 
                                                style={{ borderRadius: currentStyles.borderRadius, border: `${currentStyles.borderWidth || '0px'} solid ${currentStyles.borderColor || '#000'}` }} allowFullScreen></iframe>
                                        </div>
                                    )}

                                    {/* РАЗДЕЛИТЕЛЬ */}
                                    {block.type === 'divider' && (
                                        <div style={{ padding: currentStyles.padding, width: currentStyles.width }}>
                                            <hr style={{ border: 'none', borderTop: `${currentStyles.borderWidth || '2px'} solid ${currentStyles.borderColor || '#cbd5e1'}`, opacity: currentStyles.opacity, margin: 0 }} />
                                        </div>
                                    )}

                                    {/* ФОРМА ПОДПИСКИ */}
                                    {block.type === 'form' && (
                                        <div style={{ ...currentStyles }} className="space-y-3 shadow-inner">
                                            <div style={{ color: currentStyles.color || '#1e293b' }} className="font-bold text-center text-sm">
                                                {block.content.split('|')[0] || 'Форма'}
                                            </div>
                                            <input type="text" disabled placeholder={block.content.split('|')[1] || 'Имя'} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs" />
                                            <input type="email" disabled placeholder={block.content.split('|')[2] || 'Email'} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs" />
                                            <button type="button" className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg uppercase tracking-wider text-xs opacity-90">
                                                {block.content.split('|')[3] || 'Отправить'}
                                            </button>
                                        </div>
                                    )}

                                    {/* ОБЫЧНЫЕ СТАНДАРТНЫЕ БЛОКИ */}
                                    {(!['image', 'card', 'video', 'divider', 'form'].includes(block.type)) && (
                                        <Tag style={{...currentStyles, pointerEvents: block.type === 'button' ? 'none' : 'auto'}}>
                                            {block.content}
                                        </Tag>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </main>

                {/* ИНСПЕКТОР */}
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
                                        {selectedBlock.type === 'image' && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ссылка на изображение</label>
                                                    <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs" 
                                                        value={selectedBlock.content} onChange={(e) => updateBlock('content', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Object Fit</label>
                                                    <select className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs"
                                                        value={getBlockStyles(selectedBlock).objectFit || 'cover'} onChange={(e) => updateBlock('objectFit', e.target.value, true)}>
                                                        <option value="cover">Cover (Заполнение)</option>
                                                        <option value="contain">Contain (Вписать)</option>
                                                        <option value="fill">Fill (Растянуть)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {selectedBlock.type === 'video' && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ссылка Embed (YouTube)</label>
                                                <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs" 
                                                    value={selectedBlock.content} onChange={(e) => updateBlock('content', e.target.value)} />
                                            </div>
                                        )}

                                        {selectedBlock.type === 'card' && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Заголовок карточки</label>
                                                    <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs" 
                                                        value={selectedBlock.content.split('|')[0] || ''} 
                                                        onChange={(e) => updateBlock('content', `${e.target.value}|${selectedBlock.content.split('|')[1] || ''}`)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Описание карточки</label>
                                                    <textarea rows="3" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs resize-none" 
                                                        value={selectedBlock.content.split('|')[1] || ''} 
                                                        onChange={(e) => updateBlock('content', `${selectedBlock.content.split('|')[0] || ''}|${e.target.value}`)} />
                                                </div>
                                            </div>
                                        )}

                                        {selectedBlock.type === 'form' && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Заголовок формы</label>
                                                    <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs" 
                                                        value={selectedBlock.content.split('|')[0] || ''} 
                                                        onChange={(e) => {
                                                            const parts = selectedBlock.content.split('|'); parts[0] = e.target.value;
                                                            updateBlock('content', parts.join('|'));
                                                        }} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Placeholder Имени</label>
                                                    <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs" 
                                                        value={selectedBlock.content.split('|')[1] || ''} 
                                                        onChange={(e) => {
                                                            const parts = selectedBlock.content.split('|'); parts[1] = e.target.value;
                                                            updateBlock('content', parts.join('|'));
                                                        }} />
                                                </div>
                                            </div>
                                        )}

                                        {(!['image', 'video', 'card', 'form', 'divider'].includes(selectedBlock.type)) && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Текст</label>
                                                <textarea className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:border-emerald-500 outline-none resize-none min-h-[120px]"
                                                    value={selectedBlock.content} onChange={(e) => updateBlock('content', e.target.value)} />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO Тег</label>
                                            <select className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold"
                                                value={selectedBlock.tag} onChange={(e) => updateBlock('tag', e.target.value)}>
                                                <option value="h1">Заголовок H1</option>
                                                <option value="h2">Заголовок H2</option>
                                                <option value="h3">Заголовок H3</option>
                                                <option value="p">Обычный текст P</option>
                                                <option value="div">Блок DIV</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* ЧЕКБОКС ДЛЯ ГЛОБАЛЬНЫХ ИЗМЕНЕНИЙ СТИЛЕЙ */}
                                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-wider cursor-pointer" htmlFor="global-toggle">
                                                    Применять ко всем экранам
                                                </label>
                                                <input id="global-toggle" type="checkbox" className="w-4 h-4 accent-emerald-600 cursor-pointer"
                                                    checked={applyStyleToAllScreen} onChange={(e) => setApplyStyleToAllScreen(e.target.checked)} />
                                            </div>
                                            <p className="text-[9px] text-emerald-600/80 leading-normal">
                                                {applyStyleToAllScreen 
                                                    ? "⚡ Цвет, размер и шрифты изменятся одновременно на ПК, планшете и мобильном." 
                                                    : "🔒 Изменения затронут ТОЛЬКО текущий выбранный экран."}
                                            </p>
                                        </div>

                                        {/* НАСТРОЙКА РАЗМЕРОВ */}
                                        {['image', 'video', 'card', 'form', 'divider'].includes(selectedBlock.type) && (
                                            <section className="space-y-4 border-b border-slate-100 pb-4">
                                                <h3 className="text-[10px] font-black text-slate-400 pb-2 uppercase tracking-widest">Размеры блока</h3>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Ширина</label>
                                                    <input type="text" className="w-full p-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold"
                                                        value={getBlockStyles(selectedBlock).width || '300px'} onChange={(e) => updateBlock('width', e.target.value, true)} />
                                                </div>
                                                {['image', 'video'].includes(selectedBlock.type) && (
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Высота</label>
                                                        <input type="text" className="w-full p-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold"
                                                            value={getBlockStyles(selectedBlock).height || '200px'} onChange={(e) => updateBlock('height', e.target.value, true)} />
                                                    </div>
                                                )}
                                                {selectedBlock.type === 'divider' && (
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Толщина линии (px)</label>
                                                        <input type="range" min="1" max="20" className="w-full accent-emerald-500" 
                                                            value={parseInt(getBlockStyles(selectedBlock).borderWidth) || 2}
                                                            onChange={(e) => updateBlock('borderWidth', `${e.target.value}px`, true)} />
                                                    </div>
                                                )}
                                            </section>
                                        )}

                                        {/* ЦВЕТА */}
                                        <section className="space-y-4">
                                            <h3 className="text-[10px] font-black text-emerald-600 border-b border-emerald-50 pb-2 uppercase tracking-widest">Цвета и Эффекты</h3>
                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                                    {selectedBlock.type === 'divider' ? 'Цвет линии' : selectedBlock.type === 'form' || selectedBlock.type === 'button' ? 'Цвет фона' : 'Цвет текста'}
                                                </span>
                                                <input type="color" className="w-8 h-8 border-none bg-transparent cursor-pointer"
                                                    value={selectedBlock.type === 'divider' ? (getBlockStyles(selectedBlock).borderColor || '#cbd5e1') : (getBlockStyles(selectedBlock).backgroundColor || getBlockStyles(selectedBlock).color || '#000000')} 
                                                    onChange={(e) => {
                                                        if (selectedBlock.type === 'divider') updateBlock('borderColor', e.target.value, true);
                                                        else if (['button', 'form'].includes(selectedBlock.type)) updateBlock('backgroundColor', e.target.value, true);
                                                        else updateBlock('color', e.target.value, true);
                                                    }} />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between"><label className="text-[10px] font-bold text-slate-400 uppercase">Прозрачность</label><span className="text-[10px] font-bold text-emerald-600">{getBlockStyles(selectedBlock).opacity || '1'}</span></div>
                                                <input type="range" min="0" max="1" step="0.1" className="w-full accent-emerald-500" value={getBlockStyles(selectedBlock).opacity || 1}
                                                    onChange={(e) => updateBlock('opacity', e.target.value, true)} />
                                            </div>
                                        </section>

                                        {/* ТИПОГРАФИКА */}
                                        {selectedBlock.type !== 'divider' && (
                                            <section className="space-y-4">
                                                <h3 className="text-[10px] font-black text-emerald-600 border-b border-emerald-50 pb-2 uppercase tracking-widest">Типографика</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Размер</label>
                                                        <input type="text" className="w-full p-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold"
                                                            value={getBlockStyles(selectedBlock).fontSize || '16px'} onChange={(e) => updateBlock('fontSize', e.target.value, true)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Вес</label>
                                                        <select className="w-full p-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold"
                                                            value={getBlockStyles(selectedBlock).fontWeight || '400'} onChange={(e) => updateBlock('fontWeight', e.target.value, true)}>
                                                            <option value="300">Light</option>
                                                            <option value="400">Regular</option>
                                                            <option value="600">SemiBold</option>
                                                            <option value="800">Bold</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        {/* ГЕОМЕТРИЯ */}
                                        <section className="space-y-4 pb-10">
                                            <h3 className="text-[10px] font-black text-emerald-600 border-b border-emerald-50 pb-2 uppercase tracking-widest">Геометрия</h3>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase">Радиус углов</label>
                                                <input type="range" min="0" max="100" className="w-full accent-emerald-500" value={parseInt(getBlockStyles(selectedBlock).borderRadius) || 0}
                                                    onChange={(e) => updateBlock('borderRadius', `${e.target.value}px`, true)} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase">Внутренний отступ</label>
                                                <input type="range" min="0" max="100" className="w-full accent-emerald-500" value={parseInt(getBlockStyles(selectedBlock).padding) || 0}
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

            {/* МОДАЛЬНОЕ ОКНО ПУБЛИКАЦИИ */}
            {isPublishModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Настройки публикации</h2>
                                <p className="text-xs text-slate-400 font-medium mt-1">Кто сможет получить доступ к вашему сайту?</p>
                            </div>
                            <button 
                                onClick={() => setIsPublishModalOpen(false)} 
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3 mb-8">
                            {/* Вариант 1: Только автор */}
                            <label className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition ${accessLevel === 'author' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                                <input 
                                    type="radio" 
                                    name="accessLevel" 
                                    value="author" 
                                    checked={accessLevel === 'author'} 
                                    onChange={(e) => setAccessLevel(e.target.value)}
                                    className="mt-1 accent-emerald-600 h-4 w-4" 
                                />
                                <div>
                                    <span className="block font-bold text-sm text-emerald-950">Приватный (Только я)</span>
                                    <span className="block text-[11px] text-slate-400 font-medium leading-tight mt-0.5">Сайт скрыт от всех. Просматривать и редактировать его можете только вы.</span>
                                </div>
                            </label>

                            {/* Вариант 2: Авторизованные пользователи */}
                            <label className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition ${accessLevel === 'auth' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                                <input 
                                    type="radio" 
                                    name="accessLevel" 
                                    value="auth" 
                                    checked={accessLevel === 'auth'} 
                                    onChange={(e) => setAccessLevel(e.target.value)}
                                    className="mt-1 accent-emerald-600 h-4 w-4" 
                                />
                                <div>
                                    <span className="block font-bold text-sm text-emerald-950">Авторизованные пользователи</span>
                                    <span className="block text-[11px] text-slate-400 font-medium leading-tight mt-0.5">Войти на сайт смогут только пользователи, зарегистрированные в вашей системе.</span>
                                </div>
                            </label>

                            {/* Вариант 3: Все пользователи */}
                            <label className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition ${accessLevel === 'all' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                                <input 
                                    type="radio" 
                                    name="accessLevel" 
                                    value="all" 
                                    checked={accessLevel === 'all'} 
                                    onChange={(e) => setAccessLevel(e.target.value)}
                                    className="mt-1 accent-emerald-600 h-4 w-4" 
                                />
                                <div>
                                    <span className="block font-bold text-sm text-emerald-950">Публичный (Все пользователи)</span>
                                    <span className="block text-[11px] text-slate-400 font-medium leading-tight mt-0.5">Сайт доступен абсолютно всем в интернете, включая неавторизованных гостей.</span>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsPublishModalOpen(false)} 
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition"
                            >
                                Отмена
                            </button>
                            <button 
                                type="button" 
                                disabled={isPublishing}
                                onClick={handlePublishProject}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                            >
                                {isPublishing ? 'Сохранение...' : 'Применить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;