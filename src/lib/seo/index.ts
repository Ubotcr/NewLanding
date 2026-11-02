import config from "@/config/config.json";

export const origin = config.site.base_url;
export type Breadcrumb = { name: string; path: string };
export type StructuredData = Record<string, unknown>;

export function canonicalUrl(path: string): string {
  const url = new URL(path, origin);
  if (url.origin !== origin) throw new Error(`Canonical fuera del dominio: ${path}`);
  url.search = "";
  url.hash = "";
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.href;
}

// Escapar '<' impide que contenido editorial cierre un script JSON-LD.
export function serializeSchema(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function breadcrumbsSchema(items: Breadcrumb[]): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1,
      name: item.name, item: canonicalUrl(item.path),
    })),
  };
}

export const identitySchema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${origin}/#organization`,
      name: config.site.title, url: origin,
      logo: new URL(config.site.logo_icon, origin).href },
    { "@type": "WebSite", "@id": `${origin}/#website`,
      name: config.site.title, url: origin, inLanguage: "es-CR",
      publisher: { "@id": `${origin}/#organization` } },
  ],
};
