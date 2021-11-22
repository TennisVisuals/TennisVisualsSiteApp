module.exports = function(mongoose) {

   var PlayerSchema = new mongoose.Schema({
      puid: String,
      name: String, 
      fi: String,
      fname: String, 
      lname: String, 
      maiden: String,
      abbr_name: String,
      nickname: String,
      birthplace: { city: String, state: String, ioc: String },
      residence: { city: String, state: String, ioc: String },
      ioc: String,                                  // country origin information
      birth: String,
      cohort: String,                               // birth year
      status: [ { type: String, dt: Date } ],       // e.g. junior, pro, retired
      height: String,
      weight: String,
      fh: String,
      bh: String,
      ids: {},
      ranking: [ { dt: Date, org: String, r: Number } ],
      media: [ { src: String, kind: String, url: String } ],
      stats: {
         overview: {
            calcs: [{
               name: String,
               numerator: [],
               denominator: [],
               pct: [],
               default: String,
               count: Number       // number of matches
            }]
         },
      },
      sources: Array,
      flag: String
   });

   return mongoose.model('TPlayer', PlayerSchema);
}
