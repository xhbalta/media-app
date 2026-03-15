// main.js - Router principal con soporte completo para búsqueda e integración con sidebar y reproductor
import { DATA, renderFeed, renderGrid, renderEpisodio, renderSerie, renderCategoryPills } from './show.js';
import { getEpisodioByDetailUrl, getSerieByUrl, getAllEpisodios } from './episodios.js';
import './player.js';

// Páginas especiales
const PAGES = [
    { path: '/biblioteca', module: () => import('./biblioteca.js'), header: true },
    { path: '/explorar', module: () => import('./explorar.js'), header: true },
    { path: '/buscar', module: () => import('./buscar.js'), header: true }
];

let lastScrollTop = 0;

// Función para actualizar las categorías según la ruta actual
function updateActiveCategory() {
    const path = window.location.pathname;
    let activeCat = 'Todos';
    
    if (path.startsWith('/categoria/')) {
        activeCat = decodeURIComponent(path.replace('/categoria/', ''));
    }
    
    renderCategoryPills(activeCat);
}

async function router() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const container = document.getElementById('content');
    const header = document.getElementById('main-header');
    const categoryFilters = document.getElementById('category-filters');

    // Mostrar header y filtros por defecto
    if (header) header.classList.remove('hidden');
    if (categoryFilters) categoryFilters.classList.remove('hidden');

    try {
        // 1. Ruta raíz
        if (path === '/') {
            renderFeed(container);
            document.title = 'Balta Media · Conocimiento en acción';
        }
        // 2. Páginas especiales
        else {
            const page = PAGES.find(p => p.path === path);
            if (page) {
                const module = await page.module();
                
                // Si es la página de búsqueda y tiene query, pasarlo
                if (page.path === '/buscar' && searchParams.has('q')) {
                    const query = searchParams.get('q');
                    if (module.renderSearch) {
                        module.renderSearch(container, query);
                    } else {
                        module.render(container);
                    }
                } else {
                    module.render(container);
                }
                
                document.title = `${path.slice(1).charAt(0).toUpperCase() + path.slice(2)} · Balta Media`;
                
                if (module.header === false) {
                    header.classList.add('hidden');
                    categoryFilters.classList.add('hidden');
                }
            }
            // 3. Categoría
            else if (path.startsWith('/categoria/')) {
                const cat = decodeURIComponent(path.replace('/categoria/', ''));
                const buscarModule = await import('./buscar.js');
                if (buscarModule.renderCategory) {
                    buscarModule.renderCategory(container, cat);
                } else {
                    // Fallback: buscar episodios de esa categoría
                    const categoryEpisodes = DATA.filter(ep => 
                        ep.categories && ep.categories.includes(cat)
                    );
                    renderGrid(container, categoryEpisodes, cat);
                }
                document.title = `${cat} · Balta Media`;
            }
            // 4. Serie (por url)
            else {
                const serie = getSerieByUrl(path);
                if (serie) {
                    renderSerie(container, path);
                    document.title = `${serie.titulo_serie} · Balta Media`;
                }
                // 5. Episodio (por detailUrl)
                else {
                    const episodio = getEpisodioByDetailUrl(path);
                    if (episodio) {
                        renderEpisodio(container, episodio.id);
                        document.title = `${episodio.title} · Balta Media`;
                    }
                    // 6. Novedades
                    else if (path === '/novedades') {
                        const sorted = [...DATA].sort((a, b) => new Date(b.date) - new Date(a.date));
                        const recientes = sorted.slice(0, 20);
                        const aleatorios = [...DATA].sort(() => 0.5 - Math.random()).slice(0, 10);
                        const combined = [...new Set([...recientes, ...aleatorios])];
                        renderGrid(container, combined, 'Novedades y Recomendaciones');
                        document.title = 'Novedades · Balta Media';
                    }
                    // 7. No encontrado
                    else {
                        const module404 = await import('./404.js');
                        module404.render(container);
                        document.title = 'Página no encontrada · Balta Media';
                        if (module404.header === false) {
                            header.classList.add('hidden');
                            categoryFilters.classList.add('hidden');
                        }
                    }
                }
            }
        }

        // Actualizar categorías activas en el header
        updateActiveCategory();

        // Disparar evento para que la sidebar actualice el item activo
        document.dispatchEvent(new Event('spa-navigation'));

        // Actualizar sidebar
        if (window.sidebarAPI) {
            if (path === '/' || path === '/novedades') {
                window.sidebarAPI.refresh();
            }
            window.sidebarAPI.setActive();
        }

        // 🟢 NUEVO: Asegurar que el reproductor esté visible
        if (window.updatePlayerVisibility) {
            // Pequeño retraso para asegurar que el DOM se actualizó
            setTimeout(() => {
                window.updatePlayerVisibility();
            }, 50);
        }

    } catch (error) {
        console.error('Error en router:', error);
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <span class="text-6xl mb-4">😵</span>
                <h2 class="text-2xl font-bold text-white mb-2">Algo salió mal</h2>
                <p class="text-gray-400 mb-6">${error.message || 'Error al cargar la página'}</p>
                <button onclick="window.location.href='/'" 
                        class="bg-[#7b2eda] hover:bg-[#8f3ef0] text-white font-bold px-6 py-3 rounded-full transition">
                    Volver al inicio
                </button>
            </div>
        `;
    }
}

// Evento de navegación con History API
document.addEventListener('click', e => {
    const link = e.target.closest('a[data-link]');
    if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        // Navegación SPA
        window.history.pushState(null, null, href);
        router();
        
        // Scroll suave al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Botones de cerrar búsqueda
document.addEventListener('click', e => {
    if (e.target.closest('#closeGridBtn')) {
        e.preventDefault();
        window.history.pushState(null, null, '/');
        router();
    }
});

// Manejar navegación con botones atrás/adelante
window.addEventListener('popstate', router);

// Scroll header
window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const topHeader = document.getElementById('main-header');
    const categoryFilters = document.getElementById('category-filters');
    if (!topHeader || !categoryFilters) return;

    if (st > lastScrollTop && st > 100) {
        topHeader.style.opacity = '0';
        topHeader.style.pointerEvents = 'none';
    } else {
        topHeader.style.opacity = '1';
        topHeader.style.pointerEvents = 'auto';
    }
    lastScrollTop = st <= 0 ? 0 : st;
});

// Override pushState para eventos adicionales
const originalPushState = history.pushState;
history.pushState = function() {
    originalPushState.apply(this, arguments);
    setTimeout(() => {
        document.dispatchEvent(new Event('spa-navigation'));
    }, 100);
};

// Observer para cambios en el DOM
const observer = new MutationObserver((mutations) => {
    const contentChanged = mutations.some(m => 
        m.target.id === 'content' || 
        (m.target.id === 'grid-view' || m.target.id === 'feed-view')
    );
    
    if (contentChanged) {
        if (window.sidebarAPI) window.sidebarAPI.setActive();
        // 🟢 NUEVO: Actualizar reproductor si cambia el contenido
        if (window.updatePlayerVisibility) {
            window.updatePlayerVisibility();
        }
    }
});

const content = document.getElementById('content');
if (content) {
    observer.observe(content, { 
        childList: true, 
        subtree: true,
        attributes: false 
    });
}

// Inicializar
router();

console.log('✅ Main.js cargado correctamente con soporte para sidebar y reproductor persistente');
