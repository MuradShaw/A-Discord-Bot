//For creating and interacting with MySql DB

var mysql = require('mysql');


//Create connection
var con = mysql.createConnection({
  host: "/host here/",
  user: "/user here/",
  password: "/pass here/"
  database: "/database here/"
});

//Did we attempt a connection?
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});