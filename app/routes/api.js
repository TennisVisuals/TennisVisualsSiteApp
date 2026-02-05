module.exports = function (models) {
  var express = require("express");
  var cors = require("cors");
  var api_router = express.Router();
  var http = require("http");

  var fs = require("fs-extra");
  var dns = require("dns");
  var util = require("util");

  var request = require("request");
  XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var StringDecoder = require("string_decoder").StringDecoder;

  var Match = models.TMatch;
  var Player = models.TPlayer;
  var Trny = models.TTourney;

  // return list of all player names
  api_router.route("/tournaments/").get(cors(), function (req, res) {
    Trny.find(
      {
        sources: { $in: ["itf", "atp", "ist", "mcp", "pbp", "tam"] },
      },
      {
        names: 1,
        _id: 0,
      },
      function (err, array) {
        if (err) return res.json({ error: err });
        if (array == null) {
          return res.json({ error: "no tournaments found" });
        } else {
          var names = [];
          for (var n = 0; n < array.length; n++) {
            array[n].names.forEach(function (n) {
              if (names.indexOf(n) < 0) names.push(n);
            });
          }
          return res.json(names);
        }
      },
    );
  });

  // return list of all player names
  api_router.route("/players/").get(cors(), function (req, res) {
    Player.find(
      {
        sources: { $in: ["itf", "atp", "ist", "mcp", "pbp", "tam"] },
      },
      {
        name: 1,
        _id: 0,
      },
      function (err, array) {
        if (err) return res.json({ error: err });
        if (array == null) {
          return res.json({ error: "no players found" });
        } else {
          var names = array.map((n) => n.name);
          return res.json(names);
        }
      },
    );
  });

  api_router.route("/pldb/").get(cors(), function (req, res) {
    var dir = "./cache/db/";
    fs.readFile(dir + "playerdb.json", "utf8", function (err, data) {
      if (!err) {
        return res.send(data);
      } else {
        return res.json({ err: err });
      }
    });
  });

  api_router.route("/player/bio/:player").get(cors(), function (req, res) {
    Player.find(
      {
        name: req.params.player,
      },
      {
        _id: 0,
      },
      function (err, players) {
        if (err) return res.json({ error: err });
        if (players == null) {
          return res.json({ error: "no players found" });
        } else {
          return res.json(players);
        }
      },
    );
  });

  api_router.route("/codes/:tuid/:puid/:year").get(cors(), function (req, res) {
    Match.find(
      {
        $and: [
          { "metadata.players.puid": req.params.puid },
          { "metadata.tournament.tuid": req.params.tuid },
          { "metadata.match.year": req.params.year },
        ],
      },
      {
        _id: 0,
        muid: 1,
        codes: 1,
        opts: 1,
        metadata: 1,
      },
      function (err, array) {
        if (err) return res.send(err);
        if (array == null) {
          return res.json({ error: "player not found" });
        } else {
          // possibly reverse match based on search player
          return res.json(array);
        }
      },
    );
  });

  api_router
    .route("/matches/stats/puid/:puid")
    .get(cors(), function (req, res) {
      Match.find(
        {
          "metadata.players": { $elemMatch: { puid: req.params.puid } },
        },
        {
          // _id: 0, muid: 1, "tournament": 1, "score": 1, "codes": 1, "opts": 1, "metadata": 1
          _id: 0,
          muid: 1,
          stats: 1,
          "metadata.players.name": 1,
        },
        function (err, array) {
          if (err) return res.send(err);
          if (array == null) {
            return res.json({ error: "player not found" });
          } else {
            var result = array.filter(function (f) {
              return f.stats.length;
            });
            return res.json(result);
          }
        },
      );
    });

  api_router
    .route("/matches/stats/player/:player")
    .get(cors(), function (req, res) {
      Match.find(
        {
          "metadata.players": { $elemMatch: { name: req.params.player } },
        },
        {
          // _id: 0, muid: 1, "tournament": 1, "score": 1, "codes": 1, "opts": 1, "metadata": 1
          _id: 0,
          muid: 1,
          stats: 1,
          "metadata.players.name": 1,
        },
        function (err, array) {
          if (err) return res.send(err);
          if (array == null) {
            return res.json({ error: "player not found" });
          } else {
            var result = array.filter(function (f) {
              return f.stats.length;
            });
            return res.json(result);
          }
        },
      );
    });

  api_router.route("/matches/:player").get(cors(), function (req, res) {
    Match.find(
      {
        "metadata.players": { $elemMatch: { name: req.params.player } },
      },
      {
        _id: 0,
        muid: 1,
        score: 1,
        opts: 1,
        metadata: 1,
        sources: 1,
      },
      function (err, array) {
        if (err) return res.send(err);
        if (array == null) {
          return res.json({ error: "player not found" });
        } else {
          return res.json(array);
        }
      },
    );
  });

  api_router.route("/matches/codes/:player").get(cors(), function (req, res) {
    Match.find(
      {
        "metadata.players": { $elemMatch: { name: req.params.player } },
      },
      {
        _id: 0,
        muid: 1,
        score: 1,
        codes: 1,
        opts: 1,
        metadata: 1,
        sources: 1,
      },
      function (err, array) {
        if (err) return res.send(err);
        if (array == null) {
          return res.json({ error: "player not found" });
        } else {
          return res.json(array);
        }
      },
    );
  });

  api_router
    .route("/matches/codes/limit/:player/:limit")
    .get(cors(), function (req, res) {
      Match.find(
        {
          "metadata.players": { $elemMatch: { name: req.params.player } },
        },
        {
          _id: 0,
          muid: 1,
          score: 1,
          codes: 1,
          opts: 1,
          metadata: 1,
          sources: 1,
        },
        function (err, array) {
          console.log("player", req.params.player);
          if (err) return res.send(err);
          if (array == null) {
            return res.json({ error: "player not found" });
          } else {
            return res.json(array);
          }
        },
      )
        .limit(parseInt(req.params.limit))
        .sort({ "metadata.match.date": -1 });
    });

  api_router
    .route("/matches/codes/:player/:year")
    .get(cors(), function (req, res) {
      Match.find(
        {
          players: { $elemMatch: { name: req.params.player } },
          date: {
            $gte: new Date(req.params.year, 0, 0),
            $lte: new Date(req.params.year, 11, 30),
          },
        },
        {
          // _id: 0, muid: 1, "tournament": 1, "score": 1, "codes": 1, "opts": 1, "metadata": 1
          _id: 0,
          muid: 1,
          score: 1,
          codes: 1,
          opts: 1,
          metadata: 1,
          sources: 1,
        },
        function (err, array) {
          if (err) return res.send(err);
          if (array == null) {
            return res.json({ error: "player not found" });
          } else {
            return res.json(array);
          }
        },
      );
    });

  // -------------##############************* OLD DATABASE ////////////////////

  var OldMatch = models.Match;

  // return array of match muids, players, stats and dates based on org
  api_router
    .route("/matches/stats/org/:org")

    .get(cors(), function (req, res) {
      OldMatch.find(
        {
          "players.identifiers": { $elemMatch: { org: req.params.org } },
        },
        {
          _id: 0,
          date: 1,
          players: 1,
          stats: 1,
        },
        function (err, array) {
          if (err) return res.send(err);
          if (array == null) {
            return res.json({ error: "org not found" });
          } else {
            return res.json(array);
          }
        },
      );
    });

  // return array of match muids, players, stats and dates based on org and year
  api_router
    .route("/matches/stats/org/:org/:year")

    .get(cors(), function (req, res) {
      OldMatch.find(
        {
          "players.identifiers": { $elemMatch: { org: req.params.org } },
          date: {
            $gte: new Date(req.params.year, 0, 0),
            $lte: new Date(req.params.year, 11, 30),
          },
        },
        {
          _id: 0,
          date: 1,
          players: 1,
          stats: 1,
        },
        function (err, array) {
          if (err) return res.send(err);
          if (array == null) {
            return res.json({ error: "org not found" });
          } else {
            return res.json(array);
          }
        },
      );
    });

  // return entire match record
  api_router
    .route("/match/muid/:muid")

    .get(cors(), function (req, res) {
      Match.findOne(
        {
          muid: req.params.muid,
        },
        {
          _id: 0,
        },
        function (err, match) {
          if (err) return res.json({ error: err });
          if (match == null) {
            return res.json({ error: "no match found" });
          } else {
            return res.json(match);
          }
        },
      );
    });

  /*
   api_router.route('/match/url/:url')

       .get(cors(), function(req, res) {
           Match.findOne(
              {
                 urls: req.params.url
              }, 
              {
                 _id: 0
              }, 
              function(err, match) {
                 if (err)
                    return res.json({'error':err});
                 if (match == null) {
                    return res.json({'error':'no match found'});
                 } else {
                    return res.json(match);
                 }
           });
       });

   // return only stats object for a given muid
   api_router.route('/match/stats/:muid')

       .get(cors(), function(req, res) {
           Match.findOne(
              {
                 muid: req.params.muid
              }, 
              {
                 stats: 1, _id: 0
              }, 
              function(err, match) {
                 if (err)
                     return res.send(err);
                 if (match == null) {
                    return res.json({'error':'match not found'});
                 } else {
                    // call stats object to generate stats, return stats
                    var stats = ase.calc_stats(match.data);
                 return res.json(stats);
              }
           });
       });

   // return array of match muids, players and dates based on player name
   api_router.route('/matches/player/:player')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 players: { $elemMatch: { "name": req.params.player } } 
              }, 
              {
                 _id: 0, players: 1, muid: 1, date: 1
              }, 
              function(err, array) {
                 if (err)
                     return res.send(err);
                 if (array == null) {
                    return res.json({'error':'player not found'});
                 } else {
                    return res.json(array);
                 }
           });
       });

   // return array of match muids, players and dates based on player name and year
   api_router.route('/matches/player/:player/:year')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 players: { $elemMatch: { "name": req.params.player } },
                 date: {$gte: new Date(req.params.year, 0, 0), $lte: new Date(req.params.year, 11, 30)}, 
              }, 
              {
                 _id: 0, players: 1, muid: 1, date: 1
              }, 
              function(err, array) {
                 if (err)
                     return res.send(err);
                 if (array == null) {
                    return res.json({'error':'player not found'});
                 } else {
                    return res.json(array);
                 }
           });
       });

   // return fingerprints, scores, tournament, players and dates based on match muid
   api_router.route('/matches/fingerprints/muid/:muid')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 muid: req.params.muid
              }, 
              {
                 _id:0,  "players.name": 1, date: 1, "tournament": 1, "score": 1, "fingerprints": 1, "data.flag": 1 
           },
           function(err, array) {
              if (err)
                  return res.send(err);
              if (array == null) {
                 return res.json({'error':'no match found'});
              } else {
                 return res.json(array);
              }
        });
    });

   // return array of match muids, fingerprints, scores, tournament, players and dates based on player name
   api_router.route('/matches/fingerprints/player/:player')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 players: { $elemMatch: { "name": req.params.player } } 
              }, 
              {
                 _id:0,  "players.name": 1, muid: 1, date: 1, "tournament": 1, "score": 1, "fingerprints": 1, "data.flag": 1 
              },
              function(err, array) {
                 if (err)
                     return res.send(err);
                 if (array == null) {
                    return res.json({'error':'no player found'});
                 } else {
                    return res.json(array);
                 }
           });
       });

   // return array of match muids, fingerprints, scores, tournament, players and dates based on player name and year
   api_router.route('/matches/fingerprints/player/:player/:year')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 players: { $elemMatch: { "name": req.params.player } },
                 date: {$gte: new Date(req.params.year, 0, 0), $lte: new Date(req.params.year, 11, 30)}, 
              }, 
              {
                 _id:0,  "players.name": 1, muid: 1, date: 1, "tournament": 1, "score": 1, "fingerprints": 1, "data.flag": 1 
              },
              function(err, array) {
                 if (err)
                     return res.send(err);
                 if (array == null) {
                    return res.json({'error':'no player found'});
                 } else {
                    return res.json(array);
                 }
           });
       });

   // return array of match muids, players and points_to_set and dates based on player name
   api_router.route('/player/stats/points_to_set/:player')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 players: { $elemMatch: { "name": req.params.player } } 
              }, 
              {
                 _id: 0, players: 1, score: 1, "stats.overview.players.points_to_set": 1, muid: 1, date: 1
              }, 
              function(err, array) {
                 if (err)
                     return res.send(err);
                 if (array == null) {
                    return res.json({'error':'no player found'});
                 } else {
                    return res.json(array);
                 }
           });
       });

   // return array of match muids, players and points_to_set and dates based on player name and year
   api_router.route('/player/stats/points_to_set/:player/:year')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 players: { $elemMatch: { "name": req.params.player } },
                 date: {$gte: new Date(req.params.year, 0, 0), $lte: new Date(req.params.year, 11, 30)}, 
              }, 
              {
                 _id: 0, players: 1, score: 1, "stats.overview.players.points_to_set": 1, muid: 1, date: 1
              }, 
              function(err, array) {
                 if (err)
                     return res.send(err);
                 if (array == null) {
                    return res.json({'error':'no player found'});
                 } else {
                    return res.json(array);
                 }
           });
       });
   */

  // return array of match muids, players, stats and dates based on player name
  api_router
    .route("/player/stats/overview/:player")

    .get(cors(), function (req, res) {
      Match.find(
        {
          players: { $elemMatch: { name: req.params.player } },
        },
        {
          _id: 0,
          players: 1,
          "stats.overview": 1,
          muid: 1,
          date: 1,
        },
        function (err, array) {
          if (err) return res.send(err);
          if (array == null) {
            return res.json({ error: "no player found" });
          } else {
            return res.json(array);
          }
        },
      );
    });

  // return array of match muids, players, stats and dates based on player name and year
  api_router
    .route("/player/stats/overview/:player/:year")

    .get(cors(), function (req, res) {
      Match.find(
        {
          players: { $elemMatch: { name: req.params.player } },
          date: {
            $gte: new Date(req.params.year, 0, 0),
            $lte: new Date(req.params.year, 11, 30),
          },
        },
        {
          _id: 0,
          players: 1,
          "stats.overview": 1,
          muid: 1,
          date: 1,
        },
        function (err, array) {
          if (err) return res.send(err);
          if (array == null) {
            return res.json({ error: "no player found" });
          } else {
            return res.json(array);
          }
        },
      );
    });

  /*
   api_router.route('/player/stats/shots/:player')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 players: { $elemMatch: { "name": req.params.player } } 
              }, 
              {
                 _id: 0, "players.name": 1, score: 1, "stats.shots": 1, muid: 1, date: 1
              }, 
              function(err, array) {
                 if (err)
                     return res.send(err);
                 if (array == null) {
                    return res.json({'error':'no player found'});
                 } else {
                    return res.json(array);
                 }
           });
       });

   // return array of match muids, players and shots and dates based on player name and year
   api_router.route('/player/stats/shots/:player/:year')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 players: { $elemMatch: { "name": req.params.player } },
                 date: {$gte: new Date(req.params.year, 0, 0), $lte: new Date(req.params.year, 11, 30)}, 
              }, 
              {
                 _id: 0, "players.name": 1, score: 1, "stats.shots": 1, muid: 1, date: 1
              }, 
              function(err, array) {
                 if (err)
                     return res.send(err);
                 if (array == null) {
                    return res.json({'error':'no player found'});
                 } else {
                    return res.json(array);
                 }
           });
       });

   // return array of match muids, players, stats and dates based on player name
   api_router.route('/player/stats/:player')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 players: { $elemMatch: { "name": req.params.player } } 
              }, 
              {
                 _id: 0, players: 1, stats: 1, muid: 1, date: 1
              }, 
              function(err, array) {
                 if (err)
                     return res.send(err);
                 if (array == null) {
                    return res.json({'error':'no player found'});
                 } else {
                    return res.json(array);
                 }
           });
       });

   // return array of match muids, players, stats and dates based on player name and year
   api_router.route('/player/stats/:player/:year')

       .get(cors(), function(req, res) {
           Match.find(
              {
                 players: { $elemMatch: { "name": req.params.player } },
                 date: {$gte: new Date(req.params.year, 0, 0), $lte: new Date(req.params.year, 11, 30)}, 
              }, 
              {
                 _id: 0, players: 1, stats: 1, muid: 1, date: 1
              }, 
              function(err, array) {
                 if (err)
                     return res.send(err);
                 if (array == null) {
                    return res.json({'error':'no player found'});
                 } else {
                    return res.json(array);
                 }
           });
       });
   */

  var cache = "./cache/";

  api_router.route("/match/share").post(function (req, res) {
    if (req.body.action) {
      switch (req.body.action) {
        case "save":
          let save = true;
          if (!req.body.destination || typeof req.body.destination != "string")
            save = false;
          if (!req.body.filename || typeof req.body.filename != "string")
            save = false;
          if (!req.body.filetype || typeof req.body.filetype != "string")
            save = false;

          if (save) {
            var destination = req.body.destination;
            fs.ensureDirSync(cache + destination);

            var filename = req.body.filename;
            var filetype = req.body.filetype || "json";
            var file_to_write = `${cache}${destination}/${filename}.${filetype}`;
            fs.writeFile(
              file_to_write,
              JSON.stringify(req.body.data),
              "utf8",
              function (err) {
                if (!err) {
                  return res.json({ result: "Saved" });
                } else {
                  return res.json({ error: err });
                }
              },
            );
          } else {
            return res.json({ message: "Incomplete Destination" });
          }

          break;
        default:
          console.log("Push Action Not Supported: ", req.body.action);
          return res.json({ message: "Unknown Action" });
      }
    } else {
      console.log(req.body.action);
      return res.json({ message: "received" });
    }
  });

  api_router.route("/match/push").post(function (req, res) {
    if (req.body.action) {
      switch (req.body.action) {
        case "save":
          var destinations = ["timeline/Matches", "tennismath", "tsb"];
          if (req.body.destination) {
            var destination = req.body.destination;
            var filename = req.body.filename;
            if (destinations.indexOf(destination) >= 0) {
              fs.writeFile(
                "./cache/_" + destination + "/" + filename + ".json",
                JSON.stringify(req.body.data),
                "utf8",
                function (err) {
                  if (!err) {
                    return res.json({ message: "Saved" });
                  } else {
                    return res.json({ error: err });
                  }
                },
              );
            } else {
              return res.json({ message: "Failed to save: " + filename });
            }
          } else {
            return res.json({ message: "No destination" });
          }
          break;
        default:
          console.log("Push Action Not Supported: ", req.body.action);
          return res.json({ message: "Unknown Action" });
      }
    } else {
      console.log(req.body.action);
      return res.json({ message: "received" });
    }
  });

  api_router.route("/match/request").post(function (req, res) {
    if (req.body.tournament) {
      var tour = req.body.tournament.split("-")[0];
      if (["hts", "te", "atp"].indexOf(tour >= 0)) {
        var ip =
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;
        var message = util.format(ip) + " Tournament " + req.body.tournament;
        console.log("api:", message);

        switch (tour) {
          case "te":
            var dir = "./cache/_tenniseurope/juniors/";
            break;
          default:
            var dir = "./cache/" + tour + "/draws/";
            break;
        }
        fs.readFile(
          dir + req.body.tournament + ".json",
          "utf8",
          function (err, data) {
            if (!err) {
              return res.json({ data: data });
            } else {
              return res.json({ err: err });
            }
          },
        );
      }
    } else if (req.body.atp) {
      fs.readFile(
        "./cache/atp/draws/atp-" + req.body.atp + ".json",
        "utf8",
        function (err, data) {
          if (!err) {
            return res.json({ data: data });
          } else {
            return res.json({ err: err });
          }
        },
      );
    } else if (req.body.te) {
      fs.readFile(
        "./cache/_tenniseurope/juniors/te-" + req.body.te + ".json",
        "utf8",
        function (err, data) {
          if (!err) {
            return res.json({ data: data });
          } else {
            return res.json({ err: err });
          }
        },
      );
    } else if (req.body.matchURL && req.body.type && req.body.type == "local") {
      fs.readFile(
        "./app/static" + req.body.matchURL,
        "utf8",
        function (err, data) {
          if (!err) {
            return res.json({ data: data });
          } else {
            return res.json({ err: err });
          }
        },
      );
    } else if (req.body.cacheURL && req.body.type && req.body.type == "cache") {
      fs.readFile("./cache/" + req.body.cacheURL, "utf8", function (err, data) {
        if (!err) {
          return res.json({ data: data });
        } else {
          return res.json({ err: err });
        }
      });
    } else if (req.body.matchURL) {
      var options = { uri: req.body.matchURL, encoding: "utf8" };
      // http://samwize.com/2013/08/31/simple-http-get-slash-post-request-in-node-dot-js/
      // https://github.com/request/request
      request(options, function (err, response, data) {
        if (!err) {
          try {
            return res.json({ data: data });
          } catch (err) {
            return res.json({ data: data });
          }
        } else {
          return res.json({ err: err });
        }
      });
    }
  });

  return api_router;
};
