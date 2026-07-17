import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  Sparkles,
  GitBranch,
  Download,
  ChevronDown,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

const features = [
  {
    icon: FileText,
    title: "Upload Resumes",
    description:
      "Upload your master resumes and keep them organized in one place.",
  },
  {
    icon: Sparkles,
    title: "AI Optimization",
    description: "Get ATS-friendly tailored versions for any job description.",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Create and manage multiple tailored versions of each resume.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description:
      "Export your optimized resumes and cover letters as PDF or text.",
  },
];

const faqs = [
  {
    q: "How does the AI optimize my resume?",
    a: "The AI analyzes your original resume alongside the job description, then rewrites bullet points to naturally include relevant ATS keywords while preserving your factual experience. It never fabricates information.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Your resumes and data are stored securely. We only use your content to generate tailored versions — we never share or sell your data.",
  },
  {
    q: "Can I upload multiple resumes?",
    a: "Yes. You can upload as many master resumes as you need (e.g., Frontend Developer, Backend Developer, PM) and create tailored versions from each one.",
  },
  {
    q: "What file formats are supported?",
    a: "We support PDF and DOCX uploads. You can also paste your resume content directly if you prefer.",
  },
  {
    q: "Can I edit the AI output?",
    a: "Yes. After the AI generates an optimized version, you can review it in a side-by-side comparison, edit any section inline, then accept or discard the changes.",
  },
];

function AccordionItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b">
      <button
        className="flex w-full items-center justify-between py-4 text-left font-medium transition-colors hover:text-primary"
        onClick={onToggle}
      >
        {question}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all",
          open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl max-w-3xl">
          Tailor Your Resume with{" "}
          <span className="text-primary">AI Precision</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Upload your resume once. Generate ATS-optimized versions for every job
          application. Save hours of manual editing and land more interviews.
        </p>
        <div className="mt-10 flex gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth/register">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="border-t py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to land the job
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-6 rounded-lg border bg-card"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t py-20">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground mb-8">
            Start free, upgrade when you need more.
          </p>
          <div className="mx-auto max-w-sm rounded-lg border bg-card p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl font-bold">Free</span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium flex items-center gap-1">
                <BadgeCheck className="h-3 w-3" />
                Coming Soon
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Everything you need for your job search
            </p>
            <ul className="space-y-3 text-sm text-left mb-8">
              {[
                "Unlimited master resumes",
                "AI resume optimization",
                "Version history",
                "Cover letter generation",
                "PDF & text export",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            {!user && (
              <Link to="/auth/register">
                <Button className="w-full">Get Started Free</Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="border-t py-20 bg-muted/50">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="rounded-lg border bg-card px-6">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.q}
                answer={faq.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-20">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Ready to optimize your job search?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start tailoring your resumes in minutes, not hours.
          </p>
          {!user && (
            <Link to="/auth/register">
              <Button size="lg">Create Free Account</Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
