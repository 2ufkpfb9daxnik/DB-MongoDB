// npm run mql -- from-teacher/14/create-s_users.mongosh.js

db.s_users.drop();

db.s_users.insertMany([
  { name: "Alice", level: 20 },
  { name: "Bob", level: 22 },
  { name: "Carol", level: 19 },
]);

printjson(
  db.s_users
    .find({ level: { $gte: 20 } })
    .sort({ level: -1 })
    .toArray(),
);
