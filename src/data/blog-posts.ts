/**
 * Single source of truth for all blog posts.
 * No filesystem or MDX — everything in one file for reliable builds.
 */

export type BlogPost = {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
  };
  source: string; // HTML content
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "hello-world",
    metadata: {
      title: "Hello World — My Blog",
      publishedAt: "2026-02-23",
      summary: "A single place for my thoughts on software, building dynamic web experiences, and real-world projects.",
    },
    source: `
<p>Welcome. This blog brings together everything I write about: from static vs dynamic sites and Next.js, to taming data with TypeScript, APIs, and turning ideas into real products.</p>
<p>You’ll find the full <strong>Beyond the Static</strong> series here (from “The Problem with Static” through “From Concept to Reality”), plus updates on deployment, Web3, and security. All in one place, no separate files — just one compiled view of what I’m building and learning.</p>
<p>Thanks for reading.</p>
`.trim(),
  },
  // ——— Beyond the Static series ———
  {
    slug: "beyond-static-problem-with-static",
    metadata: {
      title: "The Problem with Static – When HTML/CSS Just Isn't Enough",
      publishedAt: "2026-02-19",
      summary: "Why pure HTML/CSS falls short for dynamic content, user interaction, and data—and why modern sites need more.",
    },
    source: `
<p>Many businesses start with a beautiful, static website. But what happens when they need to <em>do</em> something?</p>
<h2>When Static Isn't Enough</h2>
<p>Pure HTML and CSS are great for structure and style. The limitations show up when you need <strong>dynamic content</strong>, <strong>real user interaction</strong>, or <strong>data processing</strong>. Common pain points include:</p>
<ul>
<li><strong>Non-functional forms</strong> – Submissions that go nowhere or break in the browser</li>
<li><strong>Manual updates</strong> – Every change means editing files and redeploying</li>
<li><strong>No personalization</strong> – The same page for everyone, no way to tailor the experience</li>
</ul>
<h2>Why Dynamic Matters</h2>
<p>Modern online presence isn't just about looking good. Users expect sites that respond, remember, and connect to real data. That's where the idea of <strong>dynamic websites</strong> becomes crucial: they can react to user input, load fresh data, and adapt without a full manual overhaul.</p>
<hr />
<p><em>Is your website working for you, or just sitting there? Find out in the next post how modern frameworks bridge this gap.</em></p>
`.trim(),
  },
  {
    slug: "beyond-static-enter-nextjs",
    metadata: {
      title: "Enter Next.js – The Powerhouse for Modern Front-Ends",
      publishedAt: "2026-02-20",
      summary: "How Next.js delivers performance, great DX, and scalability for interactive, fast user interfaces.",
    },
    source: `
<p>We talked about static limitations. So, what's the solution for building interactive, lightning-fast user interfaces?</p>
<h2>Next.js: A Leading React Framework</h2>
<p>Next.js has become a go-to for production React apps. Here's what it brings to the table:</p>
<h3>Performance</h3>
<ul>
<li><strong>Server-Side Rendering (SSR)</strong> – Pages are rendered on the server, so users get content fast and SEO-friendly.</li>
<li><strong>Static Site Generation (SSG)</strong> – Pre-build pages at build time for maximum speed and low server load.</li>
</ul>
<h3>Developer Experience</h3>
<ul>
<li><strong>File-system routing</strong> – Folders and files map directly to routes; no manual route config.</li>
<li><strong>API routes</strong> – Back-end endpoints live in the same project, so you can add server logic without a separate service.</li>
<li><strong>Easy deployment</strong> – One-click deploys to platforms like Vercel and Netlify.</li>
</ul>
<h3>Scalability</h3>
<p>Next.js is built for growth. You can start with a few pages and scale to complex applications without rewriting the foundation.</p>
<hr />
<p>Next.js is powerful, but what about managing complex data efficiently? We'll dive into that next.</p>
`.trim(),
  },
  {
    slug: "beyond-static-taming-data",
    metadata: {
      title: "Taming Data: Why Structured Data (and TypeScript) is Your Best Friend",
      publishedAt: "2026-02-21",
      summary: "How structured data and TypeScript keep complex apps consistent, error-free, and maintainable.",
    },
    source: `
<p>Building interactive apps means dealing with data. But messy data can be a nightmare.</p>
<h2>The Case for Structured Data</h2>
<p>For anything beyond a trivial app, a <strong>well-defined data schema</strong> matters. Even a local setup—like a single <code>data.ts</code> file—gives you:</p>
<ul>
<li><strong>Consistency</strong> – Same shape everywhere, no guessing.</li>
<li><strong>Fewer bugs</strong> – Invalid or missing fields get caught early.</li>
<li><strong>Smoother development</strong> – Refactors and new features are safer and faster.</li>
</ul>
<h2>Why TypeScript Fits In</h2>
<p>TypeScript turns that structure into something the editor and compiler understand:</p>
<ul>
<li><strong>Type safety</strong> – Typos and wrong types surface before runtime.</li>
<li><strong>Readability</strong> – Types document what each function expects and returns.</li>
<li><strong>Early error detection</strong> – Many mistakes are caught at build time instead of in production.</li>
</ul>
<p>In real projects, precise data is critical—whether it's toll fees, product catalogs, or user records. Getting the data model right pays off in maintainability and fewer surprises.</p>
<hr />
<p>Data is organized, the UI is responsive… but how do we connect it all and make things happen? Next, we'll talk about the glue: APIs.</p>
`.trim(),
  },
  {
    slug: "beyond-static-api-ecosystem",
    metadata: {
      title: "The API Ecosystem: Connecting the Pieces for Seamless Functionality",
      publishedAt: "2026-02-22",
      summary: "What APIs are, why they matter, and how they power data, email, auth, and more in your apps.",
    },
    source: `
<p>Your front-end needs to talk to the outside world—whether it's sending emails or fetching data. That's where APIs come in.</p>
<h2>What Are APIs?</h2>
<p>Think of an API like a waiter: you send a request (your order), and the kitchen (the server) prepares a response (your food). APIs are the standard way for your app to request or send data to other services.</p>
<h3>A Quick Look at REST</h3>
<p>REST APIs use familiar HTTP methods (GET, POST, etc.) and URLs. You call an endpoint, get back JSON (or other formats), and use it in your UI. Simple and widely supported.</p>
<h3>Where APIs Show Up</h3>
<ul>
<li><strong>Data fetching</strong> – Load content from a CMS, database, or third-party service.</li>
<li><strong>Sending emails</strong> – e.g. with services like EmailJS from the client or via your own backend.</li>
<li><strong>User authentication</strong> – Log in, tokens, and session handling.</li>
<li><strong>Payments</strong> – Stripe, PayPal, and others expose APIs your app can call.</li>
</ul>
<p>APIs give you <strong>modularity</strong>: you don't have to build everything yourself. They also <strong>extend</strong> what your app can do—from "show this page" to "send this form," "fetch that data," or "charge this card."</p>
<hr />
<p>We've covered the tech. Next, we'll bring it all together and see how these pieces build real-world solutions that tackle common problems.</p>
`.trim(),
  },
  {
    slug: "beyond-static-concept-to-reality",
    metadata: {
      title: "From Concept to Reality: Solving Real-World Problems with Full-Stack Development",
      publishedAt: "2026-02-23",
      summary: "How Next.js, TypeScript, structured data, and APIs combine in real projects—with concrete examples.",
    },
    source: `
<p>We've explored the tools. Now, let's see how they combine to solve actual challenges.</p>
<h2>Bringing It All Together</h2>
<p>The real test of a stack is whether it delivers <strong>tangible value</strong>. Here's how the pieces we discussed—Next.js, TypeScript, structured data, and APIs—show up in real projects.</p>
<h3>Case Study: Luzon Toll</h3>
<p>In the absence of a convenient public API for toll data, a focused utility was built using:</p>
<ul>
<li><strong>Next.js</strong> for the app shell and routing</li>
<li><strong>TypeScript</strong> and <strong>structured data</strong> so toll rates and routes are consistent and type-safe</li>
</ul>
<p>The result: a needed tool that fills a gap when official or public APIs aren't available.</p>
<h3>Case Study: M&G Telemarketing</h3>
<p>A static, broken site was turned into a <strong>functional lead-generation machine</strong>:</p>
<ul>
<li><strong>Next.js</strong> for a fast, maintainable front-end</li>
<li><strong>EmailJS</strong> (and API integration) so form submissions become real leads instead of dead ends</li>
</ul>
<p>The site went from "just sitting there" to actively working for the business.</p>
<h2>The Mindset That Matters</h2>
<p>It's not just about using technologies—it's about <strong>applying them strategically</strong>. That means:</p>
<ul>
<li>Identifying real problems (forms that don't work, missing data, poor UX)</li>
<li>Choosing the right tools (framework, types, APIs)</li>
<li>Delivering end-to-end solutions that users and businesses can rely on</li>
</ul>
<hr />
<p>Ready to transform your ideas into dynamic, functional web solutions? Let's connect and build something impactful together.</p>
`.trim(),
  },
  // ——— Weekly / project updates ———
  {
    slug: "dec-25-week-1",
    metadata: {
      title: "The Netlify & TanStack Debug",
      publishedAt: "2025-12-07",
      summary: "Resolving async-workloads-router 404 issues on Netlify and refining deployment pipelines.",
    },
    source: `
<h2>Focus: Deployment and Routing Architecture</h2>
<p>Many developers run into hurdles when taking their applications from local environments to the edge.</p>
<h3>Milestone</h3>
<p>Resolving the <code>async-workloads-router</code> 404 issues on Netlify.</p>
<h3>Key Work</h3>
<p>Troubleshooting the PrecisionCode build process and refining <code>netlify.toml</code> for serverless function stability. This was a crucial first step in laying down a robust infrastructure for our product, proving that early attention to infrastructure prevents bugs later on.</p>
`.trim(),
  },
  {
    slug: "dec-25-week-2",
    metadata: {
      title: "Deep Dive into TanStack Start",
      publishedAt: "2025-12-14",
      summary: "Mastering the TanStack Start file-based routing and metadata handling.",
    },
    source: `
<h2>Focus: Full-stack React Patterns</h2>
<p>As our application expanded, we needed a scalable way to handle routing and SEO properly.</p>
<h3>Milestone</h3>
<p>Mastering the TanStack Start file-based routing and metadata handling.</p>
<h3>Key Work</h3>
<p>Implementing dynamic SEO tags and optimizing asset loading for faster initial paints. By leveraging modern routing paradigms, we were able to deliver a highly performant and SEO-friendly user experience right out of the gate.</p>
`.trim(),
  },
  {
    slug: "dec-25-week-3",
    metadata: {
      title: "Refining Deployment Pipelines",
      publishedAt: "2025-12-21",
      summary: "Standardizing the build environment between local development and Netlify branch deploys.",
    },
    source: `
<h2>Focus: Environment Consistency</h2>
<p>The worst feeling in development is "it works on my machine" but fails in production.</p>
<h3>Milestone</h3>
<p>Standardizing the build environment between local development and Netlify branch deploys.</p>
<h3>Key Work</h3>
<p>Cleaning up environment variable leaks and ensuring the <code>dist</code> folder mapped correctly to Netlify's edge. Ensuring pure consistency meant we could deploy confidently moving forward seamlessly without disruptions.</p>
`.trim(),
  },
  {
    slug: "dec-25-week-4",
    metadata: {
      title: "Transitioning to DApp Logic",
      publishedAt: "2025-12-28",
      summary: "Initial research into Substrate and the Unit Network ecosystem.",
    },
    source: `
<h2>Focus: Blockchain Integration Basics</h2>
<p>With our foundation solid, it was time to move into Web3 territory.</p>
<h3>Milestone</h3>
<p>Initial research into Substrate and the Unit Network ecosystem.</p>
<h3>Key Work</h3>
<p>Exploring how to bridge standard React states with on-chain data. We needed a frictionless way to expose decentralized interactions directly to end users without confusing them, marking our first true steps into DApp territory.</p>
`.trim(),
  },
  {
    slug: "jan-26-week-1",
    metadata: {
      title: "Unit Predict – The Vision",
      publishedAt: "2026-01-04",
      summary: "Finalizing the Maya's First Bet storyboard and designing wireframes.",
    },
    source: `
<h2>Focus: User Experience & Storyboarding</h2>
<p>Building a Web3 application shouldn't mean sacrificing UI/UX.</p>
<h3>Milestone</h3>
<p>Finalizing the "Maya's First Bet" storyboard.</p>
<h3>Key Work</h3>
<p>Creating wireframes for both Desktop and Mobile views to ensure a seamless betting experience. By storyboarding the exact flow of user interaction, we laid out the foundation for intuitive blockchain involvement without the typical intimidating learning curves.</p>
`.trim(),
  },
  {
    slug: "jan-26-week-2",
    metadata: {
      title: "Unit Predict – Development & Auth",
      publishedAt: "2026-01-11",
      summary: "Implementing the Substrate Keyring for secure user authentication.",
    },
    source: `
<h2>Focus: Secure Onboarding</h2>
<p>Onboarding Web3 users requires ironing out the authentication edge-cases that don't exist in traditional Web2.</p>
<h3>Milestone</h3>
<p>Fixing the "Gibberish Login" bug and unifying the registration flow.</p>
<h3>Key Work</h3>
<p>Implementing the Substrate Keyring for secure user authentication within the DApp. Security met usability here, as we managed to stabilize wallet integrations that directly interacted with our core interface.</p>
`.trim(),
  },
  {
    slug: "jan-26-week-3",
    metadata: {
      title: "Unit AI – Integration Phase",
      publishedAt: "2026-01-18",
      summary: "Successfully porting the useExtrinsic hook to the Unit AI project.",
    },
    source: `
<h2>Focus: AI meets Blockchain</h2>
<p>Two of the biggest tech trends collided in Unit AI.</p>
<h3>Milestone</h3>
<p>Successfully porting the <code>useExtrinsic</code> hook to the Unit AI project.</p>
<h3>Key Work</h3>
<p>Merging core branches and building the off-chain processor to handle Substrate events for AI tasks. This marked a monumental step as smart contracts effectively started feeding and responding to off-chain models directly.</p>
`.trim(),
  },
  {
    slug: "jan-26-week-4",
    metadata: {
      title: "The Framework Leap",
      publishedAt: "2026-01-25",
      summary: "Upgrading the entire stack to Next.js v16 and Tailwind CSS v4.",
    },
    source: `
<h2>Focus: Modernization</h2>
<p>In order to scale effectively globally, we needed to adopt bleeding-edge tools while dealing with aggressive legacy migrations.</p>
<h3>Milestone</h3>
<p>Upgrading the entire stack to Next.js v16 and Tailwind CSS v4.</p>
<h3>Key Work</h3>
<p>Managing complex merge conflicts and implementing i18n (internationalization) for global accessibility. While refactoring was taxing, standardizing onto modern frameworks paid massive dividends rapidly.</p>
`.trim(),
  },
  {
    slug: "feb-26-week-1",
    metadata: {
      title: "The Security Audit",
      publishedAt: "2026-02-01",
      summary: "Drafting the '6 Major Problems' report for the Main App.",
    },
    source: `
<h2>Focus: Vulnerability Identification</h2>
<p>With great utility comes tremendous necessity for security against exploits.</p>
<h3>Milestone</h3>
<p>Drafting the "6 Major Problems" report for the Main App.</p>
<h3>Key Work</h3>
<p>Identifying critical JWT data leaks and missing API authentication layers. Uncovering these proactively allowed us to map out a concrete pathway to an enterprise-grade secure environment.</p>
`.trim(),
  },
  {
    slug: "feb-26-week-2",
    metadata: {
      title: "Production Hardening",
      publishedAt: "2026-02-15",
      summary: "Shipping critical security patches to production to handle abuse.",
    },
    source: `
<h2>Focus: Deployment of Fixes</h2>
<p>After identifying the key vulnerabilities, we rolled out immediate implementations.</p>
<h3>Milestone</h3>
<p>Shipping critical security patches (Issues #1, #3, #4, and #6) to production.</p>
<h3>Key Work</h3>
<p>Implementing Rate Limiting to prevent API abuse and finalizing the encrypted session architecture. With the vulnerabilities patched, our infrastructure runs more predictably and securely than ever.</p>
`.trim(),
  },
];
