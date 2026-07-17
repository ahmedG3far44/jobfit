import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../configs/env';
import { User } from '../models/User';
import { Resume } from '../models/Resume';
import { ResumeVersion } from '../models/ResumeVersion';

const sampleResume = `Summary
Experienced full-stack developer with 5+ years building web applications using React, Node.js, and TypeScript. Passionate about clean code and user-centric design.

Skills
JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL, Docker, AWS, Git, CI/CD

Experience
Senior Software Engineer — TechCorp
Jan 2022 – Present
- Led development of a customer-facing dashboard serving 50k+ users
- Migrated legacy codebase from JavaScript to TypeScript, reducing bugs by 40%
- Designed and implemented RESTful APIs with Node.js and Express

Software Engineer — StartupXYZ
Jun 2020 – Dec 2021
- Built real-time collaboration features using WebSockets
- Reduced page load time by 60% through code splitting and lazy loading
- Wrote comprehensive unit and integration tests (Jest, Cypress)

Projects
TaskFlow — A project management tool with drag-and-drop boards
Built with React, Node.js, Socket.io, and PostgreSQL

Education
BSc in Computer Science — University of Technology
2016 – 2020`;

async function seed() {
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Resume.deleteMany({});
  await ResumeVersion.deleteMany({});
  console.log('Cleared existing data');

  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
  });
  console.log('Created test user: test@example.com / password123');

  const resume = await Resume.create({
    userId: user._id,
    title: 'Full-Stack Developer Resume',
    originalFileUrl: '',
    parsedContent: sampleResume,
  });
  console.log('Created sample resume:', resume.title);

  const version = await ResumeVersion.create({
    resumeId: resume._id,
    userId: user._id,
    name: 'Google - Senior Developer',
    company: 'Google',
    jobTitle: 'Senior Software Engineer',
    jobDescription: 'We are looking for a senior software engineer with experience in React, Node.js, TypeScript, and cloud infrastructure.',
    aiContent: sampleResume,
  });
  console.log('Created sample version:', version.name);

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
