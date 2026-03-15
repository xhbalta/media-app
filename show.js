// show.js - Vistas del feed, episodio, serie, etc. - VERSIÓN OPTIMIZADA
import { getAllEpisodios, getSerieById, getEpisodiosBySerieId, getEpisodiosConSerie } from './episodios.js';
import { userStorage } from './storage.js';
import './player.js';

// ---------- CONSTANTES ----------
const ICONS = {
    play: 'https://marca1.odoo.com/web/image/508-f876320c/play.svg',
    pause: 'https://marca1.odoo.com/web/image/508-f876320c/pause.svg',
    add: 'https://marca1.odoo.com/web/image/509-c555b4ef/a%C3%B1adir%20a.svg',
    added: 'https://nikichitonjesus.odoo.com/web/image/1112-d141b3eb/a%C3%B1adido.png',
    dl: 'https://marca1.odoo.com/web/image/510-7a9035c1/descargar.svg',
    noDl: 'https://nikichitonjesus.odoo.com/web/image/1051-622a3db3/no-desc.webp',
    share: 'https://nikichitonjesus.odoo.com/web/image/585-036b7961/cpmartir.png'
};

const CATEGORIES = [
    "Todos", "Derecho", "Física y Astronomía", "Matemáticas", "Historia",
    "Filosofía", "Economía y Finanzas", "Ciencias Sociales", "Arte y Cultura",
    "Literatura y Audiolibros", "Cine y TV", "Documentales", "Ciencias Naturales",
    "Tecnología e Informática", "Otras Ciencias"
];

// ---------- UTILIDADES ----------
function determineCategories(ep) {
    const cats = new Set();
    const text = (ep.title + ' ' + ep.description + ' ' + (ep.series?.titulo_serie || '') + ' ' + (ep.series?.descripcion_serie || '')).toLowerCase();
    const patterns = {
        "Derecho": /\b(derecho|penal|civil|constitucional|procesal|delito|ley|jurisprudencia|código|tribunal|justicia|proceso)\b/i,
        "Física y Astronomía": /\b(física|fisica|mecánica|mecanica|cuántica|cuantica|termodinámica|termodinamica|newton|einstein|astronomía|astronomia|planeta|cosmos)\b/i,
        "Matemáticas": /\b(matemática|matematicas|calculo|cálculo|algebra|álgebra|geometria|geometría|estadistica|estadística|probabilidad|ecuacion|ecuación|teorema|integral)\b/i,
        "Historia": /\b(historia|histórico|historico|siglo|época|epoca|imperio|guerra|revolución|revolucion|antiguo|medieval)\b/i,
        "Filosofía": /\b(filosofía|filosofia|kant|platon|platón|aristoteles|ética|etica|metafísica|metafisica|ontología|ontologia|epistemología|epistemologia)\b/i,
        "Economía y Finanzas": /\b(economía|economia|finanzas|inflación|inflacion|keynes|oferta|demanda|macroeconomía|macroeconomia|pib|mercado)\b/i,
        "Ciencias Sociales": /\b(sociología|sociologia|antropología|antropologia|psicología|psicologia|sociedad|cultura|identidad|género|genero|desigualdad)\b/i,
        "Arte y Cultura": /\b(arte|pintura|escultura|arquitectura|renacimiento|barroco|música|musica|cultura|artístico|artistico)\b/i,
        "Literatura y Audiolibros": /\b(audiolibro|libro|novela|cuento|poema|clásico|clasico|literatura|lectura)\b/i,
        "Cine y TV": /\b(cine|película|pelicula|serie|director|guion|ficción|ficcion|animación|animacion)\b/i,
        "Documentales": /\b(documental|bbc|ciencia|naturaleza|espacio|universo|planeta|nacional geographic)\b/i,
        "Ciencias Naturales": /\b(biología|biologia|química|quimica|geología|geologia|ecología|ecologia|evolución|evolucion|genética|genetica|clima|botánica|botanica)\b/i,
        "Tecnología e Informática": /\b(tecnología|tecnologia|programación|programacion|python|ia|computación|computacion|algoritmo|software|desarrollo)\b/i
    };
    for (const [cat, regex] of Object.entries(patterns)) {
        if (regex.test(text)) cats.add(cat);
    }
    if (ep.type === 'video') {
        if (text.includes('documental')) cats.add("Documentales");
        else cats.add("Cine y TV");
    }
    if (cats.size === 0) cats.add("Otras Ciencias");
    return Array.from(cats);
}

export const DATA = getEpisodiosConSerie().map(ep => ({
    ...ep,
    categories: determineCategories(ep)
}));

