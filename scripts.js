/*basics*/
show dbs
show collections
use db
db.collection.drop()


/*insert one*/
db.inventory.insertOne(
   { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
)

/*insert many*/
db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
   { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
   { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
])

/*insert many member*/
db.members.insertMany( [
    { "_id" : 1, "member" : "abc123", "status" : "A", "points" : 2, "misc1" : "note to self: confirm status", "misc2" : "Need to activate", "lastUpdate" : ISODate("2019-01-01T00:00:00Z") },
    { "_id" : 2, "member" : "xyz123", "status" : "A", "points" : 60, comments: [ "reminder: ping me at 100pts", "Some random comment" ], "lastUpdate" : ISODate("2019-01-01T00:00:00Z") }
] )

/*insert many student*/
db.students3.insertMany( [
   { "_id" : 1, "tests" : [ 95, 92, 90 ], "average" : 92, "grade" : "A", "lastUpdate" : ISODate("2020-01-23T05:18:40.013Z") },
   { "_id" : 2, "tests" : [ 94, 88, 90 ], "average" : 91, "grade" : "A", "lastUpdate" : ISODate("2020-01-23T05:18:40.013Z") },
   { "_id" : 3, "tests" : [ 70, 75, 82 ], "lastUpdate" : ISODate("2019-01-01T00:00:00Z") }
] )

/*insert many inventory embedded*/
db.inventory.insertMany([
   { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
   { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
   { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
   { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
   { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
]);

/*insert many inventory array*/
db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [ 14, 21 ] },
   { item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [ 14, 21 ] },
   { item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [ 14, 21 ] },
   { item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [ 22.85, 30 ] },
   { item: "postcard", qty: 45, tags: ["blue"], dim_cm: [ 10, 15.25 ] }
]);

/*insert many inventory embedded array*/
db.inventory.insertMany( [
   { item: "journal", instock: [ { warehouse: "A", qty: 5 }, { warehouse: "C", qty: 15 } ] },
   { item: "notebook", instock: [ { warehouse: "C", qty: 5 } ] },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 15 } ] },
   { item: "planner", instock: [ { warehouse: "A", qty: 40 }, { warehouse: "B", qty: 5 } ] },
   { item: "postcard", instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
]);

/*find query*/
db.inventory.find( { item: "canvas" } )
db.inventory.find( {} )
db.inventory.find( { status: { $in: [ "A", "D" ] } } )
db.inventory.find( { status: "A", qty: { $lt: 30 } } )

db.inventory.find( {
     status: "A",
     $or: [ { qty: { $lt: 30 } }, { item: /^p/ } ]
} )

/*find query embedded documents*/
db.inventory.find( { size: { h: 14, w: 21, uom: "cm" } } )
db.inventory.find( { "size.h": { $lt: 15 } } )

/*find query array documents*/
db.inventory.find( { tags: ["red", "blank"] } )
db.inventory.find( { tags: { $all: ["red", "blank"] } } )
db.inventory.find( { dim_cm: { $gt: 25 } } )
db.inventory.find( { dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } } } )

/*find query array embedded documents*/
db.inventory.find( { "instock": { warehouse: "A", qty: 5 } } )
db.inventory.find( { "instock": { qty: 5, warehouse: "A" } } )
db.inventory.find( { 'instock.qty': { $lte: 20 } } )
db.inventory.find( { "instock": { $elemMatch: { qty: { $gt: 10, $lte: 20 } } } } )



/*update one*/
try {
   db.restaurant.updateOne(
      { "name" : "Central Perk Cafe" },
      { $set: { "violations" : 3 } }
   );
} catch (e) {
   print(e);
}


try {
   db.restaurant.updateOne(
      { "name" : "Pizza Rat's Pizzaria" },
      { $set: {"_id" : 4, "violations" : 7, "borough" : "Manhattan" } },
      { upsert: true }
   );
} catch (e) {
   print(e);
}


try {
   db.restaurant.updateOne(
      { "violations" : { $gt: 10} },
      { $set: { "Closed" : true } },
      { upsert: true }
   );
} catch (e) {
   print(e);
}

/*update many*/
try {
   db.restaurant.updateMany(
      { violations: { $gt: 4 } },
      { $set: { "Review" : true } }
   );
} catch (e) {
   print(e);
}


/*update one member*/
db.members.updateOne(
   { _id: 1 },
   [
      { $set: { status: "Modified", comments: [ "$misc1", "$misc2" ], lastUpdate: "$$NOW" } },
      { $unset: [ "misc1", "misc2" ] }
   ]
)

/*update many member*/
db.members.updateMany(
   { },
   [
      { $set: { status: "Modified", comments: [ "$misc1", "$misc2" ], lastUpdate: "$$NOW" } },
      { $unset: [ "misc1", "misc2" ] }
   ]
)

/*update one student*/
db.students3.updateOne(
   { _id: 3 },
   [
     { $set: { average: { $trunc: [  { $avg: "$tests" }, 0 ] }, lastUpdate: "$$NOW" } },
     { $set: { grade: { $switch: {
                           branches: [
                               { case: { $gte: [ "$average", 90 ] }, then: "A" },
                               { case: { $gte: [ "$average", 80 ] }, then: "B" },
                               { case: { $gte: [ "$average", 70 ] }, then: "C" },
                               { case: { $gte: [ "$average", 60 ] }, then: "D" }
                           ],
                           default: "F"
     } } } }
   ]
)

/*update many student*/
db.students3.updateMany(
   { },
   [
     { $set: { average : { $trunc: [ { $avg: "$tests" }, 0 ] } , lastUpdate: "$$NOW" } },
     { $set: { grade: { $switch: {
                           branches: [
                               { case: { $gte: [ "$average", 90 ] }, then: "A" },
                               { case: { $gte: [ "$average", 80 ] }, then: "B" },
                               { case: { $gte: [ "$average", 70 ] }, then: "C" },
                               { case: { $gte: [ "$average", 60 ] }, then: "D" }
                           ],
                           default: "F"
     } } } }
   ]
)



