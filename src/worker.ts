import {  writeFileToGithubRepo } from "./github"

function base64Encode(buf: ArrayBuffer) {
  let string = '';
  (new Uint8Array(buf)).forEach(
    (byte) => { string += String.fromCharCode(byte) }
  )
  return btoa(string)
}

// Export a default object containing event handlers
export default {
  // The fetch handler is invoked when this worker receives a HTTP(S) request
  // and should return a Response (optionally wrapped in a Promise)
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Only POST requests are permitted", { status: 400 })
    }
    // You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
    const url = new URL(request.url);
    const pathparts = url.pathname.split("/");
    pathparts.splice(0, 1);
    if (pathparts.length < 4) {
      return new Response("You must specify /<repo user or org>/<repo name>/<path to file>/<filename>.<extension>", { status: 400 })
    }
    const bodyText = base64Encode(await request.arrayBuffer());
    if (bodyText.length === 0) {
      return new Response("Body must be content to upload", { status: 400 })
    }
    const repo = `${pathparts[0]}/${pathparts[1]}`;
    let cleanedRepoName = repo
    if (repo.startsWith("/")) {
      cleanedRepoName = repo.slice(1)
    }
    const fileName = pathparts.slice(2).join("/")

    // // dustinknopoff/recipe-ssg/toplevel/file.md
    const result = await writeFileToGithubRepo(fileName, bodyText, cleanedRepoName, env.GITHUB_TOKEN)

    console.log(result.status)

    return new Response("Success", { status: 200 })
  },
};
