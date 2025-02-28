"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Github,
  Linkedin,
  Facebook,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Separator from "@/components/ui/separator";

export default function Home() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [, setShowPopup] = useState(false);
  const isBrowser = typeof window !== "undefined";

  const projects = [
    {
      title: "MVBDC Company Profile",
      description:
        "Successfully designed and deployed a professional website meeting all client requirements and specifications.",
      link: "https://www.mightyvictorbuildersdevelopmentcorp.com/",
    },
    {
      title: "Fairpoint Accounting",
      description:
        "Developed and launched a custom web solution incorporating modern design principles and optimal performance.",
      link: "https://fairpointca.com/",
    },
    {
      title: "PCL e-Learning Academy",
      description: "Launched a free e-Learning System for an Academy.",
      link: "https://e-learning-academy.vercel.app/",
    },
    {
      title: "Iyen VPN",
      description:
        "Successfully Developed and Launched a VPN e-commerce system for a client.",
      link: "https://iyenn-vpn.vercel.app/",
    },
  ];

  const certificates = [
    { name: "CISCO CCNA 1", date: "2023" },
    { name: "CISCO CCNA 2", date: "2024" },
    { name: "CISCO CCNA 3", date: "2024" },
    { name: "CISCO CCNA 4", date: "2024" },
    { name: "Embedded Systems Certification", date: "2024" },
  ];

  const experiences = [
    {
      company: "Freelance Web Developer",
      role: "Full Stack Developer",
      period: "2024 - Present",
      description: "Developing and maintaining websites for various clients.",
    },
    {
      company: "Innovations Solutions and Marketing Corporation",
      role: "System Networking - Mikrotiks",
      period: "January 2025 - Present",
      description:
        "Maintining and Developing a System that is used for Mikrotiks.",
    },
    {
      company: "University of Batangas - Batangas City",
      role: "Programmer",
      period: "2022 - Present",
      description:
        "Leading teams in developing innovative engineering solutions.",
    },
  ];

  // Open Calendly popup when the dialog is opened
  const handleOpenCalendly = () => {
    setIsCalendlyOpen(true);
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">Programming</span>
            </Link>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Updated with Clark's style */}
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] items-start mb-16">
          <div className="space-y-6">
            <div className="flex flex-col-reverse md:flex-row gap-6 items-start">
              <div className="space-y-4 flex-1">
                <h1 className="text-4xl font-bold">Hi, I&apos;m Victor 👋</h1>
                <p className="text-xl text-muted-foreground">
                  Full Stack Web Developer & Computer Engineer
                </p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>21 years old</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+63 993 176 3036</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>roxas.vctr@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Tanauan City, Batangas, Philippines</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleOpenCalendly}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book a Meeting
                  </Button>
                  <Link
                    href="https://github.com/kenny-programmer/"
                    target="_blank"
                  >
                    <Button variant="outline" size="icon">
                      <Github className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/victor-roxas-jr-933a20336/"
                    target="_blank"
                  >
                    <Button variant="outline" size="icon">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="https://facebook.com/vicqttt/" target="_blank">
                    <Button variant="outline" size="icon">
                      <Facebook className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary">
                <Image
                  src="/img/me.png"
                  alt="Profile Picture"
                  width={256}
                  height={256}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* About Section */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-semibold">
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <p className="text-muted-foreground mb-4">
                  I am a Computer Engineering student at the University of
                  Batangas - Batangas City Campus, passionate about creating
                  innovative solutions through programming and technology. With
                  expertise in both software development and hardware
                  engineering, I bring a unique perspective to every project.
                </p>
                <p className="text-muted-foreground">
                  My experience includes successfully deploying websites for
                  clients, working with embedded systems, and maintaining a
                  strong academic foundation in computer engineering principles.
                  I am constantly learning and adapting to new technologies to
                  stay at the forefront of the industry.
                </p>
              </CardContent>
            </Card>

            {/* Work Experience - New section inspired by Clark's design */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-semibold">
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="relative pl-6 border-l-2 border-muted pb-6 last:pb-0"
                    >
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1" />
                      <div>
                        <h3 className="font-semibold">{exp.company}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exp.role}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exp.period}
                        </p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Educational Background */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-semibold">
                  Educational Background
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-muted pb-6">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1" />
                    <div>
                      <h3 className="font-semibold">
                        University of Batangas - Batangas City
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Bachelor of Science in Computer Engineering
                      </p>
                      <p className="text-sm text-muted-foreground">
                        2021 - 2025
                      </p>
                      <p className="text-sm mt-1">
                        Focusing on both software development and hardware
                        engineering with a strong foundation in computer science
                        principles.
                      </p>
                    </div>
                  </div>
                  <div className="relative pl-6 border-l-2 border-muted pb-0">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1" />
                    <div>
                      <h3 className="font-semibold">Relevant Coursework</h3>
                      <ul className="text-sm mt-1 space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Data Structures and Algorithms</li>
                        <li>Computer Networks</li>
                        <li>Embedded Systems Design</li>
                        <li>Web Development</li>
                        <li>Database Management Systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Skills Badges - Inspired by Clark's design */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-semibold">Skills</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="flex flex-wrap gap-2">
                  <Badge>TypeScript</Badge>
                  <Badge>JavaScript</Badge>
                  <Badge>C</Badge>
                  <Badge>C#</Badge>
                  <Badge>C++</Badge>
                  <Badge>Python</Badge>
                  <Badge>React.js</Badge>
                  <Badge>Next.js</Badge>
                  <Badge>HTML/CSS</Badge>
                  <Badge>React</Badge>
                  <Badge>Arduino</Badge>
                  <Badge>Raspberry Pi</Badge>
                  <Badge>Orange Pi</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-semibold">
                  Client Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="space-y-2">
                      <Link
                        href={project.link}
                        target="_blank"
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {project.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      {index < projects.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-semibold">
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-2">
                  {certificates.map((cert, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{cert.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {cert.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialog that will show Calendly */}
      <Dialog open={isCalendlyOpen} onOpenChange={setIsCalendlyOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-4xl lg:max-w-4xl xl:max-w-5xl h-3/4">
          <DialogHeader>
            <DialogTitle>Schedule a Meeting</DialogTitle>
            <DialogDescription>
              Choose a convenient time for us to discuss your project needs.
            </DialogDescription>
          </DialogHeader>

          {/* Calendly iframe integrated directly in the dialog */}
          {isBrowser && (
            <div className="w-full h-full min-h-[500px]">
              <iframe
                src="https://calendly.com/roxas-vctr/"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Calendly Scheduling"
                className="rounded-lg min-h-[500px]"
              ></iframe>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
