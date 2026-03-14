// episodios.js - Datos de episodios y series (separados)

// ---------- LISTA DE SERIES ----------
export const series = [
    {
        seriesid: "teoria-del-proceso",
        portada_serie: 'https://media.baltaanay.org/web/image/658-redirect/960bc627aab97e6134955b4d5d1c99d0.jpg',
        titulo_serie: 'Teoría del proceso',
        descripcion_serie: 'Proceso en el derecho y la forma de poner en movimiento la maquinaria de Justicia',
        url_serie: '/teoria-del-proceso'
    },
    {
        seriesid: "ddhh",
        portada_serie: 'https://scout.es/wp-content/uploads/2021/12/186-01.jpg',
        titulo_serie: 'Derechos Humanos',
        descripcion_serie: 'Derechos Humanos',
        url_serie: '/ddhh'
    },
    {
        seriesid: "procesal-constitucional",
        portada_serie: 'https://balta.odoo.com/web/image/417-e2fd48e0/media.webp',
        titulo_serie: 'Derecho Procesal Constitucional',
        descripcion_serie: 'Derecho Procesal Constitucional',
        url_serie: '/procesal-constitucional'
    },
    {
        seriesid: "ddpp-3-clases",
        portada_serie: 'https://media.baltaanay.org/web/image/925-6ed84678/DERECHO%20PENAL%20III.png',
        titulo_serie: 'Derecho penal 3',
        descripcion_serie: 'Derecho Público',
        url_serie: '/ddpp-3/clases'
    },
    {
        seriesid: "dp-indigenas",
        portada_serie: 'https://media.baltaanay.org/web/image/927-edc793ab/Pueblos%20ind%C3%ADgenas.png',
        titulo_serie: 'Derecho de los pueblos indígenas',
        descripcion_serie: 'Los derechos de tercera generación. Desarrolla los derechos de los pueblos indígenas o también conocidos como derechos de solidaridad.',
        url_serie: '/dp-indigenas'
    },
    {
        seriesid: "derecho-laboral-1",
        portada_serie: 'https://media.baltaanay.org/web/image/929-b905c3ef/DERECHO%20LABORAL.png',
        titulo_serie: 'Derecho Laboral',
        descripcion_serie: 'Un derecho humano por excelencia. Es la ciencia, una disciplina pública. Ciencias Sociales.',
        url_serie: '/derecho-laboral-1'
    }
];

// Crear mapa para acceso rápido
const seriesMap = Object.fromEntries(series.map(s => [s.seriesid, s]));

