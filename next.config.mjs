const pages = process.env.GITHUB_PAGES === "true";
const base = process.env.BASE_PATH || "";

export default pages
  ? {
      output: "export",
      basePath: base,
      assetPrefix: base || undefined,
      trailingSlash: true,
      images: { unoptimized: true }
    }
  : {};
