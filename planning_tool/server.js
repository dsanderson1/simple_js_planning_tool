'use static'
const express = require('express');
const app = express();


const dbPath = './utility/sql_planning_tool.js';
const db = require(dbPath);

app.get('/api/loadUnits', function (req, res) { 
    db.loadUnits().then(function(data){
        res.json(data);
    });
});

app.get('/api/loadSessions', function (req, res) {
    db.loadSessions(req.query.unitid).then(function(data){
        res.json(data);
    });
});

app.post('/api/addUnit', function (req, res) {
    db.insertUnit(req.query.unittitle, req.query.unitcreator, req.query.noofweeks);
    res.sendStatus(200);
});

app.post('/api/addSession', function (req, res) {
    db.insertSession(req.query.sessiontitle, req.query.sessiondesc, req.query.sessiontype, req.query.sessionweekno, req.query.sessionunitid);
    res.sendStatus(200);
});

app.delete('/api/deleteSession', function (req, res) {
    db.deleteSession(req.query.unitsessionid);
    res.sendStatus(200);
});

app.use('/', express.static('web_pages', { extensions: ['html'] }));

app.listen(8080, (err) => {
    if (err) console.error('error starting server', err);
    else console.log('server started');
 });
 
 function error(res, msg) {
  res.sendStatus(500);
  console.error(msg);
}