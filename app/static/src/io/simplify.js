            function simplifyOutcomeCode(icode, server, player, outcome) {
               icode = icode + '';
               var ocode = icode;
               var hand;
               var type;
               var rally_range;
               var rally_ranges = { '2': '3-4', '3': '5-8', '4': '>8' };
               var down_the_line;
               var trajectory = [];
               var shot_attributes = [];
               var serve_attributes = [];

               // first test for Serve and Volley
               // indicates a net approach on the 3rd shot of the rally
               var svtest = /SV/;
               var serve_volley = (svtest.test(ocode));

               var leadingS = /^S/;    // redundant; remove so that other parsing works
               ocode = ocode.replace(leadingS, '');

               var trailingT2 = /^T2/;
               if (trailingT2.test(ocode)) {
                  ocode = ocode.replace(trailingT2, '');
                  serve_attributes.push('Twice');  // redundant because obvious in Point Progression
               }

               // now trim off Rally related information
               var rallyRange = /[DVSRN](\d)$/;
               if (rallyRange.test(ocode)) {
                  var rally_range = rally_ranges[rallyRange.exec(ocode)[1]];
                  ocode = ocode.replace(rallyRange, '');
               }

               // Service Winners
               var sa = /^\d[VPTMD]/;
               var sw = ( server == player && 
                          ['Provoked', 'Winner'].indexOf(outcome) >= 0 && 
                          sa.test(ocode)
                        );

               if (sa.test(ocode)) {
                  if (ocode[1] == 'V') { serve_attributes.push('Accuracy'); }
                  if (ocode[1] == 'P') { serve_attributes.push('Power'); }
                  if (ocode[1] == 'T') { serve_attributes.push('Touch'); }
                  if (ocode[1] == 'M') { serve_attributes.push('Nice'); }
                  if (ocode[1] == 'D') { serve_attributes.push('Twice'); }
                  ocode = '';
               }

               // ACES
               var numstart = /^\d/;
               var ace = ( !sw && server == player && 
                           ['Provoked', 'Winner'].indexOf(outcome) >= 0 && 
                           (numstart.test(ocode) || ocode[0] == 'A')
                         );

               // Double Faults
               var numonly = /^\d$/;
               var df = ( server == player && outcome == 'Error' && numonly.test(ocode));

               // Now trim all serve related information
               var leadingDigits = /^\d+/;
               if (leadingDigits.test(ocode)) {
                  rally_range = 3; // 1-2 punch is always won on third shot of rally
                  var ocode = ocode.replace(leadingDigits, '');
               }

               var trailingDigits = /(\d+)$/;
               ocode = ocode.replace(trailingDigits, '');

               // convert old codes to new codes
               var rrv = /RRV/;
               var rcd = /RCD/;
               ocode = ocode.replace(rrv, 'G');
               ocode = ocode.replace(rcd, 'H');

               if (['V', 'VS', 'VR'].indexOf(ocode) >= 0) {
                  shot_attributes.push('approach');
                  ocode = ''; // no more information
               } else if (ocode[0] == 'V') {
                  type = 'volley';
                  ocode = ocode.substr(1); // now remove leading 'V' so rest of parsing works
               }

               // test for approach and remove trailing V
               var trailingV = /V$/;
               if (trailingV.test(ocode)) {
                  shot_attributes.push('approach');
                  ocode = ocode.replace(trailingV, '');
               }

               // again check for rally range
               var rallyRange = /[DVSRN](\d)$/;
               if (rallyRange.test(ocode)) {
                  var rally_range = rally_ranges[rallyRange.exec(ocode)[1]];
                  ocode = ocode.replace(rallyRange, '');
               }

               // E indicates approach shots, except in some cases = center
               var trailingE = /E$/;
               if (trailingE.test(ocode)) {
                  if (['RE', 'DE', 'CE', 'RPE', 'CPE'].indexOf(ocode) < 0) {
                     shot_attributes.push('approach');
                  } else {
                     trajectory.push('center');
                  }
                  ocode = ocode.replace(trailingE, '');
               }

               // identify down the line; all 'L' except for 'TL'
               if (ocode.indexOf('L') >= 0 && ocode.indexOf('TL') < 0) {
                  trajectory.push('down the line');
                  down_the_line = true;
               }

               // identify 'toudh'; all 'T' except for 'TL'
               if (ocode.indexOf('TL') >= 0) { 
                  type = 'lob'; 
               } else if (ocode.indexOf('T') >= 0) {
                  shot_attributes.push('touch');
               }

               if (ocode == 'DL') {
                  trajectory.push('inside in');
                  ocode = 'C';
               }

               if (ocode.substr(1).indexOf('D') >= 0 || ocode == 'DC') {
                  trajectory.push('inside out');
                  if (ocode == 'DC') ocode = 'D';
               }

               var sb1 = /CCC/;
               var sb2 = /CCL/;
               if (sb1.test(ocode) || sb2.test(ocode)) {
                  shot_attributes.push('short ball');
                  ocode = ocode.replace(sb1, 'CC');
                  ocode = ocode.replace(sb2, 'CL');
               }

               if (ocode.substr(1).indexOf('C') >=0 && !down_the_line) {
                  trajectory.push('cross court');
               }

               if (['VRP', 'VCP'].indexOf(ocode) >= 0) { type = 'drive volley'; }

               if (ocode.indexOf('A') >= 0) { type = 'drop'; }

               if (ocode == 'SM') {
                  hand = 'forehand';
                  type = 'smash';
               }

               var halfVolley = /D$/;
               if (halfVolley.test(ocode)) type = 'half-volley';

               // some coups joue start with P
               var leadingP = /^P/;
               if (leadingP.test(ocode)) {
                  shot_attributes.push('passing');
                  ocode.replace(leadingP, '');
               }

               var returnHand = /^[GH]/;
               var shotHand = /^[CDR]/;
               var internalP = /P/;
               if (internalP.test(ocode)) {
                  if (shotHand.test(ocode)) {
                     shot_attributes.push('passing');
                  } else if (returnHand.test(ocode)) {
                     trajectory.push('inside in');
                  }
               }

               var forehands = /^[HCD]/;
               var backhands = /^[GR]/;
               if (forehands.test(ocode)) {
                  hand = 'forehand';
               } else if (backhands.test(ocode)) {
                  hand = 'backhand';
               }

               var shot_code = ocode.length || shot_attributes.length ? shotCode(hand, type) : '';

               console.log('----------------');
               console.log(icode, ocode);
               return {
                  shot_code: shot_code, 
                  serve_volley: serve_volley,
                  serve_attributes: serve_attributes,
                  shot_attributes: shot_attributes,
                  trajectory: trajectory,
                  rally_range: rally_range, 
                  ace: ace, 
                  sw: sw, 
                  df: df 
               };
            }

            function shotCode(hand, type) {
               if (hand == 'backhand') {
                  if (type == 'volley') return 'z';
                  if (type == 'half-volley') return 'i';
                  if (type == 'smash') return 'p'; // never happens in SBA
                  if (type == 'lob') return 'm';
                  if (type == 'drive volley') return 'k';
                  if (type == 'drop') return 'y';
                  return 'b';
               } else {
                  if (type == 'volley') return 'v';
                  if (type == 'half-volley') return 'h';
                  if (type == 'smash') return 'o';
                  if (type == 'lob') return 'l';
                  if (type == 'drive volley') return 'j';
                  if (type == 'drop') return 'u';
                  return hand ? 'f' : 'q';
               }
            }

