db.s_users.drop();

db.s_users.insertMany([
  { name: "Alice", level: 20},
  { name: "Bob", level: 22},
  { name: "Carol", level: 15},
]);

printjson(db.s_users.find({level: {$gte: 20}}).sort({level:-1}).toArray());