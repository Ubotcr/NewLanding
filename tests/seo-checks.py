"""Validate shipped HTML and sitemap together, with no network dependencies."""
import json
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET

ORIGIN = 'https://ubotcr.com'

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.tags = []; self.links = []; self.schemas = []; self.title = ''; self.script = None; self.in_title = False
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs); self.tags.append((tag, attrs))
        if tag == 'a' and 'href' in attrs: self.links.append(attrs['href'])
        if tag == 'title': self.in_title = True
        if tag == 'script' and attrs.get('type') == 'application/ld+json': self.script = ''
    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.script is not None: self.script += data
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag == 'script' and self.script is not None:
            self.schemas.append(json.loads(self.script)); self.script = None
    def metas(self, name):
        return [a.get('content', '') for t,a in self.tags if t == 'meta' and (a.get('name') == name or a.get('property') == name)]
    @property
    def noindex(self): return any('noindex' in value for value in self.metas('robots'))

def validate(root):
    pages = {}
    for file in root.rglob('*.html'):
        route = '/' + str(file.relative_to(root)).removesuffix('index.html').removesuffix('.html').rstrip('/')
        pages[route] = Page(file.read_text())
    assert pages, 'No built HTML'
    sitemap_urls = set()
    for file in root.glob('sitemap-*.xml'):
        xml = ET.parse(file)
        if xml.getroot().tag.endswith('urlset'):
            sitemap_urls.update((ORIGIN + "/" if e.text == ORIGIN else e.text) for e in xml.findall('.//{*}loc'))
    expected = {ORIGIN + route for route,p in pages.items() if not p.noindex}
    assert sitemap_urls == expected, f'Sitemap mismatch: extra {sitemap_urls - expected}; missing {expected - sitemap_urls}'
    incoming = Counter(); titles = Counter(); descriptions = Counter()
    for route, page in pages.items():
        def require(condition, message): assert condition, f'{route}: {message}'
        require(len([1 for t,a in page.tags if t == 'title']) == 1 and page.title.strip(), 'one nonempty title required')
        canonical = [a['href'] for t,a in page.tags if t == 'link' and a.get('rel') == 'canonical']
        require(canonical == [ORIGIN + route], f'canonical {canonical}')
        require(len(page.metas('description')) == 1 and page.metas('description')[0].strip(), 'description required')
        require(page.metas('og:url') == canonical, 'og:url differs from canonical')
        require(len(page.metas('og:type')) == 1, 'duplicate og:type')
        require(len([1 for t,a in page.tags if t == 'h1']) == 1, 'exactly one h1')
        require(any(t == 'main' for t,a in page.tags), 'missing main content')
        require(any(t == 'meta' and a.get('name') == 'viewport' for t,a in page.tags), 'viewport missing')
        require(page.schemas, 'JSON-LD missing')
        if not page.noindex:
            titles[page.title.strip()] += 1; descriptions[page.metas('description')[0]] += 1
        for href in page.links:
            url = urlsplit(href)
            if url.scheme in ('mailto','tel') or url.netloc and url.netloc != 'ubotcr.com': continue
            if not url.path or not url.path.startswith('/'): continue
            target = unquote(url.path).rstrip('/') or '/'
            if target in pages: incoming[target] += route != target
            else: require((root / target.lstrip('/')).is_file(), f'broken internal link: {href}')
    assert all(count == 1 for count in titles.values()), f'Duplicate titles: {titles}'
    assert all(count == 1 for count in descriptions.values()), 'Duplicate descriptions'
    for route, page in pages.items():
        assert route == '/' or page.noindex or incoming[route], f'Orphan page: {route}'
    robots = (root / 'robots.txt').read_text()
    assert 'Sitemap: https://ubotcr.com/sitemap-index.xml' in robots
    assert not any(line.strip().startswith('Disallow: /') for line in robots.splitlines())
    assert pages['/404'].noindex
    assert '/estandarizadas/matematicas' in pages
    print(f'PASS SEO: {len(pages)} HTML pages, {len(sitemap_urls)} indexable URLs, metadata, JSON-LD, links and sitemap')

if __name__ == '__main__': validate(Path(sys.argv[1] if len(sys.argv) > 1 else 'dist'))
