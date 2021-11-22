!function() { 

   // module container
   var saveMCP = {};

   function saveCSV(textToWrite, fileNameToSaveAs) {
      fileNameToSaveAs = fileNameToSaveAs || 'data.txt';
       var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
       var downloadLink = document.createElement("a");
       downloadLink.download = fileNameToSaveAs;
       downloadLink.innerHTML = "Download File";
       if (window.URL != null) { 
          downloadLink.href = window.URL.createObjectURL(textFileAsBlob); 
       } else {
           downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
           downloadLink.onclick = destroyClickedElement;
           downloadLink.style.display = "none";
           document.body.appendChild(downloadLink);
       }
       downloadLink.click();
   }

   function populateCSV() {

      var meta = [];
      var md = saveMCP.match_data;
      var metadata = md.metadata();

      // reverse player names if first service == 1
      var rp = md.options().match.first_service;

      // always put the player who serves first as the first player for MCP
      meta.push(metadata.players[rp].name || '');
      meta.push(metadata.players[1 - rp].name || '');
      meta.push(metadata.players[rp].hand || '');
      meta.push(metadata.players[1 - rp].hand || '');
      meta.push(metadata.match.category || '');
      meta.push(metadata.match.date ? prepareDate(metadata.match.date) : '');
      meta.push("\"" + metadata.tournament.name + "\"" || ''); // need to wrap in quotes before export
      meta.push(metadata.tournament.round || '');
      meta.push(metadata.tournament.time || '');
      meta.push(metadata.match.court || '');
      meta.push(metadata.tournament.surface || '');
      meta.push(metadata.match.umpire || '');
      meta.push(metadata.charter || '');

      meta.push(md.options().match.sets || '');
      meta.push(md.options().match.final_set_tiebreak || '');

      var rows = 'meta,1st,2nd\r\n';
      var points = [];
      md.points().map(function(m) { if (m.code) return m.code.split('|'); })
                 .filter(function(f) { return f; })
                 .forEach(function(point) { points.push(point.join(',')); } );
      var range = meta.length > points.length ? meta.length : points.length;
      for (r=0; r < range; r++) {
         rows += meta[r] || '';
         rows += ',' + (points[r] || '') + '\r\n';
      }
      return rows;
   }

   function prepareDate(textdate) {
      return textdate.split('-').join('');
   }

   saveMCP.downloadMatch = downloadMatch;
   function downloadMatch(charting) {
      saveMCP.match_data = md = charting.match_data;
      if (!md.points().length) return;
      var file_name = new Date().toDateString().split(' ').join('-') + '_';
      var p = md.metadata().players;
      [p[0], p[1]].forEach(function(e) { file_name += e.name.split(' ').join('') + '_'; })
      file_name += 'MCP.csv';
      var rows = populateCSV();
      saveCSV(rows, file_name);
      var report = 'DOWNLOAD.....' + file_name;
      if (aip) aip.sendReport(report);
   }

   this.saveMCP = saveMCP;

}();
