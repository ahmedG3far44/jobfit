import { callOpenRouter } from './ai.service';

const STYLE_INSTRUCTIONS: Record<string, string> = {
  professional: `Write in a professional, formal tone. Use standard business language. Be concise and polished.`,

  confident: `Write with confidence and authority. Use strong, assertive language that showcases the candidate's capabilities without overstating.`,

  enthusiastic: `Write with genuine enthusiasm and energy. Convey excitement about the role and company while remaining professional.`,

  direct: `Write a straight-to-the-point letter. Be direct and efficient. Focus on key qualifications without fluff.`,

  storytelling: `Write with a narrative approach. Weave the candidate's experience into a compelling story that connects their journey to the role.`,

  warm: `Write with a warm, personable tone. Be approachable and friendly while maintaining professionalism.`,
};

export const generateCoverLetter = async (
  resumeContent: string,
  jobDescription: string,
  company: string,
  jobTitle: string,
  style: string = 'professional'
): Promise<string> => {
  const styleInstruction = STYLE_INSTRUCTIONS[style] || STYLE_INSTRUCTIONS.professional;

  const prompt = `Write a cover letter based ONLY on the information provided below.

Writing Style: ${styleInstruction}

Rules:
1. Only mention facts, experience, and skills that are explicitly present in the resume.
2. Do not invent projects, roles, technologies, or achievements.
3. Personalize it for ${company} and the ${jobTitle} role.
4. Reference specific relevant experience from the resume.
5. Keep it concise (3-4 paragraphs).
6. Do NOT include phone numbers, email addresses, URLs, or any contact information.
7. Start with "Dear Hiring Manager," as the salutation.

Resume:
${resumeContent}

Job Description:
${jobDescription}

Company: ${company}
Job Title: ${jobTitle}

Write the full cover letter starting with "Dear Hiring Manager," followed by the body paragraphs. Do not include a closing signature.`;

  return callOpenRouter(prompt);
};
