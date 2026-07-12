// Template 4: Elegant — large serif name centered, double-rule, centered contact, minimal sections (image 4 style)
export default function TemplateElegant({ resume }) {
  const { personal, summary, education, skills, experience, projects, certifications, languages, customSections, hiddenSections } = resume;
  const hidden = hiddenSections || [];
  const isHidden = (s) => hidden.includes(s);

  const SectionTitle = ({ title }) => (
    <div style={{ margin: "12px 0 6px" }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, color: "#000", margin: 0, fontStyle: "italic" }}>{title}</h2>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Times New Roman', 'Georgia', serif", fontSize: 9.5, color: "#1a1a1a", background: "#fff", lineHeight: 1.5, padding: "28px 36px" }}>
      {/* Large Name */}
      <h1 style={{ fontSize: 30, fontWeight: 900, color: "#000", textAlign: "center", margin: "0 0 8px", letterSpacing: "0.01em" }}>
        {personal.fullName || "Your Name"}
      </h1>

      {/* Summary centered below name */}
      {!isHidden("summary") && summary && (
        <p style={{ textAlign: "center", margin: "0 auto 10px", fontSize: 9, color: "#333", lineHeight: 1.65, maxWidth: "85%" }}>{summary}</p>
      )}

      {/* Double rule */}
      <div style={{ borderTop: "2px solid #000", marginBottom: 3 }} />
      <div style={{ borderTop: "0.75px solid #000", marginBottom: 8 }} />

      {/* Contact centered */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 18px", fontSize: 8.5, color: "#555", marginBottom: 14 }}>
        {personal.address && <span>⚐ {personal.address}</span>}
        {personal.email && <span>✉ {personal.email}</span>}
        {personal.phone && <span>☎ {personal.phone}</span>}
        {personal.linkedin && <span style={{ textDecoration: "underline" }}>in/{personal.linkedin}</span>}
        {personal.github && <span style={{ textDecoration: "underline" }}>github.com/{personal.github}</span>}
        {personal.website && <span style={{ textDecoration: "underline" }}>{personal.website}</span>}
      </div>

      {/* Education */}
      {!isHidden("education") && (education || []).length > 0 && (
        <>
          <SectionTitle title="Education" />
          <hr style={{ border: "none", borderTop: "0.75px solid #aaa", margin: "0 0 6px" }} />
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 9 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 10 }}>{edu.degree}{edu.cgpa ? ` – ${edu.cgpa}` : ""}</span>
                <span style={{ fontSize: 8.5, color: "#555" }}>{edu.startYear}{edu.endYear ? ` to ${edu.endYear}` : ""}</span>
              </div>
              <div style={{ fontSize: 9, color: "#555" }}>{edu.school}</div>
              {edu.description && (
                <ul style={{ margin: "3px 0 0 16px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
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
          <hr style={{ border: "none", borderTop: "0.75px solid #aaa", margin: "0 0 6px" }} />
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 9 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 10 }}>{exp.role || exp.title}</span>
                <span style={{ fontSize: 8.5, color: "#555" }}>{exp.startDate}{exp.endDate ? ` to ${exp.endDate}` : exp.current ? " to Present" : ""}</span>
              </div>
              <div style={{ fontSize: 9, color: "#555", marginBottom: 2 }}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
              {exp.description && (
                <ul style={{ margin: "2px 0 0 16px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {exp.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Skills — 2 col */}
      {!isHidden("skills") && (skills || []).length > 0 && (
        <>
          <SectionTitle title="Skills" />
          <hr style={{ border: "none", borderTop: "0.75px solid #aaa", margin: "0 0 6px" }} />
          <div style={{ columns: 2, gap: 24 }}>
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
          <hr style={{ border: "none", borderTop: "0.75px solid #aaa", margin: "0 0 6px" }} />
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 7 }}>
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

      {/* Certifications */}
      {!isHidden("certifications") && (certifications || []).length > 0 && (
        <>
          <SectionTitle title="Certificate" />
          <hr style={{ border: "none", borderTop: "0.75px solid #aaa", margin: "0 0 6px" }} />
          {certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: 7 }}>
              <span style={{ fontWeight: 700, fontSize: 9.5 }}>{cert.name}{cert.issuer ? ` | ${cert.issuer}` : ""}{cert.year ? ` – ${cert.year}` : ""}</span>
              {cert.link && <div style={{ fontSize: 8, textDecoration: "underline", color: "#444" }}>{cert.link}</div>}
              {cert.description && (
                <ul style={{ margin: "2px 0 0 16px", padding: 0, fontSize: 8.5, color: "#444", lineHeight: 1.5 }}>
                  {cert.description.split("\n").filter(Boolean).map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Languages — 2 col */}
      {!isHidden("languages") && (languages || []).length > 0 && (
        <>
          <SectionTitle title="Language" />
          <hr style={{ border: "none", borderTop: "0.75px solid #aaa", margin: "0 0 6px" }} />
          <div style={{ columns: 2, gap: 24 }}>
            {(languages || []).map((lang, i) => (
              <div key={i} style={{ fontSize: 9, marginBottom: 3, breakInside: "avoid" }}>
                <span style={{ fontWeight: 700 }}>{lang.name}: </span>
                <span style={{ color: "#555" }}>{lang.level}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {(customSections || []).filter(sec => !isHidden(`custom_${sec.id}`)).map((sec) => (
        <div key={sec.id}>
          <SectionTitle title={sec.title} />
          <hr style={{ border: "none", borderTop: "0.75px solid #aaa", margin: "0 0 6px" }} />
          <p style={{ margin: 0, fontSize: 8.5, color: "#333", lineHeight: 1.5 }}>{sec.content}</p>
        </div>
      ))}
    </div>
  );
}
