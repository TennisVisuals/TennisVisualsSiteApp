// there needs to be some post-processing that goes through and fills in player
// ranking at time of match if it is not present
//
// Match Stats Links need to be added when Tournament Draws are parsed

module.exports = function(mongoose) {

   var MatchSchema = new mongoose.Schema({
      muid: String,
      urls: Array,
      metadata: Object,
      codes: [{
         source: String,
         code: Array
      }],
      date: { date: {type: Date }, year: Number },    // add year so that match date can default to tournament year if no day/month available
      duration: String,
      status: String,      // e.g. retired, walk off W/O
      specifics: {
         surface: String, 
         draw: String, round: String, court: String,
         games_for_set: Number, number_of_sets: Number, advantages: Number, lets: Number, in_out: String,
         set_format: String, final_set_format: String,
         start_time: String, finish_time: String
      },
      contributors: [{ 
         identifiers: {}, 
         grants: { type: String, default: 'public' }
      }],
      tournament: { 
         tuid: String, 
         name: String, 
         short_name: String, 
         sponsor_names: Array
      },
      sources: [{ 
         source: String, 
         data_type: Object, 
         data: Object 
      }],
      points: [{ source: String, points: [] }],
      data: Object,
      players: [{ 
         puid: String,
         name: String, 
         fname: String, 
         first_initial: String,
         lname: String, 
         abbr_name: String,
         nationality: String,
         ranking: String, 
         seed: String,
         draw_position: Number,
         identifiers: {},
         winner: Number
      }],
      score: [{ player0: Number, player1: Number, tiebreak: Number }],
      fingerprints: [{ gp: Array, pp: Array, rp: Array, gp: Array, yp: Array, wp: Array, fs: Number, source: String }],
      stats: [{
         source: String,
         overview: {
            players: [{
               first_serve_in: { count: Number, total: Number, pct: Number }, 
               second_serve_in: { count: Number, total: Number, pct: Number },
               first_serve_speed_avg: Number, // TODO
               second_serve_speed_avg: Number, // TODO
               fastest_serve: Number, // TODO
               aces: { count: Number, pct: Number },
               serve_winners: { count: Number, pct: Number },
               double_faults: { count: Number, pct: Number },

               winners: { count: Number, forcing_errors: Number, forehand: Number, backhand: Number },
               unforced_errors: { count: Number, forehand: Number, backhand: Number, avg_per_game: Number }, 
               forced_errors: { count: Number, forehand: Number, backhand: Number, avg_per_game: Number }, 

               returns_in_play: { count: Number, total: Number, pct: Number },

               total_points_won: { count: Number, pct: Number },
               first_serve_points_won: { count: Number, pct: Number },
               second_serve_points_won: { count: Number, pct: Number },
               return_points_won: { count: Number, total: Number, pct: Number, 
                                    winners: Number, winners_pct: Number,
                                    first_serve: Number, first_serve_pct: Number,
                                    second_serve: Number, second_serve_pct: Number },

               gamepoints: { count: Number, converted: Number, pct: Number },
               breakpoints: { count: Number, converted: Number, pct: Number },
               breakpoints_saved: { count: Number, total: Number, pct: Number },
               netpoints: { count: Number, total: Number, pct: Number }, // TODO
               breakgames: { count: Number, converted: Number, pct: Number},

               distance_covered: { feet: Number, meters: Number }, // TODO
               aggressive_margin: { number: Number, pct: Number },
               avg_rally_on_serve: Number,

               points_to_set: Array
            }],
            avg_rally: Number
         },
         serve: {
            players: [{
            }]
         },
         return: {
            players: [{
            }]
         },
         shots: {
            players: [{
            }]
         }
      }],
      // for linking to stories about the match or to i.e. ATP match_stats page
      media: [{ source: String, kind: String, url: String }],
      notes: [{ source: String, note: String }],
      flag: String
   });

   return module.exports = mongoose.model('Match', MatchSchema);
}
