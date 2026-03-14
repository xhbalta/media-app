// main.js - Router principal con soporte completo para búsqueda
import { DATA, renderFeed, renderGrid, renderEpisodio, renderSerie } from './show.js';
import { getEpisodioByDetailUrl, getSerieByUrl, getAllEpisodios } from './episodios.js';
import './player.js';

// Páginas especiales
const PAGES = [
    { path: '/biblioteca', module: () => import('./biblioteca.js'), header: true },
    { path: '/explorar', module: () => import('./explorar.js'), header: true },
    { path: '/buscar', module: () => import('./buscar.js'), header: true }
];

let lastScrollTop = 0;

async function router() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const container = document.getElementById('content');
    const header = document.getElementById('main-header');
    const categoryFilters = document.getElementById('category-filters');

    // Mostrar header y filtros por defecto
    if (header) header.classList.remove('hidden');
    if (categoryFilters) categoryFilters.classList.remove('hidden');

    // 1. Ruta raíz
    if (path === '/') {
        renderFeed(container);
        document.title = 'Balta Media · Conocimiento en acción';
        return;
    }

    // 2. Páginas especiales
    const page = PAGES.find(p => p.path === path);
    if (page) {
        const module = await page.module();
        
        // Si es la página de búsqueda y tiene query, pasarlo
        if (page.path === '/buscar' && searchParams.has('q')) {
            const query = searchParams.get('q');
            module.renderSearch(container, query);
        } else {
            module.render(container);
        }
        
        document.title = `${path.slice(1).charAt(0).toUpperCase() + path.slice(2)} · Balta Media`;
        
        if (module.header === false) {
            header.classList.add('hidden');
            categoryFilters.classList.add('hidden');
        }
        return;
    }

    // 3. Categoría
    if (path.startsWith('/categoria/')) {
        const cat = decodeURIComponent(path.replace('/categoria/', ''));
        const buscarModule = await import('./buscar.js');
        buscarModule.renderCategory(container, cat);
        document.title = `${cat} · Balta Media`;
        return;
    }

    // 4. Serie (por url)
    const serie = getSerieByUrl(path);
    if (serie) {
        renderSerie(container, path);
        document.title = `${serie.titulo_serie} · Balta Media`;
        return;
    }

    // 5. Episodio (por detailUrl)
    const episodio = getEpisodioByDetailUrl(path);
    if (episodio) {
        renderEpisodio(container, episodio.id);
        document.title = `${episodio.title} · Balta Media`;
        return;
    }

    // 6. Novedades
    if (path === '/novedades') {
        const sorted = [...DATA].sort((a, b) => new Date(b.date) - new Date(a.date));
        const recientes = sorted.slice(0, 20);
        const aleatorios = [...DATA].sort(() => 0.5 - Math.random()).slice(0, 10);
        const combined = [...new Set([...recientes, ...aleatorios])];
        renderGrid(container, combined, 'Novedades y Recomendaciones');
        document.title = 'Novedades · Balta Media';
        return;
    }

    // 7. No encontrado
    const module404 = await import('./404.js');
    module404.render(container);
    document.title = 'Página no encontrada · Balta Media';
    if (module404.header === false) {
        header.classList.add('hidden');
        categoryFilters.classList.add('hidden');
    }
}

// Evento de navegación con History API
document.addEventListener('click', e => {
    const link = e.target.closest('a[data-link]');
    if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.history.pushState(null, null, href);
        router();
    }
});

// Botones de cerrar búsqueda (si existen)
document.addEventListener('click', e => {
    if (e.target.closest('#closeGridBtn')) {
        e.preventDefault();
        window.history.pushState(null, null, '/');
        router();
    }
});

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
        // La barra de categorías se queda fija (sticky), no la ocultamos
    } else {
        topHeader.style.opacity = '1';
        topHeader.style.pointerEvents = 'auto';
    }
    lastScrollTop = st <= 0 ? 0 : st;
});

// Iniciar
router();
