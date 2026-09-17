import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    area: z.enum(["ai-gpu", "trustworthy", "quantum"]),
    problem: z.string(),
    proof: z.string(),
    github: z.string().url(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, work };
