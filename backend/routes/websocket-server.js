const WebSocket = require('websocket').server;

module.exports = function (server) {
  const wsServer = new WebSocket({
    httpServer: server,
  });

  wsServer.on('request', function (request) {
    const wsConnection = request.accept(null, request.origin);

    wsConnection.on('message', function (message) {
      const uid = message.utf8Data;

      // Console.log the UID
      console.log("UID: " + uid);
    });
  });

  // Add the sendUID function to the exported object
  return {
    sendUID: function (uid) {
      // Loop through all connections and send the UID
      wsServer.connections.forEach(function (connection) {
        connection.sendUTF(uid);
      });
    }
  };
};
