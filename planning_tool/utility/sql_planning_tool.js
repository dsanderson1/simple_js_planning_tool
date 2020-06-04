'use strict';

const mysql = require('mysql2/promise');
const config = require('./config.json');

async function insertUnit(unit_name, unit_creator, unit_weeks) {
    const sql = await init();
    const insertUnit = sql.format('INSERT INTO Unit SET ? ;', { unit_name, unit_creator, unit_weeks });
    await sql.query(insertUnit);
}

async function loadUnits() {
    const sql = await init();
    
    const query = 'SELECT unit_id, unit_name, unit_weeks FROM Unit';
    const [rows] = await sql.query(query);
    return rows;
}

async function insertSession(unitsession_title, unitsession_description, unitsession_type, unitsession_weekno, unitsession_unit_id){
    const sql = await init();
    const insertSession = sql.format('INSERT INTO UnitSession SET ? ;', { unitsession_title, unitsession_description, unitsession_type, unitsession_weekno, unitsession_unit_id });
    await sql.query(insertSession);
}

async function loadSessionByUnitIDByWeek(unit_id) {
    const sql = await init();
    const query = 'SELECT * FROM UnitSession WHERE unitsession_unit_id = ' + unit_id + ' ORDER BY unitsession_weekno';
    
    const [rows] = await sql.query(query);
    return rows;
}

async function deleteSession(session_id) {

    const sql = await init();
    const deleteSess = 'DELETE FROM UnitSession WHERE unitsession_id = ' + session_id;
    await sql.query(deleteSess);
}


let sqlPromise = null;
async function init() {
  if (sqlPromise) return sqlPromise;

  sqlPromise = newConnection();
  return sqlPromise;
}

async function newConnection() {
  //create a new connection based from the config
  const sql = await mysql.createConnection(config.mysql);

  //Put the errors on the console. 
  sql.on('error', (err) => {
    console.error(err);
    sql.end();
  });

  return sql;
}

module.exports = {
    insertUnit: insertUnit,
    loadUnits: loadUnits,
    newConnection: newConnection,
    insertSession: insertSession,
    loadSessions: loadSessionByUnitIDByWeek,
    deleteSession: deleteSession,
};