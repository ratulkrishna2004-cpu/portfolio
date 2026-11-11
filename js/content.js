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
    photo: "profile.png",   // file name inside the images/ folder (transparent PNG looks best)
    photoZoom: 1,           // 1 = normal, 1.5 = zoomed in, 0.8 = zoomed out
    photoX: 0,              // move right (+) / left (-), in % of the frame
    photoY: 0,              // move down (+) / up (-), in % of the frame
    photoCircle: "off"      // "on" = crop the photo to the round ring behind it
  },
  // {awards} {leadership} {projects} {experience} are replaced by how many entries each list has
  stats: [
    { value: "{awards}",     label: "Total awards" },
    { value: "{leadership}", label: "Leadership roles" },
    { value: "{projects}",   label: "Projects built" }
  ],
  about: {
    text: "I'm an Electrical and Electronic Engineering student at Ahsanullah University of Science & Technology. I lead IT for my school's alumni association, mentor students for Physics, Chemistry and Math Olympiads, and design graphics for the AUST Robotics Club and the IEEE APS & MTT-S student chapter.",
    cvProfile: "A passionate and detail-oriented Electrical and Electronic Engineering (EEE) student with leadership experience in student organizations, data management, and event coordination. Skilled in programming, IT tools, and public engagement. Proven record of leading large-scale alumni events and mentoring in science Olympiads. A fast learner with a proactive mindset, always eager to take on new responsibilities."
  },
  cv: {
    phone: "+8801623519646",
    email: "ratulkrishna2004@gmail.com",
    address: "Amlapara Chourasta, Narayanganj",
    linkedin: "https://www.linkedin.com/in/ratul-krishna-b09i24/",
    file: "CV_Ratul.pdf"    // PDF file name inside the files/ folder
  },
  education: [
    { title: "Ahsanullah University of Science & Technology (AUST)", sub: "B.Sc. in Electrical and Electronic Engineering (EEE)", tag: "2024 — Present", note: "" },
    { title: "Notre Dame College, Dhaka", sub: "Higher Secondary Certificate (HSC)", tag: "2023", note: "GPA 5.00" },
    { title: "Narayanganj Ideal School", sub: "Secondary School Certificate (SSC)", tag: "2021", note: "GPA 5.00" }
  ],
  experience: [
    { title: "IT Head — Alumni Association (Silver Jubilee 2025)", sub: "Narayanganj Ideal School", tag: "2024 — Present",
      details: "Led IT operations for the Silver Jubilee event hosting 3000+ alumni\nCollected, organized, and managed alumni data single-handedly\nCoordinated with event, registration, and tech support teams" },
    { title: "Instructor — KnowMads", sub: "Offline Admission (NDC, HCC, SJS)", tag: "2022 — 2023", details: "" },
    { title: "Olympiad Instructor", sub: "Narayanganj Ideal School", tag: "2019 — 2024",
      details: "Mentored students (classes 6–9) in Physics, Chemistry & Math Olympiads\nConducted workshops, solved problem sets, and provided feedback" }
  ],
  projects: [
    { title: "Soccer Bot", sub: "Robotics", url: "" },
    { title: "Smart Parking System (IoT based)", sub: "Robotics", url: "" },
    { title: "FPV Drone", sub: "Robotics", url: "" },
    { title: "Smart Water Filtering System", sub: "Robotics", url: "" },
    { title: "Spherical Bot", sub: "Robotics", url: "" },
    { title: "Departmental study material & multitasking website (designed & developed)", sub: "Web-based", url: "https://www.spardho53.xyz" },
    { title: "Smart Room Tracking System website — AUST Robotics Club Bootcamp & Room System (designed & developed)", sub: "Web-based", url: "" }
  ],
  skills: [
    { label: "Programming", value: "C, C++, HTML" },
    { label: "Software", value: "MS Word, Excel, PowerPoint (Expert), Canva Graphics Design, Quartus II, LTSpice, AutoCAD, PSpice" },
    { label: "IT & Tech", value: "Online Event Management, Data Handling, Google Workspace, IoT Expert, Graphic Designer" },
    { label: "Soft Skills", value: "Leadership, Public Speaking, Team Collaboration" },
    { label: "Hobbies", value: "Singing, Archery" }
  ],
  languages: [
    { title: "Bengali", sub: "Native" },
    { title: "English", sub: "Fluent" },
    { title: "Hindi", sub: "Fluent" }
  ],
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
