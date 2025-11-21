import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 站点配置
const siteUrl = 'https://zhangjun.xyz';

// 固定页面
const fixedPages = [
  {
    loc: '/',
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: '0.5'
  },
  {
    loc: '/about',
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: '0.5'
  },
  {
    loc: '/about/',
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: '0.5'
  },
  {
    loc: '/archive/',
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: '0.5'
  }
];

// 读取博客文章
function getBlogPosts() {
  const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');
  const posts = [];
  
  try {
    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir);
      
      files.forEach(file => {
        if (file.endsWith('.md') || file.endsWith('.mdx')) {
          const filePath = path.join(postsDir, file);
          const stat = fs.statSync(filePath);
          
          // 获取文件名（不含扩展名）作为slug
          const slug = file.replace(/\.(md|mdx)$/, '');
          
          posts.push({
            loc: `/posts/${encodeURIComponent(slug)}/`,
            lastmod: stat.mtime.toISOString(),
            changefreq: 'weekly',
            priority: '0.7'
          });
        }
      });
    }
  } catch (error) {
    console.warn('Warning: Could not read blog posts directory:', error.message);
  }
  
  return posts;
}

// 生成格式化的sitemap XML
function generateFormattedSitemap(pages) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  pages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}${page.loc}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += `</urlset>`;
  
  return xml;
}

// 生成格式化的sitemap索引文件
function generateFormattedSitemapIndex(sitemaps) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  sitemaps.forEach(sitemap => {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${siteUrl}/${sitemap.filename}</loc>\n`;
    xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
    xml += `  </sitemap>\n`;
  });
  
  xml += `</sitemapindex>`;
  
  return xml;
}

// 生成sitemap XML
function generateSitemap() {
  // 获取博客文章
  const blogPosts = getBlogPosts();
  
  // 合并固定页面和博客文章
  const allPages = [...fixedPages, ...blogPosts];
  
  // 生成格式化的sitemap内容
  const sitemapContent = generateFormattedSitemap(allPages);
  const lastmod = new Date().toISOString();
  
  // 生成格式化的sitemap索引内容
  const sitemapIndexContent = generateFormattedSitemapIndex([
    {
      filename: 'sitemap-0.xml',
      lastmod: lastmod
    }
  ]);
  
  // 写入文件
  const distPath = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  
  // 写入格式化的sitemap文件，替换默认生成的文件
  fs.writeFileSync(path.join(distPath, 'sitemap-0.xml'), sitemapContent);
  console.log(`Formatted sitemap generated successfully at dist/sitemap-0.xml with ${allPages.length} pages`);
  
  // 写入格式化的sitemap索引文件，替换默认生成的文件
  fs.writeFileSync(path.join(distPath, 'sitemap-index.xml'), sitemapIndexContent);
  console.log(`Formatted sitemap index generated successfully at dist/sitemap-index.xml`);
}

// 执行生成
generateSitemap();