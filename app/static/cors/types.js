!function() {
   var types = {
      desc: 'Tava Types Definitions',
      shots: {}
   }

   types.shots =  {
      strokes: ["Forehand", "Backhand", "Unknown", "Return"],
      stroke_types: ["Drive", "Slice", "Volley", "Overhead", "Lob", "Drop Shot", "Approach Shot", "Unknown", "Other", "First Return", "Second Return"]
   }

  if (typeof define === "function" && define.amd) define(types); else if (typeof module === "object" && module.exports) module.exports = types;
  this.types = types;
}();
