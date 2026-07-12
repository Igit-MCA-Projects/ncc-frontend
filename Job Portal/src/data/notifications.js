const notifications = [
  {
    id: "n1",
    title: "New job match: Frontend Developer at Tatva Technologies",
    Descripton: "You have a 92% match with a new Frontend Developer role. Apply before it closes!",
    type: "JOB_MATCH",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "n2",
    title: "Profile completion reminder",
    Descripton: "Your profile is 82% complete. Add 2 more projects to boost match scores by ~8%.",
    type: "PROFILE",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "n3",
    title: "Application viewed by BharatShield Systems",
    Descripton:
      "A recruiter from BharatShield Systems viewed your profile for the Defense Analyst role.",
    type: "APPLICATION",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "n4",
    title: "NCC Certificate boost applied",
    Descripton:
      "Your NCC C Certificate has been verified. You now get a +12% match bonus on leadership roles.",
    type: "GENERAL",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: "n5",
    title: "Mentor session scheduled",
    Descripton: "Your mentor Col. Rajiv Mehta has confirmed a session for tomorrow at 5 PM.",
    type: "MENTOR",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: "n6",
    title: "New role unlocked: Cybersecurity Analyst",
    Descripton: "Based on your NCC background, you now qualify for Cybersecurity Analyst openings.",
    type: "JOB_MATCH",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
  },
];

export default notifications;
