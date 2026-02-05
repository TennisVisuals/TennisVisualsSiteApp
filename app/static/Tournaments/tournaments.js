!(function () {
  var te = {};

  var contexts = [];

  var okeys = Object.keys(aip.QueryString);
  var highlight_player =
    okeys && okeys.indexOf("player") >= 0
      ? decodeURIComponent(aip.QueryString["player"])
      : undefined;

  selected_player.addEventListener("keyup", function (event) {
    if (event.keyCode == 13) {
      go();
    }
  });

  te.bh = bh;
  function bh() {
    var player_db = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: players(),
    });
    $("#bloodhound .typeahead").typeahead("destroy");
    $("#bloodhound .typeahead")
      .typeahead(
        {
          hint: true,
          highlight: true,
          minLength: 1,
        },
        {
          name: "players",
          source: player_db,
        },
      )
      .keypress(function (event) {
        var that = this;
        var e = jQuery.Event("keydown");
        e.keyCode = e.which = 9; // 9 == tab
        if (event.which == 13) {
          $("#bloodhound .typeahead").trigger(e);
          return true;
        }
      })
      .on("typeahead:selected", function (event) {
        go();
      });
  }

  function go() {
    $("#bloodhound .typeahead").typeahead("close");
    highlightPlayer(selected_player.value);
  }

  te.loadTournament = loadTournament;
  function loadTournament(id) {
    contexts = [];
    d3.selectAll(".tournamentBurst").remove();
    $.ajax({
      url: "/api/match/request",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ te: id }),
    }).done(function (result) {
      if (result.err) console.log(result.err);
      if (result.data) {
        data = JSON.parse(result.data);
        data.draws.forEach(function (d) {
          fillDraw(d);
        });
        if (highlight_player) {
          highlightPlayer(highlight_player);
        }
        sendReport("TE: " + id);
      }
      te.bh();
    });
  }

  te.loadATP = loadATP;
  function loadATP(id) {
    contexts = [];
    d3.selectAll(".tournamentBurst").remove();
    $.ajax({
      url: "/api/match/request",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ atp: id }),
    }).done(function (result) {
      if (result.err) console.log(result.err);
      if (result.data) {
        data = JSON.parse(result.data);
        fillDraw(data);
        if (highlight_player) {
          highlightPlayer(highlight_player);
        }
        sendReport("ATP: " + id);
      }
      te.bh();
    });
  }

  te.players = players;
  function players() {
    var players = [];
    contexts.forEach(function (c) {
      c.draw.first_round.forEach(function (e, i) {
        if (e.player) {
          players.push(e.player);
        } else if (e.players) {
          e.players.forEach(function (p) {
            players.push(p.player);
          });
        } else {
          console.log("Missing Player Name at index:", i);
        }
      });
    });
    return players.filter(function (item, i, self) {
      return self.lastIndexOf(item) == i;
    });
  }

  te.highlightPlayer = highlightPlayer;
  function highlightPlayer(player) {
    contexts.forEach(function (c) {
      if (players().indexOf(player) >= 0) {
        var highlighted = c.chart.highlightPlayer(player);
        c.chart.hide(highlighted ? false : true);
      } else {
        c.chart.highlightPlayer();
        c.chart.hide(false);
      }
    });
  }

  function sendReport(what) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", location.origin + "/report/" + what, true);
    xhttp.send();
  }

  function fillDraw(results) {
    var draws = results.draws;

    draws.forEach(function (r, i) {
      var title = results.titles[i];
      contexts.push({
        draw: {},
        title: title,
        countries: findCountries(draws[i]),
        chart: burstChart(),
      });
      var c = contexts.length - 1;

      contexts[c].chart.width(400).height(400);
      contexts[c].chart.options({
        display: {
          title: title,
          flags: contexts[c].countries,
        },
      });
      contexts[c].draw.rounds = draws[i];
      contexts[c].draw.primary_key = largestNodeKey(draws[i]);
      contexts[c].draw.first_round = draws[i][contexts[c].draw.primary_key];

      var seeds = contexts[c].draw.first_round.filter(function (f) {
        return f.seed;
      });
      if (seeds.length) contexts[c].chart.options({ display: { seeds: true } });

      // var nested = createNest(contexts[c].draw.first_round);
      var nested = createNest(flipHalf(contexts[c].draw.first_round));
      console.log({ nested });
      if (nested.length) {
        contexts[c].draw.nest = nested[0];
        d3.select("#draws").call(contexts[c].chart);
        contexts[c].chart.data(contexts[c].draw.nest);
        contexts[c].chart.update();
        addRounds(contexts[c].draw);
        contexts[c].chart.data(contexts[c].draw.nest).update();
      }
    });
  }

  function flipHalf(round) {
    top_half = round.slice(0, round.length / 2);
    bottom_half = round.slice(round.length / 2);
    return top_half.concat(bottom_half.reverse());
  }

  function findCountries(rounds) {
    var countries = [];
    Object.keys(rounds).forEach(function (k) {
      rounds[k].forEach(function (e) {
        if (e.country && countries.indexOf(e.country) < 0) {
          countries.push(e.country);
        }
        if (e.players)
          e.players.forEach(function (p) {
            if (p.country && countries.indexOf(p.country) < 0)
              countries.push(p.country);
          });
      });
    });
    return countries;
  }

  function addRounds(draw) {
    Object.keys(draw.rounds).forEach(function (k) {
      if (draw.rounds[k].length < draw.first_round.length) {
        addRound(draw, k);
      }
    });
  }

  function addRound(draw, round_key) {
    var rounds = draw.rounds[round_key];
    var num_matches = rounds.length;
    var walk_depth = Math.log(rounds.length) / Math.log(2);
    for (var p = 0; p < num_matches; p++) {
      var result = rounds[p];
      var winner = rounds[p].player
        ? rounds[p].player
        : rounds[p].players
          ? rounds[p].players
          : undefined;
      if (!winner) continue;
      var player_data = findPlayerData(draw.first_round, winner);
      var draw_tree = drawWalk(draw.first_round, draw.nest, winner);
      if (draw_tree)
        addOutcome(
          draw.nest,
          draw_tree.slice(0, walk_depth),
          player_data,
          result,
        );
    }
  }

  function addOutcome(draw_nest, draw_walk, player_data, result) {
    var target = draw_nest;
    while (draw_walk.length) {
      var child = draw_walk.shift();
      target = target.children[child];
    }
    target.Draw = player_data.draw_position;
    Object.keys(result).forEach(function (e) {
      target[e] = result[e];
    });
  }

  function findPlayerData(first_round, player) {
    var result = first_round.filter(function (m) {
      if (m.player == player) return true;
      if (
        m.players &&
        m.players.length &&
        m.players[0].player == player[0].player
      ) {
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
    if (draw_position > round)
      draw_position = draw_position - Math.floor(draw_position / round) * round;
    return Math.floor(draw_position / (round / 2)) % 2;
  }

  function createNest(draw) {
    nestedNode = d3.nest();
    var num_keys = Math.log(draw.length) / Math.log(2);

    for (var v = 0; v < draw.length; v++) {
      draw[v]["Draw"] = v + 1;
    }
    for (var k = 0; k < num_keys; k++) {
      for (var v = 0; v < draw.length; v++) {
        draw[v]["D" + k] = Math.ceil((v + 1) / Math.pow(2, k + 1));
      }
    }
    if (num_keys > 6)
      nestedNode = nestedNode.key(function (f) {
        return f["D6"];
      });
    if (num_keys > 5)
      nestedNode = nestedNode.key(function (f) {
        return f["D5"];
      });
    if (num_keys > 4)
      nestedNode = nestedNode.key(function (f) {
        return f["D4"];
      });
    if (num_keys > 3)
      nestedNode = nestedNode.key(function (f) {
        return f["D3"];
      });
    if (num_keys > 2)
      nestedNode = nestedNode.key(function (f) {
        return f["D2"];
      });
    if (num_keys > 1)
      nestedNode = nestedNode.key(function (f) {
        return f["D1"];
      });
    if (num_keys > 0)
      nestedNode = nestedNode.key(function (f) {
        return f["D0"];
      });

    nestedNode = nestedNode.entries(draw);
    return nestedNode;
  }

  function largestNodeKey(nodes) {
    var keys = Object.keys(nodes);
    var key;
    for (var k = 0; k < keys.length; k++) {
      if (!key || nodes[keys[k]].length > nodes[key].length) key = keys[k];
    }
    return key;
  }

  if (typeof define === "function" && define.amd) define(te);
  else if (typeof module === "object" && module.exports) module.exports = te;
  this.te = te;
})();
