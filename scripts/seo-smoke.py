"""Read-only production checks. No GA events, authentication or external dependencies."""
from html.parser import HTMLParser
import argparse
import re
from urllib.request import urlopen, Request
from urllib.error import HTTPError
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser()
parser.add_argument('--landing-only', action='store_true')
args = parser.parse_args()

def fetch(url):
    try:
        response = urlopen(Request(url, headers={'User-Agent': 'UbotSEOChecks/1.0'}), timeout=25)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.headers, response.read().decode('utf-8', 'replace')

class AppPolicy(HTMLParser):
    def __init__(self, html):
        super().__init__(); self.directives = []; self.feed(html)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta' and attrs.get('name', '').lower() in ('robots', 'googlebot'):
            self.directives.append(attrs.get('content', '').strip().lower())

practice_routes = [f'/{product}/practica/{slug}' for product, slugs in [('admision', ['planteamiento', 'patrones', 'inferencias']), ('estandarizadas', ['pendiente', 'funciones-lineales', 'porcentajes'])] for slug in slugs]
for route in ['/', '/admision', '/estandarizadas', '/estandarizadas/matematicas', '/estandarizadas/matematicas/pendiente-de-una-recta', '/admision/practica', '/estandarizadas/practica', '/about', '/calendario', *practice_routes]:
    status, headers, html = fetch('https://ubotcr.com' + route)
    assert status == 200 and 'text/html' in headers.get('Content-Type', ''), (route, status)
    assert f'rel="canonical" href="https://ubotcr.com{route}"' in html, route
    assert not re.search(r'<meta[^>]+(?:name=[\"\x27]robots[\"\x27][^>]+content=[\"\x27][^\"\x27]*noindex)', html, re.I), route
    assert 'noindex' not in headers.get('X-Robots-Tag','').lower(), route
status, _, robots = fetch('https://ubotcr.com/robots.txt')
assert status == 200 and 'Sitemap: https://ubotcr.com/sitemap-index.xml' in robots
status, _, sitemap = fetch('https://ubotcr.com/sitemap-index.xml')
assert status == 200
for loc in ET.fromstring(sitemap).findall('.//{*}loc'):
    status, _, body = fetch(loc.text)
    assert status == 200
    urls = [e.text for e in ET.fromstring(body).findall('.//{*}loc')]
    assert urls and all((url == 'https://ubotcr.com' or url.startswith('https://ubotcr.com/')) for url in urls)
    assert not any('/404' in url or '/changelog' in url or '/blog/page/' in url for url in urls)
assert fetch('https://ubotcr.com/seo-check-url-that-does-not-exist')[0] == 404
if not args.landing_only:
    for host in ['chat.ubotcr.com', 'estandarizadas.ubotcr.com']:
        routes = ['/', '/cuenta', '/matematicas/practica'] if host.startswith('estandarizadas') else ['/', '/cuenta', '/chat']
        for route in routes:
            status, headers, html = fetch('https://' + host + route)
            assert status == 200 and 'text/html' in headers.get('Content-Type',''), (host, route)
            assert AppPolicy(html).directives == ['noindex'], (host, route)
            assert headers.get('X-Robots-Tag', '').strip().lower() == 'noindex', (host, route)
        status, _, robots = fetch('https://' + host + '/robots.txt')
        assert status == 200 and 'Allow: /' in robots and 'Disallow:' not in robots and 'Sitemap:' not in robots, host
        assert fetch('https://' + host + '/seo-check-url-that-does-not-exist')[0] == 404, host
print('PASS published SEO checks')
