import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  LevelFormat,
  Header,
  Footer,
  PageNumber,
  TabStopType,
  TabStopPosition,
} from 'docx'

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

function spacer(lines = 1) {
  return Array.from({ length: lines }, () =>
    new Paragraph({ children: [new TextRun('')] })
  )
}

function sectionHeader(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: 'Arial', size: 28, bold: true, color: '1A2744' })],
    spacing: { before: 360, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'C9A84C', space: 4 },
    },
  })
}

function subHeader(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: 'Arial', size: 24, bold: true, color: '2E3E60' })],
    spacing: { before: 240, after: 80 },
  })
}

function labelValue(label, value) {
  const isTaydennettava = !value || value.trim() === ''
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, font: 'Arial', size: 22, bold: true, color: '333333' }),
      new TextRun({
        text: isTaydennettava ? '[täydennettävä]' : value,
        font: 'Arial',
        size: 22,
        color: isTaydennettava ? 'A0A0A0' : '111111',
        italics: isTaydennettava,
      }),
    ],
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
  })
}

function bodyText(text, options = {}) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        font: 'Arial',
        size: 22,
        color: options.muted ? '777777' : '222222',
        italics: options.italics || false,
      }),
    ],
    spacing: { before: 40, after: 40 },
    indent: { left: options.indent || 0 },
  })
}

