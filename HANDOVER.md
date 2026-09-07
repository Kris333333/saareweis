# SaareWeis üleandmine: täielik samm-sammuline juhend

Eesmärk: **peale seda ei halda ega hosti Kratt midagi.** Kõik on Kris'i kontodel, leht on live, tellimused + laoseis + e-kirjad töötavad. See juhend on mõeldud otsast lõpuni läbi tegemiseks, ilma et midagi jääks õhku.

Tee sammud **järjekorras** (1 -> 7). Iga samm ütleb, kuidas kontrollida, et see õnnestus.

**Kes mida teeb:** sammud 1 kuni 4 ja 7 on ühekordne tehniline seadistus (Kristjan või tema abiga). Sammud 5 ja 6 ning "Kuidas Kris süsteemi haldab" on Kris'i igapäev.

---

## Enne alustamist: kontod

Kris'il on vaja (loo puuduvad, tasuta):
- **Google konto** (saareweis@gmail.com), on juba olemas.
- **GitHub konto** (github.com), 2 min.
- **Netlify konto** (netlify.com), saab GitHubiga sisse logida.
- **Domeeniregistripidaja** .ee jaoks (nt Zone.ee).

Kristjanil on vaja: ligipääs praegustele Google tabelitele + koodikaust `saareweis/`.

Kolm väärtust, mis liiguvad käigu pealt (märgi üles):
- **A** = Apps Scripti veebiaadress (`/exec`), tekib sammus 1.
- **B** = "SaareWeis ladu" tabeli ID = `1tbl8BMe-Qi98wvZ1bHsxZ4cqwEH4ubQhPpJHx-AT1kQ`
- **C** = "SaareWeis tellimused" tabeli ID = `13VmHgBWJ5KozBakXpye0M1-5lQgF23JzUrwNjmiry0g`

---

## SAMM 1: Google pool (tabelid + skript Kris'i alla)

**1.1 Anna tabelid Kris'ile üle.** Kristjan avab mõlemad tabelid ("SaareWeis ladu" ja "SaareWeis tellimused") -> **Share** -> lisa `saareweis@gmail.com` toimetajaks -> muuda tema roll **"Make owner"** -> Kris kinnitab omaniku-kutse e-mailist. (Tabeli ID-d jäävad samaks, koodis ei muutu midagi.)

**1.2 Ajavöönd.** Kris avab kummagi tabeli -> **File -> Settings -> Time zone -> (GMT+03:00) Tallinn -> Save.**

**1.3 Skript.** Kris avab **"SaareWeis ladu"** -> **Extensions -> Apps Script**. Kustuta kogu vana kood (Cmd+A, Delete) ja kleebi see (ID-d on juba täidetud, e-kiri saadetakse GmailAppiga = usaldusväärne):

```javascript
var TELLIMUSED_ID = '13VmHgBWJ5KozBakXpye0M1-5lQgF23JzUrwNjmiry0g';
var NOTIFY_EMAIL = 'saareweis@gmail.com';

function doPost(e) {
  var b = JSON.parse(e.postData.contents);
  function n(v) { return parseInt(v, 10) || 0; }
  function t(v) { v = String(v == null ? '' : v); return /^[=+\-@]/.test(v) ? String.fromCharCode(39) + v : v; }
  SpreadsheetApp.openById(TELLIMUSED_ID).getSheets()[0].appendRow([new Date(), t(b.nimi), t(b.epost), t(b.tel), t(b.kattesaamine), t(b.aadress), n(b.hakklihakast), n(b.perekast), n(b.grillkast), n(b.hakkliha500), t(b.markused)]);
  var ladu = SpreadsheetApp.getActive().getSheets()[0];
  var vals = ladu.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) { var ordered = n(b[vals[i][0]]); if (ordered > 0) ladu.getRange(i + 1, 5).setValue(n(vals[i][4]) - ordered); }
  var read = 'Nimi: ' + b.nimi + ' | Tel: ' + b.tel + ' | E-post: ' + b.epost + ' | Kattesaamine: ' + b.kattesaamine + ' | Aadress: ' + b.aadress + ' | Hakklihakast: ' + n(b.hakklihakast) + ' | Perekast: ' + n(b.perekast) + ' | Grillmeistri: ' + n(b.grillkast) + ' | Hakkliha500g: ' + n(b.hakkliha500) + ' | Markused: ' + b.markused;
  GmailApp.sendEmail(NOTIFY_EMAIL, 'Uus SaareWeis broneering', read);
  if (b.epost) GmailApp.sendEmail(b.epost, 'Aitäh! Saime su broneeringu kätte', 'Aitäh broneeringu eest! Paneme su järjekorda. Kui järgmine partii on valmis, võtame sinuga ühendust ja saadame arve. Broneering on mittesiduv, alles arve tasumine kinnitab tellimuse. Sinu tellimus: ' + read);
  return ContentService.createTextOutput('ok');
}
```

Salvesta (Cmd+S).

