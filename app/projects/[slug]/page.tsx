import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { notFound } from "next/navigation";

import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
// import { JsonComponent } from "@/app/components/json";

const redis = new Redis({
  url: "https://crack-mutt-62281.upstash.io",
  token: "AfNJAAIjcDEwNjE3OTFkOTc0ZTc0MjRiYjM4ODE5YjFjZDU0YmZmNHAxMA",
});

export const revalidate = 60;

interface Project {
  slug: string;
  title: string;
  description: string;
  date?: string;
  published: boolean;
}

type Props = {
  params: {
    slug: string;
  };
};

async function loadProjects(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), "projects.json");
  const fileContents = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(fileContents);
}

export async function generateStaticParams(): Promise<Props["params"][]> {
  const allProjects: Project[] = await loadProjects();

  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const allProjects: Project[] = await loadProjects();
  const slug = params?.slug;

  // Eğer slug yoksa notFound() çağrısı yapalım
  console.log("slug: " + slug);

  if (!slug) {
    notFound();
  }

  const project = allProjects.find((project: Project) => project.slug === slug);

  console.log("project: " + project?.title);
  // Eğer project yoksa notFound() çağrısı yapalım
  if (!project) {
    notFound();
  }

  const views =
    (await redis.get<number>(["pageviews", "projects", slug].join(":"))) ?? 0;

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header project={project} views={views} />
      <ReportView slug={project.slug} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        {/* <JsonComponent data={project.slug} /> */}
      </article>
    </div>
  );
}
