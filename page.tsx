"use client"

import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Facebook, Mail, Phone, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Award } from "lucide-react"

export default function Home() {
  // Add Calendly widget script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">Computer Engineer</h1>
                <h2 className="text-3xl font-semibold text-gray-900">Full Stack Developer</h2>
                <p className="text-lg text-gray-600 max-w-lg">
                  Passionate about creating innovative solutions through technology and engineering. Specializing in web
                  development and embedded systems.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="#contact">Contact Me</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#projects">View Projects</Link>
                </Button>
              </div>
              <div className="flex gap-4">
                <Link href="https://github.com" className="text-gray-600 hover:text-gray-900">
                  <Github className="h-6 w-6" />
                </Link>
                <Link href="https://linkedin.com" className="text-gray-600 hover:text-gray-900">
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="https://facebook.com" className="text-gray-600 hover:text-gray-900">
                  <Facebook className="h-6 w-6" />
                </Link>
              </div>
            </div>
            <div className="relative aspect-square w-full max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50"></div>
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Profile Picture"
                width={400}
                height={400}
                className="relative rounded-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Academic Background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Bachelor of Science in Computer Engineering</h3>
                  <p className="text-gray-600">University of Batangas - Batangas City Campus</p>
                  <p className="text-sm text-gray-500">2020 - Present</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Relevant Coursework:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Digital Systems Design</li>
                    <li>Computer Architecture</li>
                    <li>Embedded Systems</li>
                    <li>Software Engineering</li>
                    <li>Network Programming</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Professional Summary</CardTitle>
                <CardDescription>Experience & Expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  A dedicated Computer Engineering student with a strong foundation in both hardware and software
                  development. Experienced in creating full-stack web applications and working with embedded systems.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Key Achievements:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Successfully deployed 2 client websites</li>
                    <li>Proficient in multiple programming languages</li>
                    <li>Experience with embedded systems (Arduino, Raspberry Pi)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Skills</h2>
          <Tabs defaultValue="web" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="web">Web Development</TabsTrigger>
              <TabsTrigger value="programming">Programming</TabsTrigger>
              <TabsTrigger value="embedded">Embedded Systems</TabsTrigger>
            </TabsList>
            <TabsContent value="web" className="space-y-4">
              {webSkills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} />
                </div>
              ))}
            </TabsContent>
            <TabsContent value="programming" className="space-y-4">
              {programmingSkills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} />
                </div>
              ))}
            </TabsContent>
            <TabsContent value="embedded" className="space-y-4">
              {embeddedSkills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Certificates Section - Add this before Projects section */}
      <section id="certificates" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Certifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle>{cert.name}</CardTitle>
                      <CardDescription>{cert.issuer}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{cert.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{cert.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section - Updated with Dialog */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video relative rounded-lg overflow-hidden">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-gray-600 line-clamp-2">{project.description}</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{project.title}</DialogTitle>
                    <DialogDescription>{project.type}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-gray-600">{project.description}</p>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Key Features:</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {project.features?.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={project.link} className="flex items-center justify-center gap-2">
                        Visit Website
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Updated with Calendly */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="max-w-xl mx-auto">
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <span>your.email@example.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <span>+63 XXX XXX XXXX</span>
                </div>
                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="https://linkedin.com" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Link>
                  </Button>
                  <Button
                    onClick={() => {
                      // @ts-ignore
                      if (typeof Calendly !== "undefined") {
                        // @ts-ignore
                        Calendly.initPopupWidget({
                          url: "https://calendly.com/YOUR_USERNAME",
                        })
                      } else {
                        console.error("Calendly is not defined. Ensure the script is loaded.")
                      }
                    }}
                    variant="outline"
                  >
                    Schedule a Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}

// Previous data constants remain the same, adding new ones:

const certificates = [
  {
    name: "CISCO Networking Academy - Level 1",
    issuer: "Cisco",
    description:
      "Fundamentals of networking, including network protocols, TCP/IP, and basic network security concepts.",
    date: "2023",
  },
  {
    name: "CISCO Networking Academy - Level 2",
    issuer: "Cisco",
    description: "Advanced networking concepts, routing protocols, and network administration.",
    date: "2023",
  },
  {
    name: "CISCO Networking Academy - Level 3",
    issuer: "Cisco",
    description: "Enterprise networking, security, and automation.",
    date: "2023",
  },
  {
    name: "Embedded Systems Certification",
    issuer: "University of Batangas",
    description: "Comprehensive training in embedded systems design, programming, and implementation.",
    date: "2023",
  },
]

// Update the projects constant with more details
const projects = [
  {
    title: "Client Website 1",
    type: "Web Development",
    description:
      "A professional website developed for a client using modern web technologies. Features include responsive design, dynamic content management, and optimized performance.",
    image: "/placeholder.svg?height=300&width=400",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
    features: [
      "Responsive design for all devices",
      "Dynamic content management system",
      "SEO optimized",
      "Fast loading times",
      "Interactive UI components",
    ],
    link: "#",
  },
  {
    title: "Client Website 2",
    type: "Web Development",
    description:
      "Another successful client project showcasing full-stack development capabilities. Implemented modern design principles and advanced functionality.",
    image: "/placeholder.svg?height=300&width=400",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB"],
    features: [
      "User authentication system",
      "Real-time data updates",
      "Custom admin dashboard",
      "Advanced search functionality",
      "Performance optimization",
    ],
    link: "#",
  },
]

const webSkills = [
  { name: "HTML", level: 90 },
  { name: "CSS", level: 85 },
  { name: "JavaScript", level: 80 },
  { name: "React", level: 75 },
  { name: "Next.js", level: 70 },
  { name: "Tailwind CSS", level: 80 },
]

const programmingSkills = [
  { name: "C", level: 70 },
  { name: "C++", level: 65 },
  { name: "Python", level: 80 },
  { name: "Java", level: 75 },
  { name: "TypeScript", level: 70 },
]

const embeddedSkills = [
  { name: "Arduino", level: 80 },
  { name: "Raspberry Pi", level: 75 },
  { name: "Microcontrollers", level: 70 },
  { name: "Circuit Design", level: 65 },
]