**1.4 Juuruta.** **Deploy -> New deployment -> (hammasratas) Web app** -> *Execute as:* **Me** -> *Who has access:* **Anyone** -> **Deploy** -> luba ligipääs (**Advanced -> Go to project -> Allow**, kinnita ka **Gmaili** luba). **Kopeeri veebirakenduse aadress (lõppeb `/exec`) = väärtus A.**

> **TÄHTIS (õpitud valuga):** tee AINULT ÜKS juurutus. Kui hiljem koodi muudad, uuenda ALATI sama juurutust: **Deploy -> Manage deployments -> pliiats (Edit) -> Version: New version -> Deploy.** ÄRA tee teist korda "New deployment", sest see loob uue `/exec` aadressi, mida leht ei kasuta, ja siis tundub nagu muudatus ei mõjuks (leht jääb vana versiooni külge kinni). See oligi algne e-kirja tõrke põhjus.

**1.5 Jaga ladu leht avalikuks lugemiseks.** "SaareWeis ladu" -> **Share -> Anyone with the link -> Viewer**. (Ainult numbrid on avalikud, kliendiandmeid siin pole.) "SaareWeis tellimused" jääb **privaatseks**.

**1.6 Lähtesta ladu.** Kustuta testread tabelist "SaareWeis tellimused". Kirjuta tabelis "SaareWeis ladu" veergu **`jaanud`** iga kasti kohta päris arv (ringi kogus). Veerud `alg`/`tellitud` võid ignoreerida.

> **Kontroll:** ava brauseris `https://docs.google.com/spreadsheets/d/1tbl8BMe-Qi98wvZ1bHsxZ4cqwEH4ubQhPpJHx-AT1kQ/gviz/tq?tqx=out:json&gid=0` -> peab tulema andmeplokk (mitte login).

---

## SAMM 2: Kood (üks väärtus)

