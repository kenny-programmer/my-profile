"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Facebook } from "lucide-react";

export function SocialLinks() {
  const links = [
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Facebook, label: "Facebook", href: "#" },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Connect</h2>
      <div className="grid gap-2">
        {links.map((link, index) => (
          <Button key={index} variant="outline" className="w-full" asChild>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              <link.icon className="w-4 h-4 mr-2" />
              {link.label}
            </a>
          </Button>
        ))}
      </div>
    </Card>
  );
}
