import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// Homepage collection
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({}).catchall(z.any()),
});

// About collection
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({}).catchall(z.any()),
});

// Changelog collection
const changelogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/changelog" }),
  schema: z.object({}).catchall(z.any()),
});

// Editorial metadata is validated at build time. Never invent review dates.
const editorialSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  meta_title: z.string().optional(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  reviewedBy: z.string().min(1).optional(),
  reviewedAt: z.coerce.date().optional(),
  sources: z.array(z.object({ title: z.string().min(1), url: z.string().url() })).default([]),
  related: z.array(z.string().startsWith("/")).default([]),
  draft: z.boolean().default(false),
  author: z.object({ name: z.string().min(1), designation: z.string().optional() }),
}).passthrough().superRefine((data, ctx) => {
  if (data.updated && data.updated < data.date) ctx.addIssue({ code: "custom", message: "updated anterior a date" });
  if (Boolean(data.reviewedBy) !== Boolean(data.reviewedAt)) ctx.addIssue({ code: "custom", message: "reviewedBy y reviewedAt deben indicarse juntos" });
});
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    kind: z.enum(["index", "article"]).default("article"),
    title: z.string().min(1), description: z.string().min(1),
    meta_title: z.string().optional(), image: z.string().optional(), category: z.string().optional(), featured: z.boolean().optional(),
    date: z.coerce.date().optional(), updated: z.coerce.date().optional(),
    author: z.object({ name: z.string().min(1), designation: z.string().optional() }).optional(),
    reviewedBy: z.string().optional(), reviewedAt: z.coerce.date().optional(),
    sources: z.array(z.object({ title: z.string().min(1), url: z.string().url() })).default([]),
    related: z.array(z.string().startsWith("/")).default([]), draft: z.boolean().default(false),
  }).catchall(z.any()).superRefine((data, ctx) => {
    if (data.kind !== "index" && !data.draft && (!data.date || !data.author)) ctx.addIssue({ code: "custom", message: "Un artículo publicado requiere date y author" });
    if (data.updated && data.date && data.updated < data.date) ctx.addIssue({ code: "custom", message: "updated anterior a date" });
    if (Boolean(data.reviewedBy) !== Boolean(data.reviewedAt)) ctx.addIssue({ code: "custom", message: "reviewedBy y reviewedAt deben indicarse juntos" });
  }),
});
const guidesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/guides" }),
  schema: editorialSchema,
});

// Contact collection
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({}).catchall(z.any()),
});

// Features collection
const featuresCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/features" }),
  schema: z.object({}).catchall(z.any()),
});

// Pages collection
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({}).catchall(z.any()),
});

// Pricing collection
const pricingCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pricing" }),
  schema: z.object({}).catchall(z.any()),
});

// Sections collection
const sectionsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/sections" }),
  schema: z.object({}).catchall(z.any()),
});

const practicesCollection = defineCollection({
 loader: glob({ pattern: "*.json", base: "src/content/practices" }),
 schema: z.object({ slug: z.string(), title: z.string(), product: z.enum(["admision", "estandarizadas"]), intro: z.string(), example: z.string(), questions: z.array(z.object({id: z.string(), prompt: z.string(), answer: z.string(), options: z.array(z.object({id: z.string(), text: z.string(), explanation: z.string()})).min(2)})).length(5) }).superRefine((data, ctx) => {
 if (new Set(data.questions.map(q => q.id)).size !== data.questions.length) ctx.addIssue({code: "custom", message: "Preguntas duplicadas"});
 for (const q of data.questions) if (!q.options.some(o => o.id === q.answer) || new Set(q.options.map(o => o.id)).size !== q.options.length) ctx.addIssue({code: "custom", message: "Alternativas inválidas"});
 }),
});
// Export collections
export const collections = {
  practices: practicesCollection,
  homepage: homepageCollection,
  about: aboutCollection,
  changelog: changelogCollection,
  blog: blogCollection,
  guides: guidesCollection,
  contact: contactCollection,
  features: featuresCollection,
  pages: pagesCollection,
  pricing: pricingCollection,
  sections: sectionsCollection,
};
