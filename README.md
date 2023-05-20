Based on [add-file-to-github-repo](https://github.com/RichardLitt/add-file-to-github-repo)

This is a Cloudflare worker for adding files to a github repo.

## Deploy your Own

Make sure you have pnpm and wrangler installed locally.

1. Optionally fork this repo, and clone it locally.
2. `pnpm install`
3. In Github, create a fine grained access token with read/write permission to the contents of the repository(s) you wish to edit
4. `wrangler secrets put GITHUB_TOKEN` and provide the token
5. `pnpm run deploy`


## Using the worker

POST to the endpoint `<your worker URL>/<repo org or username>/<repo name>/<path to write to>/<filename>.<extension>` and the body is the contents of the file. (Feel free to have a body in plaintext if you're writing markdown.)
