import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, Header, Footer,
  PageNumber, TabStopType, TabStopPosition,
} from 'docx'

const border = { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }
const borders = { top: border, bottom: border, left: border, right: border }
const headerShading = { fill: 'F0EDE6', type: ShadingType.CLEAR }

function docTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, font: 'Arial', size: 52, bold: true, color: '1A2744' })],
    spacing: { before: 0, after: 80 },
  })
}

function meta(vainajan_nimi) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: `Vainaja: ${vainajan_nimi || '[täydennettävä]'}`, font: 'Arial', size: 20, color: '555555' }),
      new TextRun({ text: '   |   ', font: 'Arial', size: 20, color: 'AAAAAA' }),
      new TextRun({ text: `Laadittu: ${new Date().toLocaleDateString('fi-FI')}`, font: 'Arial', size: 20, color: '555555' }),
    ],
    spacing: { before: 0, after: 320 },
  })
}

function note(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Arial', size: 19, color: 'CC8800', italics: true })],
    spacing: { before: 0, after: 240 },
  })
}

function spacer() {
  return new Paragraph({ children: [new TextRun('')], spacing: { before: 0, after: 120 } })
}

function totalRow(label) {
  return new TableRow({
    children: [
      new TableCell({
        borders,
        shading: { fill: 'F7F4EF', type: ShadingType.CLEAR },
        columnSpan: 2,
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Arial', size: 22, bold: true, color: '1A2744' })] })],
      }),
      new TableCell({
        borders,
        shading: { fill: 'F7F4EF', type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: '_____________________', font: 'Arial', size: 22, color: 'AAAAAA' })] })],
      }),
    ],
  })
}

function headerRow(cols) {
  return new TableRow({
    tableHeader: true,
    children: cols.map(({ text, width }) =>
      new TableCell({
        borders, shading: headerShading, width: { size: width, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 180, right: 180 },
        children: [new Paragraph({ children: [new TextRun({ text, font: 'Arial', size: 20, bold: true, color: '1A2744' })] })],
      })
    ),
  })
}

function dataRow(cells) {
  return new TableRow({
    children: cells.map(({ text, width, align, muted }) =>
      new TableCell({
        borders, width: { size: width, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 180, right: 180 },
        children: [new Paragraph({
          alignment: align || AlignmentType.LEFT,
          children: [new TextRun({ text: text || '', font: 'Arial', size: 20, color: muted ? '888888' : '222222' })],
        })],
      })
    ),
  })
}

function makeHeader(title) {
  return new Header({
    children: [new Paragraph({
      children: [
        new TextRun({ text: title, font: 'Arial', size: 18, color: 'AAAAAA' }),
        new TextRun({ text: '\t', font: 'Arial', size: 18 }),
        new TextRun({ text: 'Pesänhoitaja-sovellus', font: 'Arial', size: 18, color: 'CCCCCC' }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'EEEEEE', space: 4 } },
    })],
  })
}

function makeFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Sivu ', font: 'Arial', size: 18, color: 'AAAAAA' }),
        new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: 'AAAAAA' }),
        new TextRun({ text: ' / ', font: 'Arial', size: 18, color: 'AAAAAA' }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: 'AAAAAA' }),
      ],
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'EEEEEE', space: 4 } },
    })],
  })
}

function buildVaratDoc(vainajan_nimi, data) {
  const rows = data.flatMap(({ kategoria, kirjaukset }) =>
    kirjaukset.map((k, i) =>
      dataRow([
        { text: i === 0 ? kategoria : '', width: 3600 },
        { text: k, width: 4800 },
        { text: '', width: 1560 },
      ])
    )
  )

  return new Document({
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 } } },
      headers: { default: makeHeader('VARALLISUUSLUETTELO — LUONNOS') },
      footers: { default: makeFooter() },
      children: [
        docTitle('VARALLISUUSLUETTELO'),
        meta(vainajan_nimi),
        note('Täydennä Arvo (€) -sarake ennen perunkirjoitusta. Arvot ilmoitetaan käypään arvoon kuolinhetkellä.'),
        rows.length > 0
          ? new Table({
              width: { size: 9960, type: WidthType.DXA },
              columnWidths: [3600, 4800, 1560],
              rows: [
                headerRow([
                  { text: 'Omaisuuserä', width: 3600 },
                  { text: 'Kuvaus / tunniste', width: 4800 },
                  { text: 'Arvo (€)', width: 1560 },
                ]),
                ...rows,
                totalRow('Varat yhteensä (€)'),
              ],
            })
          : new Paragraph({ children: [new TextRun({ text: 'Ei kirjattuja varoja.', font: 'Arial', size: 20, color: '888888', italics: true })] }),
      ],
    }],
  })
}

