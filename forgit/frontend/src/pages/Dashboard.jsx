import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { Plus, Layout, LogOut, X, Sparkles, FilePlus, Briefcase, ShoppingCart, Menu } from 'lucide-react';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('empty');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // БАЗА ГОТОВЫХ АДАПТИВНЫХ ШАБЛОНОВ
    const templates = {
        empty: [],
        landing: [
            {
                id: "land-h1",
                type: "heading",
                tag: "h1",
                content: "GreenBuild — Создавай Будущее",
                link: "",
                responsive: {
                    desktop: { x: 125, y: 60, styles: { color: "#064e3b", backgroundColor: "transparent", fontSize: "42px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "center", padding: "12px", width: "600px" } },
                    tablet: { x: 50, y: 50, styles: { color: "#064e3b", backgroundColor: "transparent", fontSize: "32px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "center", padding: "12px", width: "500px" } },
                    mobile: { x: 10, y: 40, styles: { color: "#064e3b", backgroundColor: "transparent", fontSize: "24px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "center", padding: "8px", width: "100%" } }
                }
            },
            {
                id: "land-div",
                type: "divider",
                tag: "hr",
                content: "",
                link: "",
                responsive: {
                    desktop: { x: 275, y: 150, styles: { padding: "0px", width: "300px", borderWidth: "4px", borderColor: "#10b981", opacity: "1" } },
                    tablet: { x: 200, y: 130, styles: { padding: "0px", width: "200px", borderWidth: "4px", borderColor: "#10b981", opacity: "1" } },
                    mobile: { x: 80, y: 120, styles: { padding: "0px", width: "200px", borderWidth: "3px", borderColor: "#10b981", opacity: "1" } }
                }
            },
            {
                id: "land-p1",
                type: "paragraph",
                tag: "p",
                content: "Конструируйте адаптивные сайты без единой строчки кода. Быстро, стильно и полностью под вашим контролем.",
                link: "",
                responsive: {
                    desktop: { x: 175, y: 180, styles: { color: "#475569", backgroundColor: "transparent", fontSize: "16px", fontFamily: "sans-serif", fontWeight: "400", textAlign: "center", padding: "8px", width: "500px" } },
                    tablet: { x: 75, y: 170, styles: { color: "#475569", backgroundColor: "transparent", fontSize: "15px", fontFamily: "sans-serif", fontWeight: "400", textAlign: "center", padding: "8px", width: "450px" } },
                    mobile: { x: 15, y: 150, styles: { color: "#475569", backgroundColor: "transparent", fontSize: "14px", fontFamily: "sans-serif", fontWeight: "400", textAlign: "center", padding: "4px", width: "100%" } }
                }
            },
            {
                id: "land-video",
                type: "video",
                tag: "div",
                content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                link: "",
                responsive: {
                    desktop: { x: 175, y: 270, styles: { width: "500px", height: "280px", padding: "0px", borderRadius: "16px", borderWidth: "0px", borderColor: "#000", opacity: "1" } },
                    tablet: { x: 50, y: 260, styles: { width: "500px", height: "280px", padding: "0px", borderRadius: "16px", borderWidth: "0px", borderColor: "#000", opacity: "1" } },
                    mobile: { x: 10, y: 240, styles: { width: "100%", height: "190px", padding: "0px", borderRadius: "12px", borderWidth: "0px", borderColor: "#000", opacity: "1" } }
                }
            },
            {
                id: "land-btn",
                type: "button",
                tag: "p",
                content: "Попробовать бесплатно",
                link: "#start",
                responsive: {
                    desktop: { x: 300, y: 580, styles: { color: "#ffffff", backgroundColor: "#10b981", fontSize: "15px", fontFamily: "sans-serif", fontWeight: "700", textAlign: "center", padding: "14px 28px", borderRadius: "30px", width: "250px" } },
                    tablet: { x: 175, y: 570, styles: { color: "#ffffff", backgroundColor: "#10b981", fontSize: "14px", fontFamily: "sans-serif", fontWeight: "700", textAlign: "center", padding: "12px 24px", borderRadius: "30px", width: "250px" } },
                    mobile: { x: 55, y: 460, styles: { color: "#ffffff", backgroundColor: "#10b981", fontSize: "14px", fontFamily: "sans-serif", fontWeight: "700", textAlign: "center", padding: "12px 20px", borderRadius: "30px", width: "250px" } }
                }
            }
        ],
        portfolio: [
            {
                id: "port-img",
                type: "image",
                tag: "img",
                content: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
                link: "",
                responsive: {
                    desktop: { x: 350, y: 50, styles: { width: "150px", height: "150px", borderRadius: "100px", objectFit: "cover", padding: "0px", opacity: "1", borderWidth: "4px", borderColor: "#10b981" } },
                    tablet: { x: 225, y: 40, styles: { width: "150px", height: "150px", borderRadius: "100px", objectFit: "cover", padding: "0px", opacity: "1", borderWidth: "4px", borderColor: "#10b981" } },
                    mobile: { x: 110, y: 30, styles: { width: "140px", height: "140px", borderRadius: "100px", objectFit: "cover", padding: "0px", opacity: "1", borderWidth: "3px", borderColor: "#10b981" } }
                }
            },
            {
                id: "port-h1",
                type: "heading",
                tag: "h1",
                content: "Привет, я Анна — UI/UX дизайнер",
                link: "",
                responsive: {
                    desktop: { x: 150, y: 220, styles: { color: "#0f172a", backgroundColor: "transparent", fontSize: "32px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "center", padding: "6px", width: "550px" } },
                    tablet: { x: 50, y: 210, styles: { color: "#0f172a", backgroundColor: "transparent", fontSize: "28px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "center", padding: "6px", width: "500px" } },
                    mobile: { x: 10, y: 190, styles: { color: "#0f172a", backgroundColor: "transparent", fontSize: "22px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "center", padding: "4px", width: "100%" } }
                }
            },
            {
                id: "port-card1",
                type: "card",
                tag: "div",
                content: "Мобильное приложение|Разработка интерфейса для крупного финтех-стартапа с 1 млн+ пользователей.",
                link: "",
                responsive: {
                    desktop: { x: 100, y: 300, styles: { width: "300px", padding: "20px", borderRadius: "16px", borderWidth: "1px", borderColor: "#e2e8f0", backgroundColor: "#ffffff", color: "#1e293b" } },
                    tablet: { x: 20, y: 290, styles: { width: "260px", padding: "16px", borderRadius: "16px", borderWidth: "1px", borderColor: "#e2e8f0", backgroundColor: "#ffffff", color: "#1e293b" } },
                    mobile: { x: 15, y: 270, styles: { width: "100%", padding: "16px", borderRadius: "12px", borderWidth: "1px", borderColor: "#e2e8f0", backgroundColor: "#ffffff", color: "#1e293b" } }
                }
            },
            {
                id: "port-card2",
                type: "card",
                tag: "div",
                content: "Редизайн Веб-платформы|Оптимизация конверсии посадочной страницы на 45% за счет UX-исследований.",
                link: "",
                responsive: {
                    desktop: { x: 450, y: 300, styles: { width: "300px", padding: "20px", borderRadius: "16px", borderWidth: "1px", borderColor: "#e2e8f0", backgroundColor: "#ffffff", color: "#1e293b" } },
                    tablet: { x: 320, y: 290, styles: { width: "260px", padding: "16px", borderRadius: "16px", borderWidth: "1px", borderColor: "#e2e8f0", backgroundColor: "#ffffff", color: "#1e293b" } },
                    mobile: { x: 15, y: 440, styles: { width: "100%", padding: "16px", borderRadius: "12px", borderWidth: "1px", borderColor: "#e2e8f0", backgroundColor: "#ffffff", color: "#1e293b" } }
                }
            },
            {
                id: "port-form",
                type: "form",
                tag: "form",
                content: "Обсудить проект|Ваше имя|Email партнера|Отправить ТЗ",
                link: "",
                responsive: {
                    desktop: { x: 225, y: 520, styles: { width: "400px", padding: "24px", borderRadius: "20px", borderWidth: "1px", borderColor: "#e2e8f0", backgroundColor: "#f8fafc", opacity: "1" } },
                    tablet: { x: 100, y: 510, styles: { width: "400px", padding: "24px", borderRadius: "20px", borderWidth: "1px", borderColor: "#e2e8f0", backgroundColor: "#f8fafc", opacity: "1" } },
                    mobile: { x: 15, y: 620, styles: { width: "100%", padding: "16px", borderRadius: "16px", borderWidth: "1px", borderColor: "#e2e8f0", backgroundColor: "#f8fafc", opacity: "1" } }
                }
            }
        ],
        showcase: [
            {
                id: "show-img",
                type: "image",
                tag: "img",
                content: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                link: "",
                responsive: {
                    desktop: { x: 80, y: 80, styles: { width: "320px", height: "300px", borderRadius: "24px", objectFit: "cover", padding: "0px", opacity: "1", borderWidth: "0px", borderColor: "#000" } },
                    tablet: { x: 140, y: 60, styles: { width: "320px", height: "260px", borderRadius: "24px", objectFit: "cover", padding: "0px", opacity: "1", borderWidth: "0px", borderColor: "#000" } },
                    mobile: { x: 15, y: 40, styles: { width: "100%", height: "220px", borderRadius: "16px", objectFit: "cover", padding: "0px", opacity: "1", borderWidth: "0px", borderColor: "#000" } }
                }
            },
            {
                id: "show-h1",
                type: "heading",
                tag: "h1",
                content: "Спортивные Кроссовки RunX-Pro",
                link: "",
                responsive: {
                    desktop: { x: 440, y: 80, styles: { color: "#0f172a", backgroundColor: "transparent", fontSize: "28px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "left", padding: "0px", width: "350px" } },
                    tablet: { x: 140, y: 350, styles: { color: "#0f172a", backgroundColor: "transparent", fontSize: "24px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "center", padding: "0px", width: "320px" } },
                    mobile: { x: 15, y: 280, styles: { color: "#0f172a", backgroundColor: "transparent", fontSize: "20px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "left", padding: "0px", width: "100%" } }
                }
            },
            {
                id: "show-price",
                type: "paragraph",
                tag: "p",
                content: "9 990 ₽",
                link: "",
                responsive: {
                    desktop: { x: 440, y: 160, styles: { color: "#10b981", backgroundColor: "transparent", fontSize: "24px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "left", padding: "0px", width: "150px" } },
                    tablet: { x: 140, y: 400, styles: { color: "#10b981", backgroundColor: "transparent", fontSize: "22px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "center", padding: "0px", width: "320px" } },
                    mobile: { x: 15, y: 320, styles: { color: "#10b981", backgroundColor: "transparent", fontSize: "18px", fontFamily: "sans-serif", fontWeight: "800", textAlign: "left", padding: "0px", width: "100%" } }
                }
            },
            {
                id: "show-p",
                type: "paragraph",
                tag: "p",
                content: "Ультимативный комфорт для бега на длинные дистанции. Дышащая сетка, подошва с амортизацией и футуристичный дизайн.",
                link: "",
                responsive: {
                    desktop: { x: 440, y: 210, styles: { color: "#475569", backgroundColor: "transparent", fontSize: "14px", fontFamily: "sans-serif", fontWeight: "400", textAlign: "left", padding: "0px", width: "350px", lineHeight: "1.5" } },
                    tablet: { x: 140, y: 440, styles: { color: "#475569", backgroundColor: "transparent", fontSize: "14px", fontFamily: "sans-serif", fontWeight: "400", textAlign: "center", padding: "0px", width: "320px", lineHeight: "1.5" } },
                    mobile: { x: 15, y: 360, styles: { color: "#475569", backgroundColor: "transparent", fontSize: "13px", fontFamily: "sans-serif", fontWeight: "400", textAlign: "left", padding: "0px", width: "100%", lineHeight: "1.5" } }
                }
            },
            {
                id: "show-btn",
                type: "button",
                tag: "p",
                content: "Купить в один клик",
                link: "#buy",
                responsive: {
                    desktop: { x: 440, y: 320, styles: { color: "#ffffff", backgroundColor: "#0f172a", fontSize: "14px", fontFamily: "sans-serif", fontWeight: "700", textAlign: "center", padding: "12px 24px", borderRadius: "12px", width: "200px" } },
                    tablet: { x: 200, y: 530, styles: { color: "#ffffff", backgroundColor: "#0f172a", fontSize: "14px", fontFamily: "sans-serif", fontWeight: "700", textAlign: "center", padding: "12px 24px", borderRadius: "12px", width: "200px" } },
                    mobile: { x: 15, y: 450, styles: { color: "#ffffff", backgroundColor: "#0f172a", fontSize: "13px", fontFamily: "sans-serif", fontWeight: "700", textAlign: "center", padding: "12px 20px", borderRadius: "12px", width: "100%" } }
                }
            }
        ]
    };

    // ФУНКЦИЯ ЗАГРУЗКИ И СОЗДАНИЯ ПРОЕКТОВ
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await API.get('/projects');
                setProjects(data);
            } catch (err) {
                console.error("Ошибка при получении списка проектов:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!projectName.trim()) return;

        try {
            const initialBlocks = templates[selectedTemplate] || [];
            
            const { data } = await API.post('/projects', {
                name: projectName,
                blocks: initialBlocks
            });

            setIsModalOpen(false);
            setProjectName('');
            setSelectedTemplate('empty');
            
            navigate(`/editor/${data.id}`);
        } catch (err) {
            console.error("Ошибка при создании проекта:", err);
        }
    };

    const handleDeleteProject = async (id, e) => {
        e.stopPropagation(); 
        if (!window.confirm("Вы уверены, что хотите удалить этот проект?")) return;

        try {
            await API.delete(`/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) {
            console.error("Ошибка при удалении проекта:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const renderLandingThumbnail = () => (
        <div className="w-full h-full flex flex-col gap-1 items-center justify-center p-4 bg-white opacity-80 select-none">
            <div className="w-20 h-2.5 bg-emerald-800/20 rounded-sm"></div>
            <div className="w-28 h-1.5 bg-emerald-500/30 rounded-sm mt-0.5"></div>
            <div className="w-16 h-4 bg-emerald-600 rounded-lg mt-2 shadow-sm flex items-center justify-center">
                <div className="w-6 h-1 bg-white/50 rounded-full"></div>
            </div>
        </div>
    );

    const renderPortfolioThumbnail = () => (
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center p-4 bg-white opacity-80 select-none">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 bg-slate-50 flex items-center justify-center text-emerald-600/40 text-xs font-black">P</div>
            <div className="w-24 h-2 bg-slate-900/10 rounded-sm"></div>
            <div className="flex gap-1.5 mt-1">
                <div className="w-10 h-6 bg-slate-50 border border-slate-100 rounded-md"></div>
                <div className="w-10 h-6 bg-slate-50 border border-slate-100 rounded-md"></div>
            </div>
        </div>
    );

    const renderShowcaseThumbnail = () => (
        <div className="w-full h-full flex gap-3 items-center justify-center p-4 bg-white opacity-80 select-none">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100/50 rounded-xl flex items-center justify-center text-emerald-500/40"><ShoppingCart size={18} /></div>
            <div className="space-y-1.5">
                <div className="w-16 h-2.5 bg-slate-900/10 rounded-sm"></div>
                <div className="w-10 h-2 bg-emerald-500/20 rounded-sm"></div>
                <div className="w-12 h-3.5 bg-slate-900 rounded-md"></div>
            </div>
        </div>
    );

    const renderEmptyThumbnail = () => (
        <div className="w-full h-full flex items-center justify-center bg-white opacity-70">
            <Layout size={36} className="text-emerald-500/20" />
        </div>
    );

    const getThumbnail = (project) => {
        if (!project.blocks || project.blocks.length === 0) {
            return renderEmptyThumbnail();
        }
        const firstBlockId = project.blocks[0].id;
        if (firstBlockId && firstBlockId.startsWith('land-')) return renderLandingThumbnail();
        if (firstBlockId && firstBlockId.startsWith('port-')) return renderPortfolioThumbnail();
        if (firstBlockId && firstBlockId.startsWith('show-')) return renderShowcaseThumbnail();
        
        return renderEmptyThumbnail();
    };

    return (
        <div className="min-h-screen bg-[#f4fbf8] font-sans flex flex-col overflow-x-hidden">
            
            {/* ХЕДЕР КАК НА ГЛАВНОЙ СТРАНИЦЕ */}
            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                            <span className="text-white font-black text-xl italic">GB</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter text-emerald-950">GREENBUILD</span>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8">
                        <button onClick={() => navigate('/about')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            О проекте
                        </button>
                        <button onClick={() => navigate('/templates')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            Шаблоны
                        </button>
                        <button onClick={() => navigate('/pricing')} className="text-[11px] font-black uppercase tracking-widest text-emerald-600 transition-colors">
                            Подписка
                        </button>
                        <button onClick={() => navigate('/contact')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            Связь
                        </button>
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3">
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md shadow-emerald-600/10"
                            >
                                МОИ ПРОЕКТЫ
                            </button>
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                            >
                                <LogOut size={16} /> Выйти
                            </button>
                        </div>
                        
                        <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top">
                        <button onClick={() => { navigate('/about'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            О проекте
                        </button>
                        <button onClick={() => { navigate('/templates'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            Шаблоны
                        </button>
                        <button onClick={() => { navigate('/pricing'); setIsMenuOpen(false); }} className="w-full border-2 border-emerald-200 bg-emerald-50 py-4 rounded-xl font-black uppercase tracking-widest text-emerald-700">
                            Подписка
                        </button>
                        <button onClick={() => { navigate('/contact'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            Связь
                        </button>
                        <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest">
                            Мои проекты
                        </button>
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-rose-600">
                            Выйти
                        </button>
                    </div>
                )}
            </header>

            {/* ОСНОВНОЙ КОНТЕНТ */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8 pt-28">
                
                <div className="flex justify-between items-center pt-4">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black text-emerald-950 tracking-tighter">Ваши сайты</h2>
                        <p className="text-[#52786c] text-sm font-medium">Управляйте своими проектами или создавайте новый</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#047857] hover:bg-[#065f46] text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition shadow-md shadow-emerald-900/10 active:scale-95">
                        <Plus size={16} /> Создать проект
                    </button>
                </div>

                {/* СПИСОК ПРОЕКТОВ */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3].map(n => <div key={n} className="h-64 bg-slate-200/60 rounded-3xl"></div>)}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="bg-white border border-[#e1f2eb] rounded-3xl p-16 text-center space-y-4 max-w-xl mx-auto shadow-sm">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400 text-3xl">📁</div>
                        <h3 className="font-bold text-slate-700 text-lg">У вас пока нет сайтов</h3>
                        <p className="text-slate-400 text-sm px-10 leading-relaxed">Создайте свой первый site с чистого листа или воспользуйтесь готовой структурой.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {projects.map(project => (
                            <div key={project.id} onClick={() => navigate(`/editor/${project.id}`)} className="group bg-white border border-slate-100 rounded-[28px] cursor-pointer transition-all shadow-sm hover:shadow-xl hover:-translate-y-0.5 flex flex-col overflow-hidden h-64">
                                
                                {/* ПРЕВЬЮ КАРТОЧКИ */}
                                <div className="bg-[#eaf7f2] h-44 border-b border-slate-50 flex items-center justify-center overflow-hidden relative">
                                    {getThumbnail(project)}
                                    <button onClick={(e) => handleDeleteProject(project.id, e)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 p-1.5 transition-all rounded-xl hover:bg-white shadow-sm bg-white/40 backdrop-blur-sm">
                                        <X size={14} />
                                    </button>
                                </div>
                                
                                {/* ИНФОРМАЦИЯ О ПРОЕКТЕ */}
                                <div className="flex-1 p-5 px-6 flex flex-col justify-between bg-white">
                                    <h3 className="font-bold text-emerald-950 text-base group-hover:text-emerald-700 transition-colors truncate">{project.name}</h3>
                                    
                                    <div className="flex justify-between items-center text-[11px] font-medium text-slate-400">
                                        <span>ID: {project.id}</span>
                                        <span>17.05.2026</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ФУТЕР КАК НА ГЛАВНОЙ СТРАНИЦЕ */}
            <footer className="bg-emerald-950 py-12 md:py-20 px-6 text-white text-center md:text-left">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center italic font-black">GB</div>
                            <span className="font-black text-xl">GREENBUILD</span>
                        </div>
                        <p className="text-emerald-400 text-xs uppercase font-black tracking-widest">Build the future</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 md:col-span-2">
                        <div className="space-y-4 text-sm font-bold text-emerald-100/40 uppercase tracking-tighter">
                            <p className="text-emerald-500">Продукт</p>
                            <p onClick={() => navigate('/pricing')} className="hover:text-white cursor-pointer transition-colors">Подписка</p>
                            <p onClick={() => navigate('/templates')} className="hover:text-white cursor-pointer transition-colors">Шаблоны</p>
                            <p className="hover:text-white cursor-pointer transition-colors">Функции</p>
                        </div>
                        <div className="space-y-4 text-sm font-bold text-emerald-100/40 uppercase tracking-tighter">
                            <p className="text-emerald-500">Компания</p>
                            <p onClick={() => navigate('/about')} className="hover:text-white cursor-pointer transition-colors">О нас</p>
                            <p onClick={() => navigate('/contact')} className="hover:text-white cursor-pointer transition-colors">Контакты</p>
                            <p className="hover:text-white cursor-pointer transition-colors">Помощь</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ПРОЕКТА */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-emerald-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn z-[999]">
                    <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full p-8 my-10 relative flex flex-col max-h-[calc(100vh-5rem)] overflow-hidden border border-slate-100">
                        <button onClick={() => { setIsModalOpen(false); setProjectName(''); setSelectedTemplate('empty'); }} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition z-10">
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <Sparkles size={20} className="text-amber-500 fill-amber-500" /> Создание нового сайта
                            </h2>
                            <p className="text-slate-400 text-xs mt-0.5">Выберите базовый шаблон. Все элементы уже настроены под разные типы экранов.</p>
                        </div>

                        <form onSubmit={handleCreateProject} className="space-y-6 overflow-y-auto flex-1 pr-1">
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Название вашего проекта</label>
                                <input type="text" required placeholder="Например: Моя Кофейня, Портфолио Дизайнера..." className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium focus:border-emerald-500 outline-none transition"
                                    value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Выберите стартовый макет</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    
                                    <div onClick={() => setSelectedTemplate('empty')} className={`p-5 border-2 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-36 ${selectedTemplate === 'empty' ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className={`p-2.5 rounded-xl ${selectedTemplate === 'empty' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                                <FilePlus size={18} />
                                            </div>
                                            <input type="radio" readOnly checked={selectedTemplate === 'empty'} className="accent-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-emerald-950">Чистый холст</h3>
                                            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-1">Полная свобода действий. Начните проектирование абсолютно с нуля.</p>
                                        </div>
                                    </div>

                                    <div onClick={() => setSelectedTemplate('landing')} className={`p-5 border-2 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-36 ${selectedTemplate === 'landing' ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className={`p-2.5 rounded-xl ${selectedTemplate === 'landing' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                                <Layout size={18} />
                                            </div>
                                            <input type="radio" readOnly checked={selectedTemplate === 'landing'} className="accent-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-emerald-950">Бизнес-Лендинг</h3>
                                            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-1">Заголовок, фирменный разделитель, промо-видео и конверсионная кнопка.</p>
                                        </div>
                                    </div>

                                    <div onClick={() => setSelectedTemplate('portfolio')} className={`p-5 border-2 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-36 ${selectedTemplate === 'portfolio' ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className={`p-2.5 rounded-xl ${selectedTemplate === 'portfolio' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                                <Briefcase size={18} />
                                            </div>
                                            <input type="radio" readOnly checked={selectedTemplate === 'portfolio'} className="accent-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-emerald-950">Портфолио специалиста</h3>
                                            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-1">Аватар автора, карточки выполненных работ и готовая форма обратной связи.</p>
                                        </div>
                                    </div>

                                    <div onClick={() => setSelectedTemplate('showcase')} className={`p-5 border-2 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-36 ${selectedTemplate === 'showcase' ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className={`p-2.5 rounded-xl ${selectedTemplate === 'showcase' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                                <ShoppingCart size={18} />
                                            </div>
                                            <input type="radio" readOnly checked={selectedTemplate === 'showcase'} className="accent-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-emerald-950">Витрина / Товар</h3>
                                            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-1">Презентация продукта: изображение, описание, ценник и кнопка покупки.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button type="button" onClick={() => { setIsModalOpen(false); setProjectName(''); setSelectedTemplate('empty'); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition">
                                    Отмена
                                </button>
                                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 text-xs uppercase tracking-wider transition">
                                    Создать и открыть
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;