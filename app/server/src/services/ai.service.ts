import { env } from '../configs/env';

export const fitResume = async (
  resumeContent: string,
  jobDescription: string,
  customInstructions?: string
): Promise<string> => {
  const extra = customInstructions
    ? `\n\nAdditional Instructions from the User:\n${customInstructions}\n\nApply these instructions while keeping all other rules intact.`
    : '';

  const prompt = `You are an ATS optimization expert. Your task is to heavily optimize the given resume so its keyword match score against the job description reaches 80-90%, without fabricating or changing any factual information.

Rules:
1. Preserve the EXACT SAME section structure and order as the original resume.
2. Keep ALL factual information (company names, job titles, dates, degree names, institutions) exactly as-is.
3. NEVER add experience, projects, education, or skills that don't exist in the original.
4. Extract ALL important keywords, phrases, and terminology from the job description. Reword existing bullet points to include as many of these as possible, using the exact same phrasing from the job description.
5. Rewrite every bullet point to be more professional and impact-focused. Replace generic descriptions with terminology mirroring the job description.
6. If a section exists in the original, include it. Do not remove sections.
7. In the Skills section, rephrase skill names to match the exact terminology used in the job description.
8. For each existing bullet point, ask: "what keywords from the job description can I naturally weave into this?" — then do it.

Original Resume:
${resumeContent}

Job Description:
${jobDescription}${extra}

Return the enhanced resume with the same section headers and structure as the original. The wording must be thoroughly rewritten to achieve maximum keyword overlap with the job description while staying 100% truthful. Do NOT use any markdown formatting (no **, no *, no _, no #, no backticks). Use plain text only.`;

  return stripMarkdown(await callOpenRouter(prompt));
};

export const fitResumeA4 = async (
  resumeContent: string,
  jobDescription: string,
  customInstructions?: string
): Promise<string> => {
  const extra = customInstructions
    ? `\n\nAdditional Instructions from the User:\n${customInstructions}\n\nApply these instructions while keeping all other rules intact.`
    : '';

  const prompt = `You are an ATS optimization expert. Your task is to heavily optimize the given resume so its keyword match score against the job description reaches 80-90%, without fabricating or changing any factual information. The final output MUST fit on exactly ONE A4 page when rendered as a PDF.

Rules:
1. Preserve the EXACT SAME section structure and order as the original resume.
2. Keep ALL factual information (company names, job titles, dates, degree names, institutions) exactly as-is.
3. NEVER add experience, projects, education, or skills that don't exist in the original.
4. Extract ALL important keywords, phrases, and terminology from the job description. Reword existing bullet points to include as many as possible, using the exact same phrasing from the job description.
5. Rewrite every bullet point to be professional and impact-focused. Replace generic descriptions with terminology mirroring the job description.
6. If a section exists in the original, include it. Do not remove entire sections.
7. In the Skills section, rephrase skill names to match the exact terminology used in the job description.
8. CRITICAL — Fits one A4 page: be extremely concise. Each bullet point must be a single line. No multi-sentence bullets.
9. Remove fluff, filler words, and redundant descriptions. Use tight language.
10. If an entry has more than 3 bullet points, keep only the 3 most relevant to the job description.
11. Prioritize hard skills, quantifiable achievements, and keywords from the job description over descriptive narratives.
12. No introductory or concluding text — only resume section content.

Original Resume:
${resumeContent}

Job Description:
${jobDescription}${extra}

Return the enhanced resume with the same section headers and structure as the original. The wording must be thoroughly rewritten to achieve maximum keyword overlap with the job description while staying 100% truthful, all within a single A4 page. Do NOT use any markdown formatting (no **, no *, no _, no #, no backticks). Use plain text only.`;

  return stripMarkdown(await callOpenRouter(prompt));
};

export async function callOpenRouter(prompt: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.openrouter.apiKey}`,
    },
    body: JSON.stringify({
      model: env.openrouter.model,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/~~(.+?)~~/g, '$1')
    .trim();
}
