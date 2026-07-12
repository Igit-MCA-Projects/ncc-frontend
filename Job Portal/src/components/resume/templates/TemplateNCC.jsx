// Template 3: Compact — large name top-left, summary, contact row, sections with underline title (image 3 style)
export default function TemplateNCC({ resume }) {
  const { personal, summary, education, skills, experience, projects, certifications, languages, customSections, hiddenSections } = resume;
  const hidden = hiddenSections || [];
  const isHidden = (s) => hidden.includes(s);

  const SectionTitle = ({ title }) => (
    <div style={{ marginBottom: 6, marginTop: 12 }}>
      <h2 style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#000", margin: "0 0 3px", borderBottom: "1.5px solid #000", paddingBottom: 2, display: "inline-block" }}>{title}</h2>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", fontSize: 9.5, color: "#1a1a1a", background: "#fff", lineHeight: 1.45, padding: "24px 28px" }}>
      {/* Name */}
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#000", margin: "0 0 6px", textAlign: "center" }}>
        {personal.fullName || "Your Name"}
      </h1>

      {/* Summary below name (image 3 style: summary right under name) */}
      {!isHidden("summary") && summary && (
        <p style={{ margin: "0 auto 10px", fontSize: 9, color: "#333", lineHeight: 1.6, textAlign: "center", maxWidth: "90%" }}>{summary}</p>
      )}

      {/* Contact row */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 16px", fontSize: 8.5, color: "#555", marginBottom: 10 }}>
        {personal.email && <span>✉ {personal.email}</span>}
        {personal.phone && <span>☎ {personal.phone}</span>}
        {personal.address && <span>⚐ {personal.address}</span>}
        {personal.linkedin && <span style={{ textDecoration: "underline" }}>in/{personal.linkedin}</span>}
        {personal.github && <span style={{ textDecoration: "underline" }}>github.com/{personal.github}</span>}
        {personal.website && <span style={{ textDecoration: "underline" }}>{personal.website}</span>}
      </div>

      <hr style={{ border: "none", borderTop: "1.5px solid #000", margin: "0 0 4px" }} />

      {/* Education */}
      {!isHidden("education") && (education || []).length > 0 && (
        <>
          <SectionTitle title="Education" />
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 10 }}>{edu.school}</span>
                <span style={{ fontSize: 8.5, color: "#555" }}>{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ""}</span>
              </div>
              <div style={{ fontSize: 9, color: "#444" }}>{edu.degree}{edu.cgpa ? ` - ${edu.cgpa}` : ""}</div>
              {edu.description && (
                <ul style={{ margin: "2px 0 0 14px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {edu.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Experience */}
      {!isHidden("experience") && (experience || []).length > 0 && (
        <>
          <SectionTitle title="Experience" />
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 10 }}>{exp.role || exp.title}</span>
                <span style={{ fontSize: 8.5, color: "#555" }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? " – Present" : ""}</span>
              </div>
              <div style={{ fontSize: 8.5, color: "#666" }}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
              {exp.description && (
                <ul style={{ margin: "2px 0 0 14px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {exp.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {!isHidden("skills") && (skills || []).length > 0 && (
        <>
          <SectionTitle title="Skills" />
          <div style={{ columns: 2, gap: 20 }}>
            {(skills || []).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 5, fontSize: 8.5, marginBottom: 2, breakInside: "avoid" }}>
                <span>•</span>
                <span>{typeof s === "string" ? s : s.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Projects */}
      {!isHidden("projects") && (projects || []).length > 0 && (
        <>
          <SectionTitle title="Projects" />
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 9.5 }}>{proj.title}</span>
                {proj.link && <span style={{ fontSize: 8.5, textDecoration: "underline" }}>{proj.link}</span>}
              </div>
              {proj.techStack && <span style={{ fontSize: 8.5, fontStyle: "italic", color: "#555" }}>{proj.techStack}</span>}
              {proj.description && <p style={{ margin: "2px 0 0", fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>{proj.description}</p>}
            </div>
          ))}
        </>
      )}

      {/* Certifications */}
      {!isHidden("certifications") && (certifications || []).length > 0 && (
        <>
          <SectionTitle title="Certificate" />
          {certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: 7 }}>
              <div style={{ fontWeight: 700, fontSize: 9.5 }}>{cert.name}{cert.issuer ? ` | ${cert.issuer}` : ""}{cert.year ? ` – ${cert.year}` : ""}</div>
              {cert.link && <div style={{ fontSize: 8, textDecoration: "underline" }}>{cert.link}</div>}
              {cert.description && (
                <ul style={{ margin: "2px 0 0 14px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {cert.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Languages */}
      {!isHidden("languages") && (languages || []).length > 0 && (
        <>
          <SectionTitle title="Language" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 24px" }}>
            {(languages || []).map((lang, i) => (
              <div key={i} style={{ fontSize: 9, marginBottom: 2 }}>
                <span style={{ fontWeight: 700, marginRight: 4 }}>{lang.name}</span>
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
