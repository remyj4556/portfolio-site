export type Site = {
  name: string;                         // full name: hero h1, footer, <title>
  firstName: string;                    // header logo
  role: string;                         // static role line in hero, <title>
  description: string;                  // meta / OG description (~150 chars)
  typedPhrases: [string, ...string[]];  // non-empty, looped in hero
  intro: string;                        // hero paragraph
  resumePath: `/${string}.pdf`;         // file in public/
  resumeSourceUrl: string;              // raw PDF URL fetched into resumePath at build time
  email: string;
  linkedinUrl: string;                  // full URL
  githubUsername: string;
  siteUrl: string;                      // no trailing slash
  sourceRepoUrl: string;
};

export type Project = {
  id: string;               // unique; lowercase letters, digits, hyphens; used as React key and in element ids
  title: string;
  summary: string;          // shown collapsed
  tech: string[];
  image?: { src: string; alt: string };   // 1200×750 WebP in public/projects/, ≤150KB
  displayUrl?: string;      // shown in the browser-frame bar
  links?: { source?: string; demo?: string };
  problem: string;
  contribution: string;
  outcome: string;
  highlights?: string[];
};
