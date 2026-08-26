//Variablen:
//Allgemeine und Statistik
let fritzls = 0; //Währung
let fps = 0; //fritzls pro Sekunde
let ffritzls = 0; //fritzls pro Sekunde durch Food
let maus = 0; //Mausstärke
let mausclicks = 0; //Mausclickanzahl
let insfood = 0; //alle Foods
let insup = 0; //alle Upgrades
let fritzlclicks = 0; //alle friztls durch Clicks
let tab = 0; //Tabvariable
let y = 0; //Tabvariable für Einstellungen
let savegame = 0; //Variable, damit Ladenfunktion verhindert wird, falls vorher noch nicht gespeichert
let volume = 1; //Volume für Lautstärke
let voltemp = 100; //vorrübergehende Lautstärkevariable (Volume kann nicht über 1 sein und input[range] erlaubt keinen slider von 0 bis 1)
let dissound = false;
let disvideo = false;
let dyslexic = false;
//Food-Variablen: u=Foodstärke, a=Foodanzahl, p=Foodpreis, i=insgesamte fritzls (für fps)
let u1 = 0.2;
let a1 = 0;
let p1 = 15;
let i1 = 0;
let u2 = 1;
let a2 = 0;
let p2 = 100;
let i2 = 0;
let u3 = 8;
let a3 = 0;
let p3 = 600;
let i3 = 0;
let u4 = 32;
let a4 = 0;
let p4 = 2500;
let i4 = 0;
let u5 = 111;
let a5 = 0;
let p5 = 15000;
let i5 = 0;
let u6 = 420;
let a6 = 0;
let p6 = 75000;
let i6 = 0;
//Upgrade-Variablen ua=Upgradeanzahl, up=Upgradekosten, sb=Sternburgvariable
let ua1 = 0;
let up1 = 100;
let ua2 = 0;
let up2 = 100;
let ua3 = 0;
let up3 = 2000;
let ua4 = 0;
let up4 = 2500;
let ua5 = 0;
let up5 = 10000;
let ua6 = 0;
let sb = 1;
let up6 = 100000;
let ua7 = 0;
let up7 = 75000;
let ua8 = 0;
let up8 = 500000;
//Media- und Intervallvariablen
let Interval = setInterval(aktualisieren, 10);
let audioplop = new Audio("sound/plop.mp3");
let audioclick = new Audio("sound/click.mp3");
let audiocash = new Audio("sound/cash.wav");
let audioslurp = new Audio("sound/slurp.mp3");
img = document.getElementById("img1");
//Funktionen:
//Audiofunktion
function sound(x){  //Sound wird erst pausiert, Abspielzeit auf 0 verändert und danach neu abgespielt
  if (dissound == false){
  x.pause();
  volume = voltemp/100;
  
  x.currentTime = 0;  
  x.play();
  }
}
//Funktionen zum Testen
function test() {
  alert("!");
}
/*function boost() {
  fritzls = fritzls + 100000
}*/
//Funktion zur Aktualisierung der fritzl-Anzeige
function anzeige() {
  document.getElementById("fa").innerHTML = fritzls.toLocaleString("de", {maximumFractionDigits:2});
}
//Klickfunktion
function add() {
  mausclicks++ ; //Mausclicksaktualisierung
  fritzls = fritzls + ((1 + (10*a4*ua5))*2**ua1)*(1+((a1*ua2)/100)); //fritzlaktualisierung nach Klick mit allen Upgrades
  fritzlclicks = fritzlclicks + ((1 + (10*a4*ua5))*2**ua1)*(1+((a1*ua2)/100)); //Statistikaktualisierung nach Click
  maus = ((1 + (10*a4*ua5))*2**ua1)*(1+((a1*ua2)/100)); //Mausstärkeaktualisierung nach Click
  anzeige();
  sound(audioplop);
  //"Animation" für Bild
  if (disvideo == false) {
  document.getElementById("img1").style.maxWidth = "50%"; 
  document.getElementById("img1").style.marginTop = "20px";
  let back = setTimeout(revert, 5000);
  }
}
function revert() {
  document.getElementById("img1").style.maxWidth = "100%";
  document.getElementById("img1").style.marginTop = "0px";
}
//Funktionen für das Einstellungsfenster
function settings() {
  if (y < 1){
  sound(audioclick);
  y = 1; //Tab nicht mehrmals öffnen
  document.getElementById("efenster").style.display ="flex"; //Angaben gemäß den Einstellungen anpassen
  document.getElementById("volume").value = voltemp;
  document.getElementById("volumetf").checked = dissound;
  document.getElementById("videotf").checked = disvideo;
  document.getElementById("legasthenie").checked = dyslexic;
  } else {
  sclose();
  }
}
function sclose() { //Einstellungsfenster schließen
  sound(audioclick);
  y = 0;
  document.getElementById("efenster").style.display ="none";
}
function ssave() {
  voltemp = document.getElementById("volume").value; //Abfrage der eingebenen Werte
  dissound = document.getElementById("volumetf").checked;
  disvideo = document.getElementById("videotf").checked;
  dyslexic = document.getElementById("legasthenie").checked;
  if (dyslexic == true){ //durchkämmt alle Elemente und stylt sie in einen speziellen Font
    let list = document.querySelectorAll("*");
    for (var i = 0; i < list.length; ++i) {
    list[i].style.fontFamily="Dyslexic"; }
  } else { 
    let list = document.querySelectorAll("*");
    for (var i = 0; i < list.length; ++i) {
    list[i].style.fontFamily="serif, 'Courier New', Courier, monospace"; }
  }
  localStorage.setItem("sdys", dyslexic); //Speichern der Werte, für zukünftige Sessions/über mehrere Tabs
  localStorage.setItem("svol", voltemp);
  localStorage.setItem("svoltf", dissound);
  localStorage.setItem("svideotf", disvideo);
  sclose();
}
function checksettings() { //Aufrufen der Einstellungen auf der Hauptseite, parsen der einzelnen Werte von Strings in Booleans/Floats notwendig
  let dyslexiccheck = localStorage.getItem("sdys");
  if (dyslexiccheck== "true"){
    dyslexic = true; 
    var list = document.querySelectorAll("*");
    for (var i = 0; i < list.length; ++i) {
      list[i].style.fontFamily="Dyslexic"; 
    }
  } else {
    dyslexic = false;
  }
  voltemp = localStorage.getItem("svol"); 
  voltemp = parseFloat(voltemp);
  let dissoundcheck = localStorage.getItem("svoltf");
  if (dissoundcheck == "true"){
    dissound = true;
  } else {
    dissound = false;
  }
  let disvideocheck = localStorage.getItem("svideotf");
  if (disvideocheck == "true"){
    disvideo = true;
  } else {
    disvideo = false;
  }
}
//Funktionen für Food
function fu1() {
  if (fritzls >= p1.toFixed(1)) { //fritzl-Abfrage, ob genug fritzls verfügbar für Kauf
  fritzls = fritzls - p1.toFixed(1); //fritzl-Abzug von aktuellen fritzls
  a1++ ; //Foodanzahl um 1 erhöht
  u1 = (0.2 + (ua2*0.1))*(10**ua6); //Foodstärke nach allen Upgrades
  i1 = a1 * u1; //Insgesamte Foodverrechnung
  p1 = 15 * 1.1**(a1-20*ua8*a6); //Foodpreiserhöhung, nach Abzug der Upgrades
  maus = ((1 + (10*a4*ua5))*2**ua1)*(1+((a1*ua2)/100)); //Mausstärkeupgrade, da sie mit Upgrades und Food verbunden ist, muss sie in allen relatierten Funktionen aktualisiert werden
  document.getElementById("anzahl1").innerHTML = a1; //Anzahlaktualisierung
  document.getElementById("kosten1").innerHTML = p1.toFixed(1); //Preisaktaktualisierung
  sound(audioslurp);
  }
}
function fu2() {
  if (fritzls >= p2.toFixed(1)) {
  fritzls = fritzls - p2.toFixed(1);
  a2++ ;
  i2 = a2 * u2;
  p2 = 100 * 1.1**a2;
  document.getElementById("anzahl2").innerHTML = a2;
  document.getElementById("kosten2").innerHTML = p2.toFixed(1);
  sound(audioslurp);
  }
}
function fu3() {
  if (fritzls >= p3.toFixed(1)) {
  fritzls = fritzls - p3.toFixed(1);
  a3++ ;
  i3 = a3 * u3;
  p3 = 600 * 1.1**a3;
  document.getElementById("anzahl3").innerHTML = a3;
  document.getElementById("kosten3").innerHTML = p3.toFixed(1);
  sound(audioslurp);
  }
}
function fu4() {
  if (fritzls >= p4.toFixed(1)) {
  fritzls = fritzls - p4.toFixed(1);
  a4++ ;
  i4 = a4 * u4;
  p4 = 2500 * 1.1**a4;
  maus = ((1 + (10*a4*ua5))*2**ua1)*(1+((a1*ua2)/100));
  document.getElementById("anzahl4").innerHTML = a4;
  document.getElementById("kosten4").innerHTML = p4.toFixed(1);
  sound(audioslurp);
  }
}
function fu5() {
  if (fritzls >= p5.toFixed(1)) {
  fritzls = fritzls - p5.toFixed(1);
  a5++ ;
  i5 = a5 * u5;
  p5 = 15000 * 1.1**a5;
  document.getElementById("anzahl5").innerHTML = a5;
  document.getElementById("kosten5").innerHTML = p5.toFixed(1);
  sound(audioslurp);
  }
}
function fu6() {
  if (fritzls >= p6.toFixed(1)) {
  fritzls = fritzls - p6.toFixed(1);
  a6++ ;
  a1 = a1 + 20*ua8;
  i6 = a6 * u6;
  i1 = a1 * u1;
  p6 = 75000 * 1.1**a6;
  document.getElementById("anzahl6").innerHTML = a6;
  document.getElementById("kosten6").innerHTML = p6.toFixed(1);
  document.getElementById("anzahl1").innerHTML = a1;
  sound(audioslurp);
  }
}
//Funktionen für Upgrades
function upgrade1() { 
  if (fritzls >= up1) { //fritzl-Abfrage
    fritzls = fritzls - up1; //fritzl-Abzug
    ua1++ ; //Upgradeanzahlaktualisierung
    maus = ((1 + (10*a4*ua5))*2**ua1)*(1+((a1*ua2)/100)); //Upgradeinhalt
    up1 = up1*20; //Upgradepreisaktualisierung
    document.getElementById("uanzahl1").innerHTML = ua1; //Upgradeananzahlaktualisierung
    document.getElementById("ukosten1").innerHTML = up1; //Upgradepreisaktualisierung
    sound(audiocash);
  }
}
function upgrade2() {
  if (fritzls >= up2) {
    fritzls = fritzls - up2;
    ua2++ ;
    u1 = (0.2 + (ua2*0.1))*(10**ua6);
    i1 = a1 * u1;
    up2 = up2*5;
    maus = ((1 + (10*a4*ua5))*2**ua1)*(1+((a1*ua2)/100));
    document.getElementById("uanzahl2").innerHTML = ua2;
    document.getElementById("ubeschreibung1").innerHTML = (u1 + 0.1*10**ua6).toFixed(1);
    document.getElementById("ubeschreibung2").innerHTML = ua2 + 1;
    document.getElementById("ukosten2").innerHTML = up2;
    document.getElementById("fps1").innerHTML = u1.toFixed(1);
    sound(audiocash);
  }
}
function upgrade3() {
  if (fritzls >= up3) {
    fritzls = fritzls - up3;
    ua3++ ;
    u2 = u2*2;
    i2 = a2 * u2;
    up3 = up3*4;
    document.getElementById("uanzahl3").innerHTML = ua3;
    document.getElementById("ukosten3").innerHTML = up3;
    document.getElementById("fps2").innerHTML = u2.toFixed(0);
    sound(audiocash);
  }
}
function upgrade4() {
  if (fritzls >= up4) {
    fritzls = fritzls - up4;
    ua4++ ;
    up4 = up4*4;
    document.getElementById("uanzahl4").innerHTML = ua4;
    document.getElementById("ubeschreibung3").innerHTML = ua4 + 1;
    document.getElementById("ukosten4").innerHTML = up4;
    sound(audiocash);
  }
}
function upgrade5() {
  if (fritzls >= up5) {
    fritzls = fritzls - up5;
    ua5++ ;
    up5 = up5*8;
    maus = ((1 + (10*a4*ua5))*2**ua1)*(1+((a1*ua2)/100));
    document.getElementById("uanzahl5").innerHTML = ua5;
    document.getElementById("ukosten5").innerHTML = up5;
    document.getElementById("ubeschreibung4").innerHTML = 10*(ua5+1);
    sound(audiocash);
  }
}
function upgrade6() {
  if (fritzls >= up6) {
    fritzls = fritzls - up6;
    ua6++ ;
    sb = 10;
    u1 = (0.2 + (ua2*0.1))*(10**ua6);
    i1 = a1 * u1;
    document.getElementById("upgrade6hide").style.display = "none";
    document.getElementById("bier1").innerHTML ="Sternburg";
    document.getElementById("bier2").innerHTML ="Sternburg";
    document.getElementById("bier3").innerHTML ="Sternburg";
    document.getElementById("ubeschreibung1").innerHTML = (u1 + 0.1*10**ua6).toFixed(1);
    document.getElementById("fps1").innerHTML = u1.toFixed(1);
    sound(audiocash);
  }
}
function upgrade7() {
  if (fritzls >= up7) {
    fritzls = fritzls - up7;
    ua7++ ;
    u5 = 111 * (ua7+1);
    i5 = a5 * u5;
    up7 = up7*2;
    document.getElementById("uanzahl7").innerHTML = ua7;
    document.getElementById("ukosten7").innerHTML = up7;
    document.getElementById("fps5").innerHTML = u5;
    sound(audiocash);
  }
}
function upgrade8() {
  if (fritzls >= up8) {
    fritzls = fritzls - up8;
    ua8++ ;
    a1 = a1 -(20*(ua8-1)*a6) + 20*ua8*a6;
    i1 = a1 * u1;
    up8 = up8*4;
    document.getElementById("uanzahl8").innerHTML = ua8;
    document.getElementById("ubeschreibung6").innerHTML = 20*(ua8+1);
    document.getElementById("ukosten8").innerHTML = up8;
    document.getElementById("anzahl1").innerHTML = a1;
    sound(audiocash);
  }
}
//Funktion zum automatischen aktualisieren des Punktestandes
function aktualisieren() {
  fps = (i1 + i2 + i3 + i4 + i5 + i6)*(1+(a3*ua4*0.01)); //alle insgesamte Foods mit Uprades verrechnet
  fritzls = fritzls + (fps/100); //fritzl-Aktualisierung, geteilt durch 100, da Intervall alle 0,01 Sekunden ausgelöst
  ffritzls = ffritzls + (fps/100);
  anzeige();
  document.getElementById("fpsa").innerHTML = fps.toLocaleString("de", {maximumFractionDigits:2}); //Aktualisierung der fpS-Anzeige
  if (fritzls == 0) { //Seitentitelaktualisierung, abhängig wie viele fritzl man hat
    document.title = "fritzlclickr - der beste Clicker Ilmenaus!";
  } else if (fritzls == 1) {
    document.title = fritzls.toFixed(0) + " fritzl!";
  } else {
    document.title = fritzls.toFixed(0) + " fritzls!";
  }
}
//Funktionen für das Zeigen von div-Containern
function foodtab() {
  if (tab > 0) {
  document.getElementById("food").style.display = "inline";
  document.getElementById("upgrades").style.display = "none";
  sound(audioclick);
  tab = 0; //Variable, damit Tab nicht öfter geclickt werden kann
  }
}
function upgradetab() {
  if (tab < 1) {
  document.getElementById("food").style.display = "none";
  document.getElementById("upgrades").style.display = "inline";
  sound(audioclick);
  tab = 1;
  }
}
//Speichern/Laden-Funktion
function speichern() { //Alle wichtigen Variablen in local Storage packen
  sound(audioclick);
  if (window.confirm("Spielstand speichern?")){ //Abfrage, ob User speichern will
  let time = new Date(); 
  let timenow = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " " + time.getDate() + "." + (time.getMonth()+1) + "." + time.getFullYear(); //volle Datum- und Zeitanzeige für Statistik
  insfood = a1 + a2 + a3 + a4 + a5 + a6;
  insup = ua1 + ua2 + ua3 + ua4 + ua5 + ua6 + ua7 + ua8;
  savegame = 1;
  document.getElementById("nachricht").innerHTML ="Spielstand gespeichert!"; //Nachricht
  localStorage.setItem("smausclicks", mausclicks);
  localStorage.setItem("sfritzlclicks", fritzlclicks);
  localStorage.setItem("sfood", insfood);
  localStorage.setItem("supgrade", insup);
  localStorage.setItem("stime", timenow);
  localStorage.setItem("fritzlAnzahl", fritzls);
  localStorage.setItem("fritzlsproSekunde", fps);
  localStorage.setItem("mausupgrade", maus);
  localStorage.setItem("foodfritzls", ffritzls);
  localStorage.setItem("save", savegame);
  localStorage.setItem("afood1", a1);
  localStorage.setItem("afood2", a2);
  localStorage.setItem("afood3", a3);
  localStorage.setItem("afood4", a4);
  localStorage.setItem("afood5", a5);
  localStorage.setItem("afood6", a6);
  localStorage.setItem("pfood1", p1.toFixed(1));
  localStorage.setItem("pfood2", p2.toFixed(1));
  localStorage.setItem("pfood3", p3.toFixed(1));
  localStorage.setItem("pfood4", p4.toFixed(1));
  localStorage.setItem("pfood5", p5.toFixed(1));
  localStorage.setItem("pfood6", p6.toFixed(1));
  localStorage.setItem("ifood1", i1);
  localStorage.setItem("ifood2", i2);
  localStorage.setItem("ifood3", i3);
  localStorage.setItem("ifood4", i4);
  localStorage.setItem("ifood5", i5);
  localStorage.setItem("ifood6", i6);
  localStorage.setItem("ufood1", u1);
  localStorage.setItem("ufood2", u2);
  localStorage.setItem("ufood5", u5);
  localStorage.setItem("aupgrade1", ua1);
  localStorage.setItem("aupgrade2", ua2);
  localStorage.setItem("aupgrade3", ua3);
  localStorage.setItem("aupgrade4", ua4);
  localStorage.setItem("aupgrade5", ua5);
  localStorage.setItem("aupgrade6", ua6);
  localStorage.setItem("aupgrade7", ua7);
  localStorage.setItem("aupgrade8", ua8);
  localStorage.setItem("pupgrade1", up1);
  localStorage.setItem("pupgrade2", up2);
  localStorage.setItem("pupgrade3", up3);
  localStorage.setItem("pupgrade4", up4);
  localStorage.setItem("pupgrade5", up5);
  localStorage.setItem("pupgrade6", up6);
  localStorage.setItem("pupgrade7", up7);
  localStorage.setItem("pupgrade8", up8);
  localStorage.setItem("foodfritzls", ffritzls);
  }
  else {document.getElementById("nachricht").innerHTML ="Spielstand nicht gespeichert!"; //falls auf Abfrage nein geantwortet wurde
}
}
function laden() { //Laden der ganzen gespeicherten Variablen
  sound(audioclick);
  savegame = localStorage.getItem("save");
  if (savegame == 0){
  document.getElementById("nachricht").innerHTML= "keinen Spielstand gefunden!"
  } else {
  if (window.confirm("Spielstand laden?")){
  document.getElementById("nachricht").innerHTML ="Spielstand geladen!";
  fritzls = localStorage.getItem("fritzlAnzahl");
  maus = localStorage.getItem("mausupgrade");
  mausclicks = localStorage.getItem("smausclicks");
  a1 = localStorage.getItem("afood1");
  a2 = localStorage.getItem("afood2");
  a3 = localStorage.getItem("afood3");
  a4 = localStorage.getItem("afood4");
  a5 = localStorage.getItem("afood5");
  a6 = localStorage.getItem("afood6");
  p1 = localStorage.getItem("pfood1");
  p2 = localStorage.getItem("pfood2");
  p3 = localStorage.getItem("pfood3");
  p4 = localStorage.getItem("pfood4");
  p5 = localStorage.getItem("pfood5");
  p6 = localStorage.getItem("pfood6");
  i1 = localStorage.getItem("ifood1");
  i2 = localStorage.getItem("ifood2");
  i3 = localStorage.getItem("ifood3");
  i4 = localStorage.getItem("ifood4");
  i5 = localStorage.getItem("ifood5");
  i6 = localStorage.getItem("ifood6");
  u1 = localStorage.getItem("ufood1");
  u2 = localStorage.getItem("ufood2");
  u5 = localStorage.getItem("ufood5");
  ua1 = localStorage.getItem("aupgrade1");
  ua2 = localStorage.getItem("aupgrade2");
  ua3 = localStorage.getItem("aupgrade3");
  ua4 = localStorage.getItem("aupgrade4");
  ua5 = localStorage.getItem("aupgrade5");
  ua6 = localStorage.getItem("aupgrade6");
  ua7 = localStorage.getItem("aupgrade7");
  ua8 = localStorage.getItem("aupgrade8");
  up1 = localStorage.getItem("pupgrade1");
  up2 = localStorage.getItem("pupgrade2");
  up3 = localStorage.getItem("pupgrade3");
  up4 = localStorage.getItem("pupgrade4");
  up5 = localStorage.getItem("pupgrade5");
  up6 = localStorage.getItem("pupgrade6");
  up7 = localStorage.getItem("pupgrade7");
  up8 = localStorage.getItem("pupgrade8");
  sb = localStorage.getItem("sternburg");
  fritzls = parseFloat(fritzls);
  maus = parseFloat(maus);
  mausclicks = parseFloat(mausclicks);
  a1 = parseFloat(a1);
  a2 = parseFloat(a2);
  a3 = parseFloat(a3);
  a4 = parseFloat(a4);
  a5 = parseFloat(a5);
  a6 = parseFloat(a6);
  p1 = parseFloat(p1);
  p2 = parseFloat(p2);
  p3 = parseFloat(p3);
  p4 = parseFloat(p4);
  p5 = parseFloat(p5);
  p6 = parseFloat(p6);
  i1 = parseFloat(i1);
  i2 = parseFloat(i2);
  i3 = parseFloat(i3);
  i4 = parseFloat(i4);
  i5 = parseFloat(i5);
  i6 = parseFloat(i6);
  u1 = parseFloat(u1);
  u2 = parseFloat(u2);
  u5 = parseFloat(u5);
  ua1 = parseFloat(ua1);
  ua2 = parseFloat(ua2);
  ua3 = parseFloat(ua3);
  ua4 = parseFloat(ua4);
  ua5 = parseFloat(ua5);
  ua6 = parseFloat(ua6);
  ua7 = parseFloat(ua7);
  ua8 = parseFloat(ua8);
  up1 = parseFloat(up1);
  up2 = parseFloat(up2);
  up3 = parseFloat(up3);
  up4 = parseFloat(up4);
  up5 = parseFloat(up5);
  up6 = parseFloat(up6);
  up7 = parseFloat(up7);
  up8 = parseFloat(up8);
  document.getElementById("fa").innerHTML = fritzls.toFixed(1);
  document.getElementById("anzahl1").innerHTML = a1;
  document.getElementById("anzahl2").innerHTML = a2;
  document.getElementById("anzahl3").innerHTML = a3;
  document.getElementById("anzahl4").innerHTML = a4;
  document.getElementById("anzahl5").innerHTML = a5;
  document.getElementById("anzahl6").innerHTML = a6;
  document.getElementById("kosten1").innerHTML = p1.toFixed(1);
  document.getElementById("kosten2").innerHTML = p2.toFixed(1);
  document.getElementById("kosten3").innerHTML = p3.toFixed(1);
  document.getElementById("kosten4").innerHTML = p4.toFixed(1); 
  document.getElementById("kosten5").innerHTML = p5.toFixed(1);
  document.getElementById("kosten6").innerHTML = p6.toFixed(1);
  document.getElementById("uanzahl1").innerHTML = ua1;
  document.getElementById("uanzahl2").innerHTML = ua2;
  document.getElementById("uanzahl3").innerHTML = ua3;
  document.getElementById("uanzahl4").innerHTML = ua4;
  document.getElementById("uanzahl5").innerHTML = ua5;
  document.getElementById("uanzahl7").innerHTML = ua7;
  document.getElementById("uanzahl8").innerHTML = ua8;
  document.getElementById("ukosten1").innerHTML = up1;
  document.getElementById("ukosten2").innerHTML = up2;
  document.getElementById("ukosten3").innerHTML = up3;
  document.getElementById("ukosten4").innerHTML = up4;
  document.getElementById("ukosten5").innerHTML = up5;
  document.getElementById("ukosten6").innerHTML = up6;
  document.getElementById("ukosten7").innerHTML = up7;
  document.getElementById("ukosten8").innerHTML = up8;
  document.getElementById("ubeschreibung1").innerHTML = (u1 + 0.1*10**ua6).toFixed(1);
  document.getElementById("ubeschreibung2").innerHTML = ua2 + 1;
  document.getElementById("ubeschreibung3").innerHTML = ua4 + 1;
  document.getElementById("ubeschreibung4").innerHTML = 10*(ua5+1);
  document.getElementById("ubeschreibung6").innerHTML = 20*(ua8+1);
  document.getElementById("fps1").innerHTML = u1.toFixed(1);
  document.getElementById("fps2").innerHTML = u2.toFixed(0);
  document.getElementById("fps5").innerHTML = u5.toFixed(0);
  if (ua6 > 0) {
    document.getElementById("upgrade6hide").style.display = "none";
    document.getElementById("bier1").innerHTML ="Sternburg";
    document.getElementById("bier2").innerHTML ="Sternburg";
    document.getElementById("bier3").innerHTML ="Sternburg";
    }
  }
  else {document.getElementById("nachricht").innerHTML ="Spielstand nicht geladen!";}
  }
}
/*
  audioplop.pause();
  audioplop.currentTime = 0;  
  audioplop.play(); */
