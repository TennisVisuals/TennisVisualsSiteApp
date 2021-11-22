// there needs to be some post-processing that goes through and fills in player
// ranking at time of match if it is not present
//
// Match Stats Links need to be added when Tournament Draws are parsed

module.exports = function(mongoose) {

   var MatchSchema = new mongoose.Schema({
      muid: String,
      urls: Array,
      metadata: {
         players: [ 
            { name: String, puid: String, fh: String, seed: String, rank: String, age: String, entry: String, ioc: String }
         ],
         tournament: {
            tuid: String,
            name: String,
            tour: String,
            date: String,        // start date, because soem data sources don't have a match date
            category: String,
            rank: String,
            surface: String,
            draw: String,
            round: String, 
         },
         match: {
            date: String,
            year: String,
            category: String,    // e.g. W, M, X, G, B (women's men's mixed, girl's boys')
            start_time: String,
            end_time: String,
            duration: String,
            status: String,      // e.g. ret, w/o, def
            winner: String,      // status message
            court: String,
            in_out: String,
            umpire: String,
         }
      },
      opts: {
         match: {
            sets:                     String,
            description:              String,
            final_set_tiebreak:       { type: Boolean, default: true },
            final_set_tiebreak_to:    String,
            final_set_tiebreak_only:  { type: Boolean, default: false },
            first_service:            String
         },
    
         set: {
            games:                    String,
            advantage:                { type: Boolean, default: true },
            lets:                     { type: Boolean, default: true },
            tiebreak:                 { type: Boolean, default: true },
            tiebreak_at:              String,
            tiebreak_to:              String
         },
      },
      codes: [{
         first_service: String,
         source: String,
         code: Array
      }],
      contributors: [{ 
         identifiers: {}, 
         grants: { type: String, default: 'public' }
      }],
      sources: Array,
      score: [{ player0: Number, player1: Number, tiebreak: Number }],
      stats: [{
         source: String,
         overview: {
            calcs: [{
               name: String,
               numerator: [],
               denominator: [],
               pct: [],
               default: String
            }],
            avg_rally: Number
         },
         raw: [],
         serve: { },
         return: { },
         shots: { }
      }],
      // for linking to stories about the match or to i.e. ATP match_stats page
      // also for URL to player images
      media: [{ source: String, kind: String, url: String }],
      notes: [{ source: String, note: String }],
      flag: String
   });

   return module.exports = mongoose.model('TMatch', MatchSchema);
}
