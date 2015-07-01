var Fiber = require("fibers");
var MongoClient = require('mongodb').MongoClient;

module.exports = function(options) {

  if (typeof options == "string") {
    options = {
      "url": options
    }
  }

  return function() {

    var Collection = function(db, name) {
      this.collection = db.collection(name);
    }

    Collection.prototype.count = function(query, options) {
      query = query || {};
      options = options || {};
      var fiber = Fiber.current;
      this.collection.count(query, options, function(err, records) {
        fiber.run(records);
      });
      return Fiber.yield();
    };

    Collection.prototype.find = function(query, options) {
      query = query || {};
      options = options || {};
      var fiber = Fiber.current;
      this.collection.find(query, options).toArray(function(err, records) {
        fiber.run(records);
      });
      return Fiber.yield();
    };

    Collection.prototype.findOne = function(query, options) {
      return this.find(query, options)[0];
    };

    Collection.prototype.update = function(query, options) {
      var fiber = Fiber.current;
      this.collection.update(query, options, function(err, records) {
        fiber.run(records);
      });
      return Fiber.yield();
    };

    Collection.prototype.insert = function(document) {
      var fiber = Fiber.current;
      this.collection.insert(document, function(err, records) {
        fiber.run(records);
      });
      return Fiber.yield();
    };

    Collection.prototype.remove = function(document) {
      var fiber = Fiber.current;
      this.collection.remove(document, function(err, records) {
        fiber.run(records);
      });
      return Fiber.yield();
    };

    var fiber = Fiber.current;

    MongoClient.connect(options.url, function(err, db) {

      var obj = {
        "close": function() {
          db.close();
        }
      };

      db.collectionNames(function(err, collections) {
        collections.forEach(function(collection) {
          obj[collection.name] = new Collection(db, collection.name);
        });
        fiber.run(obj);
      });

    });

    return Fiber.yield();

  }

}