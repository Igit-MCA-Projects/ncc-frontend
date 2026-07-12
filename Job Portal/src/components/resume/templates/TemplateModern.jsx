// Template 2: Centered Classic — centered headings with full-width rules (image 2 style)
export default function TemplateModern({ resume }) {
  const { personal, summary, education, skills, experience, projects, certifications, languages, customSections, hiddenSections } = resume;
  const hidden = hiddenSections || [];
  const isHidden = (s) => hidden.includes(s);

  const SectionTitle = ({ title }) => (
    <div style={{ textAlign: "center", margin: "12px 0 8px" }}>
      <div style={{ borderTop: "1.5px solid #1a1a1a", marginBottom: 4 }} />
      <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#000", margin: 0 }}>{title}</h2>
      <div style={{ borderTop: "1.5px solid #1a1a1a", marginTop: 4 }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Times New Roman', 'Georgia', serif", fontSize: 9.5, color: "#1a1a1a", background: "#fff", lineHeight: 1.5, padding: "24px 28px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", letterSpacing: "0.02em", color: "#000" }}>
          {personal.fullName || "Your Name"}
        </h1>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 16px", fontSize: 8.5, color: "#444" }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>☎ {personal.phone}</span>}
          {personal.address && <span>⚐ {personal.address}</span>}
          {personal.linkedin && <span style={{ textDecoration: "underline" }}>in/{personal.linkedin}</span>}
          {personal.github && <span style={{ textDecoration: "underline" }}>github.com/{personal.github}</span>}
          {personal.website && <span style={{ textDecoration: "underline" }}>{personal.website}</span>}
        </div>
      </div>

      {!isHidden("summary") && summary && (
        <>
          <SectionTitle title="Summary" />
          <p style={{ margin: 0, fontSize: 9.5, color: "#333", lineHeight: 1.6 }}>{summary}</p>
        </>
      )}

      {!isHidden("education") && (education || []).length > 0 && (
        <>
          <SectionTitle title="Education" />
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: i < education.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 10 }}>{edu.school}</span>
                <span style={{ fontSize: 8.5, color: "#555" }}>{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ""}</span>
              </div>
              <div style={{ fontSize: 9, color: "#444" }}>{edu.degree}{edu.cgpa ? ` - ${edu.cgpa}` : ""}</div>
              {edu.description && (
                <ul style={{ margin: "4px 0 0 16px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {edu.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {!isHidden("experience") && (experience || []).length > 0 && (
        <>
          <SectionTitle title="Experience" />
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: i < experience.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 10 }}>{exp.company}</span>
                <span style={{ fontSize: 8.5, color: "#555" }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? " – Present" : ""}</span>
              </div>
              <div style={{ fontSize: 9, color: "#555", marginBottom: 2 }}>{exp.role || exp.title}{exp.location ? ` · ${exp.location}` : ""}</div>
              {exp.description && (
                <ul style={{ margin: "3px 0 0 16px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {exp.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {!isHidden("skills") && (skills || []).length > 0 && (
        <>
          <SectionTitle title="Skills" />
          <div style={{ columns: 2, gap: 20 }}>
            {(skills || []).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 5, fontSize: 8.5, marginBottom: 2, breakInside: "avoid" }}>
                <span style={{ fontWeight: 700 }}>•</span>
                <span>{typeof s === "string" ? s : s.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {!isHidden("projects") && (projects || []).length > 0 && (
        <>
          <SectionTitle title="Projects" />
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: i < projects.length - 1 ? 8 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 9.5 }}>{proj.title}</span>
                {proj.link && <span style={{ fontSize: 8.5, textDecoration: "underline" }}>{proj.link}</span>}
              </div>
              {proj.techStack && <div style={{ fontSize: 8.5, fontStyle: "italic", color: "#555" }}>{proj.techStack}</div>}
              {proj.description && <p style={{ margin: "2px 0 0", fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>{proj.description}</p>}
            </div>
          ))}
        </>
      )}

      {!isHidden("certifications") && (certifications || []).length > 0 && (
        <>
          <SectionTitle title="Certificate" />
          {certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: i < certifications.length - 1 ? 8 : 0 }}>
              <span style={{ fontWeight: 700, fontSize: 9.5 }}>{cert.name}{cert.issuer ? ` | ${cert.issuer}` : ""}{cert.year ? ` – ${cert.year}` : ""}</span>
              {cert.link && <div style={{ fontSize: 8, textDecoration: "underline", color: "#444" }}>{cert.link}</div>}
              {cert.description && (
                <ul style={{ margin: "3px 0 0 16px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {cert.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {!isHidden("languages") && (languages || []).length > 0 && (
        <>
          <SectionTitle title="Language" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px" }}>
            {(languages || []).map((lang, i) => (
              <div key={i} style={{ fontSize: 9, marginBottom: 2 }}>
                <span style={{ fontWeight: 700 }}>{lang.name} </span>
                <span style={{ color: "#555" }}>{lang.level}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {(customSections || []).filter(sec => !isHidden(`custom_${sec.id}`)).map((sec) => (
        <div key={sec.id}>
          <SectionTitle title={sec.title} />
          <p style={{ margin: 0, fontSize: 8.5, color: "#333", lineHeight: 1.5 }}>{sec.content}</p>
        </div>
      ))}
    </div>
  );
}