function allekirjoitusRivi(label) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}:  `, font: 'Arial', size: 22, bold: true }),
      new TextRun({ text: '_______________________________________________', font: 'Arial', size: 22, color: 'AAAAAA' }),
    ],
    spacing: { before: 200, after: 80 },
  })
}

function varallisuusTaulukko(rivit) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }
  const borders = { top: border, bottom: border, left: border, right: border }
  const headerShading = { fill: 'F0EDE6', type: ShadingType.CLEAR }

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        borders,
        shading: headerShading,
        width: { size: 5400, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 180, right: 180 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'Omaisuuserä', font: 'Arial', size: 20, bold: true, color: '1A2744' })],
          }),
        ],
      }),
      new TableCell({
        borders,
        shading: headerShading,
        width: { size: 2400, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 180, right: 180 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'Kuvaus', font: 'Arial', size: 20, bold: true, color: '1A2744' })],
          }),
        ],
      }),
      new TableCell({
        borders,
        shading: headerShading,
        width: { size: 2160, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 180, right: 180 },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: 'Arvo (€)', font: 'Arial', size: 20, bold: true, color: '1A2744' })],
          }),
        ],
      }),
    ],
  })

  const dataRows = rivit.map(({ kategoria, kuvaus, isEmpty }) =>
    new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 5400, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 180, right: 180 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: kategoria, font: 'Arial', size: 20, color: '222222' })],
            }),
          ],
        }),
        new TableCell({
          borders,
          width: { size: 2400, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 180, right: 180 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: kuvaus || '',
                  font: 'Arial',
                  size: 20,
                  color: '444444',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          borders,
          width: { size: 2160, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 180, right: 180 },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: '[täydennettävä]',
                  font: 'Arial',
                  size: 20,
                  color: 'A0A0A0',
                  italics: true,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  )

  return new Table({
    width: { size: 9960, type: WidthType.DXA },
    columnWidths: [5400, 2400, 2160],
    rows: [headerRow, ...dataRows],
  })
}

// -------------------------------------------------------
// Document builder
// -------------------------------------------------------

function buildDocument({ vainaja, pesanIlmoittaja, kuolinpaivaFormatted, varatLoydetyt, velatLoydetyt }) {
  const taydenettava = '[täydennettävä]'

  const children = [
    // ── OTSIKKO ──────────────────────────────────────────
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'PERUKIRJA', font: 'Arial', size: 56, bold: true, color: '1A2744' }),
      ],
      spacing: { before: 0, after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `Pesänhoitaja-sovelluksen perukirjapohja — ${new Date().toLocaleDateString('fi-FI')}`, font: 'Arial', size: 20, color: '999999', italics: true }),
      ],
      spacing: { before: 0, after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Tämä on esitäytetty pohja. Täydennä [täydennettävä]-kohdat ennen allekirjoitusta.', font: 'Arial', size: 20, color: 'CC8800', bold: true }),
      ],
      spacing: { before: 0, after: 480 },
    }),

    // ── 1. JOHDANTO ──────────────────────────────────────
    sectionHeader('1. JOHDANTO'),
    labelValue('Toimituspaikka', taydenettava),
    labelValue('Toimitusaika', taydenettava),
    ...spacer(1),
    subHeader('Pesän ilmoittaja'),
    labelValue('Nimi', pesanIlmoittaja || taydenettava),
    labelValue('Osoite', taydenettava),
    labelValue('Puhelinnumero', taydenettava),
    ...spacer(1),
    subHeader('Uskottu mies 1'),
    labelValue('Nimi', taydenettava),
    labelValue('Osoite', taydenettava),
    subHeader('Uskottu mies 2'),
    labelValue('Nimi', taydenettava),
    labelValue('Osoite', taydenettava),
    ...spacer(1),
    subHeader('Läsnäolijat'),
    bodyText('Merkitse jokainen perunkirjoitustilaisuudessa läsnä ollut henkilö.', { muted: true, italics: true }),
    labelValue('Läsnäolijat', taydenettava),
    ...spacer(1),
    subHeader('Perunkirjoituksen perustana olevat asiakirjat'),
    bodyText('☐  Virkatodistus vainajasta', { indent: 360 }),
    bodyText('☐  Virkatodistukset perillisistä / sukuselvitys', { indent: 360 }),
    bodyText('☐  Testamentti (jos on)', { indent: 360 }),
    bodyText('☐  Avioehto- tai avioehtosopimus (jos on)', { indent: 360 }),
    bodyText('☐  Muut liitteet: ' + taydenettava, { indent: 360 }),

    // ── 2. VAINAJAN TIEDOT ───────────────────────────────
    ...spacer(1),
    sectionHeader('2. VAINAJAN TIEDOT'),
    labelValue('Täydellinen nimi', vainaja || taydenettava),
    labelValue('Henkilötunnus', taydenettava),
    labelValue('Kuolinpäivä', kuolinpaivaFormatted || taydenettava),
    labelValue('Kotikunta', taydenettava),
    labelValue('Viimeinen osoite', taydenettava),
    labelValue('Siviilisääty kuolinhetkellä', taydenettava + '  (naimaton / naimisissa / leski / eronnut)'),
    labelValue('Ammatti / Eläkeläinen', taydenettava),

    // ── 3. KUOLINPESÄN OSAKKAAT ──────────────────────────
    ...spacer(1),
    sectionHeader('3. KUOLINPESÄN OSAKKAAT'),
    bodyText('Merkitse kaikki perilliset, mahdollinen leski sekä testamentinsaajat.', { muted: true, italics: true }),
    ...spacer(1),
    subHeader('Perilliset'),
    ...[1, 2, 3].flatMap(i => [
      bodyText(`Perillinen ${i}`, { indent: 0 }),
      labelValue('  Nimi', taydenettava),
      labelValue('  Sukulaissuhde', taydenettava + '  (lapsi / sisarus / vanhempi / muu)'),
      labelValue('  Henkilötunnus', taydenettava),
      labelValue('  Osoite', taydenettava),
      ...spacer(1),
    ]),
    bodyText('Lisää rivejä tarpeen mukaan.', { muted: true, italics: true }),
    ...spacer(1),
    subHeader('Leski (jos sovellettavissa)'),
    labelValue('Nimi', taydenettava),
    labelValue('Henkilötunnus', taydenettava),
    labelValue('Osoite', taydenettava),
    ...spacer(1),
    subHeader('Testamentinsaajat (jos testamentti on)'),
    labelValue('Nimi ja osuus', taydenettava),

    // ── 4. VARALLISUUSLUETTELO ───────────────────────────
    ...spacer(1),
    sectionHeader('4. VARALLISUUSLUETTELO'),
    bodyText('Arvot ilmoitetaan käypään arvoon kuolinhetkellä. Arvo-sarake täydennetään ennen allekirjoitusta.', { muted: true, italics: true }),
    ...spacer(1),

    subHeader('4.1 Vainajan varat'),
    ...(varatLoydetyt.length > 0
      ? [
          varallisuusTaulukko(
            varatLoydetyt.flatMap(({ kategoria, kirjaukset }) =>
              kirjaukset.map(k => ({ kategoria, kuvaus: k }))
            )
          ),
        ]
      : [bodyText('Ei kirjattuja varoja — täydennä käsin.', { muted: true, italics: true })]),

    ...spacer(1),
    subHeader('4.2 Vainajan velat'),
    bodyText('Hautauskulut ovat vähennyskelpoisia — merkitse erikseen.', { muted: true, italics: true }),
    ...spacer(1),
    ...(velatLoydetyt.length > 0
      ? [
          varallisuusTaulukko(
            velatLoydetyt.flatMap(({ kategoria, kirjaukset }) =>
              kirjaukset.map(k => ({ kategoria, kuvaus: k }))
            )
          ),
        ]
      : [bodyText('Ei kirjattuja velkoja — täydennä käsin.', { muted: true, italics: true })]),

    ...spacer(1),
    subHeader('4.3 Hautauskulut (vähennyskelpoinen)'),
    labelValue('Hautajaiskulut yhteensä', taydenettava),
    labelValue('Muistotilaisuuden kulut', taydenettava),
    labelValue('Hautakivi / Hautapaikan kulut', taydenettava),

    ...spacer(1),
    subHeader('4.4 Lesken varat ja velat (täytä jos vainaja oli naimisissa)'),
    bodyText('Laki edellyttää lesken varojen ja velkojen ilmoittamista, jos vainajalla oli avio-oikeus.', { muted: true, italics: true }),
    labelValue('Lesken varat yhteensä', taydenettava),
    labelValue('Lesken velat yhteensä', taydenettava),

    ...spacer(1),
    subHeader('4.5 Muut tiedot'),
    labelValue('Ennakkoperinnöt (jos on)', taydenettava),
    labelValue('Henkivakuutuskorvaukset (saaja)', taydenettava),
    labelValue('Testamentti (kyllä / ei)', taydenettava),

    // ── 5. YHTEENVETO ────────────────────────────────────
    ...spacer(1),
    sectionHeader('5. YHTEENVETO'),
    new Table({
      width: { size: 9960, type: WidthType.DXA },
      columnWidths: [7000, 2960],
      rows: [
        ...['Varat yhteensä (€)', 'Velat yhteensä (€)', 'Hautauskulut (€)', 'Nettovarallisuus (€)'].map(
          label =>
            new TableRow({
              children: [
                new TableCell({
                  borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' } },
                  width: { size: 7000, type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 180, right: 180 },
                  children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Arial', size: 22, bold: label.includes('Netto'), color: label.includes('Netto') ? '1A2744' : '333333' })] })],
                }),
                new TableCell({
                  borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' } },
                  width: { size: 2960, type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 180, right: 180 },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: '[täydennettävä]', font: 'Arial', size: 22, color: 'A0A0A0', italics: true })] })],
                }),
              ],
            })
        ),
      ],
    }),

    // ── 6. VAKUUTUKSET JA ALLEKIRJOITUKSET ──────────────
    ...spacer(2),
    sectionHeader('6. VAKUUTUKSET JA ALLEKIRJOITUKSET'),
    ...spacer(1),
    subHeader('Pesän ilmoittajan vakuutus'),
    bodyText(
      'Vakuutan, että olen antanut perukirjaan oikeat ja täydelliset tiedot pesän varoista ja veloista, ' +
      'enkä tietoisesti ole jättänyt mitään ilmoittamatta.',
      { italics: true }
    ),
    ...spacer(1),
    allekirjoitusRivi('Päiväys ja paikka'),
    allekirjoitusRivi('Pesän ilmoittajan allekirjoitus'),
    allekirjoitusRivi('Nimenselvennys'),
    ...spacer(2),
    subHeader('Uskottujen miesten vakuutus'),
    bodyText(
      'Vakuutamme, että olemme arvioineet perukirjaan merkityn omaisuuden parhaan ymmärryksemme ' +
      'mukaan käypään arvoonsa kuolinhetkellä, emmekä tietoisesti ole jättäneet mitään merkitsemättä.',
      { italics: true }
    ),
    ...spacer(1),
    allekirjoitusRivi('Päiväys ja paikka'),
    allekirjoitusRivi('Uskottu mies 1 — allekirjoitus'),
    allekirjoitusRivi('Nimenselvennys'),
    ...spacer(1),
    allekirjoitusRivi('Uskottu mies 2 — allekirjoitus'),
    allekirjoitusRivi('Nimenselvennys'),

    // ── HUOMAUTUS ────────────────────────────────────────
    ...spacer(2),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Perukirja on toimitettava Verohallinnolle kuukauden kuluessa perunkirjoitustilaisuudesta. ' +
                'Lähetä osoitteeseen: Verohallinto, PL 700, 00052 VERO — tai sähköisesti OmaVero-palvelussa.',
          font: 'Arial',
          size: 18,
          color: '888888',
          italics: true,
        }),
      ],
      spacing: { before: 120, after: 0 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 8 },
      },
    }),
  ]

  return new Document({
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 22, color: '222222' } },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 28, bold: true, font: 'Arial', color: '1A2744' },
          paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 24, bold: true, font: 'Arial', color: '2E3E60' },
          paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'PERUKIRJA — LUONNOS', font: 'Arial', size: 18, color: 'AAAAAA' }),
                  new TextRun({ text: '\t', font: 'Arial', size: 18 }),
                  new TextRun({ text: 'Pesänhoitaja-sovellus', font: 'Arial', size: 18, color: 'CCCCCC' }),
                ],
                tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                border: {
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: 'EEEEEE', space: 4 },
                },
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Sivu ', font: 'Arial', size: 18, color: 'AAAAAA' }),
                  new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: 'AAAAAA' }),
                  new TextRun({ text: ' / ', font: 'Arial', size: 18, color: 'AAAAAA' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: 'AAAAAA' }),
                ],
                border: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: 'EEEEEE', space: 4 },
                },
              }),
            ],
          }),
        },
        children,
      },
    ],
  })
}

// -------------------------------------------------------
// Route handler
// -------------------------------------------------------

export async function POST(request) {
  try {
    const body = await request.json()
    const { kuolinpesa, vahvistetutKirjaukset } = body

    const vainaja = kuolinpesa?.vainajan_nimi || ''
    const pesanIlmoittaja = kuolinpesa?.kayttaja_nimi || ''
    const kuolinpaiva = kuolinpesa?.kuolinpaiva || ''
    const kuolinpaivaFormatted = kuolinpaiva
      ? new Date(kuolinpaiva).toLocaleDateString('fi-FI')
      : ''

    // Varat muistilistan kategoriat
    const varatKategoriat = [
      { id: 'pankkitilit', teksti: 'Pankkitilit' },
      { id: 'kateinen', teksti: 'Käteinen' },
      { id: 'sijoitukset', teksti: 'Sijoitukset (osakkeet, rahastot)' },
      { id: 'asunnot', teksti: 'Asunto-osakkeet ja kiinteistöt' },
      { id: 'ajoneuvot', teksti: 'Ajoneuvot' },
      { id: 'metsa', teksti: 'Metsätilat' },
      { id: 'mokki', teksti: 'Kesämökki / vapaa-ajan kiinteistö' },
      { id: 'tallelokero', teksti: 'Tallelokero pankissa' },
      { id: 'krypto', teksti: 'Kryptovaluutat' },
      { id: 'osuuskunnat', teksti: 'Osuuskunnat' },
      { id: 'elakesaastot', teksti: 'Eläkesäästöt / kapitalisaatiosopimukset' },
      { id: 'veronpalautus', teksti: 'Veronpalautukset' },
      { id: 'lomarahat', teksti: 'Ansaitsemattomat lomarahat' },
      { id: 'vakuutuskorvaukset', teksti: 'Vakuutuskorvaukset (kesken)' },
      { id: 'arvoesineet', teksti: 'Arvoesineet (korut, taide, antiikki)' },
    ]

    const velatKategoriat = [
      { id: 'asuntolaina', teksti: 'Asuntolaina' },
      { id: 'kulutusluotot', teksti: 'Kulutusluotot ja pikavipit' },
      { id: 'autolaina', teksti: 'Autolaina / rahoitussopimus' },
      { id: 'opintolaina', teksti: 'Opintolaina' },
      { id: 'osamaksut', teksti: 'Osamaksusopimukset' },
      { id: 'takaukset', teksti: 'Takaukset' },
      { id: 'maksamattomat', teksti: 'Maksamattomat laskut' },
      { id: 'verorästit', teksti: 'Verorästit' },
    ]

    const vahv = vahvistetutKirjaukset || {}

    const varatLoydetyt = varatKategoriat
      .filter(k => Array.isArray(vahv[k.id]) && vahv[k.id].length > 0)
      .map(k => ({ kategoria: k.teksti, kirjaukset: vahv[k.id] }))

    const velatLoydetyt = velatKategoriat
      .filter(k => Array.isArray(vahv['velat_' + k.id]) && vahv['velat_' + k.id].length > 0)
      .map(k => ({ kategoria: k.teksti, kirjaukset: vahv['velat_' + k.id] }))

    const doc = buildDocument({
      vainaja,
      pesanIlmoittaja,
      kuolinpaivaFormatted,
      varatLoydetyt,
      velatLoydetyt,
    })

    const buffer = await Packer.toBuffer(doc)

    const safeVainaja = vainaja.replace(/[^a-zA-Z0-9_\-äöåÄÖÅ]/g, '_') || 'Perukirja'
    const filename = `Perukirja_${safeVainaja}_${new Date().toISOString().slice(0, 10)}.docx`

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('Perukirja generation error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
