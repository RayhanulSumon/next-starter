import type { Metadata } from "next";

// Centralized metadata configuration
export const siteMetadata = {
  title: "Next.js Starter Application",
  description: "A robust Next.js 14 starter template with authentication and best practices",
  siteUrl: "https://yourdomain.com",
};

export function generateMetadata(): Metadata {
  return {
    title: {
      default: siteMetadata.title,
      template: `%s | ${siteMetadata.title}`,
    },
    description: siteMetadata.description,
    metadataBase: new URL(siteMetadata.siteUrl),
  };
}