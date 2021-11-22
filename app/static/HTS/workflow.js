pr = hts.rankCategory('U12')
//

mm = hts.addMatches()
matrix = hts.createMatrix(mm)
players = hts.findPlayers()
u12players = hts.findPlayers('U12')

pr = hts.prestigeRank(matrix)

rlist = prList(pr, players.m)
u12rank = u12players.m.map(m => rlist.indexOf(m))
u12rank.sort((a, b) => a - b)
u12r = u12rank.map(m => rlist[m]);

function prList(pr, players) {
   var ranked_players = [];
   var list = pr.elements.slice().sort().reverse();
   var l=0;
   while(l < list.length) {
      var idx = pr.elements.reduce((a, e, i) => { if (e === list[l]) a.push(i); return a; }, []);
      idx.forEach(i => {
         l += 1;
         ranked_players.push(players[i]);
      });
   }
   return ranked_players;
}

thelist = ["Dino Prizmic", "Alen Bill", "Lovre Erceg", "Fran Mitrovic", "Mili Poljicak", "Matej Dodig", "Luka Mikrut", "Roko Baskovic", "Patrik Jurina", "Ivan Sodan", "Dorian Vasung", "Lovro Harc", "Roko Stipetic", "Noa Vukadin", "Bruno Balic", "Luka Vidovic", "Matija Margetic", "Tin Ostro", "Ante Petar Ercegovic", "Bartol Borse", "Stjepan Majcan", "Tonko Puljiz", "Lovre Ethan Hirons", "Teo Kurtagic", "Lovro Majcan", "Stefan Djokic", "A. Walker Allen", "Dino Glavas", "Andrey Te", "Ognjen Dragosavljevic", "Borna Borsic", "Stjepan Ivanek", "Josip Poljak", "Jakov Maroevic", "Vito Horvat", "Leon Babic Brajko", "Luka Plosnic", "Dominik Simunovic", "Matan Budimir", "Nazar Oliynykov", "Karlo Klaic", "Filip Kola", "Jurica Blazevic", "Matej Bek", "Vito Ivanisevic", "Mark Oliver Tutic", "Savva Krivoshchekov", "Fran Kuna", "Marko Banicevic", "Leonard Lozancic", "Marko Indic", "Denis Adlasic", "Mateo Mrvac", "Roko Markovina", "Josip Bobok", "Vedran Tucic", "Daniel Jancic", "Fran Rakonic", "Gabriel Barun", "Lance Ian Urlaub", "Toni Vladusic", "Filip Ferega", "Vinko Brkic", "Leon Soldatic", "Bruno Frankic", "Borna Jaki", "Antonio Voljavec", "Marko Bradvic", "Ainur Garifullin", "Patrik Krascic", "Danylo Rekun", "David Czersky-hafner", "Robert Leskur", "Pero Jelavic", "Viktor Boban", "Luka Dosen", "Damjan Vukadin", "Borna Pejic", "Patrik Lukac", "Noa Kljajic", "Borna Jagetic", "Brajko Leon Babic", "Daniel Skreb", "Noa Ruzic", "Leon Subotic", "Fran Katic", "Ivan Majic", "Almo Medvedec", "Oliver Burec", "Karlo Krstic", "Niko Mixich", "Marko Stojanovic", "Dorian Salopek", "Roko Zrilic", "Leopold Santic", "Marko Cindric", "Lucije Radic", "Antonio Kolic", "Carlo Smolic", "Vito Perkov"]

pool = { m: thelist }
rpool = hts.rankPool(pool);

function calcLv(names) {
   results = [];
   names.forEach((e, i) => {
      var matching = names
         .filter(n => {
            var lv = Levenshtein.get(e, n);
            if (lv == 1) return true;
         })
      if (matching.length) results.push({ name: e, matches: matching });
   });
   console.log('Done');
   return results;
}
