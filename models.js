module.exports = function(mongoose) {
   var fs               = require('fs');
   var model_directory  = "./app/models/";
   var models           = {};
   var declarations     = {};

   var model_declarations = fs.readdirSync(model_directory).filter(function(f) { return f.match('.js$')=='.js' });
   model_declarations.forEach(function(e) {
      var model_name = e.split('.')[0];
      models[model_name] = require(model_directory + e)(mongoose);
   });

   return models;
}
