var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
var dataSource = app.dataSources.postgres;

dataSource.automigrate('User', function(err) {
  if (err) throw err;

  console.log('User model migrated');
  //dataSource.disconnect();
});
dataSource.automigrate('AccessToken', function(err) {
  if (err) throw err;

  console.log('AccessToken model migrated');
  //dataSource.disconnect();
});
dataSource.automigrate('ACL', function(err) {
  if (err) throw err;

  console.log('ACL model migrated');
  //dataSource.disconnect();
});
dataSource.automigrate('RoleMapping', function(err) {
  if (err) throw err;

  console.log('RoleMapping model migrated');
  //dataSource.disconnect();
});
dataSource.automigrate('Role', function(err) {
  if (err) throw err;

  console.log('Role model migrated');
  dataSource.disconnect();
});
