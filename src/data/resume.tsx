import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Victor Roxas",
  initials: "VR",
  url: "https://victorroxas.vercel.app",
  location: "Tanauan City, Batangas, Philippines",
  locationLink: "https://www.google.com/maps/place/sanfrancisco",
  description:
    "Computer Engineer passionate about software development and hardware engineering.",
  summary:
    "I'm graduating with my Computer Engineering degree from the University of Batangas in September 2025. Over the past few years, I've built websites for clients, worked on embedded systems, and developed a strong foundation in both software and hardware.\n\nI'm passionate about coding and always eager to learn new tools to keep growing as a developer. Outside of coding, I love taking on new challenges—whether it's a side project or exploring how technology can solve real-world problems.",
  avatarUrl: "/me.jpg",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Javascript",
    "TailwindCSS",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "MySQL",
    "HTML/CSS",
    "Git",
    "PostgreSQL",
    "HTML/CSS",
  ],
  // Rest of the DATA object remains the same
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "roxas.vctr@gmail.com",
    tel: "+639054238524",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/kenny-programmer/",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/victor-roxas/",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/kennyyafterhrs",
        icon: Icons.x,
        navbar: true,
      },
      Youtube: {
        name: "Youtube",
        url: "https.://www.youtube.com/",
        icon: Icons.youtube,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:roxas.vctr@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
      resume: {
        name: "Resume",
        url: "https://drive.google.com/file/d/1zgtA3jK-Y9A3TiFOgcE0n9nUcCA2Yi2B/view?usp=sharing",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  work: [
    {
      company: "Mechtric",
      href: "https://www.mechtric.com.au/",
      badges: [],
      location: "Sydney, Australia",
      title: "Web & Digital Designer – eCommerce & CMS - Freelance",
      logoUrl: "/mechtric.png",
      start: "August 2025",
      end: "August 2025",
      description:
        "Developed a fully customizable Media Banner Widget for their BigCommerce website, programmed in JSON, enabling seamless integration of any media type and ensuring dynamic responsiveness across the site. This innovation provided greater website flexibility and reduced manual adjustments. Additionally, redesigned their website using Figma and UI/UX best practices, which elevated the brand’s digital presence, improved user experience, and boosted customer engagement.",
    },
    {
      company: "Innovations Solutions and Marketing Corporation",
      href: "https://ismc.amitechco.solutions/",
      badges: [],
      location: "Las Piñas City, Philippines",
      title: "Network Engineer - Internship",
      logoUrl: "/ismc.png",
      start: "January 2025",
      end: "May 2025",
      description:
        "Maintained and troubleshot network devices such as routers, switches, and firewalls. Configured and managed network protocols such as OSPF, BGP, and EIGRP. Assisted in the design and implementation of network infrastructure for various clients. Also developed a system to use in Piso WiFi using PHP, HTML/CSS, and Javascript.",
    },
    {
      company: "Fairpoint Consulting and Accounting Services",
      badges: [],
      href: "https://fairpointca.com/",
      location: "Remote/Freelance",
      title: "Fullstack Web Developer - Freelance",
      logoUrl: "/shopify.png",
      start: "November 2024",
      end: "January 2025",
      description:
        "Developed a web application for a client using Next.js, Typescript, and TailwindCSS. The application is a application for a client to manage their accounting and consulting services. The application includes features such as user authentication, data visualization, and reporting. I also integrated the application with various third-party APIs such as Calendly and Supabase.",
    },
    {
      company: "MVBDC",
      href: "https://www.mightyvictorbuildersdevelopmentcorp.com/",
      badges: [],
      location: "Remote/Freelance",
      title: "Fullstack Web Developer - Freelance",
      logoUrl: "/nvidia.png",
      start: "January 2024",
      end: "April 2024",
      description:
        "Developed a company profile for a client who owns a construction company. The application is a web application that allows the client to manage their projects and clients. The application includes features such as user authentication, data visualization, and reporting. I developed the application using Web Builder, Wix with React Framework.",
    },
  ],
  education: [
    {
      school: "University of Batangas - Batangas City",
      href: "https://www.ub.edu.ph/",
      degree: "Bachelor's Degree of Computer Engineering (BSCpE)",
      logoUrl: "/buildspace.jpg",
      start: "2021",
      end: "2025",
    },
    {
      school: "La Consolacion College of Tanauan",
      href: "https://lcctanauan.edu.ph/",
      degree:
        "Technical Vocational - Information and Commucations Technology (TVL-ICT)",
      logoUrl: "/waterloo.png",
      start: "2019",
      end: "2021",
    },
    {
      school: "Tanauan City National High School",
      href: "https://www.facebook.com/DepEdTayoTCIHS321601/",
      degree: "High School Diploma",
      logoUrl: "/laurier.png",
      start: "2015",
      end: "2019",
    },
  ],
  projects: [
    {
      title: "Faipoint Accounting",
      href: "https://fairpointca.com",
      dates: "Dec 2024 - Present",
      active: true,
      description:
        "Fairpoint Consulting and Accounting provides tailored tax, accounting, and advisory services to help businesses stay compliant, optimize finances, and grow sustainably. They also offer free tax deadline reminders.",
      technologies: [
        "Next.js",
        "Typescript",
        "React",
        "PostgreSQL",
        "TailwindCSS",
        "Shadcn UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://fairpointca.com",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/kenny-programmer/fairpoint",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/fairpoint.png",
      video: "",
    },
    {
      title: "Mighty Victor Builders Development Corporation",
      href: "https://www.mightyvictorbuildersdevelopmentcorp.com",
      dates: "Jan 2024 - Apr 2024",
      active: true,
      description:
        "Mighty Victor Builders Development Corporation is a construction company that specializes in residential and commercial projects. They provide services such as project management, design, and construction.",
      technologies: ["Next.js", "React", "PostgreSQL", "WIX"],
      links: [
        {
          type: "Website",
          href: "https://www.mightyvictorbuildersdevelopmentcorp.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "https://cdn.magicui.design/bento-grid.mp4",
    },
    {
      title: "PCL e-Learning Academy",
      href: "https://e-learning-academy.vercel.app/",
      dates: "April 2023 - September 2023",
      active: true,
      description:
        "PCL e-Learning Academy is an online learning platform that provides courses and resources for students and professionals. It offers a wide range of courses in various fields such as programming, design, and business. The platform is designed to be user-friendly and accessible to everyone.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "TailwindCSS",
        "Shadcn UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://e-learning-academy.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/kenny-programmer/e-learning",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/e-learning.png",
      video: "",
    },
    {
      title: "CK Digitals",
      href: "https://www.ckdigitals.com/",
      dates: "April 2023 - Present",
      active: true,
      description:
        "CK Digitals is a digital marketing agency that specializes in providing online marketing solutions for businesses. They offer services such as social media management, search engine optimization, and web development. The agency aims to help businesses grow their online presence and reach their target audience effectively.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
        "Node.js",
        "PHP",
        "Laravel",
      ],
      links: [
        {
          type: "Website",
          href: "https://www.ckdigitals.com/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/CHlNlTO/ckdigitals",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/ck-digitals.png",
      video: "",
    },
  ],
  hackathons: [
    {
      title: "Breadboarding Competition",
      dates: "December 5th - 6th, 2024",
      location: "Lipa City, Batangas",
      description:
        "Annalyzed and designed a breadboard circuit for a given problem statement. The circuit was designed to solve a problem related to electronics and electrical engineering.",
      image: "/icpep.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    {
      title: "Programming Competition - Python Category",
      dates: "December 1st - 2nd, 2023",
      location: "Biñan City, Laguna",
      description:
        "Created a mobile application that provided a library of interactive bedtime stories for children, including a feature for users to record and share their own narrated stories within the app.",
      image: "/icpep.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    {
      title: "Programming Competition",
      dates: "December 2nd - 3rd, 2022",
      location: "Biñan City, Laguna",
      description:
        "Collaborated with a team to solve algorithmic challenges under time pressure, demonstrating strong problem-solving and teamwork skills.",
      image: "/icpep.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
  ],
} as const;