Failis **`js/script.js`**, kohe üleval (rida 2), pane `SW_WEBHOOK` väärtuseks **A** (Kris'i `/exec` aadress):

```javascript
var SW_WEBHOOK = 'PANE_SIIA_VÄÄRTUS_A';
```

`SHEET_ID` (ladu lugemiseks) jääb samaks (**B**), sest tabeli ID ei muutunud. Muud koodi puudutada pole vaja.

---

## SAMM 3: GitHub + Netlify (leht live Kris'i all)

**3.1** Kris loob GitHubi ja Netlify konto (kui pole).

**3.2** Lae koodikaust Kris'i GitHubi repo'sse (Kristjan aitab: `git remote add` + `git push`, või lohista failid GitHubi kaudu).

**3.3** Netlify -> **Add new site -> Import from Git** -> vali see repo -> **Deploy**. Leht läheb üles aadressile `nimi.netlify.app`.

*(Lihtsam alternatiiv ilma GitHubita: lohista kaust lehele `app.netlify.com/drop`. Aga GitHub + Netlify tähendab: Claude muudab faili -> push -> läheb ise live'i.)*

> **Kontroll:** ava `nimi.netlify.app` -> leht avaneb, kastid ja laoseis näitavad numbreid.

---

## SAMM 4: Domeen

**4.1** Registreeri **saareweis.ee** Kris'i nimele (nt Zone.ee).

**4.2** Netlify -> **Domain settings -> Add a domain** -> `saareweis.ee` -> suuna DNS Netlify antud kirjete järgi. SSL (https) tuleb Netlifylt automaatselt.

---

## SAMM 5: Kris'i sisu ja avaldamise-eelne kontroll

Enne kui leht päriselt avalikuks läheb, käi see nimekiri üle (kõike saab teha Claude'iga):
- **Päris fotod:** kastid, valmis road (retseptid), hero, pere. Pane samade failinimedega `images/` kausta.
- **Näidisarvustused avalehel:** praegu on seal näidistagasiside (Margus jt), märgitud näidiseks. Asenda päris klientide tagasisidega või eemalda plokk. Väljamõeldud arvustusi ei tohi live'i jätta.
- **Ettevõtte nimi + registrikood:** kohatäide `[ Ettevõtte nimi ja registrikood ]` on mitmel lehel (jalus + privaatsus). Ütle Claude'ile "asenda ettevõtte nimi ja registrikood kõigil lehtedel".
- **Privaatsusleht:** täida `[ kuupäev ]` ja registrikood.
- **Pere sõnum + foto** (praegu näidis).
- **Kontrolli lõplikud:** telefoninumber (praegu +372 5100711), e-post, hinnad ja kastide sisu.

---

## SAMM 6: Lõpptest (kogu ahel korraga)

Esita lehel üks päris tellimus ja kontrolli:
1. Uus rida tabelis **"SaareWeis tellimused"**.
2. Vastava kasti **`jaanud`** number kahanes.
3. **E-kiri saareweis@gmail.com-i** (uus broneering).
4. **Kliendi e-kiri** (kinnitus) jõuab kliendi aadressile.

Kui kast on otsas (jaanud 0), näitab leht "Otsas sel ringil" + "Teata mulle".

**Pärast testi:** testtellimus jättis tabelisse "tellimused" rea ja vähendas laoseisu. Kustuta testrida ja pane `jaanud` number tagasi õigeks, enne kui päris kliendid tulevad.

---

## SAMM 7: Viimane etapp

- Kristjan eemaldab end: tabelite jagamisest, GitHubi collaborator'ist, Netlify tiimist.
- Kustuta Kratti Netlify all olnud demo (`saareweis-demo`).
- Kontroll: Kristjanil ei ole ühtki logint ega vastutust; kõik on Kris'i kontodel.

---

## Kuidas Kris süsteemi haldab (igapäev)

**Uus ring / partii:** ava "SaareWeis ladu", kirjuta veergu **`jaanud`** iga kasti kohta, mitu on saadaval. Number kahaneb ise, kui broneeringud tulevad. Leht näitab "Viimased X kasti" ja kui otsas, siis "Otsas sel ringil".

**Ootelist:** kui kast oli otsas ja klient vajutas "Teata mulle", tekib tabelisse "tellimused" rida, mille märkuses on `OOTELIST`. Uut ringi avades anna neile esimestena teada.

**Broneering, mitte makse:** leht võtab vastu broneeringuid, mitte makseid. Arveldamine käib meili teel koos arvega: kui partii on valmis, saadab Kris kliendile arve ja klient tasub pangaülekandega. Alles makse kinnitab tellimuse.

**Ringi kinnitamine:** kirjuta broneeringute listile (tabel "SaareWeis tellimused", ajalises järjekorras) mis on saadaval + hind, anna ~5 päeva kinnitamiseks + tasumiseks. Kes ees, see mees, kuni otsas. Maksmata jäänud kastid pane Facebooki/Instagrami. Ülejääk jääb listi järgmiseks ringiks (ei pea uuesti küsima).

**Muudatuste tegemine Claude'iga (Kris ise, koodi oskamata):**
1. Logi sisse `claude.ai` (oma Claude'i konto).
2. Ava Claude Code veebis `claude.ai/code` ja ühenda oma **GitHubi** konto.
3. Vali `saareweis` repo.
4. Ütle tavakeeles, mida muuta ("muuda perekasti hind 95 euroks", "vaheta avalehe pilt", "paranda see lause").
5. Claude teeb muudatuse ja salvestab GitHubi. Netlify paneb uue versiooni ise mõne minuti pärast live'i.
6. Ava oma leht ja vaata tulemus üle. Kui vaja, ütle "võta tagasi".

Pilte lisades pane samade failinimedega, mis vanad. Hoia puutumata ainult "Ära puutu" nimekirja asjad, muu on vaba.

---

## Ära puutu (need hoiavad süsteemi töös)

- **Apps Script** (tabeli "SaareWeis ladu" all). Kirjutab tellimused, loeb laost maha, saadab kirjad.
- **`SW_WEBHOOK`** failis `js/script.js` (rida 2) ja **`SHEET_ID`** (laoseisu lugemine).
- Tabeli **veerupäised** (`key`, `jaanud`) ja kastide **võtmed** (`hakklihakast`, `perekast`, `grillkast`, `hakkliha500`); leht ühildab nende järgi.
- Tabeli "ladu" **veergude järjekord**: `key` peab jääma veergu A ja `jaanud` veergu E, sest laoseisu vähendamine kirjutab just sinna. Uusi veerge lisa alles pärast E-veergu, olemasolevaid ära tõsta ümber.

Kõike muud (tekst, hinnad, pildid, värvid, uued lehed) võib Claude'iga julgelt muuta.

**Kinnituskirjade tekst** elab Apps Scriptis (mitte veebilehe failides), seega Claude/GitHub seda ei muuda. Tekst on juba korralikus eesti keeles. Kui tahad sõnastust muuta: ava "SaareWeis ladu" -> Extensions -> Apps Script, muuda tekst jutumärkide vahel, siis **Deploy -> Manage deployments -> pliiats (Edit) -> Version: New version -> Deploy**. Uus versioon on kohustuslik, muidu muudatus ei jõustu.

---

## Kulud

Netlify: tasuta. Google Sheets + Apps Script: tasuta. SSL: tasuta. **Ainus püsikulu = domeen ~15-20 eurot aastas.** Serverit pole, midagi hallata pole.

---

## Lõplik checklist (miski ei jää õhku)

- [ ] Mõlemad tabelid + Apps Script Kris'i Google konto all.
- [ ] Apps Script juurutatud, `/exec` (A) käes, Gmaili luba antud.
- [ ] "SaareWeis ladu" avalik (Viewer), "SaareWeis tellimused" privaatne.
- [ ] `SW_WEBHOOK` = A. Testandmed lähtestatud, päris `jaanud` numbrid sees.
- [ ] Repo Kris'i GitHubis, leht Kris'i Netlify all live.
- [ ] Domeen saareweis.ee Kris'i nimel, suunatud Netlifyle, https töötab.
- [ ] Sisu: fotod, tekstid, pere sõnum, registrikood.
- [ ] Lõpptest: tellimus -> tabel + laoseis + 2 e-kirja -> kõik töötab.
- [ ] Kristjan eemaldatud kõigist, demo kustutatud.

Kui see nimekiri on tehtud, on **projekt täielikult üle antud SaareWeisele**.
