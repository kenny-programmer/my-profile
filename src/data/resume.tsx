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
    "I'm currently wrapping up my degree in Computer Engineering at the University of Batangas – Batangas City Campus, set to graduate this September. Over the past few years, I've built and deployed websites for clients, worked on embedded systems, and developed a strong foundation in both software development and hardware engineering.\n\nWhat excites me most is creating innovative solutions—whether that's through full-stack development or working hands-on with hardware. I'm constantly learning, experimenting, and pushing myself to stay ahead of the curve as I prepare to fully dive into the tech industry.",
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
    "C#",
    "C",
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
        url: "https://drive.google.com/file/d/1tac_T1f08xtms3OD99jPoKvidQnA3V0r/view?usp=sharing",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  work: [
    {
      company: "Innovations Solutions and Marketing Cororation",
      href: "https://ismc.amitechco.solutions/",
      badges: [],
      location: "Las Piñas City, Philippines",
      title: "Network Engineer - Internship",
      logoUrl: "/atomic.png",
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
      title: "Full-Stack Web Developer - Freelance",
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
      title: "Full-stack Web Developer - Freelance",
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
      dates: "Dec 2024 - Jan 2024",
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
      dates: "April 2023 - March 2024",
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
        "Developed a mobile application which delivered bedtime stories to children using augmented reality.",
      image: "/icpep.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    {
      title: "Programming Competition",
      dates: "December 2nd - 3rd, 2022",
      location: "Biñan City, Laguna",
      description:
        "Developed a mobile application which delivered bedtime stories to children using augmented reality.",
      image: "/icpep.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
  ],
} as const;
