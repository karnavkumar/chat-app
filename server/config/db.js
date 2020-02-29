const Datastore = require('nedb');

const db = {};

/**
 * @description create and load dyanmic Databases AND  it's physical file
*/
db[`users`] = new Datastore(`${'./database/users.db'}`);
db[`chats`] = new Datastore(`${'./database/chats.db'}`);
/**
* @description Load datafile in db object
*/
db[`users`].loadDatabase();
db[`chats`].loadDatabase();
/**
* @description remove $delete refernce and corrupt data row from physical data file after every 20 sec
*/
db[`users`].persistence.setAutocompactionInterval(20000);
db[`chats`].persistence.setAutocompactionInterval(20000);

exports.db = db;
