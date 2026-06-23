import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Overclocker",
    short_name: "Overclocker",
    description:
      "Gamified, multidisciplinary engineering interview prep across Mechanical, Aerospace, Electrical, Computer, Civil, Chemical, Mechatronics, Industrial, Biomedical, and Environmental engineering.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
  };
}
