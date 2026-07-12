// Template 1: Sidebar — dark left column with section labels, content on the right
export default function TemplateClassic({ resume }) {
  const { personal, summary, education, skills, experience, projects, certifications, languages, customSections, hiddenSections } = resume;
  const hidden = hiddenSections || [];
  const isHidden = (s) => hidden.includes(s);

  const SectionRow = ({ sectionKey, label, children }) => {
    if (isHidden(sectionKey)) return null;
    return (
      <div style={{ display: "flex" }}>
        <div style={{ width: "26%", background: "#1c1c1c", color: "#fff", padding: "12px 8px", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
          <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.3 }}>{label}</span>
        </div>
        <div style={{ flex: 1, padding: "10px 14px", borderBottom: "1px solid #e8e8e8", background: "#fff" }}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", fontSize: 9.5, color: "#1a1a1a", background: "#fff", lineHeight: 1.45 }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "20px 16px 14px", borderLeft: "4px solid #1c1c1c", borderBottom: "2px solid #1c1c1c" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#000", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
          {personal.fullName || "Your Name"}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 8.5, color: "#444" }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>☎ {personal.phone}</span>}
          {personal.address && <span>⚐ {personal.address}</span>}
          {personal.linkedin && <span style={{ textDecoration: "underline" }}>in/{personal.linkedin}</span>}
          {personal.github && <span style={{ textDecoration: "underline" }}>github.com/{personal.github}</span>}
          {personal.website && <span style={{ textDecoration: "underline" }}>{personal.website}</span>}
        </div>
      </div>

      {/* Section rows */}
      {!isHidden("summary") && summary && (
        <SectionRow sectionKey="summary" label="Summary">
          <p style={{ margin: 0, fontSize: 9, color: "#333", lineHeight: 1.55 }}>{summary}</p>
        </SectionRow>
      )}

      {!isHidden("education") && (education || []).length > 0 && (
        <SectionRow sectionKey="education" label="Education">
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: i < education.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 9.5 }}>{edu.school}</span>
                <span style={{ fontSize: 8.5, color: "#555" }}>{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ""}</span>
              </div>
              <div style={{ fontSize: 9, color: "#555" }}>{edu.degree}{edu.cgpa ? ` · ${edu.cgpa}` : ""}</div>
              {edu.description && (
                <ul style={{ margin: "3px 0 0 14px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {edu.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </SectionRow>
      )}

      {!isHidden("experience") && (experience || []).length > 0 && (
        <SectionRow sectionKey="experience" label="Experience">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: i < experience.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 9.5 }}>{exp.role || exp.title}</span>
                <span style={{ fontSize: 8.5, color: "#555" }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? " – Present" : ""}</span>
              </div>
              <div style={{ fontSize: 8.5, color: "#666" }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
              {exp.description && (
                <ul style={{ margin: "3px 0 0 14px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {exp.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </SectionRow>
      )}

      {!isHidden("skills") && (skills || []).length > 0 && (
        <SectionRow sectionKey="skills" label="Skills">
          <div style={{ columns: 2, gap: 12 }}>
            {(skills || []).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 4, fontSize: 8.5, marginBottom: 2, breakInside: "avoid" }}>
                <span style={{ color: "#1c1c1c", fontWeight: 700, marginTop: 1, lineHeight: 1 }}>•</span>
                <span>{typeof s === "string" ? s : s.name}</span>
              </div>
            ))}
          </div>
        </SectionRow>
      )}

      {!isHidden("projects") && (projects || []).length > 0 && (
        <SectionRow sectionKey="projects" label="Projects">
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: i < projects.length - 1 ? 8 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 9.5 }}>{proj.title}</span>
                {proj.link && <span style={{ fontSize: 8.5, textDecoration: "underline", color: "#333" }}>{proj.link}</span>}
              </div>
              {proj.techStack && <div style={{ fontSize: 8.5, color: "#666", fontStyle: "italic" }}>{proj.techStack}</div>}
              {proj.description && <p style={{ margin: "2px 0 0", fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>{proj.description}</p>}
            </div>
          ))}
        </SectionRow>
      )}

      {!isHidden("certifications") && (certifications || []).length > 0 && (
        <SectionRow sectionKey="certifications" label="Certificate">
          {certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: i < certifications.length - 1 ? 8 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 9.5 }}>{cert.name}{cert.issuer ? ` | ${cert.issuer}` : ""}{cert.year ? ` | ${cert.year}` : ""}</span>
              </div>
              {cert.description && (
                <ul style={{ margin: "3px 0 0 14px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {cert.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
              {cert.link && <div style={{ fontSize: 8.5, textDecoration: "underline", color: "#333" }}>{cert.link}</div>}
            </div>
          ))}
        </SectionRow>
      )}

      {!isHidden("languages") && (languages || []).length > 0 && (
        <SectionRow sectionKey="languages" label="Language">
          {(languages || []).map((lang, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 9, marginBottom: 3 }}>
              <span style={{ fontWeight: 700 }}>{lang.name}</span>
              <span style={{ color: "#555" }}>{lang.level}</span>
            </div>
          ))}
        </SectionRow>
      )}

      {(customSections || []).filter(sec => !isHidden(`custom_${sec.id}`)).map((sec) => (
        <SectionRow key={sec.id} sectionKey={`custom_${sec.id}`} label={sec.title}>
          <p style={{ margin: 0, fontSize: 8.5, color: "#333", lineHeight: 1.5 }}>{sec.content}</p>
        </SectionRow>
      ))}
    </div>
  );
}
