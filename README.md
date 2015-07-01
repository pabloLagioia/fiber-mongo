#How to use it

```
var mongo = require("fiber-mongo")("mongodb://localhost:27017/myMongoDB");
var Fiber = require("fibers");

Fiber(function() {
  
  var db = mongo();

  db.users.insert({
    "name": "John Doe",
    "type": "developer"
  });

  //Get all Users in an array
  var users = db.users.find();

  //Get one user
  var user = db.users.findOne({
    "type": "developer"
  });

  //Update
  db.users.update({
    "name": "John Doe"
  },{
    "$set": {
      "age": 20
    }
  });

  //Remove
  db.users.remove({
    "name": "John Doe"
  });
  
  db.close();

}).run();
```
