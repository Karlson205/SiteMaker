import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

const ViewSite = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [breakpoint, setBreakpoint] = useState('desktop');

    // Отслеживаем ширину окна в реальном времени
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width <= 600) setBreakpoint('mobile');
            else if (width <= 850) setBreakpoint('tablet');
            else setBreakpoint('desktop');
        };
        
        handleResize(); // Инициализация при загрузке
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchSite = async () => {
            try {
                const { data } = await API.get(`/projects/${id}/view`);
                setProject(data);
                document.title = data.name;
            } catch (err) {
                setError(err.response?.data?.error || "Произошла ошибка при загрузке сайта");
            } finally {
                setLoading(false);
            }
        };
        fetchSite();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-emerald-600 font-bold">Загрузка сайта...</div>;
    
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4 border border-slate-100">
                <div className="text-4xl">🔒</div>
                <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Доступ закрыт</h1>
                <p className="text-sm text-slate-500 font-medium">{error}</p>
                <button onClick={() => navigate('/')} className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition">На главную GreenBuild</button>
            </div>
        </div>
    );

    const breakpointWidths = { desktop: '850px', tablet: '600px', mobile: '360px' };

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center overflow-x-hidden relative">
            
            {/* ТЕСТОВАЯ ПЛАШКА: Удали её, когда убедишься, что всё работает */}
            <div className="fixed bottom-4 right-4 bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold z-50 shadow-lg opacity-50 hover:opacity-100 transition">
                Режим: {breakpoint.toUpperCase()} ({window.innerWidth}px)
            </div>

            <div style={{ width: breakpointWidths[breakpoint], maxWidth: '100%' }} className="relative min-h-screen bg-white shadow-2xl overflow-hidden transition-all duration-300">
                {project.blocks.map(block => {
                    const Tag = block.tag;
                    
                    // ИДЕАЛЬНАЯ ЛОГИКА: Берем текущий экран, если нет - берем базу, если нет - ставим 0.
                    // ?? (Nullish Coalescing) позволяет корректно считывать координату "0"
                    const x = block.responsive?.[breakpoint]?.x ?? block.x ?? 0;
                    const y = block.responsive?.[breakpoint]?.y ?? block.y ?? 0;
                    const currentStyles = { ...(block.styles || {}), ...(block.responsive?.[breakpoint]?.styles || {}) };

                    return (
                        <div key={block.id} 
                            style={{ 
                                position: 'absolute', 
                                left: `${x}px`, 
                                top: `${y}px`,
                                // Плавная анимация при изменении размера окна браузера
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                            }}
                        >
                            {block.type === 'image' && (
                                <img src={block.content} alt="" style={{ width: currentStyles.width, height: currentStyles.height, objectFit: currentStyles.objectFit, borderRadius: currentStyles.borderRadius, opacity: currentStyles.opacity, padding: currentStyles.padding, border: `${currentStyles.borderWidth || '0px'} solid ${currentStyles.borderColor}` }} />
                            )}
                            
                            {block.type === 'card' && (
                                <div style={{ ...currentStyles }}>
                                    <h4 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '8px', color: currentStyles.color }}>{block.content.split('|')[0]}</h4>
                                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>{block.content.split('|')[1]}</p>
                                </div>
                            )}
                            
                            {block.type === 'video' && (
                                <div style={{ width: currentStyles.width, height: currentStyles.height, padding: currentStyles.padding }}>
                                    <iframe title={`Video-${block.id}`} width="100%" height="100%" src={block.content} frameBorder="0" style={{ borderRadius: currentStyles.borderRadius, border: `${currentStyles.borderWidth || '0px'} solid ${currentStyles.borderColor}` }} allowFullScreen></iframe>
                                </div>
                            )}
                            
                            {block.type === 'divider' && (
                                <div style={{ padding: currentStyles.padding, width: currentStyles.width }}>
                                    <hr style={{ border: 'none', borderTop: `${currentStyles.borderWidth || '2px'} solid ${currentStyles.borderColor || '#cbd5e1'}`, opacity: currentStyles.opacity, margin: 0 }} />
                                </div>
                            )}
                            
                            {block.type === 'form' && (
                                <form style={{ ...currentStyles }} className="space-y-3 shadow-inner" onSubmit={(e) => e.preventDefault()}>
                                    <div style={{ color: currentStyles.color }} className="font-bold text-center text-sm">{block.content.split('|')[0]}</div>
                                    <input type="text" placeholder={block.content.split('|')[1]} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500" required />
                                    <input type="email" placeholder={block.content.split('|')[2]} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500" required />
                                    <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 transition text-white font-bold rounded-lg uppercase tracking-wider text-xs">
                                        {block.content.split('|')[3]}
                                    </button>
                                </form>
                            )}
                            
                            {(!['image', 'card', 'video', 'divider', 'form'].includes(block.type)) && (
                                <Tag style={currentStyles}>{block.content}</Tag>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ViewSite;