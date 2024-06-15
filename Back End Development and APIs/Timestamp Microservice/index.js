var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/:date?", function (req, res) {
  let dateString = req.params.date || new Date().toISOString();

  let date;
  if (!isNaN(req.params.date)) {
    date = new Date(parseInt(req.params.date));
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({
      unix: date.getTime(),
      utc: date.toUTCString()
    });
  }
});

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
