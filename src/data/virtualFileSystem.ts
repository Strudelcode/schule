import { VFile } from '../types';

export const INITIAL_FILES: VFile[] = [
  // --- ROOT FOLDERS ---
  {
    id: 'f_org',
    name: '00_Organisation',
    path: '/00_Organisation',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '15.02.2026 09:30',
  },
  {
    id: 'f_de',
    name: '01_Deutsch',
    path: '/01_Deutsch',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '22.02.2026 11:15',
  },
  {
    id: 'f_en',
    name: '02_Englisch',
    path: '/02_Englisch',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '20.02.2026 14:00',
  },
  {
    id: 'f_it',
    name: '03_Italienisch',
    path: '/03_Italienisch',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '18.02.2026 10:20',
  },
  {
    id: 'f_math',
    name: '04_Mathematik',
    path: '/04_Mathematik',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '25.02.2026 08:45',
  },
  {
    id: 'f_natwi',
    name: '05_Natwi - Biologie',
    path: '/05_Natwi - Biologie',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '12.02.2026 13:10',
  },
  {
    id: 'f_geo',
    name: '06_Geografie',
    path: '/06_Geografie',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '19.02.2026 15:40',
  },
  {
    id: 'f_hist',
    name: '07_Geschichte',
    path: '/07_Geschichte',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '16.02.2026 16:20',
  },
  {
    id: 'f_lern',
    name: '08_Lernberatung',
    path: '/08_Lernberatung',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '10.02.2026 11:00',
  },
  {
    id: 'f_kit',
    name: '09_Kit',
    path: '/09_Kit',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '05.02.2026 09:15',
  },
  {
    id: 'f_rel',
    name: '10_Religion',
    path: '/10_Religion',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '14.02.2026 12:00',
  },
  {
    id: 'f_mus',
    name: '11_Musik',
    path: '/11_Musik',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '08.02.2026 10:45',
  },
  {
    id: 'f_bib',
    name: '12_Bibliothek',
    path: '/12_Bibliothek',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '24.02.2026 17:30',
  },
  {
    id: 'f_pruf',
    name: '13_Abschlussprüfung',
    path: '/13_Abschlussprüfung',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '27.02.2026 14:15',
  },
  {
    id: 'f_unklar',
    name: '99_Unklar zuordnen',
    path: '/99_Unklar zuordnen',
    parentId: 'root',
    isFolder: true,
    type: 'folder',
    dateModified: '26.02.2026 18:00',
  },

  // --- 00_Organisation SUBFOLDERS & FILES ---
  {
    id: 'f_org_tab',
    name: 'Tabellen',
    path: '/00_Organisation/Tabellen',
    parentId: 'f_org',
    isFolder: true,
    type: 'folder',
    dateModified: '15.02.2026 09:30',
  },
  {
    id: 'f_org_pres',
    name: 'Präsentation',
    path: '/00_Organisation/Präsentation',
    parentId: 'f_org',
    isFolder: true,
    type: 'folder',
    dateModified: '15.02.2026 09:30',
  },
  {
    id: 'f_org_vorl',
    name: 'Vorlagen und Links',
    path: '/00_Organisation/Vorlagen und Links',
    parentId: 'f_org',
    isFolder: true,
    type: 'folder',
    dateModified: '15.02.2026 09:30',
  },
  {
    id: 'file_stundenplan_xlsx',
    name: 'Stundenplan-Schule.xlsx',
    path: '/00_Organisation/Tabellen/Stundenplan-Schule.xlsx',
    parentId: 'f_org_tab',
    isFolder: false,
    type: 'xlsx',
    size: '18.4 KB',
    dateModified: '15.02.2026 09:35',
    spreadsheet: {
      sheets: [
        {
          name: 'Stundenplan',
          rows: [
            ['Stunde', 'Zeit', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'],
            ['1. Stunde', '07:50 - 08:40', 'Mathematik (R204)', 'Deutsch (R204)', 'Englisch (R204)', 'Mathematik (R204)', 'Deutsch (R204)'],
            ['2. Stunde', '08:40 - 09:30', 'Mathematik (R204)', 'Deutsch (R204)', 'Englisch (R204)', 'Mathematik (R204)', 'Italienisch (R204)'],
            ['Pause', '09:30 - 09:45', '--- Pause ---', '--- Pause ---', '--- Pause ---', '--- Pause ---', '--- Pause ---'],
            ['3. Stunde', '09:45 - 10:35', 'Deutsch (R204)', 'Mathematik (R204)', 'Italienisch (R204)', 'Biologie / Natwi (Bio-Saal)', 'Geografie (R204)'],
            ['4. Stunde', '10:35 - 11:25', 'Geschichte (R204)', 'Italienisch (R204)', 'Biologie / Natwi (Bio-Saal)', 'Geografie (R204)', 'Geschichte (R204)'],
            ['5. Stunde', '11:30 - 12:20', 'Englisch (R204)', 'Musik (Musikraum)', 'Lernberatung (R204)', 'Religion (R204)', 'Sport / Bewegung (Turnhalle)'],
            ['6. Stunde', '12:20 - 13:10', 'Technik (Werkraum)', 'Freistunde / Essen', 'Informatik / KIT (PC-Raum)', 'Freistunde', 'Wochenabschluss'],
          ],
        },
      ],
    },
  },
  {
    id: 'file_azug_pptx',
    name: 'A-Zug Rückblick.pptx',
    path: '/00_Organisation/Präsentation/A-Zug Rückblick.pptx',
    parentId: 'f_org_pres',
    isFolder: false,
    type: 'pptx',
    size: '2.4 MB',
    dateModified: '14.02.2026 11:20',
    slides: [
      {
        title: 'Rückblick auf den A-Zug',
        bullets: [
          'Gemeinsame Schuljahre & Meilensteine',
          'Projekte: Lesekarren, Naturwissenschaftliche Exkursionen',
          'Vorbereitung auf die Abschlussprüfung 2026',
        ],
        notes: 'Einleitung durch die Klassensprecher und Lehrpersonen.',
      },
      {
        title: 'Höhepunkte & Projekte',
        bullets: [
          'Wissenschaftliche Experimente im Natwi-Labor',
          'Sprachreisen und Theaterprojekte in Italienisch & Englisch',
          'Großes Fußballturnier der Mittelschule',
        ],
      },
      {
        title: 'Ausblick auf das Abschlussjahr',
        bullets: [
          'Themenwahl der interdisziplinären Facharbeit',
          'Lern- und Prüfungsvorbereitung im 2. Semester',
          'Gemeinsame Abschlussfeier',
        ],
      },
    ],
  },
  {
    id: 'file_schule_url',
    name: 'schule.url',
    path: '/00_Organisation/Vorlagen und Links/schule.url',
    parentId: 'f_org_vorl',
    isFolder: false,
    type: 'url',
    size: '1.2 KB',
    dateModified: '10.01.2026 10:00',
    content: 'https://schule.digital-portal.schule',
  },

  // --- 01_Deutsch SUBFOLDERS & FILES ---
  {
    id: 'f_de_dok',
    name: 'Dokumente',
    path: '/01_Deutsch/Dokumente',
    parentId: 'f_de',
    isFolder: true,
    type: 'folder',
    dateModified: '22.02.2026 11:15',
  },
  {
    id: 'f_de_regel',
    name: 'Regelheft',
    path: '/01_Deutsch/Dokumente/Regelheft',
    parentId: 'f_de_dok',
    isFolder: true,
    type: 'folder',
    dateModified: '20.02.2026 10:00',
  },
  {
    id: 'f_de_aufsatz',
    name: 'Aufsatz und Texte',
    path: '/01_Deutsch/Dokumente/Aufsatz',
    parentId: 'f_de_dok',
    isFolder: true,
    type: 'folder',
    dateModified: '18.02.2026 14:30',
  },
  {
    id: 'file_de_wortarten',
    name: 'Regelheft - Die 10 Wortarten.docx',
    path: '/01_Deutsch/Dokumente/Regelheft/Regelheft - Die 10 Wortarten.docx',
    parentId: 'f_de_regel',
    isFolder: false,
    type: 'docx',
    size: '34.2 KB',
    dateModified: '20.02.2026 10:15',
    content: `<h1>Regelheft: Die 10 Wortarten im Deutschen</h1>
<p>Im Deutschen unterscheiden wir zwischen <strong>flektierbaren</strong> (veränderbaren) und <strong>unflektierbaren</strong> (unveränderbaren) Wortarten.</p>

<h2>1. Flektierbare Wortarten</h2>
<table border="1" style="width:100%; border-collapse: collapse;">
  <thead>
    <tr style="background:#f1f5f9;">
      <th>Wortart</th>
      <th>Funktion</th>
      <th>Beispiele</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Nomen (Substantive)</strong></td>
      <td>Bezeichnen Lebewesen, Gegenstände, Gefühle und Abstrakta. Haben festes Genus.</td>
      <td><em>Schüler, Buch, Freiheit, Freude</em></td>
    </tr>
    <tr>
      <td><strong>Verben</strong></td>
      <td>Drücken Tätigkeiten, Vorgänge oder Zustände aus. Konjugierbar in Person, Tempus, Modus.</td>
      <td><em>lernen, schreiben, war, werden</em></td>
    </tr>
    <tr>
      <td><strong>Adjektive</strong></td>
      <td>Beschreiben Eigenschaften (Wie-Wörter). Steigerbar und deklinierbar.</td>
      <td><em>fleißig, schneller, am besten</em></td>
    </tr>
    <tr>
      <td><strong>Artikel</strong></td>
      <td>Begleiter des Nomens (bestimmt/unbestimmt).</td>
      <td><em>der, die, das / ein, eine</em></td>
    </tr>
    <tr>
      <td><strong>Pronomen</strong></td>
      <td>Stellvertreter oder Begleiter des Nomens (Personal-, Possessiv-, Relativpronomen etc.).</td>
      <td><em>ich, mein, dieser, welcher, jemand</em></td>
    </tr>
  </tbody>
</table>

<h2>2. Unflektierbare Wortarten (Partikeln)</h2>
<ul>
  <li><strong>Präpositionen:</strong> Bestimmen den Fall des Bezugsworts (z. B. <em>wegen, auf, unter, durch, trotz</em>).</li>
  <li><strong>Konjunktionen:</strong> Verbinden Wörter, Satzteile oder Sätze (z. B. <em>weil, dass, und, oder, obwohl</em>).</li>
  <li><strong>Adverbien:</strong> Beschreiben Umstände von Ort, Zeit, Grund oder Art (z. B. <em>heute, dort, deshalb, gern</em>).</li>
  <li><strong>Interjektionen:</strong> Ausrufewörter (z. B. <em>Aua!, Hurra!, Oh!</em>).</li>
</ul>

<div style="background:#e0f2fe; padding:12px; border-left:4px solid #0284c7; margin-top:16px;">
  <strong>💡 Lerntipp für die Prüfung:</strong> Achte bei Pronomen stets auf den Fall (Kasus: Nominativ, Genitiv, Dativ, Akkusativ).
</div>`,
  },
  {
    id: 'file_de_passiv',
    name: 'Aktiv und Passiv - Grammatik.docx',
    path: '/01_Deutsch/Dokumente/Regelheft/Aktiv und Passiv - Grammatik.docx',
    parentId: 'f_de_regel',
    isFolder: false,
    type: 'docx',
    size: '28.6 KB',
    dateModified: '18.02.2026 16:45',
    content: `<h1>Aktiv und Passiv in der deutschen Grammatik</h1>
<p>Die Handlungsrichtung eines Satzes kann im <strong>Aktiv</strong> (wer handelt?) oder im <strong>Passiv</strong> (was geschieht mit dem Objekt?) formuliert werden.</p>

<h2>Vorgangspassiv: Bildung mit <em>werden</em> + Partizip II</h2>
<table border="1" style="width:100%; border-collapse: collapse;">
  <thead>
    <tr style="background:#f1f5f9;">
      <th>Zeitform</th>
      <th>Aktiv</th>
      <th>Vorgangspassiv</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Präsens</strong></td>
      <td>Der Lehrer korrigiert die Arbeit.</td>
      <td>Die Arbeit <strong>wird</strong> (vom Lehrer) <strong>korrigiert</strong>.</td>
    </tr>
    <tr>
      <td><strong>Präteritum</strong></td>
      <td>Der Lehrer korrigierte die Arbeit.</td>
      <td>Die Arbeit <strong>wurde</strong> korrigiert.</td>
    </tr>
    <tr>
      <td><strong>Perfekt</strong></td>
      <td>Der Lehrer hat die Arbeit korrigiert.</td>
      <td>Die Arbeit <strong>ist</strong> korrigiert <strong>worden</strong>.</td>
    </tr>
    <tr>
      <td><strong>Plusquamperfekt</strong></td>
      <td>Der Lehrer hatte die Arbeit korrigiert.</td>
      <td>Die Arbeit <strong>war</strong> korrigiert <strong>worden</strong>.</td>
    </tr>
    <tr>
      <td><strong>Futur I</strong></td>
      <td>Der Lehrer wird die Arbeit korrigieren.</td>
      <td>Die Arbeit <strong>wird</strong> korrigiert <strong>werden</strong>.</td>
    </tr>
  </tbody>
</table>

<div style="background:#fef3c7; padding:12px; border-left:4px solid #f59e0b; margin-top:16px;">
  <strong>Wichtig:</strong> Das Akkusativobjekt des Aktivsatzes wird zum <strong>Subjekt im Nominativ</strong> des Passivsatzes!
</div>`,
  },
  {
    id: 'file_de_bericht',
    name: 'Bericht schreiben - Kriterien & W-Fragen.docx',
    path: '/01_Deutsch/Dokumente/Aufsatz/Bericht schreiben - Kriterien & W-Fragen.docx',
    parentId: 'f_de_aufsatz',
    isFolder: false,
    type: 'docx',
    size: '22.1 KB',
    dateModified: '15.02.2026 14:10',
    content: `<h1>Leitfaden: Sachlicher Bericht</h1>
<p>Ein Bericht informiert sachlich, objektiv und chronologisch über ein reales Geschehen (z. B. Unfall, Schulausflug, Sportereignis).</p>

<h2>Die 7 W-Fragen</h2>
<ol>
  <li><strong>Wer?</strong> - Beteiligte Personen oder Institutionen</li>
  <li><strong>Was?</strong> - Das eigentliche Ereignis / der Vorfall</li>
  <li><strong>Wann?</strong> - Genauer Zeitpunkt (Datum, Uhrzeit)</li>
  <li><strong>Wo?</strong> - Genauer Ort des Geschehens</li>
  <li><strong>Wie?</strong> - Ablauf und Umstände</li>
  <li><strong>Warum?</strong> - Ursache und Anlass</li>
  <li><strong>Welche Folgen?</strong> - Sachschaden, Verletzungen, Ergebnisse</li>
</ol>

<h2>Sprachliche Kriterien</h2>
<ul>
  <li>Zeitform: <strong>Präteritum</strong> (bzw. Plusquamperfekt bei Vorzeitigkeit)</li>
  <li>Keine persönliche Meinung, keine Gefühle oder Wertungen</li>
  <li>Sachlicher, präziser Wortschatz</li>
</ul>`,
  },

  // --- 02_Englisch SUBFOLDERS & FILES ---
  {
    id: 'f_en_dok',
    name: 'Grammar and Texts',
    path: '/02_Englisch/Dokumente',
    parentId: 'f_en',
    isFolder: true,
    type: 'folder',
    dateModified: '20.02.2026 14:00',
  },
  {
    id: 'file_en_irregular',
    name: 'Irregular Verbs Master List.docx',
    path: '/02_Englisch/Dokumente/Irregular Verbs Master List.docx',
    parentId: 'f_en_dok',
    isFolder: false,
    type: 'docx',
    size: '42.8 KB',
    dateModified: '20.02.2026 14:05',
    content: `<h1>English Irregular Verbs: Comprehensive Overview</h1>
<p>Learn and revise all essential English irregular verbs with their 3 forms: <em>Infinitive (V1)</em>, <em>Past Simple (V2)</em>, and <em>Past Participle (V3)</em>.</p>

<table border="1" style="width:100%; border-collapse: collapse;">
  <thead>
    <tr style="background:#f1f5f9;">
      <th>Infinitive (V1)</th>
      <th>Past Simple (V2)</th>
      <th>Past Participle (V3)</th>
      <th>German Translation</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>be (am/is/are)</td><td>was / were</td><td>been</td><td>sein</td></tr>
    <tr><td>become</td><td>became</td><td>become</td><td>werden</td></tr>
    <tr><td>begin</td><td>began</td><td>begun</td><td>anfangen, beginnen</td></tr>
    <tr><td>break</td><td>broke</td><td>broken</td><td>brechen, zerbrechen</td></tr>
    <tr><td>bring</td><td>brought</td><td>brought</td><td>bringen, mitbringen</td></tr>
    <tr><td>build</td><td>built</td><td>built</td><td>bauen</td></tr>
    <tr><td>buy</td><td>bought</td><td>bought</td><td>kaufen</td></tr>
    <tr><td>catch</td><td>caught</td><td>caught</td><td>fangen, erwischen</td></tr>
    <tr><td>choose</td><td>chose</td><td>chosen</td><td>(aus)wählen</td></tr>
    <tr><td>come</td><td>came</td><td>come</td><td>kommen</td></tr>
    <tr><td>do</td><td>did</td><td>done</td><td>tun, machen</td></tr>
    <tr><td>drive</td><td>drove</td><td>driven</td><td>fahren, lenken</td></tr>
    <tr><td>eat</td><td>ate</td><td>eaten</td><td>essen</td></tr>
    <tr><td>fall</td><td>fell</td><td>fallen</td><td>fallen, stürzen</td></tr>
    <tr><td>feel</td><td>felt</td><td>felt</td><td>(sich) fühlen, spüren</td></tr>
    <tr><td>find</td><td>found</td><td>found</td><td>finden</td></tr>
    <tr><td>fly</td><td>flew</td><td>flown</td><td>fliegen</td></tr>
    <tr><td>forget</td><td>forgot</td><td>forgotten</td><td>vergessen</td></tr>
    <tr><td>get</td><td>got</td><td>got</td><td>bekommen, holen, werden</td></tr>
    <tr><td>give</td><td>gave</td><td>given</td><td>geben, schenken</td></tr>
    <tr><td>go</td><td>went</td><td>gone</td><td>gehen, fahren</td></tr>
    <tr><td>have</td><td>had</td><td>had</td><td>haben, besitzen</td></tr>
    <tr><td>know</td><td>knew</td><td>known</td><td>wissen, kennen</td></tr>
    <tr><td>make</td><td>made</td><td>made</td><td>machen, herstellen</td></tr>
    <tr><td>see</td><td>saw</td><td>seen</td><td>sehen</td></tr>
    <tr><td>take</td><td>took</td><td>taken</td><td>nehmen, bringen</td></tr>
    <tr><td>write</td><td>wrote</td><td>written</td><td>schreiben</td></tr>
  </tbody>
</table>`,
  },
  {
    id: 'file_en_tenses',
    name: 'English Tenses Overview.docx',
    path: '/02_Englisch/Dokumente/English Tenses Overview.docx',
    parentId: 'f_en_dok',
    isFolder: false,
    type: 'docx',
    size: '31.5 KB',
    dateModified: '19.02.2026 11:30',
    content: `<h1>English Tenses Summary Sheet</h1>
<p>Overview of the most important tenses in English with signal words, form and usage.</p>

<h2>1. Simple Present vs. Present Progressive</h2>
<ul>
  <li><strong>Simple Present:</strong> Regular habits, facts. <em>Signal words: always, never, usually, every day.</em> Example: <em>He plays tennis every Monday.</em></li>
  <li><strong>Present Progressive:</strong> Happening right now at the moment of speaking. <em>Signal words: now, at the moment, Listen!, Look!.</em> Example: <em>He is playing tennis right now.</em></li>
</ul>

<h2>2. Simple Past vs. Present Perfect</h2>
<ul>
  <li><strong>Simple Past:</strong> Completed action in the past with a specific time. <em>Signal words: yesterday, in 2022, last week, 2 days ago.</em> Example: <em>I visited London last year.</em></li>
  <li><strong>Present Perfect:</strong> Past action with a connection or result in the present. <em>Signal words: just, already, yet, never, ever, since, for.</em> Example: <em>I have already finished my homework.</em></li>
</ul>`,
  },

  // --- 03_Italienisch SUBFOLDERS & FILES ---
  {
    id: 'f_it_dok',
    name: 'Dokumente',
    path: '/03_Italienisch/Dokumente',
    parentId: 'f_it',
    isFolder: true,
    type: 'folder',
    dateModified: '18.02.2026 10:20',
  },
  {
    id: 'f_it_film',
    name: 'Film',
    path: '/03_Italienisch/Dokumente/Film',
    parentId: 'f_it_dok',
    isFolder: true,
    type: 'folder',
    dateModified: '18.02.2026 10:20',
  },
  {
    id: 'file_it_jumanji',
    name: 'Jumanji.docx',
    path: '/03_Italienisch/Dokumente/Film/Jumanji.docx',
    parentId: 'f_it_film',
    isFolder: false,
    type: 'docx',
    size: '25.3 KB',
    dateModified: '18.02.2026 10:25',
    content: `<h1>Jumanji - Analisi del Film e Vocabolario</h1>
<p>Riassunto del film e comprensione del testo per la classe d'italiano.</p>

<h2>Trama Principale (La trama)</h2>
<p>Nel 1969, un ragazzo di nome Alan Parrish trova un misterioso gioco da tavolo chiamato <strong>Jumanji</strong> sepolto in un cantiere edile. Quando inizia a giocare con la sua amica Sarah, scopre che ogni tiro di dadi scatena pericoli della giungla reale nel salotto di casa sua. Alan viene risucchiato magicamente nel gioco.</p>

<h2>Vocabolario Chiave (Parole nuove)</h2>
<ul>
  <li><strong>Il gioco da tavolo:</strong> das Brettspiel</li>
  <li><strong>I dadi:</strong> die Würfel (tirare i dadi = würfeln)</li>
  <li><strong>La giungla:</strong> der Dschungel</li>
  <li><strong>Il cacciatore:</strong> der Jäger</li>
  <li><strong>Scappare / Fuggire:</strong> fliehen, weglaufen</li>
  <li><strong>Vincere la partita:</strong> das Spiel gewinnen</li>
</ul>`,
  },
  {
    id: 'file_it_robinson',
    name: 'Robinson Crusoe.docx',
    path: '/03_Italienisch/Dokumente/Robinson Crusoe.docx',
    parentId: 'f_it_dok',
    isFolder: false,
    type: 'docx',
    size: '29.0 KB',
    dateModified: '17.02.2026 14:50',
    content: `<h1>Robinson Crusoe di Daniel Defoe</h1>
<p>Scheda di lettura e comprensione per la lingua italiana.</p>

<h2>La Storia del Naufrago</h2>
<p>Robinson Crusoe è un giovane inglese che desidera viaggiare per mare. Durante un violento naufragio causato da una tempesta, è l'unico superstite e si ritrova su un'isola deserta nel Mar dei Caraibi.</p>

<h2>Temi Principali</h2>
<ul>
  <li>La sopravvivenza (sopravvivere costruendo un rifugio)</li>
  <li>L'amicizia con Venerdì (Venerdì impara l'inglese e le usanze)</li>
  <li>La speranza e il coraggio di non arrendersi mai</li>
</ul>`,
  },

  // --- 04_Mathematik SUBFOLDERS & FILES ---
  {
    id: 'f_math_dok',
    name: 'Dokumente',
    path: '/04_Mathematik/Dokumente',
    parentId: 'f_math',
    isFolder: true,
    type: 'folder',
    dateModified: '25.02.2026 08:45',
  },
  {
    id: 'file_math_brueche',
    name: 'Bruchrechnen - Die 4 Grundrechenarten.docx',
    path: '/04_Mathematik/Dokumente/Bruchrechnen - Die 4 Grundrechenarten.docx',
    parentId: 'f_math_dok',
    isFolder: false,
    type: 'docx',
    size: '38.0 KB',
    dateModified: '25.02.2026 08:50',
    content: `<h1>Bruchrechnen: Formelsammlung & Rechenregeln</h1>
<p>Ein Bruch besteht aus Zähler (oben) und Nenner (unten): <code>a / b</code>.</p>

<h2>1. Addition und Subtraktion</h2>
<p>Brüche müssen zuerst auf einen <strong>gemeinsamen Nenner (Hauptnenner / kgV)</strong> erweitert werden:</p>
<p><code>a/c + b/c = (a + b) / c</code></p>
<p><em>Beispiel:</em> 1/3 + 1/4 = 4/12 + 3/12 = <strong>7/12</strong></p>

<h2>2. Multiplikation</h2>
<p>Zähler mal Zähler, Nenner mal Nenner. Vor dem Ausmultiplizieren immer kürzen!</p>
<p><code>(a / b) * (c / d) = (a * c) / (b * d)</code></p>
<p><em>Beispiel:</em> 2/5 * 3/4 = (2 * 3) / (5 * 4) = 6/20 = <strong>3/10</strong></p>

<h2>3. Division</h2>
<p>Mit dem <strong>Kehrwert</strong> des zweiten Bruches multiplizieren!</p>
<p><code>(a / b) : (c / d) = (a / b) * (d / c) = (a * d) / (b * c)</code></p>
<p><em>Beispiel:</em> 3/4 : 2/5 = 3/4 * 5/2 = <strong>15/8 = 1 7/8</strong></p>`,
  },
  {
    id: 'file_math_geometrie',
    name: 'Formelsammlung Geometrie 2D & 3D.docx',
    path: '/04_Mathematik/Dokumente/Formelsammlung Geometrie 2D & 3D.docx',
    parentId: 'f_math_dok',
    isFolder: false,
    type: 'docx',
    size: '35.4 KB',
    dateModified: '24.02.2026 15:10',
    content: `<h1>Formelsammlung Geometrie</h1>
<h2>Flächenberechnung (2D)</h2>
<ul>
  <li><strong>Rechteck:</strong> Fläche A = a * b | Umfang U = 2a + 2b</li>
  <li><strong>Dreieck:</strong> Fläche A = (g * h) / 2 | Umfang U = a + b + c</li>
  <li><strong>Kreis:</strong> Fläche A = π * r² | Umfang U = 2 * π * r (d * π)</li>
  <li><strong>Trapez:</strong> Fläche A = ((a + c) / 2) * h</li>
  <li><strong>Parallelogramm:</strong> Fläche A = a * ha</li>
</ul>

<h2>Satz des Pythagoras</h2>
<p>Im rechtwinkligen Dreieck mit Hypotenuse c und Katheten a, b:</p>
<p><code>a² + b² = c²  =>  c = √(a² + b²)</code></p>`,
  },

  // --- 05_Natwi - Biologie ---
  {
    id: 'f_natwi_dok',
    name: 'Dokumente',
    path: '/05_Natwi - Biologie/Dokumente',
    parentId: 'f_natwi',
    isFolder: true,
    type: 'folder',
    dateModified: '12.02.2026 13:10',
  },
  {
    id: 'file_natwi_gewaesser',
    name: 'Ökosystem See & Fließgewässer.docx',
    path: '/05_Natwi - Biologie/Dokumente/Ökosystem See & Fließgewässer.docx',
    parentId: 'f_natwi_dok',
    isFolder: false,
    type: 'docx',
    size: '27.8 KB',
    dateModified: '12.02.2026 13:15',
    content: `<h1>Ökosystem See: Zonierung & Nahrungskette</h1>
<p>Ein See gliedert sich in verschiedene Lebensbereiche mit charakteristischer Flora und Fauna.</p>

<h2>Zonierung des Sees</h2>
<ol>
  <li><strong>Uferzone (Litoral):</strong> Röhrichtzone (Schilf), Schwimmblattpflanzen (Seerose), Tauchblattzone (Wasserpest).</li>
  <li><strong>Freiwasserzone (Pelagial):</strong> Lebensraum für Plankton (Phytoplankton & Zooplankton) und Freiwasserfische (z. B. Renke, Hecht).</li>
  <li><strong>Tiefenzone (Profundal):</strong> Lichtlose Zone, Zersetzer (Bakterien, Würmer) bauen organischen Abfall ab.</li>
</ol>`,
  },

  // --- 07_Geschichte ---
  {
    id: 'f_hist_dok',
    name: 'Dokumente',
    path: '/07_Geschichte/Dokumente',
    parentId: 'f_hist',
    isFolder: true,
    type: 'folder',
    dateModified: '16.02.2026 16:20',
  },
  {
    id: 'file_hist_krieg',
    name: '1. Weltkrieg - Ursachen und Folgen.docx',
    path: '/07_Geschichte/Dokumente/1. Weltkrieg - Ursachen und Folgen.docx',
    parentId: 'f_hist_dok',
    isFolder: false,
    type: 'docx',
    size: '33.2 KB',
    dateModified: '16.02.2026 16:25',
    content: `<h1>Der Erste Weltkrieg (1914 - 1918)</h1>
<h2>1. Ursachen und Auslöser</h2>
<ul>
  <li><strong>Imperialismus & Wettrüsten:</strong> Rivalität der europäischen Großmächte (Großbritannien, Deutsches Reich, Frankreich, Russland, Österreich-Ungarn).</li>
  <li><strong>Bündnissysteme:</strong> Dreibund (Deutschland, Österreich-Ungarn, Italien) vs. Triple Entente (Großbritannien, Frankreich, Russland).</li>
  <li><strong>Attentat von Sarajevo (28. Juni 1914):</strong> Ermordung des österreichischen Thronfolgers Franz Ferdinand durch Gavrilo Princip.</li>
</ul>

<h2>2. Kriegsführung und Besonderheiten</h2>
<p>Der Krieg entwickelte sich schnell vom Bewegungskrieg zum zermürbenden <strong>Stellungskrieg</strong> in Schützengräben. Einsatz neuer Waffen: Giftgas, Maschinengewehre, Panzer, U-Boote und Flugzeuge.</p>`,
  },

  // --- 13_Abschlussprüfung ---
  {
    id: 'f_pruf_dok',
    name: 'Mittelschule 2026',
    path: '/13_Abschlussprüfung/Mittelschule 2026',
    parentId: 'f_pruf',
    isFolder: true,
    type: 'folder',
    dateModified: '27.02.2026 14:15',
  },
  {
    id: 'file_pruf_lego',
    name: 'LEGO - Haupttext & Motivation.docx',
    path: '/13_Abschlussprüfung/Mittelschule 2026/LEGO - Haupttext & Motivation.docx',
    parentId: 'f_pruf_dok',
    isFolder: false,
    type: 'docx',
    size: '30.1 KB',
    dateModified: '27.02.2026 14:20',
    content: `<h1>Abschlussprüfung 2026: Das Phänomen LEGO</h1>
<h2>Thema: Innovation, Pädagogik & Globale Wirtschaft</h2>

<p>LEGO (abgeleitet vom dänischen <em>„leg godt“</em> = spiel gut) wurde 1932 vom Tischler Ole Kirk Christiansen gegründet. Die Erfindung des patentierten Kupplungsprinzips der Noppenbausteine im Jahr 1958 revolutionierte die Spielwarenindustrie weltweit.</p>

<h2>Gliederung der Facharbeit:</h2>
<ol>
  <li><strong>Geschichte & Unternehmensentwicklung:</strong> Vom Holzspielzeug zum Weltkonzern</li>
  <li><strong>Mathematik & Geometrie der Steine:</strong> Kombinatorik (mit 6 Standardsteinen gibt es 915 Millionen Kombinationen!)</li>
  <li><strong>Technik & Robotik:</strong> LEGO Mindstorms und moderne Automatisierung in der Schule</li>
  <li><strong>Ökologischer Wandel:</strong> Forschung an bio-basiertem Kunststoff aus Zuckerrohr</li>
</ol>`,
  },

  // --- 99_Unklar zuordnen ---
  {
    id: 'f_unklar_dat',
    name: 'Dateien',
    path: '/99_Unklar zuordnen/Dateien',
    parentId: 'f_unklar',
    isFolder: true,
    type: 'folder',
    dateModified: '26.02.2026 18:00',
  },
  {
    id: 'file_fussball_html',
    name: 'fußball.html',
    path: '/99_Unklar zuordnen/Dateien/fußball.html',
    parentId: 'f_unklar_dat',
    isFolder: false,
    type: 'html',
    size: '12.5 KB',
    dateModified: '26.02.2026 18:05',
    content: `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Schul-Fußballliga Manager</title>
</head>
<body>
  <h1>⚽ Schul-Fußballliga Manager</h1>
  <p>Hier werden alle Spiele, Tore und Punkte der Schulmannschaften erfasst.</p>
</body>
</html>`,
  },
  {
    id: 'file_bielefeld_docx',
    name: 'Bielefeld_Verschwörungstheorie.docx',
    path: '/99_Unklar zuordnen/Dateien/Bielefeld_Verschwörungstheorie.docx',
    parentId: 'f_unklar_dat',
    isFolder: false,
    type: 'docx',
    size: '18.9 KB',
    dateModified: '20.02.2026 17:15',
    content: `<h1>Die Bielefeld-Verschwörung: Analyse einer Satire</h1>
<p>Die Bielefeld-Verschwörung ist ein bekanntes satirisches Phänomen der deutschen Internetkultur aus dem Jahr 1994, erfunden von Achim Held.</p>

<h2>Die 3 klassischen Fragen der Theorie:</h2>
<ol>
  <li>Kennst du jemanden aus Bielefeld?</li>
  <li>Warst du schon einmal in Bielefeld?</li>
  <li>Kennst du jemanden, der schon einmal dort war?</li>
</ol>
<p><em>Zweck im Deutschunterricht:</em> Erkennen von Scheinargumenten, rhetorischen Mitteln und satirischen Elementen in modernen Texten.</p>`,
  },
];
