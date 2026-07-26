# ChaseTalks resume template contract

## Reference

- Source: `/Users/eeri/Downloads/Копия ChaseTalks Resume Template.docx`
- SHA-256: `4982166ecdad18a949395bdc4c46ff2e03be3857ace7607a7d9bebcd0c0228a5`
- Rendered pages: 2
- Sections: 1
- Visual evidence: `tmp/chase_template/reference_render/page-1.png` and `page-2.png`
- Style evidence: `tmp/chase_template/template-style-evidence.json`
- Authoring target: retain the visual system of page 2; remove page 1, which is explanatory copy rather than resume content.

## Page system

- A4 portrait: 8.27 x 11.69 in.
- Margins: 0.39 in on all four sides.
- One section; no first/even/odd-page variants.
- No visible running header or footer.
- Final must render as exactly one page.

## Typography

- Primary family: Rubik.
- Emphasis family: Rubik Medium.
- Ink: `#282828`; background: white.
- Name: Rubik, 24 pt, bold, left aligned, single line spacing.
- Contact row: Rubik, 10 pt, regular, left aligned, single line spacing.
- Section headings: Rubik, bold, uppercase, dark ink, approximately 14 pt, with a 1.5 pt black bottom rule created by cell borders.
- Company/project labels and dates: Rubik Medium, 9 pt, dark ink.
- Body and bullet text: Rubik, 9 pt, dark ink, compact single spacing.
- Dates: right aligned in the narrow right column.
- Role and location: stacked under the company label.

## Lists and table geometry

- Resume body uses one 12-row, 2-column fixed-width table.
- Table grid: 7814 DXA + 2970 DXA = 10784 DXA.
- Section-heading and body rows are generally merged across both columns; company/date rows remain split.
- Section heading rows carry a black bottom border (`w:sz=12`).
- Content cells have no visible perimeter borders; white cell borders hide the table grid.
- Cell margins are 0 DXA on the main content side and 100 DXA on the right-hand heading/date side where present.
- Bullets use actual Word numbering; text indent 457200 EMU (0.5 in), hanging indent -228600 EMU (0.25 in).
- No fixed row height; source rows use `AT_LEAST`, so content may expand.

## Components and content flow

1. Name.
2. Contact line with plain-text separators and embedded hyperlinks.
3. PROFILE section: title/position row plus a compact summary paragraph.
4. EXPERIENCE section: two jobs, each with company/date row followed by role, location, and four bullets.
5. TECHNICAL SKILLS section: four compact labeled lines.
6. LANGUAGES section: one compact labeled line.

## Slot map

- `word/document.xml`, body paragraphs before the table:
  - Remove original paragraphs 0-14 (the instructional first page and its explicit page break).
  - Paragraph 15: replace `John Doe` with the candidate name.
  - Paragraph 17: replace all contact runs and hyperlink targets.
  - Paragraphs 16, 18, and 19 remain spacing elements unless render QA requires a small reduction.
- `word/document.xml`, table 0:
  - Row 0: replace EDUCATION with PROFILE; preserve heading border pattern.
  - Row 1: left = position; right = location.
  - Row 2: merged content = summary.
  - Row 3: preserve EXPERIENCE heading.
  - Rows 4-5: IVE STUDIO experience.
  - Rows 6-7: AI-DEF experience.
  - Row 8: replace PROJECTS with TECHNICAL SKILLS.
  - Row 9: merged content = four labeled skill lines.
  - Row 10: replace TECHNICAL SKILLS with LANGUAGES.
  - Row 11: merged content = one language line.

## Package preservation

- Editable: `word/document.xml`, `word/_rels/document.xml.rels`, and candidate-facing core metadata.
- Preserve-only: styles, numbering, theme, font table, settings, web settings, custom XML, headers/footers if present, and all other relationships/parts.
- Keep source fonts, table geometry, borders, numbering, page size, and margins recognizably unchanged.
- The retained source file itself must remain byte-for-byte unchanged.

## Fidelity gates

- Final page must visually derive from reference page 2: same left-aligned masthead, Rubik hierarchy, black section rules, two-column date alignment, body density, and bullet treatment.
- No instructional copy, sample John Doe content, education, projects, Meta, Atlassian, or placeholder details may remain.
- No invented achievements, projects, education, or metrics.
- No clipping, overlap, broken wrapping, or second page.
- Render and inspect final page at 100% and compare against reference page 2.
