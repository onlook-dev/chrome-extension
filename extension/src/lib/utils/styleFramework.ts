import { StyleFramework } from "$shared/models/projectSettings";

async function isTailwindUsed() {
  // Function to fetch and read the content of a stylesheet
  async function fetchStylesheet(href: string) {
    try {
      const response = await fetch(href);
      return await response.text();
    } catch (error) {
      console.error('Error fetching the stylesheet:', error);
      return '';
    }
  }

  // Get all stylesheet links on the page
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];

  // Check each stylesheet for Tailwind CSS patterns
  for (let link of links) {
    if (!link.href) continue; // Skip if no href attribute
    const content = await fetchStylesheet(link.href);
    // Look for a Tailwind CSS signature pattern
    if (content.includes('tailwindcss') || content.includes('@tailwind')) {
      return true; // Tailwind CSS pattern found
    }
  }

  return false; // No Tailwind CSS patterns found in any stylesheet
}

export async function getCSSFramework() {
  if (await isTailwindUsed()) {
    return StyleFramework.TailwindCSS;
  } else {
    return StyleFramework.InlineCSS;
  }
}