// ---------- RENDERIZADO DE TARJETAS ----------
export function createStandardCard(ep) {
    const inPlaylist = userStorage.playlist.has(ep.id);
    const addIcon = inPlaylist ? ICONS.added : ICONS.add;
    const dlIcon = ep.allowDownload ? ICONS.dl : ICONS.noDl;
    return `<div class="card-std group" data-episodio-id="${ep.id}">
        <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-800 cursor-pointer" onclick="window.goToDetail('${ep.detailUrl}')">
            <img src="${ep.coverUrl}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
            <div class="overlay-full">
                <img src="${addIcon}" class="action-icon" onclick="window.handleAdd(event, '${ep.id}'); return false;" data-episodio-id="${ep.id}" data-added="${inPlaylist}">
                <img src="${ICONS.play}" class="play-icon-lg" onclick="window.handlePlay(event, '${ep.id}'); return false;">
                <img src="${dlIcon}" class="action-icon" onclick="window.handleDl(event, '${ep.id}'); return false;" title="${ep.allowDownload ? 'Descargar' : 'Descarga no disponible'}">
            </div>
            <div class="mobile-play-button" onclick="window.handlePlay(event, '${ep.id}'); return false;">
                <img src="${ICONS.play}" alt="Play">
            </div>
        </div>
        <div onclick="window.goToDetail('${ep.detailUrl}')" class="cursor-pointer">
            <h3 class="font-bold text-white text-sm truncate hover:text-blue-400 transition-colors">${ep.title}</h3>
            <p class="text-xs text-gray-400 mt-1 truncate">${ep.author}</p>
        </div>
    </div>`;
}

