import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerateApiRequest, GenerateApiResponse, GeneratedDocument } from '@/types';
import { generateMockAcademicDocument } from '@/utils/mockGenerator';

export async function POST(req: NextRequest) {
  try {
    const body: GenerateApiRequest = await req.json();
    const { mode, title, description, metadata, codeSnippet, count, apiKey: clientApiKey } = body;

    // Determine API Key from client request or environment variable
    const apiKey =
      clientApiKey?.trim() ||
      req.headers.get('x-gemini-key')?.trim() ||
      process.env.GEMINI_API_KEY?.trim();

    // If no API key is provided, gracefully generate high-quality mock output so the user can test all features immediately
    if (!apiKey) {
      const mockDoc = generateMockAcademicDocument(body);
      return NextResponse.json<GenerateApiResponse>({
        success: true,
        document: mockDoc,
        isMockFallback: true,
      });
    }

    // Call Google Gemini API
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Use gemini-1.5-flash for speed and reliability, or gemini-1.5-pro
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const prompt = `You are an elite Senior Full-Stack Architect and Academic Professor. 
Generate a comprehensive, publication-grade academic document in STRICT JSON format for a university student.

User Request Details:
- Academic Mode: "${mode}" (${mode === 'presentation' ? 'Presentation Slide Deck' : mode === 'lab_report' ? 'Formal University Lab Report' : 'Coursework Assignment'})
- Document Title: "${title || 'Untitled Academic Work'}"
- Description / Objectives / Instructions: "${description || 'Comprehensive analysis and implementation'}"
- Course: "${metadata.courseCode} - ${metadata.courseTitle}"
- Institution: "${metadata.institution}"
- Department: "${metadata.department}"
- Student: "${metadata.studentName} (ID: ${metadata.studentId})"
- Instructor: "${metadata.instructorName}"
- Target Item Count: ${count || (mode === 'presentation' ? 6 : 6)}
${codeSnippet ? `- Student Provided Code Snippet:\n\`\`\`\n${codeSnippet}\n\`\`\`` : ''}

Strict Output Instructions:
1. Return ONLY a valid JSON object matching the TypeScript interface below (no markdown ticks around JSON):
{
  "mode": "${mode}",
  "title": string,
  "subtitle": string,
  "executiveSummary": string,
  "metadata": {
    "studentName": "${metadata.studentName}",
    "studentId": "${metadata.studentId}",
    "department": "${metadata.department}",
    "institution": "${metadata.institution}",
    "courseCode": "${metadata.courseCode}",
    "courseTitle": "${metadata.courseTitle}",
    "instructorName": "${metadata.instructorName}",
    "submissionDate": "${metadata.submissionDate}"
  },
  "primaryDiagram": {
    "code": string (MUST be valid Mermaid.js flowchart or sequence diagram, e.g. "flowchart TD\\n  A[\\"Start\\"] --> B[\\"Process\\"]"),
    "title": string,
    "type": "flowchart",
    "caption": string
  },
  ${
    mode === 'presentation'
      ? `"slides": [
    {
      "id": "slide-1",
      "slideNumber": 1,
      "title": string,
      "subtitle": string,
      "bullets": [string, string, ...],
      "speakerNotes": string,
      "diagramCode": string (optional mermaid diagram code),
      "diagramCaption": string (optional),
      "codeSnippet": string (optional),
      "callout": string (optional key takeaway)
    }
  ],`
      : `"sections": [
    {
      "id": "sec-1",
      "heading": string,
      "subheading": string,
      "content": string (thorough, scholarly paragraphs),
      "bulletPoints": [string, ...],
      "codeSnippet": string (optional),
      "codeLanguage": "typescript" | "python" | "cpp" | "java",
      "tableData": {
        "headers": [string, string, ...],
        "rows": [[string, string, ...], ...]
      },
      "diagramCode": string (optional mermaid code for this section),
      "diagramCaption": string (optional)
    }
  ],`
  }
  "references": [
    string (formal APA/IEEE citations)
  ],
  "generatedAt": "${new Date().toISOString()}"
}

Critical Mermaid Diagram Guidelines:
- The Mermaid code MUST compile without error in mermaid.js.
- Always quote labels containing special characters or punctuation, like: \`A["Label (Details)"] --> B["Next Step"]\`.
- Use "flowchart TD" or "flowchart LR" or "sequenceDiagram".
- Avoid HTML tags inside labels.
`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text();

      // Clean any accidental markdown fence if present
      const cleanJson = textResponse
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const parsed: GeneratedDocument = JSON.parse(cleanJson);

      return NextResponse.json<GenerateApiResponse>({
        success: true,
        document: parsed,
        isMockFallback: false,
      });
    } catch (geminiError: any) {
      console.warn('Gemini API call failed or timed out, using fallback mock generator:', geminiError?.message);
      // Fallback to high quality mock data so the app remains fully functional
      const mockDoc = generateMockAcademicDocument(body);
      return NextResponse.json<GenerateApiResponse>({
        success: true,
        document: mockDoc,
        isMockFallback: true,
        error: `Gemini API notice: ${geminiError?.message || 'Using offline academic template engine'}`,
      });
    }
  } catch (error: any) {
    console.error('API Error in /api/generate:', error);
    return NextResponse.json<GenerateApiResponse>(
      {
        success: false,
        error: error?.message || 'Internal server error while generating document',
      },
      { status: 500 }
    );
  }
}
