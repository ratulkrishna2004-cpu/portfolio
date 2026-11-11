/* Default content of the site.
   Once Firebase is connected, whatever you save from /admin replaces this.
   Until then you can edit this file directly. */

window.SOCIAL_TYPES = {
  email:     { label: "Email",     icon: "fa-solid fa-envelope" },
  facebook:  { label: "Facebook",  icon: "fa-brands fa-facebook-f" },
  whatsapp:  { label: "WhatsApp",  icon: "fa-brands fa-whatsapp" },
  linkedin:  { label: "LinkedIn",  icon: "fa-brands fa-linkedin-in" },
  instagram: { label: "Instagram", icon: "fa-brands fa-instagram" },
  x:         { label: "X",         icon: "fa-brands fa-x-twitter" },
  github:    { label: "GitHub",    icon: "fa-brands fa-github" },
  youtube:   { label: "YouTube",   icon: "fa-brands fa-youtube" },
  telegram:  { label: "Telegram",  icon: "fa-brands fa-telegram" },
  phone:     { label: "Phone",     icon: "fa-solid fa-phone" },
  website:   { label: "Website",   icon: "fa-solid fa-globe" }
};

window.DEFAULT_CONTENT = {
  hero: {
    fullName: "Ratul Krishna Mojumder",
    name: "RATUL.",
    tagline: "EEE Student & Graphic Designer",
    description: "Building **robots, IoT systems** and **visual identities** — while leading teams, mentoring Olympiad students and running the tech behind large-scale events.",
    badge: "AUST · EEE · 2024 —",
    photo: "profile.jpg",   // file name inside the images/ folder
    photoZoom: 1,           // 1 = normal, 1.5 = zoomed in, 0.8 = zoomed out
    photoX: 0,              // move right (+) / left (-), in % of the frame
    photoY: 0,              // move down (+) / up (-), in % of the frame
    photoFrame: "on"        // "off" = no coloured box (for transparent PNG photos)
  },
  stats: [
    { value: "{awards}", label: "Total awards" },   // {awards} = number of entries in the awards list
    { value: "3000+", label: "Alumni event IT lead" },
    { value: "5",     label: "Robotics builds" }
  ],
  about: {
    text: "I'm an Electrical and Electronic Engineering student at Ahsanullah University of Science & Technology. I've led IT operations for a Silver Jubilee event hosting 3000+ alumni, mentored students for Physics, Chemistry and Math Olympiads, and I design graphics for the AUST Robotics Club and the IEEE APS & MTT-S student chapter."
  },
  tags: [
    { text: "C / C++" }, { text: "IoT" }, { text: "HTML" },
    { text: "Canva" }, { text: "AutoCAD" }, { text: "LTSpice" }
  ],
  leadership: [
    { title: "Mentor", sub: "International Junior Science Olympiad Team of Bangladesh", tag: "Aug 2026 — Present" },
    { title: "Academic Team Member", sub: "BDJSO", tag: "Jul 2026 — Present" },
    { title: "Assistant Director, GFX Team", sub: "AUST Robotics Club", tag: "Jul 2026 — Present" },
    { title: "Volunteer", sub: "Society for the Popularization of Science, Bangladesh (SPSB)", tag: "2026 — Present" },
    { title: "Graphics Designer", sub: "IEEE APS & MTT-S Joint Student Branch Chapter, AUST", tag: "2026 — Present" },
    { title: "Mentor, ARC Bootcamp Wing-1 (Embedded System)", sub: "AUST Robotics Club", tag: "2026 — Present" },
    { title: "Senior Sub-Executive (GFX)", sub: "AUST Robotics Club", tag: "Feb 2026 — Jul 2026" },
    { title: "Junior Executive", sub: "AUST Robotics Club", tag: "Jul 2025 — Feb 2026" },
    { title: "IT Head, Alumni Association (Silver Jubilee 2025)", sub: "Narayanganj Ideal School", tag: "2024 — Present" },
    { title: "President, Science Club", sub: "Narayanganj Ideal School", tag: "2019 — 2021" },
    { title: "Secretary, Math Club", sub: "Narayanganj Ideal School", tag: "2019 — 2021" }
  ],
  awards: [
    { title: "1st Runner-up — Techfest, IIT Bombay (Bangladesh Zonal)", sub: "Olympiad", tag: "2026" },
    { title: "Bronze Honor — International Astronomy Olympiad", sub: "Olympiad", tag: "2023" },
    { title: "Champion — BUET National Environmental Carnival", sub: "Olympiad", tag: "2023" },
    { title: "Champion — NDC National Space & Eco Fest", sub: "Olympiad", tag: "2023" },
    { title: "3rd Place — 3rd National Science Fest", sub: "Olympiad", tag: "2023" },
    { title: "3rd Place — HCC Science Fest", sub: "Olympiad", tag: "2023" },
    { title: "Champion — HCC Science Fest", sub: "Olympiad", tag: "2022" },
    { title: "Champion — CS Congress Research Paper", sub: "Olympiad", tag: "2020" },
    { title: "Champion — BDPHO Regional Round", sub: "Olympiad", tag: "2020" },
    { title: "Champion — SJC Math Mania", sub: "Olympiad", tag: "2020" },
    { title: "4th Place — 4th National Space Carnival", sub: "Olympiad", tag: "" },
    { title: "Champion — Thana & Upazila Level Singing", sub: "Cultural · Singing", tag: "2015" },
    { title: "2nd Place — Singing, District Level", sub: "Cultural · Singing", tag: "2015" },
    { title: "3rd Place — Narayanganj Rifle Club Singing Contest", sub: "Cultural · Singing", tag: "" },
    { title: "4 Awards — BAFA (Bangladesh Academy of Fine Arts)", sub: "Cultural · Singing", tag: "" },
    { title: "3 Awards — Bangladesh Shishu Academy", sub: "Cultural · Singing", tag: "" },
    { title: "Ranked 61st — 13th National Archery Championship", sub: "Sports · Archery", tag: "" }
  ],
  socials: [
    { type: "email",     label: "Email",     url: "mailto:ratulkrishna2004@gmail.com" },
    { type: "facebook",  label: "Facebook",  url: "https://www.facebook.com/" },
    { type: "whatsapp",  label: "WhatsApp",  url: "https://wa.me/8801623519646" },
    { type: "linkedin",  label: "LinkedIn",  url: "https://www.linkedin.com/in/ratul-krishna-b09i24/" },
    { type: "instagram", label: "Instagram", url: "https://www.instagram.com/" },
    { type: "x",         label: "X",         url: "https://x.com/" }
  ]
};
