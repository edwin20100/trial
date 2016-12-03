
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
				<td>
						<div class="col-xs-12">
						    <ul class="nav nav-pills nav-justified thumbnail">
							<li><a href="#" onclick="return addAction('item-${index}',1)">
							    <h4 class="list-group-item-heading">1</h4>
							    <p class="list-group-item-text">Por Salir</p>
							</a></li>
							<li class="active"><a href="#" onclick="return addAction('item-${index}',2)"> 
							    <h4 class="list-group-item-heading">2</h4>
							    <p class="list-group-item-text">En Marcha</p>
							</a></li>
							<li><a href="#" onclick="return addAction('item-${index}',3)">
							    <h4 class="list-group-item-heading">3</h4>
							    <p class="list-group-item-text">Por Llegar</p>
							</a></li>
						    </ul>
						</div>
				<td>
          	 	 </tr>`);
	}).join(" ");
	document.getElementById('body-table-admin').innerHTML = html;
}


var app={

      listenSocket:function(){ //funcion para comunicarnos con Socketio
	      socket.on('horarios',function(data){
		     var dato =  data;
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
