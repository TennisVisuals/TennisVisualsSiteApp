module.exports = function(mongoose) {

   var TournamentSchema = new mongoose.Schema({
      tuid: String,
      name: String,
      names: Array,
      sponsor_names: Array,
      tours: Array,     // ATP, WTA, ITF
      rank: String,     // default rank
      lt: String,       // default Lattitude
      lg: String,       // default Longitude
      ids: {},
      dates: [ { 
         start: Date, 
         end: Date, 
         match_dates: Array, // dates of matches identified with tournament
         year: String,
         venue: String,
         surface: String,
         sponsor: String,
         location: { street: String, city: String, state: String, country: String, lt: String, lg: String }, 
         draw_size: String,   // different years may have different draw sizes
         rank: String,        // points may change based on strength of players each year
         category: String,
         prize_money: String 
      }],
      urls: Array,
      codes: Array,     // found on itftennis.com
      cache: Array,     // if parsed from or saved to local cache
      flag: String,     // notation for human identified
      sources: Array
   });

   return module.exports = mongoose.model('TTourney', TournamentSchema);
}