function buildVelatDoc(vainajan_nimi, data) {
  const rows = data.flatMap(({ kategoria, kirjaukset }) =>
    kirjaukset.map((k, i) =>
      dataRow([
        { text: i === 0 ? kategoria : '', width: 3600 },
        { text: k, width: 4800 },
        { text: '', width: 1560 },
      ])
    )
  )

  return new Document({
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 } } },
      headers: { default: makeHeader('VELKALUETTELO — LUONNOS') },
      footers: { default: makeFooter() },
      children: [
        docTitle('VELKALUETTELO'),
        meta(vainajan_nimi),
        note('Täydennä Summa (€) -sarake. Tarkista jäljellä olevat saldot pankeilta ja luottolaitoksilta.'),
        rows.length > 0
          ? new Table({
              width: { size: 9960, type: WidthType.DXA },
              columnWidths: [3600, 4800, 1560],
              rows: [
                headerRow([
                  { text: 'Velka', width: 3600 },
                  { text: 'Kuvaus / tunniste', width: 4800 },
                  { text: 'Summa (€)', width: 1560 },
                ]),
                ...rows,
                totalRow('Velat yhteensä (€)'),
              ],
            })
          : new Paragraph({ children: [new TextRun({ text: 'Ei kirjattuja velkoja.', font: 'Arial', size: 20, color: '888888', italics: true })] }),
      ],
    }],
  })
}

function buildSopimuksetDoc(vainajan_nimi, data) {
  const tilaVari = (tila) => tila === 'hoidettu' ? '2E7D32' : tila === 'ei' ? '888888' : 'CC8800'
  const tilaLabel = (tila) => tila === 'hoidettu' ? 'Hoidettu' : tila === 'ei' ? 'Ei koske' : 'Kesken'

  const rows = data.map(({ nimi, kategoria, tila }) =>
    new TableRow({
      children: [
        new TableCell({ borders, width: { size: 4400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 180, right: 180 }, children: [new Paragraph({ children: [new TextRun({ text: nimi, font: 'Arial', size: 20, color: '222222' })] })] }),
        new TableCell({ borders, width: { size: 3200, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 180, right: 180 }, children: [new Paragraph({ children: [new TextRun({ text: kategoria, font: 'Arial', size: 20, color: '555555' })] })] }),
        new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 180, right: 180 }, children: [new Paragraph({ children: [new TextRun({ text: tilaLabel(tila), font: 'Arial', size: 20, bold: true, color: tilaVari(tila) })] })] }),
        new TableCell({ borders, width: { size: 800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 180, right: 180 }, children: [new Paragraph({ children: [new TextRun({ text: '', font: 'Arial', size: 20 })] })] }),
      ],
    })
  )

  return new Document({
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 } } },
      headers: { default: makeHeader('SOPIMUSLUETTELO — LUONNOS') },
      footers: { default: makeFooter() },
      children: [
        docTitle('SOPIMUSLUETTELO'),
        meta(vainajan_nimi),
        note('Listaa kaikki sopimukset ja niiden tila. Lisää huomiot-sarakkeeseen tarvittavat lisätiedot.'),
        rows.length > 0
          ? new Table({
              width: { size: 9960, type: WidthType.DXA },
              columnWidths: [4400, 3200, 1560, 800],
              rows: [
                headerRow([
                  { text: 'Sopimus', width: 4400 },
                  { text: 'Kategoria', width: 3200 },
                  { text: 'Tila', width: 1560 },
                  { text: 'Huomiot', width: 800 },
                ]),
                ...rows,
              ],
            })
          : new Paragraph({ children: [new TextRun({ text: 'Ei käsiteltyjä sopimuksia.', font: 'Arial', size: 20, color: '888888', italics: true })] }),
      ],
    }],
  })
}

export async function POST(request) {
  try {
    const { tyyppi, vainajan_nimi, data } = await request.json()

    let doc
    if (tyyppi === 'varat') doc = buildVaratDoc(vainajan_nimi, data)
    else if (tyyppi === 'velat') doc = buildVelatDoc(vainajan_nimi, data)
    else if (tyyppi === 'sopimukset') doc = buildSopimuksetDoc(vainajan_nimi, data)
    else return new Response(JSON.stringify({ error: 'Tuntematon tyyppi' }), { status: 400 })

    const buffer = await Packer.toBuffer(doc)
    const nimiSafe = (vainajan_nimi || 'Yhteenveto').replace(/[^a-zA-Z0-9_\-äöåÄÖÅ]/g, '_')
    const tyypit = { varat: 'Varallisuusluettelo', velat: 'Velkaluettelo', sopimukset: 'Sopimusluettelo' }
    const filename = `${tyypit[tyyppi]}_${nimiSafe}_${new Date().toISOString().slice(0, 10)}.docx`

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('Yhteenveto generation error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
