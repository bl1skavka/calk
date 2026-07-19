// When deployed to GitHub Pages as a project site (username.github.io/repo),
// every absolute URL needs to be prefixed with "/repo". The GitHub Actions
// workflow sets NEXT_PUBLIC_BASE_PATH="/repo-name" automatically at build
// time. When running locally (npm run dev) this stays empty, so nothing
// changes for local development.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