export function createVideoExpand(ep) {
    const inPlaylist = userStorage.playlist.has(ep.id);
    const addIcon = inPlaylist ? ICONS.added : ICONS.add;
    const dlIcon = ep.allowDownload ? ICONS.dl : ICONS.noDl;
    const hasCover2 = ep.coverWide && ep.coverWide !== ep.coverUrl;
    return `<div class="card-video group" data-episodio-id="${ep.id}">
        <img src="${ep.coverUrl}" class="absolute inset-0 w-full h-full object-cover z-10 group-hover:opacity-0 transition-opacity duration-300">
        ${hasCover2 ? `<img src="${ep.coverWide}" class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300">` : ''}
        <div class="overlay-full z-20">
            <img src="${addIcon}" class="action-icon" onclick="window.handleAdd(event, '${ep.id}'); return false;" data-episodio-id="${ep.id}" data-added="${inPlaylist}">
            <img src="${ICONS.play}" class="play-icon-lg" onclick="window.handlePlay(event, '${ep.id}'); return false;">
            <img src="${dlIcon}" class="action-icon" onclick="window.handleDl(event, '${ep.id}'); return false;" title="${ep.allowDownload ? 'Descargar' : 'Descarga no disponible'}">
        </div>
        <div class="mobile-play-button z-30" onclick="window.handlePlay(event, '${ep.id}'); return false;">
            <img src="${ICONS.play}" alt="Play">
        </div>
        <div class="absolute bottom-2 left-2 z-20 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold border border-white/10">VIDEO</div>
    </div>`;
}

export function createListItem(ep, idx) {
    const inPlaylist = userStorage.playlist.has(ep.id);
    const addIcon = inPlaylist ? ICONS.added : ICONS.add;
    return `<div class="list-item group" data-episodio-id="${ep.id}">
        <span class="text-gray-500 font-bold w-6 text-center text-sm">${idx + 1}</span>
        <div class="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer" onclick="window.goToDetail('${ep.detailUrl}')">
            <img src="${ep.coverUrl}" class="w-full h-full object-cover" loading="lazy">
            <div class="overlay-mini" onclick="window.handlePlay(event, '${ep.id}'); return false;"><img src="${ICONS.play}" class="play-icon-sm"></div>
        </div>
        <div class="item-content cursor-pointer flex-1 min-w-0" onclick="window.goToDetail('${ep.detailUrl}')">
            <h4 class="font-bold text-sm truncate text-white group-hover:text-blue-400 transition-colors">${ep.title}</h4>
            <p class="text-xs text-gray-500 truncate">${ep.author}</p>
        </div>
        <div class="item-actions flex items-center gap-2 flex-shrink-0">
            <button class="lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-white/20 flex items-center justify-center" onclick="window.handleAdd(event, '${ep.id}'); return false;">
                <img src="${addIcon}" alt="Agregar" class="w-4 h-4" data-episodio-id="${ep.id}" data-added="${inPlaylist}">
            </button>
            <div class="lg:hidden mobile-play-btn w-8 h-8 rounded-lg bg-[#7b2eda] flex items-center justify-center" onclick="window.handlePlay(event, '${ep.id}'); return false;">
                <img src="${ICONS.play}" alt="Play" class="w-4 h-4">
            </div>
        </div>
    </div>`;
}

export function createGridCard(item) {
    const inPlaylist = userStorage.playlist.has(item.id);
    const addIcon = inPlaylist ? ICONS.added : ICONS.add;
    const dlIcon = item.allowDownload ? ICONS.dl : ICONS.noDl;
    return `
        <div class="grid-card group" data-episodio-id="${item.id}">
            <div class="aspect-square bg-zinc-800 relative rounded-xl overflow-hidden cursor-pointer" onclick="window.goToDetail('${item.detailUrl}')">
                <img src="${item.coverUrl}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                <div class="overlay-full">
                    <img src="${addIcon}" class="action-icon" onclick="window.handleAdd(event, '${item.id}'); return false;" data-episodio-id="${item.id}" data-added="${inPlaylist}">
                    <img src="${ICONS.play}" class="play-icon-lg" onclick="window.handlePlay(event, '${item.id}'); return false;">
                    <img src="${dlIcon}" class="action-icon" onclick="window.handleDl(event, '${item.id}'); return false;" title="${item.allowDownload ? 'Descargar' : 'Descarga no disponible'}">
                </div>
                <div class="mobile-play-button" onclick="window.handlePlay(event, '${item.id}'); return false;">
                    <img src="${ICONS.play}" alt="Play">
                </div>
            </div>
            <div onclick="window.goToDetail('${item.detailUrl}')" class="cursor-pointer">
                <h4 class="font-bold text-sm text-white truncate hover:text-blue-400 transition-colors">${item.title}</h4>
                <p class="text-xs text-gray-500 truncate">${item.author}</p>
            </div>
        </div>
    `;
}

// ---------- CARRUSELES ----------
function createCarousel(title, type, items, categoryContext) {
    if (!items || items.length === 0) return '';
    const id = 'c-' + Math.random().toString(36).substr(2, 9);
    let content = '';
    if (type === 'double') {
        content = `<div id="${id}" class="flex flex-col flex-wrap h-[580px] gap-x-6 gap-y-6 overflow-x-auto no-scrollbar scroll-smooth">` +
            items.map(ep => createStandardCard(ep)).join('') +
            `</div>`;
    } else if (type === 'list') {
        content = `<div id="${id}" class="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-4">`;
        for (let i = 0; i < items.length; i += 4) {
            content += `<div class="card-list-group min-w-[300px] sm:min-w-[340px] space-y-3">` +
                (items[i] ? createListItem(items[i], i) : '') +
                (items[i+1] ? createListItem(items[i+1], i+1) : '') +
                (items[i+2] ? createListItem(items[i+2], i+2) : '') +
                (items[i+3] ? createListItem(items[i+3], i+3) : '') +
                `</div>`;
        }
        content += `</div>`;
    } else if (type === 'expand') {
        content = `<div id="${id}" class="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 pl-1">` +
            items.map(ep => createVideoExpand(ep)).join('') +
            `</div>`;
    } else {
        content = `<div id="${id}" class="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 pl-1">` +
            items.map(ep => createStandardCard(ep)).join('') +
            `</div>`;
    }
    const verTodoHandler = categoryContext !== 'Todos'
        ? `window.handleCategoryClick('${categoryContext}')`
        : `window.location.href='/'`;
    return `<section class="carousel-wrapper relative group/section mb-8 sm:mb-12">
        <div class="flex items-end justify-between mb-3 sm:mb-5 px-1">
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors cursor-default">${title}</h2>
            <button onclick="${verTodoHandler}" class="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors">Ver todo</button>
        </div>
        <div class="relative">
            <div class="nav-btn left" onclick="document.getElementById('${id}').scrollLeft -= 600"><button>❮</button></div>
            ${content}
            <div class="nav-btn right" onclick="document.getElementById('${id}').scrollLeft += 600"><button>❯</button></div>
        </div>
    </section>`;
}

function createSeriesCarousel() {
    const id = 'c-series-' + Math.random().toString(36).substr(2, 9);
    const seriesGroups = {};
    DATA.forEach(ep => {
        if (ep.series) {
            const serieKey = ep.series.url_serie;
            if (!seriesGroups[serieKey]) {
                seriesGroups[serieKey] = { episodes: [], seriesInfo: ep.series };
            }
            seriesGroups[serieKey].episodes.push(ep);
        }
    });
    const seriesKeys = Object.keys(seriesGroups);
    if (seriesKeys.length === 0) return '';
    let content = `<div id="${id}" class="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-4">`;
    seriesKeys.forEach(serieKey => {
        const group = seriesGroups[serieKey];
        group.episodes.sort((a, b) => new Date(b.date) - new Date(a.date));
        const s = group.seriesInfo;
        if (!s || group.episodes.length < 1) return;
        content += `<div class="card-list-group min-w-[300px] sm:min-w-[340px]">
            <div class="mb-4 cursor-pointer group/serie" onclick="window.goToDetail('${s.url_serie}')">
                <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-800">
                    <img src="${s.portada_serie}" class="w-full h-full object-cover group-hover/serie:scale-105 transition-transform duration-500" loading="lazy">
                </div>
                <h3 class="font-bold text-white text-sm truncate mt-2 group-hover/serie:text-blue-400 transition-colors">${s.titulo_serie}</h3>
                <p class="text-xs text-gray-400 flex items-center gap-1">
                    <span>ver serie</span>
                    <span class="text-blue-400">→</span>
                </p>
            </div>
            <div class="space-y-3">
                ${group.episodes.slice(0, 4).map((ep, i) => createListItem(ep, i)).join('')}
            </div>
        </div>`;
    });
    content += `</div>`;
    return `<section class="carousel-wrapper relative group/section mb-8 sm:mb-12">
        <div class="flex items-end justify-between mb-3 sm:mb-5 px-1">
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors cursor-default">Series y Cursos Académicos</h2>
            <button class="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors">Ver todo</button>
        </div>
        <div class="relative">
            <div class="nav-btn left" onclick="document.getElementById('${id}').scrollLeft -= 600"><button>❮</button></div>
            ${content}
            <div class="nav-btn right" onclick="document.getElementById('${id}').scrollLeft += 600"><button>❯</button></div>
        </div>
    </section>`;
}

// ---------- VISTAS DE DETALLE ----------
export function renderEpisodio(container, episodioId) {
    const ep = DATA.find(e => e.id === episodioId);
    if (!ep) {
        import('./404.js').then(m => m.render(container));
        return;
    }
    const inPlaylist = userStorage.playlist.has(ep.id);
    const addIcon = inPlaylist ? ICONS.added : ICONS.add;
    const html = `
        <div class="detail-view w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <!-- Header adaptable -->
            <div class="episode-header mb-8">
                <!-- Versión móvil -->
                <div class="block lg:hidden">
                    <div class="relative w-full aspect-square max-w-[300px] mx-auto mb-6 rounded-3xl overflow-hidden shadow-2xl">
                        <img src="${ep.coverUrl}" class="w-full h-full object-cover" alt="${ep.title}">
                    </div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">${ep.title}</h1>
                    <p class="text-lg text-gray-300 mb-3">${ep.author}</p>
                    <p class="text-gray-400 mb-6 leading-relaxed">${ep.description}</p>
                   
                    <div class="flex items-center gap-3 mb-8">
                        <button class="flex-1 bg-[#7b2eda] hover:bg-[#8f3ef0] rounded-2xl py-4 px-6 flex items-center justify-center gap-3 transition transform hover:scale-[1.02]" onclick="window.handlePlay(event, '${ep.id}')">
                            <img src="${ICONS.play}" class="w-6 h-6 icon-white">
                            <span class="font-bold">Reproducir</span>
                        </button>
                        <button class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.handleAdd(event, '${ep.id}')">
                            <img src="${addIcon}" class="w-6 h-6 icon-white">
                        </button>
                        <button class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.handleDl(event, '${ep.id}')">
                            <img src="${ep.allowDownload ? ICONS.dl : ICONS.noDl}" class="w-6 h-6 icon-white">
                        </button>
                        <button class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.shareContent('${ep.title}', '${ep.detailUrl}')">
                            <img src="${ICONS.share}" class="w-6 h-6 icon-white">
                        </button>
                    </div>
                </div>
                <!-- Versión escritorio -->
                <div class="hidden lg:block relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/10">
                    <div class="absolute inset-0 opacity-20">
                        <img src="${ep.coverUrl}" class="w-full h-full object-cover blur-3xl scale-110">
                    </div>
                    <div class="relative z-10 p-8 flex gap-8">
                        <img src="${ep.coverUrl}" class="w-48 h-48 rounded-3xl object-cover shadow-2xl border-2 border-white/20" alt="${ep.title}">
                        <div class="flex-1">
                            <h1 class="text-4xl font-extrabold text-white mb-2">${ep.title}</h1>
                            <p class="text-xl text-gray-300 mb-4">${ep.author}</p>
                            <p class="text-gray-400 max-w-3xl leading-relaxed">${ep.description}</p>
                           
                            <div class="flex items-center gap-4 mt-8">
                                <button class="bg-[#7b2eda] hover:bg-[#8f3ef0] rounded-2xl py-4 px-8 flex items-center gap-3 transition transform hover:scale-105" onclick="window.handlePlay(event, '${ep.id}')">
                                    <img src="${ICONS.play}" class="w-6 h-6 icon-white">
                                    <span class="font-bold text-lg">Reproducir</span>
                                </button>
                                <button class="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.handleAdd(event, '${ep.id}')" title="Añadir a lista">
                                    <img src="${addIcon}" class="w-6 h-6 icon-white">
                                </button>
                                <button class="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.handleDl(event, '${ep.id}')" title="${ep.allowDownload ? 'Descargar' : 'Descarga no disponible'}">
                                    <img src="${ep.allowDownload ? ICONS.dl : ICONS.noDl}" class="w-6 h-6 icon-white">
                                </button>
                                <button class="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.shareContent('${ep.title}', '${ep.detailUrl}')" title="Compartir">
                                    <img src="${ICONS.share}" class="w-6 h-6 icon-white">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${ep.series ? `
            <div class="part-of-program mt-8 lg:mt-12 p-6 lg:p-8 bg-white/5 backdrop-blur rounded-3xl border border-white/10">
                <h3 class="text-xl lg:text-2xl font-bold mb-6">Parte del programa</h3>
                <div class="program-card flex flex-col sm:flex-row items-start sm:items-center gap-6 cursor-pointer group" onclick="window.goToDetail('${ep.series.url_serie}')">
                    <img src="${ep.series.portada_serie}" class="w-24 h-24 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" alt="${ep.series.titulo_serie}">
                    <div>
                        <h3 class="text-xl lg:text-2xl font-bold group-hover:text-blue-400 transition-colors">${ep.series.titulo_serie}</h3>
                        <p class="text-gray-400 mt-1 line-clamp-2">${ep.series.descripcion_serie}</p>
                        <p class="text-[#7b2eda] font-semibold mt-3 flex items-center gap-1">
                            Ver más episodios <span class="text-lg">→</span>
                        </p>
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
    `;
    container.innerHTML = html;
}

export function renderSerie(container, serieUrl) {
    const serie = DATA.find(e => e.series?.url_serie === serieUrl)?.series;
    if (!serie) {
        import('./404.js').then(m => m.render(container));
        return;
    }
    const episodiosSerie = DATA.filter(e => e.series?.url_serie === serieUrl);
    episodiosSerie.sort((a, b) => new Date(b.date) - new Date(a.date));
    const episodiosHtml = episodiosSerie.map(ep => {
        const inPlaylist = userStorage.playlist.has(ep.id);
        const addIcon = inPlaylist ? ICONS.added : ICONS.add;
        return `
            <div class="episode-card flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white/5 backdrop-blur rounded-2xl sm:rounded-3xl border border-white/10 mb-4 hover:bg-white/10 transition-all group" data-episodio-id="${ep.id}">
                <img src="${ep.coverUrl}" class="w-full sm:w-24 h-48 sm:h-24 rounded-xl sm:rounded-2xl object-cover" loading="lazy" onclick="window.goToDetail('${ep.detailUrl}')" style="cursor: pointer;">
                <div class="flex-1 min-w-0 w-full">
                    <div onclick="window.goToDetail('${ep.detailUrl}')" class="cursor-pointer">
                        <h3 class="text-lg sm:text-xl font-bold truncate hover:text-blue-400 transition-colors">${ep.title}</h3>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-gray-400 text-sm">${ep.author}</span>
                            <span class="bg-[#7b2eda]/30 px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#7b2eda]/30">${ep.type === 'video' ? 'VIDEO' : 'PODCAST'}</span>
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm mt-2 line-clamp-2 hidden sm:block">${ep.description}</p>
                    <div class="flex items-center gap-2 mt-4">
                        <button class="episode-action-btn w-10 h-10 rounded-xl bg-black/30 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-white/20 transition" onclick="window.handleAdd(event, '${ep.id}')" title="Añadir a lista">
                            <img src="${addIcon}" class="w-5 h-5 icon-white">
                        </button>
                        <button class="episode-action-btn w-10 h-10 rounded-xl bg-black/30 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-white/20 transition" onclick="window.handleDl(event, '${ep.id}')" title="${ep.allowDownload ? 'Descargar' : 'Descarga no disponible'}">
                            <img src="${ep.allowDownload ? ICONS.dl : ICONS.noDl}" class="w-5 h-5 icon-white">
                        </button>
                        <button class="episode-action-btn w-10 h-10 rounded-xl bg-black/30 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-white/20 transition" onclick="window.shareContent('${ep.title}', '${ep.detailUrl}')" title="Compartir">
                            <img src="${ICONS.share}" class="w-5 h-5 icon-white">
                        </button>
                        <button class="episode-play-btn w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#7b2eda] flex items-center justify-center hover:scale-110 transition ml-auto" onclick="window.handlePlay(event, '${ep.id}')" title="Reproducir">
                            <img src="${ICONS.play}" class="w-5 h-5 sm:w-7 sm:h-7 icon-white ml-1">
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    const ultimoEpisodio = episodiosSerie[0] || null;
    const html = `
        <div class="detail-view w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="serie-header mb-8">
                <div class="block lg:hidden">
                    <div class="relative w-full aspect-square max-w-[300px] mx-auto mb-6 rounded-3xl overflow-hidden shadow-2xl">
                        <img src="${serie.portada_serie}" class="w-full h-full object-cover" alt="${serie.titulo_serie}">
                    </div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">${serie.titulo_serie}</h1>
                    <p class="text-lg text-gray-300 mb-3">${episodiosSerie[0]?.author || ''}</p>
                    <p class="text-gray-400 mb-6 leading-relaxed">${serie.descripcion_serie}</p>
                   
                    <div class="flex items-center gap-3 mb-8">
                        ${ultimoEpisodio ? `
                        <button class="flex-1 bg-[#7b2eda] hover:bg-[#8f3ef0] rounded-2xl py-4 px-6 flex items-center justify-center gap-3 transition transform hover:scale-[1.02]" onclick="window.handlePlay(event, '${ultimoEpisodio.id}')">
                            <img src="${ICONS.play}" class="w-6 h-6 icon-white">
                            <span class="font-bold">Último episodio</span>
                        </button>
                        ` : ''}
                        <button class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.shareContent('${serie.titulo_serie}', '${serie.url_serie}')" title="Compartir serie">
                            <img src="${ICONS.share}" class="w-6 h-6 icon-white">
                        </button>
                    </div>
                </div>
                <div class="hidden lg:block relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/10">
                    <div class="absolute inset-0 opacity-20">
                        <img src="${serie.portada_serie}" class="w-full h-full object-cover blur-3xl scale-110">
                    </div>
                    <div class="relative z-10 p-8 flex gap-8">
                        <img src="${serie.portada_serie}" class="w-48 h-48 rounded-3xl object-cover shadow-2xl border-2 border-white/20" alt="${serie.titulo_serie}">
                        <div class="flex-1">
                            <h1 class="text-4xl font-extrabold text-white mb-2">${serie.titulo_serie}</h1>
                            <p class="text-xl text-gray-300 mb-4">${episodiosSerie[0]?.author || ''}</p>
                            <p class="text-gray-400 max-w-3xl leading-relaxed">${serie.descripcion_serie}</p>
                           
                            <div class="flex items-center gap-4 mt-8">
                                ${ultimoEpisodio ? `
                                <button class="bg-[#7b2eda] hover:bg-[#8f3ef0] rounded-2xl py-4 px-8 flex items-center gap-3 transition transform hover:scale-105" onclick="window.handlePlay(event, '${ultimoEpisodio.id}')">
                                    <img src="${ICONS.play}" class="w-6 h-6 icon-white">
                                    <span class="font-bold text-lg">Último episodio</span>
                                </button>
                                ` : ''}
                                <button class="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.shareContent('${serie.titulo_serie}', '${serie.url_serie}')" title="Compartir serie">
                                    <img src="${ICONS.share}" class="w-6 h-6 icon-white">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="episodes-list mt-8 lg:mt-12">
                <h2 class="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-2">
                    <span>Episodios</span>
                    <span class="text-sm font-normal text-gray-500">(${episodiosSerie.length})</span>
                </h2>
                <div class="space-y-4">
                    ${episodiosHtml}
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

// ---------- RENDER FEED ----------
export function renderFeed(container) {
    let feedView = document.getElementById('feed-view');
    let gridView = document.getElementById('grid-view');
    if (!feedView) {
        container.innerHTML = `
            <div id="feed-view" class="space-y-8 sm:space-y-12 transition-opacity duration-300"></div>
            <div id="grid-view" class="hidden transition-opacity duration-300">
                <div class="flex items-center justify-between mb-6 sm:mb-8 mt-4 sm:mt-6">
                    <h2 id="grid-title" class="text-xl sm:text-2xl font-bold">Resultados</h2>
                    <button id="closeGridBtn" class="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1">
                        <span class="text-xl">×</span> Cerrar búsqueda
                    </button>
                </div>
                <div id="results-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6"></div>
                <div id="empty-state" class="hidden py-8 sm:py-10 text-center">
                    <p class="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8" id="empty-msg">No encontramos nada...</p>
                    <h3 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white">Quizás te interese esto:</h3>
                    <div id="recommendations-grid" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6"></div>
                </div>
            </div>
        `;
        feedView = document.getElementById('feed-view');
        gridView = document.getElementById('grid-view');
    }
    const getRandomSafe = (count, filterFn = () => true) => {
        const filtered = DATA.filter(filterFn);
        if (filtered.length === 0) return [];
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, filtered.length));
    };
    feedView.innerHTML = '';
    feedView.innerHTML += createCarousel("Nuevos Lanzamientos", "standard",
        getRandomSafe(15, ep => new Date(ep.date) > new Date(Date.now() - 30*24*60*60*1000)), "Todos");
    feedView.innerHTML += createCarousel("Series de Video", "expand",
        getRandomSafe(10, e => e.type === 'video'), "Cine y TV");
    feedView.innerHTML += createCarousel("Top Semanal", "list",
        getRandomSafe(16), "Todos");
    feedView.innerHTML += createCarousel("Para Estudiar Profundamente", "double",
        getRandomSafe(20, e => e.categories.includes("Matemáticas") || e.categories.includes("Física y Astronomía")), "Matemáticas");
    feedView.innerHTML += createCarousel("Matemáticas", "standard",
        getRandomSafe(15, e => e.categories.includes("Matemáticas")), "Matemáticas");
    feedView.innerHTML += createCarousel("Especiales en Video", "expand",
        getRandomSafe(10, e => e.type === 'video' && e.categories.includes("Documentales")), "Documentales");
    feedView.innerHTML += createCarousel("Física y Astronomía", "standard",
        getRandomSafe(15, e => e.categories.includes("Física y Astronomía")), "Física y Astronomía");
    feedView.innerHTML += createCarousel("Ciencias Naturales y Tecnología", "double",
        getRandomSafe(20, e => e.categories.some(c => ["Ciencias Naturales", "Tecnología e Informática"].includes(c))), "Otras Ciencias");
    feedView.innerHTML += createSeriesCarousel();
    feedView.innerHTML += createCarousel("Otras Ciencias y Disciplinas", "standard",
        getRandomSafe(15, e => e.categories.includes("Otras Ciencias") ||
            e.categories.some(c => ["Ciencias Naturales", "Tecnología e Informática"].includes(c))),
        "Otras Ciencias");
    feedView.innerHTML += createCarousel("Imprescindibles del Mes", "list",
        getRandomSafe(16, e => new Date(e.date) > new Date(Date.now() - 60*24*60*60*1000)), "Todos");
    feedView.innerHTML += createCarousel("Podcasts Destacados", "standard",
        getRandomSafe(15, e => e.type === 'audio'), "Todos");
    feedView.innerHTML += createCarousel("Charlas y Conferencias", "expand",
        getRandomSafe(10, e => e.type === 'video' && (e.categories.includes("Cine y TV") || e.categories.includes("Documentales"))), "Cine y TV");
    feedView.innerHTML += createCarousel("Humanidades y Sociedad", "double",
        getRandomSafe(20, e => e.categories.some(c => ["Historia", "Filosofía", "Ciencias Sociales", "Arte y Cultura"].includes(c))), "Ciencias Sociales");
    feedView.innerHTML += createCarousel("Mentes Curiosas", "standard",
        getRandomSafe(15, e => e.categories.includes("Tecnología e Informática") || e.categories.includes("Ciencias Naturales")), "Tecnología e Informática");
    feedView.innerHTML += createCarousel("Actualidad Académica", "list",
        getRandomSafe(16, e => new Date(e.date) > new Date(Date.now() - 45*24*60*60*1000)), "Todos");
    feedView.innerHTML += createCarousel("Mix de Saberes", "double",
        getRandomSafe(20), "Todos");
}

// ---------- RENDER GRID ----------
export function renderGrid(container, items, title) {
    let gridView = document.getElementById('grid-view');
    if (!gridView) {
        container.innerHTML = `
            <div id="feed-view" class="hidden"></div>
            <div id="grid-view" class="transition-opacity duration-300">
                <div class="flex items-center justify-between mb-6 sm:mb-8 mt-4 sm:mt-6">
                    <h2 id="grid-title" class="text-xl sm:text-2xl font-bold">${title}</h2>
                    <button id="closeGridBtn" class="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1">
                        <span class="text-xl">×</span> Cerrar búsqueda
                    </button>
                </div>
                <div id="results-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6"></div>
                <div id="empty-state" class="hidden py-8 sm:py-10 text-center">
                    <p class="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8" id="empty-msg">No encontramos nada...</p>
                    <h3 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white">Quizás te interese esto:</h3>
                    <div id="recommendations-grid" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6"></div>
                </div>
            </div>
        `;
        gridView = document.getElementById('grid-view');
    }
    const gridContainer = document.getElementById('results-grid');
    const emptyState = document.getElementById('empty-state');
    const titleEl = document.getElementById('grid-title');
    titleEl.innerText = title;
    gridContainer.innerHTML = '';
    if (items.length === 0) {
        emptyState.classList.remove('hidden');
        gridContainer.classList.add('hidden');
        const searchTerm = title.replace('Resultados para ', '').replace(/"/g, '');
        document.getElementById('empty-msg').innerText = `No hemos encontrado nada para "${searchTerm}"`;
        const suggestions = [...DATA].sort(() => 0.5 - Math.random()).slice(0, 5);
        const recGrid = document.getElementById('recommendations-grid');
        recGrid.innerHTML = '';
        suggestions.forEach(ep => {
            recGrid.innerHTML += createGridCard(ep);
        });
    } else {
        emptyState.classList.add('hidden');
        gridContainer.classList.remove('hidden');
        items.forEach(item => {
            gridContainer.innerHTML += createGridCard(item);
        });
    }
    document.getElementById('feed-view')?.classList.add('hidden');
    gridView.classList.remove('hidden');
    document.getElementById('closeGridBtn')?.addEventListener('click', () => {
        window.history.pushState(null, null, '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
    });
}

// ---------- EXPONER FUNCIONES GLOBALES ----------
window.shareContent = async (title, url) => {
    const fullUrl = window.location.origin + url;
    if (navigator.share) {
        try {
            await navigator.share({ title, url: fullUrl });
        } catch (e) {
            console.log('Compartir cancelado');
        }
    } else {
        navigator.clipboard.writeText(fullUrl);
        alert('Enlace copiado al portapapeles');
    }
};

window.handlePlay = function(e, episodioId) {
    e.stopPropagation();
    e.preventDefault();
    
    const ep = DATA.find(x => x.id === episodioId);
    if (!ep) {
        alert('No se encontró el episodio.');
        return false;
    }

    if (typeof window.playEpisodeExpanded === 'function') {
        try {
            window.playEpisodeExpanded(
                ep.mediaUrl,
                ep.type,
                ep.coverUrl,
                ep.coverUrl,
                ep.title,
                ep.detailUrl,
                ep.author,
                [],
                ep.description,
                ep.allowDownload
            );
        } catch (err) {
            console.error('Error al reproducir:', err);
            alert('No se pudo reproducir el episodio.\n' +
                  'Posibles causas: enlace roto, formato no soportado o problema de conexión.\n' +
                  'Intenta descargar el archivo o recargar la página.');
        }
    } else {
        alert('El reproductor no está disponible en este momento.\n' +
              'Por favor, intenta más tarde o usa el botón de descarga si está habilitado.');
    }

    return false;
};

window.handleAdd = function(e, episodioId) {
    e.stopPropagation();
    e.preventDefault();
    
    const ep = DATA.find(x => x.id === episodioId);
    if (!ep) return;

    const alreadyIn = userStorage.playlist.has(ep.id);
    
    if (alreadyIn) {
        userStorage.playlist.remove(ep.id);  // Asegúrate de tener .remove() en storage.js
        alert('Episodio eliminado de tu lista');
    } else {
        userStorage.playlist.add(ep);
        alert('Episodio añadido a tu lista');
    }

    // Actualizar todos los iconos relacionados con este episodio
    document.querySelectorAll(`[data-episodio-id="${episodioId}"] img[data-added]`)
        .forEach(img => {
            img.src = alreadyIn ? ICONS.add : ICONS.added;
            img.dataset.added = alreadyIn ? 'false' : 'true';
            img.style.transform = 'scale(1.3)';
            setTimeout(() => img.style.transform = 'scale(1)', 180);
        });

    return false;
};

window.handleDl = function(e, episodioId) {
    e.stopPropagation();
    e.preventDefault();
    const ep = DATA.find(x => x.id === episodioId);
    if (!ep) return;
    if (!ep.allowDownload) {
        alert('Descarga no disponible para este episodio');
        return false;
    }
    const ext = ep.type === 'video' ? 'mp4' : 'mp3';
    const filename = `${ep.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}.${ext}`;
    try {
        const a = document.createElement('a');
        a.href = ep.mediaUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        window.open(ep.mediaUrl, '_blank');
    }
    return false;
};

window.goToDetail = function(url) {
    if (url && url !== '#') {
        window.history.pushState(null, null, url);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }
};

window.handleCategoryClick = function(category) {
    const url = category === 'Todos' ? '/' : `/categoria/${encodeURIComponent(category)}`;
    window.history.pushState(null, null, url);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function renderCategoryPills(activeCat = 'Todos') {
    const container = document.getElementById('category-pills');
    if (!container) return;
   
    container.innerHTML = '';
   
    CATEGORIES.forEach(cat => {
        const isActive = cat === activeCat;
        const btn = document.createElement('button');
        btn.className = `whitespace-nowrap px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all ${isActive ? 'bg-white text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`;
        btn.innerText = cat;
       
        btn.addEventListener('click', () => {
            window.handleCategoryClick(cat);
        });
       
        container.appendChild(btn);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => renderCategoryPills());
} else {
    renderCategoryPills();
}
