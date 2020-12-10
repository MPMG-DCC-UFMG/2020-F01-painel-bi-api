module.exports = () => {
  const hive = require('hive-driver');
  const { TCLIService, TCLIService_types } = hive.thrift;
  const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
  );
  const db = {};
  
  db.bla = function(x) { return 'HELP' };
  db.query = (sql) => {
    client.connect(
      {
          host: 'localhost',
          port: 1000
      },
      new hive.connections.TcpConnection(),
      new hive.auth.NoSaslAuthentication()
    ).then(async client => {
      const session = await client.openSession({
          client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
      }).catch(error => {
  	console.log(error);
      }).finally(() => console.log('Fim'));
      const response = await session.getInfo(
          TCLIService_types.TGetInfoType.CLI_DBMS_VER
      );
  
      console.log(response.getValue());
  
      await session.close();
    }).catch(error => {
      console.log(error);
    });
  }
  return db;
}
