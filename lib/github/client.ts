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

    return data
      .filter((issue) => !issue.pull_request) // Exclude PRs
      .map((issue) => ({
        title: issue.title,
        body: issue.body || null,
        labels: Array.isArray(issue.labels)
          ? issue.labels.map((l: any) => (typeof l === "string" ? l : l.name))
          : [],
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

// Fetch all source file contents recursively (for deep security audit)
// Uses GitHub's Git Trees API for efficiency (single call returns all paths)
export async function getRepoAllFiles(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string = "main"
): Promise<Array<{ path: string; content: string }>> {
  try {
    // Get the full recursive tree for the repo
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: refData.object.sha,
      recursive: "1",
    });

    // Filter to source files only
    const sourceExtensions = [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".py",
      ".go",
      ".rb",
      ".rs",
      ".java",
      ".php",
      ".vue",
      ".svelte",
      ".css",
      ".sql",
    ];

    const excludePatterns = [
      "node_modules/",
      ".next/",
      "dist/",
      "build/",
      "out/",
      /.min\.js$/,
      /\.lock$/,
      /\.map$/,
      /pnpm-lock/,
      /package-lock/,
    ];

    const sourceFiles = treeData.tree
      .filter((item: any) => {
        if (item.type !== "blob") return false;

        // Check extension
        const hasSourceExt = sourceExtensions.some((ext) => item.path.endsWith(ext));
        if (!hasSourceExt) return false;

        // Check exclusions
        const isExcluded = excludePatterns.some((pattern) => {
          if (pattern instanceof RegExp) {
            return pattern.test(item.path);
          }
          return item.path.includes(pattern);
        });
        return !isExcluded;
      })
      .slice(0, 50); // Limit to top 50 files to control token count

    // Fetch content for each file
    const files: Array<{ path: string; content: string }> = [];

    for (const file of sourceFiles) {
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: file.path,
        });

        if ("content" in data && typeof data.content === "string") {
          const content = Buffer.from(data.content, "base64").toString("utf-8");
          files.push({ path: file.path, content });
        }
      } catch (error) {
        // Skip files that can't be fetched
        console.warn(`Could not fetch ${file.path}:`, error);
        continue;
      }
    }

    return files;
  } catch (error) {
    console.error("Failed to fetch repo files:", error);
    return [];
  }
}
