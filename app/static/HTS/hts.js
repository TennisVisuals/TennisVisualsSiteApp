// TODO: Box Plot of each tournament's ranked players range

!function() { 

   var hts = {};

      var cache = {};
      hts.contexts = [];
      hts.matches = [];
      hts.players = { a: [], m: [], f: [] };

      var result_columns = ['R128', 'R64', 'R32', 'R16', 'QF', 'SF', 'F', 'W'];

      selected_player.addEventListener("keyup", function(event) {
         if (event.keyCode == 13) { go(); }
      })

      hts.bh = bh;
      function bh() {
         var player_db = new Bloodhound({
           datumTokenizer: Bloodhound.tokenizers.whitespace,
           queryTokenizer: Bloodhound.tokenizers.whitespace,
           local: hts.players.a
         });
         $('#bloodhound .typeahead').typeahead('destroy');
         $('#bloodhound .typeahead').typeahead({
           hint: true,
           highlight: true,
           minLength: 1
         },
         {
           name: 'players',
           source: player_db
         })
         .keypress(function(event) {
            var that = this;
            var e = jQuery.Event("keydown");
            e.keyCode = e.which = 9; // 9 == tab
            if (event.which == 13) {
               $('#bloodhound .typeahead').trigger(e);
               return true;
            }
         })
         .on('typeahead:selected', function(event) {
            go();
         });
      }
      
      function go() {
         $('#bloodhound .typeahead').typeahead('close');
         findPlayer(selected_player.value);
      }

      hts.loadDataset = loadDataset;
      function loadDataset(id) {
         dataset_id = id;
         hts.players.a = [];
         d3.selectAll('.tournamentBurst').remove();
         d3.select('#bloodhound').style('display', 'none');

         if (selected_player.value == '') {
               d3.select('#overview').style('display', 'inline');
               d3.select('#matchRecord').style('display', 'none');
               d3.select('#stats').style('display', 'none');
               d3.select('#seasonchart').style('display', 'none');
               d3.select('#draws').style('display', 'none');
         }

         if (cache[id]) {
            defineContexts(cache[id]);
            d3.select('#bloodhound').style('display', 'inline');
            if (selected_player.value) { findPlayer(selected_player.value); }
            hts.bh();
         } else {
            $.ajax({
               url: '/api/match/request', 
               type: 'POST', 
               contentType: 'application/json', 
               data: JSON.stringify( { tournament: id })
            }).done(function(result) {
               if (result.err) console.log(result.err);
               if (result.data) {
                  if (aip) aip.sendReport('HTS: ' + id);
                  var data = JSON.parse(result.data);
                  cache[id] = data;
                  defineContexts(data);
                  d3.select('#bloodhound').style('display', 'inline');
                  if (selected_player.value) { findPlayer(selected_player.value); }
               }
               hts.bh();
            });
         }
      }

      hts.preloadDataset = preloadDataset;
      function preloadDataset(id) {
         if (!cache[id]) {
            $.ajax({
               url: '/api/match/request', 
               type: 'POST', 
               contentType: 'application/json', 
               data: JSON.stringify( { tournament: id })
            }).done(function(result) {
               if (result.err) console.log(result.err);
               if (result.data) { cache[id] = JSON.parse(result.data); }
            });
         }
      }

      hts.findPlayer = findPlayer;
      function findPlayer(player) {
         var in_contexts = [];
         if (hts.players.a.indexOf(player) >= 0) {
            aip.sendReport('HTS Player: ' + player);
            hts.contexts.forEach(function(c) {
               c.draw.first_round.forEach(function(e, i) { 
                  if (e.player && e.player.toLowerCase() == player.toLowerCase()) {
                     in_contexts.push({ id: c.id, ranking: +e.ranking });
                  }
               });
            });
         }
         mc.exports().hideClubs();
         hideCharts();
         if (in_contexts.length) {
            d3.select('#seasonchart').style('display', 'inline');
            d3.select('#matchRecord').style('display', 'inline');
            d3.select('#draws').style('display', 'inline');
            d3.select('#stats').style('display', 'inline');
            d3.select('#croatia').style('display', 'inline')
            d3.select('#c2').style('display', 'inline')
            d3.select('#overview').style('display', 'none');
            generateSeasonChart(player, in_contexts);
            showStats(player);
         } else {
            d3.select('#seasonchart').style('display', 'none');
            d3.select('#matchRecord').style('display', 'none');
            d3.select('#stats').style('display', 'none');
            d3.select('#draws').style('display', 'none');
            d3.select('#croatia').style('display', 'none')
            d3.select('#c2').style('display', 'none')
            d3.select('#overview').style('display', 'inline');
         }
      }
   
      function showStats(player) {
         var results = playerRecord(player);
         var stats = d3.select('#stats');
         var winloss = results.wins.length + ' / ' + results.losses.length;
         d3.select('#statsWinLoss').html(winloss);

         var games = results.games.won + ' / ' + results.games.lost;
         d3.select('#statsGames').html(games);
         d3.select('#statsUpsets').html(results.upsets.won + ' / ' + results.upsets.lost);

         var matches = d3.select('#matches');
         matches.selectAll('li').remove();
         results.wins.forEach(function(e) { matches.append('li').html(e.story).style('color', 'green'); });
         results.losses.forEach(function(e) { matches.append('li').html(e.story).style('color', 'red'); });
      }

      hts.playerResults = playerResults;
      function playerResults(context) {
         var pnames = {};
         context.draw.first_round.forEach(function(e, i) { 
            if (e.player && e.player.toLowerCase() != 'bye') {
               pnames[e.player] = {};
            } else if (e.players) {
               e.players.forEach(function(p) { 
                  if (p.player.toLowerCase() != 'bye') pnames[p.player] = {}; 
               });
            }
         });
         result_columns.forEach(function(r) {
            if (context.draw.rounds[r]) {
               context.draw.rounds[r].forEach(function(p) {
                  if (p.player && pnames[p.player] && p.player.toLowerCase() != 'bye') {
                     pnames[p.player].result = r;
                  } else if (p.players) {
                     p.players.forEach(function(l) {
                        if (pnames[l.player]) pnames[l.player].result = r;
                     });
                  }
               })
            }
         });
         return pnames;
      }

      hts.findMatches = findMatches;
      function findMatches(context_categories) {
         var matches = [];
         hts.contexts.forEach(function(context) {
            if (!context_categories || context_categories.indexOf(context.details.category) >= 0) {
               var rlts = result_columns.map(function(m) { return m; });
               var rk = Object.keys(context.draw.rounds);
               rlts = rlts.filter(function(f) { return rk.indexOf(f) >= 0; });
               for (var r=0; r < rlts.length - 1; r++) {
                  var opponents = context.draw.rounds[rlts[r]];
                  var winners = context.draw.rounds[rlts[r +1]];
                  if (opponents.length == winners.length * 2) {
                     for (var o=0; o < opponents.length; o += 2) {
                        if (opponents[o] && opponents[o+ 1]) {
                           var mp = [opponents[o].player, opponents[o + 1].player];
                           var winner = winners[o / 2];
                           var i = mp.indexOf(winner.player);
                           var loser = opponents[o + 1 - i];
                           if (i < 0) {
                              // console.log(context.id, w.player, mp);
                           } else if (winner.player.toLowerCase() != 'bye' && 
                                      mp[1 - i].toLowerCase() != 'bye' &&
                                      winner.score) 
                           {
                              var wname = winner.player.split(' ');
                              var lname = loser.player.split(' ');
                              var story = wname[wname.length - 1] + ' d. ' + lname[lname.length - 1] + ' ' + winner.score;
                              var match = {
                                 story: story,
                                 winner: winner,
                                 loser: loser,
                                 score: winner.score,
                                 context: context.id,
                                 gender: context.details.gender
                              }
                              if (winner.ranking && loser.ranking && +winner.ranking > +loser.ranking) match.upset = true;
                              matches.push(match);
                           }
                        }
                     }
                  } else {
                     // console.log('Wonky', c.id, c.details);
                  }
               }
            }
         });
         return matches;
      }

      hts.poolMatches = poolMatches;
      function poolMatches(player_pool) {
         var matches = [];
         hts.contexts.forEach(function(context) {
            var rlts = result_columns.map(function(m) { return m; });
            var rk = Object.keys(context.draw.rounds);
            rlts = rlts.filter(function(f) { return rk.indexOf(f) >= 0; });
            for (var r=0; r < rlts.length - 1; r++) {
               var opponents = context.draw.rounds[rlts[r]];
               var winners = context.draw.rounds[rlts[r +1]];
               if (opponents.length == winners.length * 2) {
                  for (var o=0; o < opponents.length; o += 2) {
                     if (opponents[o] && opponents[o+ 1]) {
                        var mp = [opponents[o].player, opponents[o + 1].player];
                        var winner = winners[o / 2];
                        var i = mp.indexOf(winner.player);
                        var loser = opponents[o + 1 - i];
                        if (i < 0) {
                           // console.log(context.id, w.player, mp);
                        } else if (winner.player.toLowerCase() != 'bye' && 
                                   mp[1 - i].toLowerCase() != 'bye' &&
                                   player_pool.indexOf(winner.player) >= 0 &&
                                   player_pool.indexOf(loser.player) >= 0 &&
                                   winner.score) 
                        {
                           var match = {
                              story: winner.player + ' d. ' + mp[1 - i] + ' ' + winner.score,
                              winner: winner,
                              loser: loser,
                              score: winner.score,
                              context: context.id,
                              gender: context.details.gender
                           }
                           if (winner.ranking && loser.ranking && +winner.ranking > +loser.ranking) match.upset = true;
                           matches.push(match);
                        }
                     }
                  }
               }
            }
         });
         return matches;
      }

      hts.findPlayers = findPlayers;
      function findPlayers(context_categories) {
         var players = [];
         var players_m = [];
         var players_f = [];
         hts.contexts.forEach(function(c) {
            if (!context_categories || context_categories.indexOf(c.details.category) >= 0) {
               c.draw.first_round.forEach(function(e, i) { 
                  if (e.player.toLowerCase() == 'bye') {
                     // skip
                  } else if (e.player) {
                     players.push(e.player);
                     if (c.details.gender == 'M') players_m.push(e.player);
                     if (c.details.gender == 'F') players_f.push(e.player);
                  } else if (e.players) {
                     e.players.forEach(function(p) { 
                        players.push(p.player);
                        if (c.details.gender == 'M') players_m.push(p.player);
                        if (c.details.gender == 'F') players_f.push(p.player);
                     });
                  } else {
                     console.log('Missing Player Name in context', c.id, 'index:', i);
                  }
               });
            }
         });
         players_m = players_m.filter(function(item, i, self) { return self.lastIndexOf(item) == i; });
         players_f = players_f.filter(function(item, i, self) { return self.lastIndexOf(item) == i; });
         players   = players.filter(function(item, i, self) { return self.lastIndexOf(item) == i; });
         return { m: players_m, f: players_f, a: players }
      }

      hts.playerRecord = playerRecord;
      function playerRecord(player, matches) {
         matches = matches ? matches : hts.matches;
         var opponents = [];
         var games = { won: 0, lost: 0 };
         var upsets = { won: 0, lost: 0 };
         var wins   = matches.filter(function(f) { 
            return f.winner.player.toLowerCase().indexOf(player.toLowerCase()) == 0; 
         });
         var losses = matches.filter(function(f) { 
            return f.loser.player.toLowerCase().indexOf(player.toLowerCase()) == 0; 
         });
         wins.forEach(function(w) {
            opponents.push(w.loser.player);
            if (w.upset) upsets.won += 1;
            w.score.split(',').forEach(function(s) {
               if (s.indexOf('-') > 0) {
                  var g = s.split('-');
                  if (!isNaN(g[0])) games.won += +g[0];
                  if (!isNaN(g[1])) games.lost += +g[1];
               }
            });
         });
         losses.forEach(function(l) {
            opponents.push(l.winner.player);
            if (l.upset) upsets.lost += 1;
            l.score.split(',').forEach(function(s) {
               if (s.indexOf('-') > 0) {
                  var g = s.split('-');
                  if (!isNaN(g[0])) games.lost += +g[0];
                  if (!isNaN(g[1])) games.won += +g[1];
               }
            });
         });
         opponents = opponents.filter(function(item, i, self) { return self.lastIndexOf(item) == i; });
         return { wins: wins, losses: losses, games: games, opponents: opponents, upsets: upsets }
      }

      function hideCharts() {
         hts.contexts.forEach(function(c) { 
            if (c.chart) { c.chart.hidden(true); }
         });
      }

      function highlightPlayer(player) {
         hts.contexts.forEach(function(c) { 
            if (hts.players.a.length && hts.players.a.indexOf(player) >= 0) {
               var highlighted = c.chart.highlightPlayer(player); 
               c.chart.hidden(highlighted.length ? false : true);
            } else {
               c.chart.highlightPlayer(); 
               c.chart.hidden(false);
            }
         });
      }

      function parseHTSDate(date_string) {
         if (date_string.indexOf(')') > 0) {
            date_string = date_string.split(')')[1];
         }
         date_string = date_string.replace(/-/g, '.-')
         date_string = date_string.replace(/[^\d.-]/g, '')
         var components = date_string.split('.').filter(function(f) { return f.length; });
         var day = components[0];
         var year = components[components.length - 1];
         var dash = components.map(function(f, i) { return f.indexOf('-') >= 0 ? i : 0; }).reduce(function(a, b) { return a + b; });
         var month = components[dash == 2 ? 1 : dash + 1];
         return [year, month, day].join('-');
      }

      function rankValue(rank) {
         var rank_value = d3.scale.linear().range([0, 2000]).domain([10, 1]);
         if (!rank) rank = 9; // Qualification Round ?
         return rank_value(rank);
      }

      function defineContexts(results) {
         var draws = results.draws;
         hts.contexts = [];
         hts.matches = [];
         hts.players = { a: [], m: [], f: [] };

         draws.forEach(function(r, i) {
            var title = results.titles[i];
            var date = results.details[i].start_date;
            var details = {
               date: date,
               city: results.details[i].city,
               lat: results.details[i].lat,
               long: results.details[i].long,
               org:  results.details[i].club,
               gender:  results.details[i].gender,
               category:  results.details[i].category,
               t_id:    results.details[i].id,
               surface: results.details[i].surface,
               rank: rankValue(results.details[i].rank)
            };
            hts.contexts.push({ 
               id:         i,
               draw:       {}, 
               title:      title, 
               countries:  findCountries(draws[i]),
               clubs:      findClubs(draws[i]),
               details:    details
            });
            var c = hts.contexts.length - 1;
            hts.contexts[c].draw.rounds = draws[i];
            hts.contexts[c].draw.primary_key = largestNodeKey(draws[i]);
            hts.contexts[c].draw.first_round = draws[i][hts.contexts[c].draw.primary_key];
            var seeds = hts.contexts[c].draw.first_round.filter(function(f) { return f.seed; });
            hts.contexts[c].seeds = seeds;

            // var nested = createNest(hts.contexts[c].draw.first_round);
            var nested = createNest(flipHalf(hts.contexts[c].draw.first_round));
            if (nested.length) { hts.contexts[c].draw.nest = nested[0]; }
         });
         var players = findPlayers();
         hts.players.m = players.m;
         hts.players.f = players.f;
         hts.players.a = players.a;
         hts.matches = findMatches();
      }

      hts.tournamentHover = tournamentHover;
      function tournamentHover(d) {
         var shapeColor = playerSeason.exports().shapeColor;
         mc.exports().displayClubs(d.clubs);
         mc.exports().displayLinks(d, shapeColor);

         d3.selectAll('.itemDate')
            .style({
               'fill': shapeColor,
               'opacity': .7
            });
         d3.select("[id='itemDate" + d.context + "']")
            .style({
               'fill': 'yellow',
               'opacity': .7
            });

         hideCharts();
         createBurst(d.context);
         hts.contexts[d.context].chart.highlightPlayer(d.name); 
         hts.contexts[d.context].chart.hidden(false); 
         if (aip) aip.sendReport('HTS: ' + d.name + '-' + hts.contexts[d.context].title);
      }

      function createBurst(context_id) {
         var c = hts.contexts[context_id];
         if (c.chart) return;
         c.chart = burstChart();

         c.chart.width(350).height(350);
         c.chart.options({
            display: {
               title: c.title +  " " + c.details.date,
               flags: c.countries
            }
         });

         if (c.seeds.length) c.chart.options({display: { seeds: true }});

         if (c.draw.nest) {
            d3.select('#draws').call(c.chart);
            c.chart.data(c.draw.nest);
            c.chart.update();
            addRounds(c.draw);
            c.chart.data(c.draw.nest).update();
         }
      }

      function flipHalf(round) {
         top_half = round.slice(0, round.length/2);
         bottom_half = round.slice(round.length/2);
         return top_half.concat(bottom_half.reverse());
      }

      function findClubs(rounds) {
         var clubs = [];
         Object.keys(rounds).forEach(function(k) {
            rounds[k].forEach(function(e) {
               if (e.club && clubs.indexOf(e.club) < 0) { clubs.push(e.club); }
               if (e.players) e.players.forEach(function(p) { 
                  if (p.club && clubs.indexOf(p.club) < 0) clubs.push(p.club); 
               });
            });
         });
         clubs = clubs.filter(function(f) { return club_codes[f]; }).map(function(m) { return club_codes[m] });
         return clubs;
      }

      function findCountries(rounds) {
         var countries = [];
         Object.keys(rounds).forEach(function(k) {
            rounds[k].forEach(function(e) {
               if (e.country && countries.indexOf(e.country) < 0) { countries.push(e.country); }
               if (e.players) e.players.forEach(function(p) { 
                  if (p.country && countries.indexOf(p.country) < 0) countries.push(p.country); 
               });
            });
         });
         return countries;
      }

      function addRounds(draw) {
         Object.keys(draw.rounds).forEach(function(k) {
            if (draw.rounds[k].length < draw.first_round.length) {
               addRound(draw, k);
            }
         });
      }

      function addRound(draw, round_key) {
         var rounds = draw.rounds[round_key];
         var num_matches = rounds.length;
         var walk_depth = Math.log(rounds.length) / Math.log(2);
         for (var p=0; p < num_matches; p++) {
            var result = rounds[p];
            var winner = rounds[p].player ? rounds[p].player : rounds[p].players ? rounds[p].players : undefined;
            if (!winner) continue;
            var player_data = findPlayerData(draw.first_round, winner);
            var draw_tree = drawWalk(draw.first_round, draw.nest, winner);
            if (draw_tree) addOutcome(draw.nest, draw_tree.slice(0, walk_depth), player_data, result);
         }
      }

      function addOutcome(draw_nest, draw_walk, player_data, result) {
         var target = draw_nest;
         while (draw_walk.length) {
            var child = draw_walk.shift();
            if (target) target = target.children[child];
         }
         if (target) target.Draw = player_data.draw_position;
         Object.keys(result).forEach(function(e) { if (target) target[e] = result[e]; });
      }

      function findPlayerData(first_round, player) {
         var result = first_round.filter(function(m) { 
            if (m.player == player) return true;
            if (m.players && m.players.length && m.players[0].player == player[0].player)  {
               return true;
            }
            return false;
         });
         if (result.length) {
            var data = { draw_position: result[0].Draw };
            if (result[0].seed) data.seed = result[0].seed;
            if (result[0].entry) data.entry = result[0].entry;
            return data;
         }
         return false;
      }

      function drawWalk(draw, draw_nest, player) {
         var player_data = findPlayerData(draw, player);
         if (!player_data) return false;
         var draw_position = player_data.draw_position;
         var tree = [];
         var round = draw_nest.value;
         while (round > 1) {
            tree.push(drawSide(round, draw_position));
            round = round / 2;
         }
         return tree;
      }

      function drawSide(round, draw_position) {
         draw_position = draw_position - 1;
         if (draw_position > round) draw_position = draw_position - (Math.floor(draw_position/round) * round);
         return Math.floor((draw_position) / (round / 2)) % 2;
      }

      function createNest(draw) {
         nestedNode = d3.nest();
         var num_keys = Math.log(draw.length) / Math.log(2);

         for (var v=0; v < draw.length; v++) { draw[v]['Draw'] = v + 1; }
         for (var k=0; k < num_keys; k++) {
            for (var v=0; v < draw.length; v++) { draw[v]['D' + k] = Math.ceil((v+1) / Math.pow(2, k + 1)) }
         }
         if (num_keys > 6) nestedNode = nestedNode.key(function(f) { return f['D6']; })
         if (num_keys > 5) nestedNode = nestedNode.key(function(f) { return f['D5']; })
         if (num_keys > 4) nestedNode = nestedNode.key(function(f) { return f['D4']; })
         if (num_keys > 3) nestedNode = nestedNode.key(function(f) { return f['D3']; })
         if (num_keys > 2) nestedNode = nestedNode.key(function(f) { return f['D2']; })
         if (num_keys > 1) nestedNode = nestedNode.key(function(f) { return f['D1']; })
         if (num_keys > 0) nestedNode = nestedNode.key(function(f) { return f['D0']; })

         nestedNode = nestedNode
            .entries(draw)
         return nestedNode;
      }

      function largestNodeKey(nodes) {
         var keys = Object.keys(nodes);
         var key;
         for (var k=0; k < keys.length; k++) {
            if (!key || nodes[keys[k]].length > nodes[key].length) key = keys[k];
         }
         return key;
      }

      hts.generateSeasonChart = generateSeasonChart;
      function generateSeasonChart(player, in_context) {
         var parseDate = d3.time.format("%Y-%m-%d").parse;
         var season = [];
         var cities = [];
         in_context.forEach(function(context) {
            var pr = playerResults(hts.contexts[context.id]);
            var result = {
               name:    player,
               context: context.id,
               ranking: +context.ranking,
               round:   pr[player].result,
               rung:    result_columns.indexOf(pr[player].result),
               category:hts.contexts[context.id].details.category,
               draw:    hts.contexts[context.id].draw.first_round.length,
               rank:    hts.contexts[context.id].details.rank,
               lat:     hts.contexts[context.id].details.lat,
               long:    hts.contexts[context.id].details.long,
               date:    parseDate(hts.contexts[context.id].details.date),
               yr:      +hts.contexts[context.id].details.date.split('-')[0],
               tourn:   hts.contexts[context.id].title,
               clubs:   hts.contexts[context.id].clubs,
               surface: hts.contexts[context.id].details.surface
            }
            var lat  = hts.contexts[context.id].details.lat;
            var long = hts.contexts[context.id].details.long;
            if (lat && long) cities.push([long, lat]);
            season.push(result);
         });
         season.sort(function(a, b) { return b.date - a.date; });
         var szn = d3.nest()
             .key(function(d,i) { return (d.name + " " + d.yr); })
             // .key(function(d,i) { return d.name; })
             .entries(season)
         szn[0].yr = szn[0].key.replace(/[^0-9]/g,"");

         // playerSeason.options({ plot: { title: { text: player }}});
         playerSeason.data(szn[0]).update();

         mc.exports().displayCities(season);
      }

      hts.addMatches = addMatches;
      function addMatches(gender, matches, players) {
         var match_matrix = [];
         matches = matches ? matches : hts.matches;
         players = players ? players : hts.players;
         gender = gender ? gender.toUpperCase() : 'M';
         gender = ['M', 'F'].indexOf(gender) >= 0 ? gender : 'M';
         var g_players = players[gender.toLowerCase()];
         var g_matches = matches.filter(function(m) { return m.gender == gender});
         g_matches.forEach(function(m) { addMatch(m, g_players) });

         function addMatch(match, player_list) {
            var win_idx = player_list.indexOf(match.winner.player);
            var los_idx = player_list.indexOf(match.loser.player);
            if (!match_matrix[win_idx] || match_matrix[win_idx].length == 0) match_matrix[win_idx] = new Array(player_list.length).fill(0);
            match_matrix[win_idx][los_idx] += 1;
         }

         return match_matrix;
      }

      hts.sharedOpponents = sharedOpponents;
      function sharedOpponents(player1, player2) {
         var rec1 = playerRecord(player1);
         var rec2 = playerRecord(player2);
         var shared = rec1.opponents.filter(function(f) { return rec2.opponents.indexOf(f) >= 0; });
         return shared;
      }


      // PRESTIGE RANK
      hts.createMatrix = createMatrix;
      function createMatrix(arrarr) {
         // zero pad each row
         for (var i=0; i < arrarr.length; i++) {
            if (!arrarr[i]) arrarr[i] = new Array(arrarr.length).fill(0) 
         }
         return $M(arrarr);
      }

      hts.prestigeRank = prestigeRank;
      function prestigeRank(matrix, q) {
         q = q ? q : .15;
         var nodes = matrix.cols();
         var offset = q / nodes;
         var compute_vector = $V(new Array(nodes).fill(offset));

         var column_sums = [];
         for (var c=1; c <= nodes; c++) {
            column_sums.push(matrix.col(c).elements.reduce(function(a, b) { return a + b; }));
         }

         var compute_matrix = matrix.map(function(f, i, j) {
            if (i == j) { 
               return 1; 
            } else if (column_sums[i - 1] == 0) {
               return -1 * (1 - q) / nodes; 
            } else { 
               return -1 * (1 - q) * f / column_sums[i - 1]; 
            } 
         });

         var mult_matrix = compute_matrix.inverse();
         var prestige_rank = mult_matrix.multiply(compute_vector);
         return prestige_rank;
      }

      hts.rankCategory = rankCategory;
      function rankCategory(category) {
         var players = findPlayers(category);
         var matches = findMatches(category);
         var match_matrix = addMatches('m', matches, players);
         var matrix = createMatrix(match_matrix);
         return prestigeRank(matrix);
      }

      hts.rankPool = rankPool;
      function rankPool(player_pool) {
         var matches = poolMatches(player_pool.m);
         var match_matrix = addMatches('m', matches, player_pool);
         var matrix = createMatrix(match_matrix);
         return prestigeRank(matrix);
      }
      // END PRESTIGE RANK

      hts.init = init;
      function init() {
         country_codes = [];
         d3.json('./country_codes.json', function(err, data) { country_codes = data; });

         club_codes = [];
         d3.json('./hts_klubs.json', function(err, data) { 
               club_codes = data; 
               Object.keys(club_codes).forEach(function(f) { club_codes[f].abbr = f });
               });

         var te_dropDown = d3.select("#ddlb_te").append("select")
                 .attr("name", "tournamentList")
                 .attr("id", "te_tournamentList")
                 .attr("class", "dropdown")

         d3.json('./hts.json', function(err, data) {
            var options = te_dropDown.selectAll("option")
                 .data(data)
               .enter()
                 .append("option")
                 .text(function (d) { return d.name; })
                 .attr("value", function (d) { return d.value; });

            if (data[0] && data[0].value) hts.loadDataset(data[0].value);
            data.forEach(function(e) { hts.preloadDataset(e.value); });

            te_dropDown.on("change", function(d) { 
               var value = d3.event.target.value; 
               if (value) {
                  hts.loadDataset(value);
               } else {
               }
            });
         });

         d3.json("croatiatopo.json", function(error, cro) {
            if (aip) aip.sendReport('CROATIA MAP');
            if (error) return console.error(error);
            mc = croatiaMap();
            mc.data(cro);
            d3.select('#croatia').call(mc);
            mc.update();
         });

         window.addEventListener( 'resize', onWindowResize, false );

         function onWindowResize() {
            if (typeof playerSeason.update === 'function' && d3.select('#seasonchart').style('display') != 'none') {
               playerSeason.update({ sizeToFit: true });
            }
            if (typeof mc.update === 'function' && d3.select('#croatiamap').style('display') != 'none') {
               mc.update({ sizeToFit: true });
            }
            hts.contexts.forEach(function(c) { 
               if (c.chart && typeof c.chart.update == 'function' && !c.chart.hidden()) { 
                  c.chart.update({ sizeToFit: true }); 
               }
            });
         }
      }

   if (typeof define === "function" && define.amd) define(hts); else if (typeof module === "object" && module.exports) module.exports = hts;
   this.hts = hts;
 
}();
