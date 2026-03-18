// main.js - Router principal (versión definitiva móvil + desktop)

import { DATA, renderFeed, renderGrid, renderEpisodio, renderSerie, renderCategoryPills } from './show.js';
import { getEpisodioByDetailUrl, getSerieByUrl } from 'https://podcast.tenam.site/episodios.js';
import './player.js';

const PAGES = [
    { path: '/biblioteca', module: () => import('./biblioteca.js'), header: true },
    { path: '/explorar', module: () => import('./explorar.js'), header: true },
    { path: '/buscar', module: () => import('./buscar.js'), header: true }
];

// Función para normalizar la ruta
function normalizePath(path) {
    let normalized = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
    try {
        normalized = decodeURIComponent(normalized);
    } catch (e) {}
    return normalized;
}

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
    const normalizedPath = normalizePath(path);
    const searchParams = new URLSearchParams(window.location.search);
    const container = document.getElementById('content');
    const headerContainer = document.getElementById('headerContainer');
    const mainHeader = document.getElementById('main-header');
    const categoryFilters = document.getElementById('category-filters');

    try {
        // Resetear visibilidad
        if (headerContainer) headerContainer.classList.remove('hidden');
        if (categoryFilters) categoryFilters.classList.remove('hidden');
        if (categoryFilters) categoryFilters.classList.remove('moved-up');

        // 1. Ruta raíz
        if (normalizedPath === '/') {
            renderFeed(container);
            document.title = 'Balta Media · Conocimiento en acción';
        }
        else {
            // 2. Páginas especiales
            const page = PAGES.find(p => p.path === normalizedPath);
            if (page) {
                const module = await page.module();
                if (page.path === '/buscar' && searchParams.has('q')) {
                    const query = searchParams.get('q');
                    if (module.renderSearch) module.renderSearch(container, query);
                    else module.render(container);
                } else {
                    module.render(container);
                }
                document.title = `${normalizedPath.slice(1).charAt(0).toUpperCase() + normalizedPath.slice(2)} · Balta Media`;
            }
            // 3. Categoría
            else if (normalizedPath.startsWith('/categoria/')) {
                const cat = decodeURIComponent(normalizedPath.replace('/categoria/', ''));
                const buscarModule = await import('./buscar.js');
                if (buscarModule.renderCategory) {
                    buscarModule.renderCategory(container, cat);
                } else {
                    const categoryEpisodes = DATA.filter(ep => ep.categories && ep.categories.includes(cat));
                    renderGrid(container, categoryEpisodes, cat);
                }
                document.title = `${cat} · Balta Media`;
            }
            // 4. Serie / Episodio / Novedades / 404
            else {
                const serie = getSerieByUrl(normalizedPath);
                if (serie) {
                    renderSerie(container, normalizedPath);
                    document.title = `${serie.titulo_serie} · Balta Media`;
                } else {
                    const episodio = getEpisodioByDetailUrl(normalizedPath);
                    if (episodio) {
                        renderEpisodio(container, episodio.id);
                        document.title = `${episodio.title} · Balta Media`;
                    } else if (normalizedPath === '/novedades') {
                        const sorted = [...DATA].sort((a, b) => new Date(b.date) - new Date(a.date));
                        const recientes = sorted.slice(0, 20);
                        const aleatorios = [...DATA].sort(() => 0.5 - Math.random()).slice(0, 10);
                        const combined = [...new Set([...recientes, ...aleatorios])];
                        renderGrid(container, combined, 'Novedades y Recomendaciones');
                        document.title = 'Novedades · Balta Media';
                    } else {
                        const module404 = await import('./404.js');
                        module404.render(container);
                        document.title = 'Página no encontrada · Balta Media';
                        if (module404.header === false) {
                            if (headerContainer) headerContainer.classList.add('hidden');
                        }
                    }
                }
            }
        }

        updateActiveCategory();
        document.dispatchEvent(new Event('spa-navigation'));

        if (window.sidebarAPI) {
            if (normalizedPath === '/' || normalizedPath === '/novedades') window.sidebarAPI.refresh();
            window.sidebarAPI.setActive();
        }

        if (window.updatePlayerVisibility) {
            setTimeout(() => window.updatePlayerVisibility(), 50);
        }

    } catch (error) {
        console.error('Error en router:', error);
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <span class="text-6xl mb-4">😵</span>
                <h2 class="text-2xl font-bold text-white mb-2">Algo salió mal</h2>
                <p class="text-gray-300 mb-6">${error.message || 'Error al cargar la página'}</p>
                <button onclick="window.history.pushState(null,null,'/'); router();" 
                        class="bg-[#7b2eda] hover:bg-[#8f3ef0] text-white font-bold px-6 py-3 rounded-full transition">
                    Volver al inicio
                </button>
            </div>
        `;
    }
}

// ==================== NAVEGACIÓN SPA ====================
document.addEventListener('click', e => {
    const link = e.target.closest('a[data-link]');
    if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http')) {
            window.history.pushState(null, null, href);
            router();
            const content = document.getElementById('content');
            if (content) content.scrollTop = 0;
        } else if (href) {
            window.open(href, '_blank');
        }
    }
});

// Cerrar búsqueda
document.addEventListener('click', e => {
    if (e.target.closest('#closeGridBtn')) {
        e.preventDefault();
        window.history.pushState(null, null, '/');
        router();
    }
});

window.addEventListener('popstate', router);

// ==================== SCROLL HEADER MÓVIL ====================
// Solo ocultamos el header principal, los filtros suben automáticamente
let lastScrollTop = 0;
const headerContainer = document.getElementById('headerContainer');
const mainHeader = document.getElementById('main-header');
const categoryFilters = document.getElementById('category-filters');

function handleScroll() {
    const content = document.getElementById('content');
    if (!content || !headerContainer) return;

    const st = content.scrollTop;

    if (Math.abs(st - lastScrollTop) < 15) return;

    if (st > lastScrollTop && st > 80) {
        // Scroll hacia abajo → ocultar header
        headerContainer.classList.add('hidden');
        if (categoryFilters) categoryFilters.classList.add('moved-up');
    } else {
        // Scroll hacia arriba → mostrar header
        headerContainer.classList.remove('hidden');
        if (categoryFilters) categoryFilters.classList.remove('moved-up');
    }

    lastScrollTop = st;
}

const contentEl = document.getElementById('content');
if (contentEl) {
    contentEl.addEventListener('scroll', handleScroll, { passive: true });
}

// Observer para cambios en el contenido
const observer = new MutationObserver(() => {
    if (window.sidebarAPI) window.sidebarAPI.setActive();
    if (window.updatePlayerVisibility) window.updatePlayerVisibility();
});

const contentObserver = document.getElementById('content');
if (contentObserver) {
    observer.observe(contentObserver, { childList: true, subtree: true });
}

// Exponer router para sidebar y otros scripts
window.router = router;

// Inicializar
router();
console.log('✅ Main.js cargado correctamente - Scroll header optimizado para móvil');
