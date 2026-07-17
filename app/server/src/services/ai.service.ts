import { env } from '../configs/env';

export const fitResume = async (
  resumeContent: string,
  jobDescription: string,
  customInstructions?: string
): Promise<string> => {
  const extra = customInstructions
    ? `\n\nAdditional Instructions from the User:\n${customInstructions}\n\nApply these instructions while keeping all other rules intact.`
    : '';

  const prompt = `You are an ATS optimization expert. Your task is to enhance the given resume to match the job description — without fabricating or changing any factual information.

Rules:
1. Preserve the EXACT SAME section structure and order as the original resume.
2. Keep ALL factual information (company names, job titles, dates, degree names, institutions) exactly as-is.
3. NEVER add experience, projects, education, or skills that don't exist in the original.
4. Improve wording within existing bullet points to naturally include relevant ATS keywords from the job description.
5. Rewrite bullet points to be more professional and impact-focused, but stay truthful.
6. If a section exists in the original, include it. Do not remove sections.

Original Resume:
${resumeContent}

Job Description:
${jobDescription}${extra}

Return the enhanced resume with the same section headers and structure as the original. Only the wording within each section should be improved to incorporate relevant keywords naturally.`;

  return callOpenRouter(prompt);
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
