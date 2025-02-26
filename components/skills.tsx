"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function Skills() {
  const skills = [
    { name: "TypeScript", level: 90 },
    { name: "JavaScript", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "HTML/CSS", level: 95 },
    { name: "Embedded Systems", level: 85 },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Skills Proficiency</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{skill.name}</span>
              <span>{skill.level}%</span>
            </div>
            <Progress value={skill.level} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
}
