// TODO: make counters into point accumulators

!function() {

   // module container
   var statistics = {};

   statistics.selectPoints = selectPoints;
   function selectPoints(points, selection) {
      if (!selection) return points;
      var selected_points = [];

      var score_groupings = {};
      score_groupings['Deuce Court'] = ['0-15', '15-0', '15-30', '30-15', '30-40', '40-30', '15-G', 'G-15'];
      score_groupings['Ad Court']    = ['15-15', '0-30', '30-30', '40-40', '15-40', '40-15', 'A-40', '40-A'];

      // overload score_selection to accept either arrays of scores or predefined named array of scores
      if (selection.scores) {
         if (typeof selection.scores == 'string' && Object.keys(score_groupings).indexOf(selection.scores) >= 0) {
            var score_selection = score_groupings[selection.scores];
         } else {
            var score_selection = selection.scores;
         }
      }

      var selection_keys = (typeof selection == 'object') ? Object.keys(selection) : undefined;

      for (var p=0; p < points.length; p++) {
         var point = points[p];

         if (score_selection && score_selection.indexOf(point.score) < 0) continue;

         if (selection.server != undefined     && point.server != selection.server) continue;
         if (selection.breakpoint != undefined && point.breakpoint != selection.breakpoint) continue;
         if (selection.gamepoint != undefined  && point.gamepoint != selection.gamepoint) continue;
         if (selection.game != undefined       && point.game != selection.game) continue;
         if (selection.set != undefined        && point.set != selection.set) continue;
         if (selection.winner != undefined     && point.winner != selection.winner) continue;
         if (selection.result != undefined     && point.result != selection.result) continue;
         if (selection.error != undefined      && point.error != selection.error) continue;
         if (selection.score != undefined      && point.score != selection.score) continue;

         selected_points.push(points[p]);
      }
      return selected_points;
   }

   statistics.counters = counters;
   function counters(points) {
      var stat_obj = { 
         'TotalPoints': points.length,
         'Breakpoints' : [0, 0],
         'BreakpointsConverted' : [0, 0],
         'ServesAce' : [0, 0],
         'ServesWinners' : [0, 0],
         'DoubleFaults' : [0, 0],
         'ServedPoints' : [0, 0],
         'Serves2nd' : [0, 0],
         'ServedGames' : [0, 0],
         'GamepointsConverted' : [0, 0],
         'ReceivedPoints' : [0, 0],
         'ReceivedPoints1st' : [0, 0],
         'ReceivedPoints2nd' : [0, 0],
         'PointsWonReturn' : [0, 0],
         'PointsWonReturn1st' : [0, 0],
         'PointsWonReturn2nd' : [0, 0],
         'MaxPointsInRow': [0, 0],
         'MaxGamesInRow': [0, 0],
         'MaxPointsInRow': [0, 0],
         'MaxShotsInRally': [0, 0],
         'NetPoints': [0, 0],
         'NetPointsWon': [0, 0]
      };

      var stat_points = {
         'NetPoints': [[], []],
      }

      var max_rally = 0;
      var last_point_winner;
      var pir = 0;
      var last_game_winner;
      var gir = 0;

      for (var p=0; p < points.length; p++) {
         var point = points[p];
         var hand  = finalShotHand(point);
         var serve_directions = serveDirections(point);
         var serve_outcomes = serveOutcomes(point);

         increment('ServedPoints', point.server);
         increment('ReceivedPoints', 1 - point.server);
         if (point.first_serve) {
            increment('Serves2nd', point.server);
            increment('ReceivedPoints2nd', 1 - point.server);
         } else {
            increment('ReceivedPoints1st', 1 - point.server);
         }

         increment('PointsWon', point.winner);
         if (point.server == point.winner) increment('PointsWonServes', point.server);
         if (point.server == point.winner && !point.first_serve) increment('PointsWonServes1st', point.server);
         if (point.server == point.winner &&  point.first_serve) increment('PointsWonServes2nd', point.server);

         if (point.server == point.winner && (!point.rally || (point.rally && point.rally.length <= 2))) increment('PointsWonServe3Rally', point.server);

         if (point.server != point.winner) increment('PointsWonReturn', 1 - point.server);
         if (point.server != point.winner && !point.first_serve) increment('PointsWonReturn1st', 1 - point.server);
         if (point.server != point.winner &&  point.first_serve) increment('PointsWonReturn2nd', 1 - point.server);

         if (point.result == 'Ace') increment('ServesAce', point.server);
         if (point.result == 'Serve Winner') increment('ServeWinners', point.server);
         if (point.result == 'Double Fault') increment('DoubleFaults', point.server);

         if (point.result == 'Forced Error' && point.rally && point.rally.length == 1) increment('ServeForcedErrors', point.server);

         if (point.result == 'Winner') increment('Winners', point.winner);
         if (point.result == 'Winner' && hand == 'Forehand') increment('WinnersForehand', point.winner);
         if (point.result == 'Winner' && hand == 'Backhand') increment('WinnersBackhand', point.winner);

         if (point.result == 'Forced Error') increment('ForcedErrors', 1 - point.winner);
         if (point.result == 'Forced Error' && hand == 'Forehand')   increment('ForcedErrorsForehand', 1 - point.winner);
         if (point.result == 'Forced Error' && hand == 'Backhand')   increment('ForcedErrorsBackhand', 1 - point.winner);

         if (point.result == 'Unforced Error') increment('UnforcedErrors', 1 - point.winner);
         if (point.result == 'Unforced Error' && hand == 'Forehand') increment('UnforcedErrorsForehand', 1 - point.winner);
         if (point.result == 'Unforced Error' && hand == 'Backhand') increment('UnforcedErrorsBackhand', 1 - point.winner);

         if (!point.first_serve) {
            if (serve_directions.first  == 'Wide') increment('ServesWide1st',  point.server);
            if (serve_directions.first  == 'Body') increment('ServesBody1st',  point.server);
            if (serve_directions.first  == 'T')    increment('ServesT1st',     point.server);

            if (point.result == 'Ace') increment('ServesAce1st', point.server);
            if (point.result == 'Serve Winner') increment('ServeWinners1st', point.server);
            if (point.result == 'Forced Error' && point.rally && point.rally.length == 1) increment('ServeForcedErrors1st', point.server);
            if (point.server == point.winner && (!point.rally || (point.rally && point.rally.length <= 2))) increment('PointsWonServe3Rally1st', point.server);

         } else {
            if (serve_directions.second == 'Wide') increment('ServesWide2nd', point.server);
            if (serve_directions.second == 'Body') increment('ServesBody2nd', point.server);
            if (serve_directions.second == 'T')    increment('ServesT2nd',    point.server);

            if (point.result == 'Ace') increment('ServesAce2nd', point.server);
            if (point.result == 'Serve Winner') increment('ServeWinners2nd', point.server);
            if (point.result == 'Forced Error' && point.rally && point.rally.length == 1) increment('ServeForcedErrors2nd', point.server);
            if (point.server == point.winner && (!point.rally || (point.rally && point.rally.length <= 2))) increment('PointsWonServe3Rally2nd', point.server);
         }

         if ( point.rally && point.rally.length && 
               ((point.rally.length == 1 && 
                 point.result != 'Unforced Error' && 
                 point.result != 'Forced Error') ||
                (point.rally.length > 1)) ) {
                   increment('ReturnsInPlay', 1 - point.server);
                   if (point.first_serve) {
                      increment('ReturnsInPlay2nd', 1 - point.server);
                   } else {
                      increment('ReturnsInPlay1st', 1 - point.server);
                   }
         }

         if (point.breakpoint != undefined) increment('Breakpoints', point.breakpoint);
         if (point.gamepoint != undefined)  increment('Gamepoints', point.gamepoint);
         if (point.score.indexOf('G') >= 0 && point.winner != point.server) increment('BreakpointsConverted', 1 - point.server);
         if (point.score.indexOf('G') >= 0 && point.winner == point.server) increment('GamepointsConverted', point.server);
         if (point.score.indexOf('G') >= 0) increment('Games', point.winner);
         if (point.score.indexOf('G') >= 0) increment('ServedGames', point.server);
         if (point.score.indexOf('G') >= 0) {
            if (point.winner == last_game_winner || last_game_winner == undefined) {
               gir += 1;
               if (gir > stat_obj.MaxGamesInRow[point.winner]) {
                  stat_obj.MaxGamesInRow[point.winner] = gir;
               }
            } else {
               gir = 1;
               if (gir > stat_obj.MaxGamesInRow[point.winner]) {
                  stat_obj.MaxGamesInRow[point.winner] = gir;
               }
            }
            last_game_winner = point.winner;
         }
         if (point.winner == last_point_winner || last_point_winner == undefined) {
            pir += 1;
            if (pir > stat_obj.MaxPointsInRow[point.winner]) {
               stat_obj.MaxPointsInRow[point.winner] = pir;
            }
         } else {
            pir = 1;
            if (pir > stat_obj.MaxPointsInRow[point.winner]) {
               stat_obj.MaxPointsInRow[point.winner] = pir;
            }
         }
         last_point_winner = point.winner;
         if (point.rally && point.rally.length && point.rally.length > max_rally) {
            max_rally = point.rally.length;
            stat_obj.MaxShotsInRally[0] = max_rally;
            stat_obj.MaxShotsInRally[1] = max_rally;
         }

         var np = isNetPoint(point);
         if (np.server) {
            stat_obj.NetPoints[point.server] += 1;
            stat_points.NetPoints[point.server].push(point);
         }
         if (np.receiver) {
            stat_obj.NetPoints[1 - point.server] += 1;
            stat_points.NetPoints[1 - point.server].push(point);
         }
         if (np.server && point.winner == point.server) stat_obj.NetPointsWon[point.server] += 1;
         if (np.receiver && point.winner != point.server) stat_obj.NetPointsWon[1 - point.server] += 1;
      }

      return stat_obj;

      function increment(what, who) {
         if (stat_obj[what]) {
            if (stat_obj[what][who]) {
               stat_obj[what][who] += 1;
            } else {
               stat_obj[what][who] = 1;
            }
         } else {
            stat_obj[what] = [];
            stat_obj[what][who] = 1;
         }
      }
   }

   statistics.baseStats = baseStats;
   function baseStats(c) {
      var ps = { 0: {}, 1: {} };
      for (var p=0; p < 2; p++) {

         var total_service          = validValue(c.ServedPoints, p);
         var second_serves          = validValue(c.Serves2nd, p);
         var first_serves_in        = total_service - second_serves;

         var opp_total_service      = validValue(c.ServedPoints, 1 - p);
         var opp_2nd_serves         = validValue(c.Serves2nd, 1 - p);

         var combined_total_service = total_service + opp_total_service;

         ps[p].CombinedServiceTotal = combined_total_service;
         ps[p].PctPointsWon         = cpct(validValue(c.PointsWon, p), combined_total_service);
         ps[p].PctPointsWonService  = cpct(validValue(c.PointsWonServes, p), validValue(c.ServedPoints, p));
         ps[p].PctPointsWonReturn   = validPct(c.PointsWonReturn, c.ReceivedPoints, p);

         ps[p].FirstServesIn        = first_serves_in;
         ps[p].PctServe1stIn        = cpct(first_serves_in, total_service);
         ps[p].PctPointsWon1st      = cpct(validValue(c.PointsWonServes1st, p), first_serves_in);

         ps[p].PctPointsWonReturn1st= validPct(c.PointsWonReturn1st, c.ReceivedPoints1st, p);

         ps[p].PctAces              = validPct(c.ServesAce, c.ServedPoints, p);
         ps[p].PctDoubleFaults      = validPct(c.DoubleFaults, c.ServedPoints, p);
         ps[p].PctPointsWon2nd      = validPct(c.PointsWonServes2nd, c.Serves2nd, p);
         ps[p].PctPointsWonReturn2nd= validPct(c.PointsWonReturn2nd, c.ReceivedPoints2nd, p);

         var opp_breakpoints        = validValue(c.Breakpoints, 1 - p);
         var opp_bpt_conv           = validValue(c.BreakpointsConverted, 1 - p);
         ps[p].BreakpointsSaved     = opp_breakpoints - opp_bpt_conv;
         ps[p].BreakpointsFaced     = opp_breakpoints;
         ps[p].PctBreakpointsSaved  = cpct(opp_breakpoints - opp_bpt_conv, opp_breakpoints);

         var breakpoints            = validValue(c.Breakpoints, p);
         var breakpoints_converted  = validValue(c.BreakpointsConverted, p);
         ps[p].Breakpoints          = breakpoints;
         ps[p].BreakpointsConverted = breakpoints_converted;
         ps[p].PctBreakpointsConverted = cpct(breakpoints_converted, breakpoints);

         var winners                = validValue(c.Winners, p);
         var aces                   = validValue(c.ServesAce, p);
         var serve_winners          = validValue(c.ServeWinners, p);
         // ps[p].Winners              = winners + aces + serve_winners;
         ps[p].Winners              = winners;      // MCP excludes aces and serve_winners from 'winners'

         var unforced_errors        = validValue(c.UnforcedErrors, p);
         var double_faults          = validValue(c.DoubleFaults, p);
         var second_serves_in       = second_serves - double_faults;
         ps[p].SecondServesIn       = second_serves_in;
         ps[p].PctServe2ndIn        = cpct(second_serves_in, second_serves);
         ps[p].UnforcedErrors       = unforced_errors + double_faults;

         var rip_1st                = validValue(c.ReturnsInPlay1st, p);
         var rip_2nd                = validValue(c.ReturnsInPlay2nd, p);
         var opp_double_faults      = validValue(c.DoubleFaults, 1 - p);
         var opp_2nd_serves_in      = opp_2nd_serves - opp_double_faults;
         var opp_1st_serves_in      = opp_total_service - opp_2nd_serves;
         ps[p].PctReturnsInPlay     = cpct(rip_1st + rip_2nd, opp_1st_serves_in + opp_2nd_serves_in);
         ps[p].PctReturnsInPlay1st  = cpct(rip_1st, opp_1st_serves_in);
         ps[p].PctReturnsInPlay2nd  = cpct(rip_2nd, opp_2nd_serves_in);

         var forcing_errors         = validValue(c.ForcedErrors, 1 - p);
         var aggressive_margin      = (aces + serve_winners + winners + forcing_errors) - (double_faults + unforced_errors);
         var aggressive_margin_pct  = cpct(aggressive_margin, c.TotalPoints);
         ps[p].AggressiveMargin     = aggressive_margin;
         ps[p].PctAggressiveMargin  = aggressive_margin_pct;
      }
      return ps;
   }

   statistics.serveStats = serveStats;
   function serveStats(c) {
      var ps = { 0: {}, 1: {} };
      for (var p=0; p < 2; p++) {

         // Serve Basics
         ps[p].PctServePointsWon    = validPct(c.PointsWonServes, c.ServedPoints, p);

         var total_service          = validValue(c.ServedPoints, p);
         var second_serves          = validValue(c.Serves2nd, p);
         var first_serves_in        = total_service - second_serves;

         ps[p].PctServeAce          = cpct(validValue(c.ServesAce, p),    total_service);
         ps[p].PctServeAce1st       = cpct(validValue(c.ServesAce1st, p), first_serves_in);
         ps[p].PctServeAce2nd       = cpct(validValue(c.ServesAce2nd, p), second_serves);

         ps[p].PctServeWinners      = cpct(validValue(c.ServeWinners, p), total_service);
         ps[p].PctServeWinners1st   = cpct(validValue(c.ServeWinners1st, p), first_serves_in);
         ps[p].PctServeWinners2nd   = cpct(validValue(c.ServeWinners2nd, p), second_serves);

         ps[p].PctServeForcedErrors    = cpct(validValue(c.ServeForcedErrors, p), total_service);
         ps[p].PctServeForcedErrors1st = cpct(validValue(c.ServeForcedErrors1st, p), first_serves_in);
         ps[p].PctServeForcedErrors2nd = cpct(validValue(c.ServeForcedErrors2nd, p), second_serves);

         ps[p].PctServeWon3Rally    = cpct(validValue(c.PointsWonServe3Rally, p), total_service);
         ps[p].PctServeWon3Rally1st = cpct(validValue(c.PointsWonServe3Rally1st, p), first_serves_in);
         ps[p].PctServeWon3Rally2nd = cpct(validValue(c.PointsWonServe3Rally2nd, p), second_serves);

         var serves_wide_1st        = validValue(c.ServesWide1st, p);
         var serves_wide_2nd        = validValue(c.ServesWide2nd, p);
         var serves_wide            = serves_wide_1st + serves_wide_2nd;

         ps[p].PctServeWide         = cpct(serves_wide, total_service);
         ps[p].PctServeWide1st      = cpct(serves_wide_1st, first_serves_in);
         ps[p].PctServeWide2nd      = cpct(serves_wide_2nd, second_serves);

         var serves_body_1st        = validValue(c.ServesBody1st, p);
         var serves_body_2nd        = validValue(c.ServesBody2nd, p);
         var serves_body            = serves_body_1st + serves_body_2nd;

         ps[p].PctServeBody         = cpct(serves_body, total_service);
         ps[p].PctServeBody1st      = cpct(serves_body_1st, first_serves_in);
         ps[p].PctServeBody2nd      = cpct(serves_body_2nd, second_serves);

         var serves_t_1st           = validValue(c.ServesT1st, p);
         var serves_t_2nd           = validValue(c.ServesT2nd, p);
         var serves_t               = serves_t_1st + serves_t_2nd;

         ps[p].PctServeT            = cpct(serves_t, total_service);
         ps[p].PctServeT1st         = cpct(serves_t_1st, first_serves_in);
         ps[p].PctServeT2nd         = cpct(serves_t_2nd, second_serves);

         // Direction
         

      }
      return ps;
   }

   function validValue(value, player) { 
      return value ? value[player] ? value[player] : 0 : 0; 
   }

   function validPct(value1, value2, player1, player2) {
      return (value1 && value2) ? 
             cpct(value1[player1], value2[player2 != undefined ? player2 : player1]) : 
             undefined;
   }

   function cpct(count, total) { 
      if (!total || !count) return 0;
      return parseFloat((count / total * 100).toFixed(2)); 
   }

   // temporary workaround until universal method contrived
   function finalShotHand(point) {
      if (!point) return undefined;
      if (!point.rally) return 'Serve';

      return findShot(point.rally[point.rally.length - 1]);

      function findShot(shot) {
         if (!shot) return false;
         var forehands = 'frvoulhj'.split('');
         var backhands = 'bszpymik'.split('');
         for (var d=0; d < forehands.length; d++) {
            if (shot.indexOf(forehands[d]) >= 0) return 'Forehand';
         }
         for (var d=0; d < backhands.length; d++) {
            if (shot.indexOf(backhands[d]) >= 0) return 'Backhand';
         }
         return 'Unknown';
      }
   }

   function serveDirections(point) {
      if (!point) return false;
      var first_serve_direction = 'Unknown';
      var second_serve_direction;
      var directions = { 0: 'Unknown', 4: 'Wide', 5: 'Body', 6: 'T' };
      if (point.serves && point.serves.length) {
         var direction = serveDirection(point.serves[point.serves.length - 1]);
         if (direction && !point.first_serve) {
            first_serve_direction = directions[direction];
         } else {
            second_serve_direction = directions[direction];
         }
      }

      if (point.first_serve && point.first_serve.serves && point.first_serve.serves.length) {
         var direction = serveDirection(point.first_serve.serves[point.first_serve.serves.length - 1]);
         if (direction) first_serve_direction = directions[direction];
      }

      var serve_directions = { first: first_serve_direction };
      if (second_serve_direction) serve_directions.second = second_serve_direction;

      return serve_directions;

      function serveDirection(shot) {
         if (!shot) return false;
         var directions = '0456'.split('');
         for (var d=0; d < directions.length; d++) {
            if (shot.indexOf(directions[d]) >= 0) return directions[d];
         }
         return 0;
      }
   }

   function serveOutcomes(point) {
   }

   statistics.raw = raw;
   function raw(points) {
      var c = statistics.counters(points);
      var st = statistics.baseStats(c);

      return [
         { 'M': '' },
         { 'A': c.ServesAce },
         { 'DF': c.DoubleFaults },
         { 'SP': c.ServedPoints },
         { 'S1In': [c.ServedPoints[0] - c.Serves2nd[0], c.ServedPoints[1] - c.Serves2nd[1]] },
         { 'S1PW': c.PointsWonServes1st },
         { 'S2PW': c.PointsWonServes2nd },
         { 'SG': c.ServedGames },
         { 'bpS': [st[0].BreakpointsSaved, st[1].BreakpointsSaved] },
         { 'bpF' : [st[0].BreakpointsFaced, st[1].BreakpointsFaced] },
      ];
   }

   statistics.statObjects = statObjects;
   function statObjects(points) {
      var so = [];
      var c = statistics.counters(points);
      var st = statistics.baseStats(c);

      so.push({
         name:          'Aces',
         numerator:     c.ServesAce,
//         denominator:   c.ServedPoints,
//         pct:           [st[0].PctAces, st[1].PctAces],
         default:       'numerator'
      });

      so.push({
         name:          'Double Faults',
         numerator:     c.DoubleFaults,
//         denominator:   c.ServedPoints,
//         pct:           [st[0].PctDoubleFaults, st[1].PctDoubleFaults],
         default:       'numerator'
      });

      // Don't display first serve statistics if the same as total serve statistics
      if (c.PointsWonServes && c.PointsWonServes1st && c.PointsWonServes.toString() != c.PointsWonServes1st.toString()) {
         so.push({
            name:          '1st Serve In',
            numerator:     [st[0].FirstServesIn, st[1].FirstServesIn],
            denominator:   c.ServedPoints,
            pct:           [st[0].PctServe1stIn, st[1].PctServe1stIn]
         });

         so.push({
            name:          '1st Serve Points Won',
            numerator:     c.PointsWonServes1st,
            denominator:   [c.ServedPoints[0] - c.Serves2nd[0], c.ServedPoints[1] - c.Serves2nd[1]],
            pct:           [st[0].PctPointsWon1st, st[1].PctPointsWon1st]
         });

         so.push({
            name:          '2nd Serve In',
            numerator:     [st[0].SecondServesIn, st[1].SecondServesIn],
            denominator:   c.Serves2nd,
            pct:           [st[0].PctServe2ndIn, st[1].PctServe2ndIn]
         });

         so.push({
            name:          '2nd Serve Points Won',
            numerator:     c.PointsWonServes2nd,
            denominator:   c.Serves2nd,
            pct:           [st[0].PctPointsWon2nd, st[1].PctPointsWon2nd]
         });
      }

      so.push({
         name:          'Total Points Won',
         numerator:     c.PointsWon,
//         denominator:   [st[0].CombinedServiceTotal, st[1].CombinedServiceTotal],
         default:       'numerator'
      });

      so.push({
         name:          'Returns In Play',
         numerator:     c.ReturnsInPlay,
         denominator:   [c.ServedPoints[1], c.ServedPoints[0]],
         pct:           [st[0].PctReturnsInPlay, st[1].PctReturnsInPlay]
      });

      so.push({
         name:          'Receiving Points Won',
         numerator:     c.PointsWonReturn,
         denominator:   [c.ServedPoints[1], c.ServedPoints[0]],
         pct:           [st[0].PctPointsWonReturn, st[1].PctPointsWonReturn]
      });

      if (c.PointsWonReturn && c.PointsWonReturn1st && c.PointsWonReturn.toString() != c.PointsWonReturn1st.toString()) {
         so.push({
            name:          'Receiving Points Won 1st',
            numerator:     c.PointsWonReturn1st,
            denominator:   c.ReceivedPoints1st,
            pct:           [st[0].PctPointsWonReturn1st, st[1].PctPointsWonReturn1st]
         });

         so.push({
            name:          'Receiving Points Won 2nd',
            numerator:     c.PointsWonReturn2nd,
            denominator:   c.ReceivedPoints2nd,
            pct:           [st[0].PctPointsWonReturn2nd, st[1].PctPointsWonReturn2nd]
         });
      }

      so.push({
         name:          'Break Points Won',
         numerator:     c.BreakpointsConverted,
         denominator:   c.Breakpoints,
         pct:           [st[0].PctBreakpointsConverted, st[1].PctBreakpointsConverted]
      });

      so.push({
         name:          'Break Points Saved',
         numerator:     [st[0].BreakpointsSaved, st[1].BreakpointsSaved],
         denominator:   [st[0].BreakpointsFaced, st[1].BreakpointsFaced],
         pct:           [st[0].PctBreakpointsSaved, st[1].PctBreakpointsSaved]
      });

//      if (st[0].Winners != c.ServesAce[0] && st[1].Winners != c.ServesAce[1]) {
         so.push({
            name:          'Winners',
            numerator:     [st[0].Winners, st[1].Winners],
            default:       'numerator'
         });
//      }

      so.push({
         name:          'Unforced Errors',
         numerator:     c.UnforcedErrors,
         default:       'numerator'
      });

      so.push({
         name:          'Forced Errors',
         numerator:     c.ForcedErrors,
         default:       'numerator'
      });

      so.push({
         name:          'Aggressive Margin',
         numerator:     [st[0].AggressiveMargin, st[1].AggressiveMargin],
         denominator:   [st[0].CombinedServiceTotal, st[1].CombinedServiceTotal],
         pct:           [st[0].PctAggressiveMargin, st[1].PctAggressiveMargin]
      });

      so.push({
         name:          'Service Games Won',
         numerator:     c.GamepointsConverted,
         denominator:   c.ServedGames
      });

      so.push({
         name:          'Service Points Won',
         numerator:     c.PointsWonServes,
         denominator:   c.ServedPoints,
         pct:           [st[0].PctPointsWonService, st[1].PctPointsWonService]
      });

      so.push({
         name:          'Games Won',
         numerator:     c.Games,
      });

      so.push({
         name:          'Most Consecutive Points Won',
         numerator:     c.MaxPointsInRow,
      });

      so.push({
         name:          'Most Consecutive Games Won',
         numerator:     c.MaxGamesInRow,
      });

      so.push({
         name:          'Longest Rally',
         numerator:     c.MaxShotsInRally,
      });

      so.push({
         name:          'Net Points Won',
         numerator:     c.NetPointsWon,
         denominator:   c.NetPoints,
         // ADD PERCENTAGE!!
      });

      return so;
   }

   statistics.isNetPoint = isNetPoint;
   function isNetPoint(point) {
      serverNet = 0;
      receiverNet = 0;

      // check for serve/volley
      var serves = point.serves;
      if (serves && serves.length) {
         if (serves[serves.length - 1].indexOf('+') >= 0) {
            serverNet = 1;
         }
      }

      if (!point.rally || !point.rally.length) {
         return { server: serverNet, receiver: receiverNet };
      }

      var rallyString = point.rally.join('');

      var extraneous = ["c", ";", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "d", "x", "n", "w"];
      var netShots = ["o", "p", "v", "z", "j", "k", "h", "i"];
      var baseShots = ["f", "b", "r", "s", "l", "m", "t", "q"];
      var dropShots = ["u", "y"];

      extraneous.forEach(function(e) {
         rallyString = rallyString.replace(new RegExp(e, 'g'), '');
      });

      netShots.forEach(function(e) {
         rallyString = rallyString.replace(new RegExp(e + '=', 'g'), 'B');
         rallyString = rallyString.replace(new RegExp(e, 'g'), 'N');
      });

      baseShots.forEach(function(e) {
         rallyString = rallyString.replace(new RegExp(e + '-', 'g'), 'N');
         rallyString = rallyString.replace(new RegExp(e + '\\+', 'g'), 'A');
         rallyString = rallyString.replace(new RegExp(e, 'g'), 'B');
      });

      dropShots.forEach(function(e) {
         rallyString = rallyString.replace(new RegExp(e + '-', 'g'), 'E');
         rallyString = rallyString.replace(new RegExp(e, 'g'), 'D');
      });

      var serverShots = [];
      var receiverShots = [];

      rallyString.split('').forEach(function(s, i) {
         if (['*', '#', '@'].indexOf(s) < 0) {
            if (i % 2) { serverShots.push(s); } else { receiverShots.push(s); }
         }
      });

      // net shot: automatic net point
      // drop shot hit from net area: auto net point
      if (serverShots.indexOf('N') >=0 || serverShots.indexOf('E') >=0) serverNet = 1;
      if (receiverShots.indexOf('N') >=0 || receiverShots.indexOf('E') >= 0) receiverNet = 1;

      var rl = rallyString.length;
      // opponent hit drop shot -- but not if ended the point w/ forced error or winner
      if (inFinalShots(serverShots, 'D')) receiverNet = 1;
      if (inFinalShots(receiverShots, 'D')) serverNet = 1;
      // player hit approach shot -- but not if approach was winner, error, or caused forced error
      if (inFinalShots(serverShots, 'A')) serverNet = 1;
      if (inFinalShots(receiverShots, 'A')) receiverNet = 1;
      function inFinalShots(shots, shot) {
         if (shots.indexOf(shot) >= 0) {
            if (rallyString.indexOf('*') >= 0 || rallyString.indexOf('@') >= 0) {
               var approachString = rallyString.slice(rl - 2);
            }
            if (rallyString.indexOf('#') >= 0) {
               var approachString = rallyString.slice(rl - 3);
            }
            if (approachString && approachString.indexOf(shot) >= 0) return true; 
         }
      }

      return { server: serverNet, receiver: receiverNet };
   }

   if (typeof define === "function" && define.amd) define(statistics); else if (typeof module === "object" && module.exports) module.exports = statistics;
   this.statistics = statistics;
 
}();
