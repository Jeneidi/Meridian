import { Octokit } from "@octokit/rest";

// Wrapper for GitHub API calls via Octokit
// All calls are read-only: repo metadata, README, issues, commits
export function createGitHubClient(accessToken: string) {
  return new Octokit({
    auth: accessToken,
  });
}

export interface RepoMetadata {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
  private: boolean;
}

// Fetch user's repositories
export async function getUserRepos(
  octokit: Octokit,
  options?: { per_page?: number }
) {
  try {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      per_page: options?.per_page || 30,
    });

    return data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      default_branch: repo.default_branch,
      private: repo.private,
    })) as RepoMetadata[];
  } catch (error) {
    console.error("Failed to fetch user repos:", error);
    throw new Error("Could not fetch your repositories");
  }
}

// Fetch README content from a repo
export async function getRepoReadme(
  octokit: Octokit,
  owner: string,
  repo: string
) {
  try {
    const { data } = await octokit.repos.getReadme({
      owner,
      repo,
    });

    // README is returned as base64
    if ("content" in data) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch (error) {
    // 404 is common if no README exists
    if (error instanceof Error && error.message.includes("404")) {
      return null;
    }
    console.error("Failed to fetch README:", error);
    return null;
  }
}

// Fetch file tree (simplified: list root files)
export async function getRepoFileTree(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string = ""
) {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        name: item.name,
        type: item.type, // "file" or "dir"
        path: item.path,
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch file tree:", error);
    return [];
  }
}

// Fetch open issues
export async function getRepoIssues(
  octokit: Octokit,
  owner: string,
  repo: string
) {
  try {
    const { data } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: "open",
      per_page: 20,
    });

    return data.map((issue) => ({
      number: issue.number,
      title: issue.title,
      body: issue.body,
      labels: issue.labels.map((l: any) => l.name),
    }));
  } catch (error) {
    console.error("Failed to fetch issues:", error);
    return [];
  }
}

// Fetch recent commits
export async function getRepoCommits(
  octokit: Octokit,
  owner: string,
  repo: string
) {
  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 10,
    });

    return data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author?.name || "Unknown",
      date: commit.commit.author?.date || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch commits:", error);
    return [];
  }
}

// Fetch a single commit with full diff
export async function getCommitDiff(
  octokit: Octokit,
  owner: string,
  repo: string,
  sha: string
) {
  try {
    const { data } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: sha,
    });

    return {
      message: data.commit.message,
      diff: data.files?.map((file) => ({
        filename: file.filename,
        patch: file.patch || "",
        additions: file.additions,
        deletions: file.deletions,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch commit diff:", error);
    return null;
  }
}
