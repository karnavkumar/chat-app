const { db } = require( './../config/db' );

const getDbData = async ( key, obj ) => new Promise( ( resolve ) => {
    db[ key ].find( obj, ( err, docs ) => {
        if ( err ) {
            console.error( "[getDbData] Error : ", err )
            return resolve( [] )
        } else {
            return resolve( docs )
        }
    } );
} )

const inserDbData = async (key, objectToInsert) => new Promise((resolve) => {
    db[key].insert(objectToInsert, (err, docs) => {
      if (err) {
        return resolve([]);
      } else {
        return resolve(docs);
      }
    });
})

const updateDbData = async (key, id, objectToUpdate) => new Promise((resolve) => {
    db[key].update({user_id: id },objectToUpdate, (err, docs) => {
      if (err) {
        return resolve([]);
      } else {
        return resolve(docs);
      }
    });
})

const removeDbData = async (key, obj) => new Promise((resolve) => {
  db[key].remove(obj, { multi: true }, (err, docs) => {
    if (err) {
      return resolve([]);
    } else {
      return resolve(docs);
    }
  });
})
exports.inserDbData = inserDbData;
exports.getDbData = getDbData;
exports.updateDbData = updateDbData;
exports.removeDbData = removeDbData;