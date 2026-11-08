// Eleventy configuration for volumesave.de
//
// Every page exists in each language listed in src/_data/site.json.
// The templates in src/pages/ paginate over those languages, so one
// template produces /de/…, /en/… and /es/…; all text comes from
// src/_data/i18n/<lang>.json.

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // "/de/pro/" + "en" -> "/en/pro/"
  eleventyConfig.addFilter("swapLang", (url, lang) =>
    String(url).replace(/^\/[a-z]{2}\//, `/${lang}/`)
  );

  // Absolute URL for canonical, hreflang and sitemap entries.
  eleventyConfig.addFilter("absolute", (path, base) =>
    new URL(path, base).href
  );

  eleventyConfig.addFilter("isoDate", (date) =>
    new Date(date).toISOString().slice(0, 10)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
