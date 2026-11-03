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

// Blog collection
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({}).catchall(z.any()),
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
  contact: contactCollection,
  features: featuresCollection,
  pages: pagesCollection,
  pricing: pricingCollection,
  sections: sectionsCollection,
};
