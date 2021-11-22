module.exports = function(models) {

   var express = require('express');
   var tava_router = express.Router();

   // middleware to use for all requests
   tava_router.use(function(req, res, next) {
    // do logging
       next(); // make sure we go to the next routes and don't stop here
   });

   // reporting route to log user activity in the application
   // ----------------------------------------------------
   tava_router.route('/report/:message') 

      .get(function(req, res) {
         res.json({message: 'Message: ' + req.params.message});
      });

   return tava_router;
}
