# SaareWeis veebileht

Mahe rohumaaveis otse Saaremaa karjamaalt. See on staatiline veebileht (lihtne HTML ja CSS), mida saab hõlpsalt ise edasi arendada, ka koos Claude'iga.

## Lehed

| Fail | Leht |
|------|------|
| `index.html` | Avaleht |
| `meist.html` | Meist (lugu, loomad ja loodus) |
| `tellimine.html` | Lihakastid, kuidas käib, tarne, tellimisvorm |
| `retseptid.html` | Retseptid |
| `kkk.html` | Korduma kippuvad küsimused |
| `kontakt.html` | Kontakt |
| `404.html` | Vea-leht |

Muu: `css/style.css` (kogu kujundus ühes failis), `js/script.js` (päise käitumine), `images/` (pildid ja logo).

## Kuidas muudatusi teha (koos Claude'iga)

Ava projekt Claude Code'is ja kirjuta lihtsas keeles, mida soovid. Näited:

- „Muuda telefoninumber kontaktilehel numbriks 5xxxxxx.”
- „Lisa Perekasti hinnaks 110 eurot.”
- „Vaheta avalehe suur pilt failiks images/hero.jpg.”
- „Lisa retseptidesse uus retsept: veisesupp.”

Claude leiab õige koha ja teeb muudatuse ära.

## Piltide lisamine

1. Pane pilt kausta `images/` (nt `images/hero.jpg`).
2. Lehel on kohatäitjad tekstiga `[ FOTO: ... ]`. Palu Claude'il asendada õige kohatäitja oma pildiga, näiteks: „Pane avalehe hero taustaks images/hero.jpg.”
3. Kõige rohkem mõjuvad **päris fotod** talust, loomadest, perest ja roogadest. Suured ja teravad originaalfailid, mitte sotsiaalmeediast alla laetud versioonid.

## Brändi reeglid (hoia neid alles)

- Kirjuta alati **ö**, mitte õ (nt „pereettevöte”, „jöuab”).
- **Ära kasuta pikka sidekriipsu.** Kasuta koma, koolonit või punkti.
- Palett: must, soe luuvalge, oxblood-punane aktsent. Kirjad: Fraunces (pealkirjad) ja Inter (tekst).

## Omandiõigus

Domeen, veebimajutus, koodihoidla ja kõik teenused on **SaareWeise enda kontodel ja nimel**. Nii jääb kogu kontroll ja edit access teile. Täpne üleandmis- ja omandiprotokoll on failis [`HANDOVER.md`](HANDOVER.md).

## Kohalik eelvaade

Projekti kaustas:

    python3 -m http.server 8777

Seejärel ava brauseris `http://localhost:8777`.

## Abi

Küsimuste korral võta ühendust arendajaga.
