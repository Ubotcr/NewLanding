"""Read-only production checks. No GA events, authentication or external dependencies."""
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

for route in ['/', '/admision', '/estandarizadas', '/estandarizadas/matematicas', '/estandarizadas/matematicas/pendiente-de-una-recta']:
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
        status, headers, html = fetch('https://' + host + '/')
        assert status == 200 and 'text/html' in headers.get('Content-Type',''), host
        assert re.search(r'<meta\s+name="robots"\s+content="noindex"', html), host
        assert fetch('https://' + host + '/seo-check-url-that-does-not-exist')[0] == 404, host
print('PASS published SEO checks')
