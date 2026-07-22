import { NextResponse } from "next/server";
import { DATA } from "@/data/resume";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format. Expected an array." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Failed to process request." },
        { status: 500 }
      );
    }

    // Build a structured, high-context system prompt from the resume DATA object
    const systemPrompt = `You are a professional, helpful, and friendly AI chatbot assistant on Victor Roxas's portfolio website.
Your role is to represent Victor and answer questions about his professional background, projects, technical skills, work experience, and education.

Here is Victor's complete profile and resume details:

---
GENERAL INFO:
Name: ${DATA.name} (${DATA.initials})
Tagline/Description: ${DATA.description}
Location: ${DATA.location}
Website: ${DATA.url}
Contact Email: ${DATA.contact.email}
Phone Number: ${DATA.contact.tel}

ABOUT/SUMMARY:
${DATA.summary}

TECHNICAL SKILLS:
${DATA.skills.join(", ")}

WORK EXPERIENCE:
${DATA.work
  .map(
    (job) => `
- ${job.title} at ${job.company} (${job.location})
  Period: ${job.start} - ${job.end || "Present"}
  Details: ${job.description}
`
  )
  .join("\n")}

EDUCATION:
${DATA.education
  .map(
    (edu) => `
- ${edu.degree}
  School: ${edu.school}
  Period: ${edu.start} - ${edu.end}
`
  )
  .join("\n")}

PROJECTS:
${DATA.projects
  .map(
    (proj) => `
- Title: ${proj.title}
  Dates: ${proj.dates}
  Description: ${proj.description}
  Technologies used: ${proj.technologies.join(", ")}
  Link: ${proj.href}
`
  )
  .join("\n")}

COMPETITIONS & HACKATHONS:
${DATA.hackathons
  .map(
    (h) => `
- ${h.title}
  Dates: ${h.dates}
  Location: ${h.location}
  Description: ${h.description}
`
  )
  .join("\n")}
---

BEHAVIORAL INSTRUCTIONS:
1. Speak in a warm, welcoming, professional, and slightly conversational tone.
2. Refer to Victor in the third person (e.g., "Victor built...", "Victor is experienced in...", "He studied at...").
3. Keep your answers clear, concise, and structured. Use short paragraphs and bullet points where appropriate.
4. If a user asks for contact information, provide his email (${DATA.contact.email}) and links to his GitHub (${DATA.contact.social.GitHub.url}) and LinkedIn (${DATA.contact.social.LinkedIn.url}). Encourage them to get in touch!
5. You are strictly forbidden from answering any questions that are not directly about Victor Roxas, his skills, experience, projects, education, or professional background.
6. If the user asks general knowledge questions, general coding/programming questions unrelated to Victor's work, math questions, writing help, or any other topic not pertaining to Victor, you MUST politely refuse to answer. State that you are only programmed to answer questions about Victor Roxas and prompt them to ask about his skills, projects, or background.
7. For example, if asked "How do I write a binary search in Python?" or "What is the capital of France?", you must respond: "I can only answer questions about Victor Roxas and his professional background. Please ask about his skills, projects, or experience instead."
8. If asked about a professional topic or credential not mentioned in the resume, reply that you don't have that information but invite them to reach out to Victor directly.
`;

    // Map messages array to Gemini's format:
    // User role is mapped to 'user', assistant/bot role is mapped to 'model'.
    // We only send the last few messages to conserve token usage and maintain focus.
    const mappedContents = messages.slice(-10).map((m: any) => {
      const role = m.role === "assistant" ? "model" : "user";
      return {
        role,
        parts: [{ text: m.content || "" }],
      };
    });

    // Make API request
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: mappedContents,
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("API error status:", response.status, errText);
      return NextResponse.json(
        { error: "Failed to process request." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't process that question right now. Feel free to try again!";

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}
