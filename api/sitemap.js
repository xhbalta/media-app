// api/sitemap.js
export default async function handler(req, res) {
  // Importar datos desde el archivo en la raíz
  const { episodios, series } = await import('../episodios.js');

  const BASE_URL = 'https://media.baltaanay.org';

  // Páginas estáticas del sitio
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/biblioteca', priority: 0.8, changefreq: 'weekly' },
    { url: '/explorar', priority: 0.8, changefreq: 'weekly' },
    { url: '/buscar', priority: 0.7, changefreq: 'monthly' },
    { url: '/novedades', priority: 0.9, changefreq: 'daily' },
  ];

  // URLs de series (campo url_serie)
  const seriesUrls = series.map(s => s.url_serie).filter(Boolean);

  // URLs de episodios (campo detailUrl)
  const episodiosUrls = episodios.map(ep => ep.detailUrl).filter(Boolean);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages.map(page => `
        <url>
          <loc>${BASE_URL}${page.url}</loc>
          <priority>${page.priority}</priority>
          <changefreq>${page.changefreq}</changefreq>
        </url>
      `).join('')}
      ${seriesUrls.map(url => `
        <url>
          <loc>${BASE_URL}${url}</loc>
          <priority>0.7</priority>
          <changefreq>weekly</changefreq>
        </url>
      `).join('')}
      ${episodiosUrls.map(url => `
        <url>
          <loc>${BASE_URL}${url}</loc>
          <priority>0.8</priority>
          <changefreq>monthly</changefreq>
        </url>
      `).join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
}
