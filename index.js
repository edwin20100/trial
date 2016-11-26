 var express= require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public')); //serving statics files like css, js, images

var port=process.env.PORT || 3000; //this is for heroku


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


http.listen(port, function(){
  console.log('listening on *:'+port);
});


//trabajando con Socket IO
var socketCount = 0; //contador de conexiones

/* ---> <---- */

var messages = [{  
  acccion: 1,
  posicionX: "Hola soy un mensaje",
  posicionY: "Carlos Azaustre"
}];

var horarios =[{horaSalida: "6.45",horaLlegada: "7.05",periodo:"a.m.",tiempoRestante: "0 mins", estado:"Detenedio" },
	      {horaSalida: "7.20",horaLlegada: "7.50",periodo:"a.m.",tiempoRestante: "0 mins", estado:"Detenedio" },
	      {horaSalida: "8.50",horaLlegada: "9.10",periodo:"a.m.",tiempoRestante: "0 mins", estado:"Detenedio" },
	      {horaSalida: "10.30",horaLlegada: "10.50",periodo:"a.m.",tiempoRestante: "0 mins", estado:"Detenedio" }];

app.get('/hello', function(req, res) {  
  res.status(200).send("Hello World!");
});

//--->>>>

io.on('connection', function(socket){

	console.log('Usuario Conectado...');
	//console.log(socket);
    socketCount++;// Socket has connected, increase socket count
	//io.sockets.emit('usuario conectado', socketCount +'Hola');    // Let all sockets know how many are connected
	io.sockets.emit('horarios',horarios); //emitos horarios a main.js
	// ----->
	 //socket.emit('messages', messages);

	 socket.on('new-message', function(data) {
	    messages = data;
 	    console.log("----->" + data.posicionX);
	    //messages = data;
	    io.sockets.emit('messages', messages);
	  });
	// ------>
	
}); //cierra on connection

/*
    socket.on('disconnect', function () {
        socketCount--; // Decrease the socket count on a disconnect	
        io.sockets.emit('usuario conectado', socketCount);    // Let all sockets know how many are connected
        console.log('usuario desconectado');
    });*/
