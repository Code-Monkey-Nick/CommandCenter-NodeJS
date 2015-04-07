module.exports = function(io) {
	//keep track the list of players connected
	var clientID = {};

	io.on('connection', function(socket){
		console.log('someone connected');
		retrieveCommanderInformation(socket);
		//sendCommanderInformation(socket);
		clientRequestPlayerData(socket);
		//io.emit('test message', "you are connected to the Guild Wars 2 Command Center");
		//io.emit('commander set', { lat: "-164.5625", lng: "163.6875"});
		handleClientDisconnection(socket);
	});

	function retrieveCommanderInformation(socket) {
		socket.on('commander-info-to-server', function(commanderInfo) {
			clientID[socket.id] = commanderInfo;
		});
	}

	function clientRequestPlayerData(socket) {
		socket.on('requestPlayerData', function() {
			sendCommanderInformation(socket);
		});
	}

	function sendCommanderInformation(socket) {
		var players = [];
		for(i=0; i < Object.keys(clientID).length; i++) {
			players.push(clientID[Object.keys(clientID)[i]]);
		}
		console.log(players);
		socket.emit('commander-info-from-server', players);
	}

	function handleClientDisconnection(socket) {
	  	socket.on('disconnect', function() {
	  		console.log('someone disconnected');
	  		delete clientID[socket.id];
	  		console.log(clientID);
	  	});
	}
}