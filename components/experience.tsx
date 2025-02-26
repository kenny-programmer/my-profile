"use client";

import { Card } from "@/components/ui/card";

export function Experience() {
  const experiences = [
    {
      title: "Web Development",
      items: [
        {
          name: "Client Projects",
          description:
            "Successfully deployed websites for various clients using modern web technologies.",
          period: "2023 - Present",
        },
        {
          name: "Freelance Development",
          description:
            "Worked on multiple freelance projects focusing on full-stack development.",
          period: "2022 - Present",
        },
      ],
    },
    {
      title: "Education",
      items: [
        {
          name: "University of Batangas",
          description: "Bachelor of Science in Computer Engineering",
          period: "2021 - 2025",
        },
      ],
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Experience & Education</h2>
      <div className="space-y-8">
        {experiences.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium text-muted-foreground">
              {section.title}
            </h3>
            <div className="space-y-6">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l-2 border-muted pb-6 last:pb-0"
                >
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1" />
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.period}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
