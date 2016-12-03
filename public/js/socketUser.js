

 var map, lat, lng;
 localStorage.string_array_puntos = (localStorage.string_array_puntos || '[]');
 var array_puntos = JSON.parse(localStorage.string_array_puntos);
  

var socket = io.connect('https://gmaps20100.herokuapp.com/'); //Creando conexion con el socket del servidor de heroku,
                                                          //donde vive nuestra aplicacion  




function tableCreate(data)
{
	 var html = data.map(function(elem, index) {
		 var context =  "";
		 switch(html)
		{
			case 1: //por llegar
			context = "label label-warning"
			break;
			case 2:
			context = "label label-success"
			break;
			case 3:
			context = "label label-info"
			break;
			default:
			context = "label label-danger"
			break;
		}
   		 return(`<tr id="item-${index}">
				<td><a href="#"><i class="-alt fa fa-2x fa-eye fa-fw"></i></a></td>	
				<td>
					<h4><b>${elem.horaSalida} ${elem.periodo} - ${elem.horaLlegada} ${elem.periodo}</b></h4>
					<span class="${context}" id="statusItem">${elem.estado}</span> 
				</td>
				<td>
					<h4><b>${elem.tiempoRestante} </b></h4>
				</td>
				
          	 	 </tr>`);
	}).join(" ");
	document.getElementById('body-table-user').innerHTML = html;
}


var app={
      geolocalizar:function (){
        GMaps.geolocate({
          success: function(position){
            if(!array_puntos[0]) {
              lat = position.coords.latitude;  // guarda coords en lat y lng
              lng = position.coords.longitude;
            }else{
              lat = array_puntos[array_puntos.length-1][0] || position.coords.latitude;  // guarda coords en lat y lng
              lng = array_puntos[array_puntos.length-1][1] || position.coords.longitude;
            }
            
            array_puntos.push([lat,lng]); //insertando las nuevas geo posiciones

            map = new GMaps({  // muestra mapa centrado en coords [lat, lng]
              el: '#map',
              lat: lat,
              lng: lng,
              click: app.enlazarMarcador,
              tap: app.enlazarMarcador
            });

            app.pinta_rutas(); //dibujando rutas
            
            map.addMarker({ lat: lat, lng: lng});  // agregando marcador en [lat, lng]
          },
          error: function(error) { alert('Geolocalización falla: '+error.message); },
          not_supported: function(){ alert("Su navegador no soporta geolocalización"); },
        });
      },

	enlazarMarcador: function (e){
       // muestra ruta entre marcas anteriores y actuales
        map.drawRoute({
          origin: [lat, lng],  // origen en coordenadas anteriores
          // destino en coordenadas del click o toque actual
          destination: [e.latLng.lat(), e.latLng.lng()],
          travelMode: 'driving',  //opciones driving -walking
          strokeColor: '#C20041',  //color de linia
          strokeOpacity: 0.6,
          strokeWeight: 5
        });

        lat = e.latLng.lat();   // guarda coords para marca siguiente
        lng = e.latLng.lng();

        map.addMarker({ lat: lat, lng: lng});  // pone marcador en mapa

        array_puntos.push([lat,lng]);
        localStorage.string_array_puntos = JSON.stringify(array_puntos);
      },


      pinta_rutas:function (){ //se carga al inicio, para las primeras coordenadas
      		
        for (var i=0; i<array_puntos.length-1; i++){
          map.drawRoute({
            origin: [array_puntos[i][0], array_puntos[i][1]],  // origen en coordenadas anteriores
            // destino en coordenadas del click o toque actual
            destination: [array_puntos[i+1][0], array_puntos[i+1][1]],
            travelMode: 'driving',
            strokeColor: '#C20041',
            strokeOpacity: 0.6,
            strokeWeight: 5
          });
          map.addMarker({ lat: array_puntos[i][0], lng: array_puntos[i][1]});
        }
      },

      cargarMapa:function(){
		//alert('llama pinta_rutas');
		localStorage.string_array_puntos = '[]';
        array_puntos = JSON.parse(localStorage.string_array_puntos);
        app.geolocalizar();
      },

      listenSocket:function(){ //funcion para comunicarnos con Socketio
      /*    socket.on('usuario conectado', function(data){
            $('#divUsuarios').html(data); //displaying how many conncetions are.
          });  */
	     socket.on('horarios',function(data){
		     
		     var dato =  data;
		     //console.log(data);
		    tableCreate(dato);
	     });
	
	  
      },

    inicializar: function() {
		"use strict";
		var self=this;
		self.listenSocket(); //Conectando al server con SocketIo
        self.cargarMapa(); //llamando metodo que carga el mapa
	}

}; //cierra var app

app.inicializar(); //inicializando objeto al cargar la pagina
   
