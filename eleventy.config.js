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

  // schema.org JSON-LD for a page, or "" if the page has none.
  // Usage in the layout: pageKey | structuredData(lang, t, site, page.url)
  eleventyConfig.addFilter("structuredData", structuredData);

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

function structuredData(pageKey, lang, t, site, pageUrl) {
  const base = site.url;
  const abs = (path) => new URL(path, base).href;
  const pub = site.publisher;

  const org = {
    "@type": "Organization",
    "@id": `${base}/#org`,
    name: pub.name,
    url: `${base}/`,
    email: site.contactEmail[lang],
    founder: { "@type": "Person", name: pub.founder },
    address: {
      "@type": "PostalAddress",
      streetAddress: pub.streetAddress,
      postalCode: pub.postalCode,
      addressLocality: pub.addressLocality,
      addressCountry: pub.addressCountry,
    },
  };
  const software = {
    "@type": "SoftwareApplication",
    "@id": `${base}/#volsave`,
    name: site.name,
    description: t.pages.home.metaDescription,
    url: abs(`/${lang}/`),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Windows 10, Windows 11, Windows PE",
    downloadUrl: site.downloadUrl,
    license: "https://www.gnu.org/licenses/gpl-3.0.html",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@id": org["@id"] },
  };

  let graph;
  if (pageKey === "home") {
    graph = [
      org,
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: site.name,
        url: `${base}/`,
        inLanguage: site.languages,
        publisher: { "@id": org["@id"] },
      },
      software,
    ];
  } else if (pageKey === "pro") {
    graph = [
      org,
      {
        "@type": "SoftwareApplication",
        "@id": `${base}/#volsave-pro`,
        name: `${site.name} Pro`,
        description: t.pages.pro.metaDescription,
        url: abs(pageUrl),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Windows 10, Windows 11, Windows PE",
        isBasedOn: { "@id": software["@id"] },
        publisher: { "@id": org["@id"] },
      },
    ];
  } else if (pageKey === "faq") {
    graph = [
      {
        "@type": "FAQPage",
        "@id": `${abs(pageUrl)}#faq`,
        inLanguage: lang,
        mainEntity: t.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a.join(" ") },
        })),
      },
    ];
  } else {
    return "";
  }

  // "<" escaped so the JSON can never close the <script> element.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
    .replace(/</g, "\\u003c");
}
