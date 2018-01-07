var Sequelize = require('sequelize');
var projectDatabase = new Sequelize('novaims', 'novaims', 'Hj9p4DzP_W?x', {
  host: "den1.mssql1.gear.host",
    dialect:'mssql'
})


module.exports ={
    'projectDB':projectDatabase
};