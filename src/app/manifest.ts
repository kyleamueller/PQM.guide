import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PQM.guide — Power Query M Function Reference",
    short_name: "PQM.guide",
    description:
      "Community-driven Power Query M language reference with visual table examples.",
    start_url: "/",
    display: "browser",
    background_color: "#1a1a2e",
    theme_color: "#4fc3f7",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
