var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(/^\/(?!{javascripts|socket\.io|stylesheets|templates|images})/, function(req, res) {
  var env = req.param('env') || process.env.NODE_ENV;

  res.render('index', { env: env });
});

module.exports = router;
