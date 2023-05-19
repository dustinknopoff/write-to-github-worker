function github(token: string) {
  const userAgent = 'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36'
  const baseURL = 'https://api.github.com';
  return {
    get: async (relativePath: string) => {
      return fetch(baseURL + relativePath, {
        method: "GET",
        headers: {
          "Authorization": `bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": userAgent,
        }
      })
    },
    put: async (relativePath: string, body: Object) => fetch(baseURL + relativePath, {
      method: "PUT",
      headers: {
        "Authorization": `bearer ${token}`,
        "content-type": "application/json",
        "User-Agent": userAgent,
      },
      body: JSON.stringify(body)
    }),
  };
}

type RepositoryInfo = {
  default_branch: string
}

export async function getDefaultBranch(repository: string, token: string) {
  const { default_branch }: RepositoryInfo = await (await github(token).get(`/repos/${repository}`)).json();
  return default_branch
}

export async function writeFileToGithubRepo(fileName: string, content: string, repository: string, token: string) {
  // Get file contents
  const path = fileName
  const branch = await getDefaultBranch(repository, token)

  // Put
  return github(token).put(`/repos/${repository}/contents/${path}`, {
    content,
    message: `chore(${fileName}): init file`,
    path,
    branch
  })
}
