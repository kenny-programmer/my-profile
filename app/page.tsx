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
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const isBrowser = typeof window !== "undefined";

  const skills = {
    webDevelopment: [
      { name: "TypeScript", level: 90 },
      { name: "JavaScript", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "HTML/CSS", level: 95 },
    ],
    programming: [
      { name: "C++", level: 90 },
      { name: "C#", level: 80 },
      { name: "C", level: 90 },
      { name: "Python", level: 95 },
    ],
    embeddedSystems: [
      { name: "Arduino", level: 90 },
      { name: "Raspberry Pi", level: 90 },
      { name: "Orange Pi", level: 90 },
    ],
  };

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
  ];

  const certificates = [
    { name: "CISCO CCNA 1", date: "2023" },
    { name: "CISCO CCNA 2", date: "2024" },
    { name: "CISCO CCNA 3", date: "2024" },
    { name: "CISCO CCNA 4", date: "2024" },
    { name: "Embedded Systems Certification", date: "2023" },
  ];

  // Open Calendly popup when the dialog is opened
  const handleOpenCalendly = () => {
    setIsCalendlyOpen(true);
    setShowPopup(true);
  };

  // Close Calendly popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setIsCalendlyOpen(false);
  };

  const SkillCategory = ({
    skills,
  }: {
    skills: { name: string; level: number }[];
  }) => (
    <div className="grid gap-4 md:grid-cols-2">
      {skills.map((skill) => (
        <div key={skill.name} className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">{skill.name}</span>
            <span className="text-muted-foreground">{skill.level}%</span>
          </div>
          <Progress value={skill.level} className="h-2" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header remains the same */}
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
        {/* Hero Section - Updated with Facebook */}
        <section className="mb-16 grid gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold">Victor Roxas Jr.</h1>
            <p className="text-xl text-muted-foreground">
              Full Stack Web Developer & Computer Engineer
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>21 years old</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+63 993 176 3036</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>roxas.vctr@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Tanauan City, Batangas, Philippines</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleOpenCalendly}>
                <Calendar className="mr-2 h-4 w-4" />
                Book a Meeting
              </Button>
              <Link href="https://github.com/kenny-programmer/" target="_blank">
                <Button variant="outline">
                  <Github className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="https://www.linkedin.com/in/victor-roxas-jr-933a20336/"
                target="_blank"
              >
                <Button variant="outline">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://facebook.com/vicqttt/" target="_blank">
                <Button variant="outline">
                  <Facebook className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-primary">
              <Image
                src="/img/me.png"
                alt="Profile Picture"
                width={256}
                height={256}
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* About Section remains the same */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">About Me</h2>
          <Card>
            <CardContent className="p-6">
              <p className="mb-4">
                I am a Computer Engineering student at the University of
                Batangas - Batangas City Campus, passionate about creating
                innovative solutions through programming and technology. With
                expertise in both software development and hardware engineering,
                I bring a unique perspective to every project.
              </p>
              <p>
                My experience includes successfully deploying websites for
                clients, working with embedded systems, and maintaining a strong
                academic foundation in computer engineering principles. I am
                constantly learning and adapting to new technologies to stay at
                the forefront of the industry.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Updated Skills Section with Tabs */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">Technical Skills</h2>
          <Tabs defaultValue="webDevelopment">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="webDevelopment">Web Development</TabsTrigger>
              <TabsTrigger value="programming">Programming</TabsTrigger>
              <TabsTrigger value="embeddedSystems">
                Embedded Systems
              </TabsTrigger>
            </TabsList>
            <TabsContent value="webDevelopment" className="mt-6">
              <SkillCategory skills={skills.webDevelopment} />
            </TabsContent>
            <TabsContent value="programming" className="mt-6">
              <SkillCategory skills={skills.programming} />
            </TabsContent>
            <TabsContent value="embeddedSystems" className="mt-6">
              <SkillCategory skills={skills.embeddedSystems} />
            </TabsContent>
          </Tabs>
        </section>

        {/* Updated Projects Section with Links */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">Client Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <Link key={project.title} href={project.link} target="_blank">
                <Card className="transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Certificates Section remains the same */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">Certifications</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <Card key={cert.name}>
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Completed {cert.date}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
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
