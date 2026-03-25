import contributorsData from "@/data/contributors.json";

export interface Contributor {
  name: string;
  login: string | null;
  avatar: string | null;
  url: string | null;
}

type ContributorsMap = Record<string, Contributor[]>;

export function getContributors(type: "functions" | "concepts" | "patterns", slug: string): Contributor[] {
  const key = `${type}/${slug}`;
  return (contributorsData as ContributorsMap)[key] ?? [];
}