// ---------- LISTA DE EPISODIOS (con seriesid) ----------
export const episodios = [
    {
        id: "la-excepcion",
        date: '2025-11-28',
        type: 'audio',
        mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2025-10-29/413399242-44100-2-2f259e66aeac3.m4a',
        coverUrl: 'https://s3-us-west-2.amazonaws.com/anchor-generated-image-bank/staging/podcast_uploaded_nologo400/44500417/44500417-1759018829686-8b0dde55850ed.jpg',
        title: 'La excepción en el proceso de administración de Justicia',
        description: 'La excepción en el proceso de administración de Justicia',
        allowDownload: false,
        author: "Barahona",
        seriesid: "teoria-del-proceso",
        detailUrl: '/teoria-del-proceso'  // puede coincidir con la serie o ser individual
    },
    {
        id: "principios-procesales",
        date: '2025-11-28',
        type: 'audio',
        mediaUrl: 'https://balta-derecho.odoo.com/documents/content/3L5vYn32Sq-M5sUKB96S1Ao9',
        coverUrl: 'https://s3-us-west-2.amazonaws.com/anchor-generated-image-bank/staging/podcast_uploaded_nologo400/44500417/44500417-1759018829686-8b0dde55850ed.jpg',
        title: 'Principios procesales',
        description: 'La excepción en el proceso de administración de Justicia',
        allowDownload: false,
        author: "Barahona",
        seriesid: "teoria-del-proceso",
        detailUrl: '/teoria-del-proceso'
    },
    {
        id: "responsabilidad-penal-adolecencia",
        date: '2025-11-01',
        type: 'video',
        mediaUrl: 'https://lb.s3.odysee.tv/vods2.odysee.live/odysee-replays/84515919a2e010fa2c381702a6777c1035c2deb3/1762812470.mp4',
        coverUrl: 'https://balta.odoo.com/web/image/417-e2fd48e0/media.webp',
        title: 'Responsabilidad penal en la adolecencia',
        description: 'Conferencia de Derechos Humanos. Sobre la responsabilidad penal de la adolecencia, las penas y las medidas de seguridad.',
        allowDownload: false,
        author: "Rony Eulalio",
        seriesid: "ddhh",
        detailUrl: '/ddhh/adolecencia'
    },
    {
        id: "repaso-dd-procesal-constitucional",
        date: '2025-11-01',
        type: 'video',
        mediaUrl: 'https://lb.s3.odysee.tv/vods2.odysee.live/odysee-replays/84515919a2e010fa2c381702a6777c1035c2deb3/1762807738.mp4',
        coverUrl: 'https://balta.odoo.com/web/image/417-e2fd48e0/media.webp',
        title: 'Repaso de DD Procesal Constitucional',
        description: 'Penultima clase de Derecho Procesal Constitucional 2025',
        allowDownload: false,
        author: "César Solares",
        seriesid: "procesal-constitucional",
        detailUrl: '/procesal-constitucional'
    },
    {
        id: "corrientes-teoria-delito",
        date: '2026-02-10',
        mediaUrl: "https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026-1-13/418061888-44100-2-bd0c488cd9ace.m4a",
        type: "audio",
        coverUrl: 'https://media.baltaanay.org/web/image/925-6ed84678/DERECHO%20PENAL%20III.png',
        title: "Corrientes de la teoría del delito",
        author: "Lemus",
        description: "Continuación de las corrientes de la teoría del delito. Teoría causalista, finalista y funcionalista.",
        allowDownload: false,
        seriesid: "ddpp-3-clases",
        detailUrl: "/ddpp-3/clases"
    },
    {
        id: "teoria-causalista",
        date: '2026-02-03',
        mediaUrl: "https://lb.s3.odysee.tv/vods2.odysee.live/odysee-replays/dd57d90536480f9a751ba4429447fd5f613efce3/1770150346.mp4",
        type: "video",
        coverUrl: 'https://media.baltaanay.org/web/image/925-6ed84678/DERECHO%20PENAL%20III.png',
        title: "La teoría causalista",
        author: "Lemus",
        description: "Desarrollo de la teoría causalista. Derecho Penal 3. Historia, Ciencia.",
        allowDownload: false,
        seriesid: "ddpp-3-clases",
        detailUrl: "/ddpp-3/clases"
    },
    {
        id: "que-es-derecho-penal",
        date: '2026-01-29',
        mediaUrl: "https://podcasts.com/api/download-episode/214790939",
        type: "audio",
        coverUrl: 'https://media.baltaanay.org/web/image/925-6ed84678/DERECHO%20PENAL%20III.png',
        title: "¿Qué es el Derecho Penal?",
        author: "Lemus",
        description: "Conjunto de normas jurídicas de naturaleza pública que regulan los delitos, las penas y las medidas de seguridad. Ciencia pública. Derecho, Historia.",
        allowDownload: false,
        seriesid: "ddpp-3-clases",
        detailUrl: "/ddpp-3/clases"
    },
    {
        id: "tipicidad-elementos-delito",
        date: '2026-02-12',
        mediaUrl: "https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026-1-13/418069738-44100-2-616f210f1eb48.m4a",
        type: "audio",
        coverUrl: 'https://media.baltaanay.org/web/image/925-6ed84678/DERECHO%20PENAL%20III.png',
        title: "La tipicidad y los elementos del delito",
        author: "Lemus",
        description: "Análisis profundo del concepto de tipicidad en derecho y sociedad. Una mirada crítica y actual. Ciencia.",
        allowDownload: false,
        seriesid: "ddpp-3-clases",
        detailUrl: "/ddpp-3/clases"
    },
    {
        id: "crisis-estado-derecho",
        date: '2026-02-06',
        mediaUrl: "https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026-1-13/418064713-44100-2-ed2c58b07cd6.m4a",
        type: "audio",
        coverUrl: 'https://media.baltaanay.org/web/image/927-edc793ab/Pueblos%20ind%C3%ADgenas.png',
        title: "Crisis del Estado de Derecho",
        author: "Raymundo",
        description: "La crisis del Estado de Derecho. Por Lic. Raymundo Catz. El estado de derecho en crisis por los derechos de segunda y tercera generación.",
        allowDownload: false,
        seriesid: "dp-indigenas",
        detailUrl: "/dp-indigenas"
    },
    {
        id: "conceptos-basicos-ddhh",
        date: '2026-02-04',
        mediaUrl: "https://lb.s3.odysee.tv/vods2.odysee.live/odysee-replays/dd57d90536480f9a751ba4429447fd5f613efce3/1770236623.mp4",
        type: "video",
        coverUrl: 'https://media.baltaanay.org/web/image/927-edc793ab/Pueblos%20ind%C3%ADgenas.png',
        title: "Conceptos básicos de los Derechos Humanos",
        author: "Raymundo",
        description: "Conceptos básicos de los Derechos Humanos",
        allowDownload: false,
        seriesid: "dp-indigenas",
        detailUrl: "/dp-indigenas"
    },
    {
        id: "antecedentes-derecho-trabajo",
        date: '2026-02-02',
        type: 'video',
        mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026-1-2/417347225-44100-2-38463f72786e9.m4a',
        coverUrl: 'https://media.baltaanay.org/web/image/929-b905c3ef/DERECHO%20LABORAL.png',
        title: 'Antecedentes Históricos del derecho de Trabajo',
        description: 'Antecedentes históricos del derecho de trabajo. Avidan Ortiz. Historia del derecho Laboral.',
        allowDownload: false,
        author: "Avidan Ortiz",
        seriesid: "derecho-laboral-1",
        detailUrl: '/derecho-laboral-1'
    },
    {
        id: "fuentes-derecho-trabajo",
        date: '2026-02-06',
        type: 'video',
        mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026-1-13/ca5f6f25-3b96-ff31-bb04-e712a81ce076.m4a',
        coverUrl: 'https://media.baltaanay.org/web/image/929-b905c3ef/DERECHO%20LABORAL.png',
        title: 'Fuentes del Derecho de Trabajo',
        description: 'Historia. Fuentes del Derecho de trabajo. Ciencia.',
        allowDownload: false,
        author: "Avidan Ortiz",
        seriesid: "derecho-laboral-1",
        detailUrl: '/derecho-laboral-1'
    },
    {
        id: "veliz-franco-vs-guatemala",
        date: '2025-09-27',
        type: 'audio',
        mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2025-8-28/408260699-44100-2-4b5edeb875805.m4a',
        coverUrl: 'https://s3-us-west-2.amazonaws.com/anchor-generated-image-bank/staging/podcast_uploaded_episode400/44500417/44500417-1759018710643-950caadc41ea7.jpg',
        title: 'Veliz Franco y Otros Vs. Guatemala - Exposición',
        description: 'Guatemala presentaba un alto índice de impunidad general, en cuyo marco la mayoría de los actos violentos que conllevaban la muerte de mujeres quedaban impunes.',
        allowDownload: true,
        author: "Melany y Laura",
        seriesid: "ddhh",
        detailUrl: '/dh/caso-veliz-franco-vs-guatemala'
    }
];

// ---------- FUNCIONES DE ACCESO ----------
export function getEpisodioById(id) {
    return episodios.find(ep => ep.id === id);
}

export function getEpisodioByDetailUrl(url) {
    return episodios.find(ep => ep.detailUrl === url);
}

export function getSerieByUrl(url) {
    return series.find(s => s.url_serie === url);
}

export function getSerieById(seriesid) {
    return seriesMap[seriesid];
}

export function getEpisodiosBySerieId(seriesid) {
    return episodios.filter(ep => ep.seriesid === seriesid);
}

export function getEpisodiosBySerieUrl(url) {
    const serie = getSerieByUrl(url);
    return serie ? getEpisodiosBySerieId(serie.seriesid) : [];
}

// Para búsquedas
export function getAllEpisodios() {
    return episodios;
}

// Para feed: combinar episodio con su serie
export function getEpisodiosConSerie() {
    return episodios.map(ep => ({
        ...ep,
        series: getSerieById(ep.seriesid) || null
    }));
}
