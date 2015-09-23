//array di configurazione menu amministratore
var inputMenuRoot={Id:"11",Nome_Prodotto:"16",Marca:"16",Venditore:"16",Quantità:"11",Prezzo_Acquisto:"9",Iva:"3",Prezzo_Vendita:"9",Ricavo:"9",Data_Ultima_Modifica:"8"};
var actionRoot={Search:"Search();",Add:"add();",Remove:"Remove();",Update:"update();"};
var optionMenuRoot={Prodotti:"prodotti();",Utenti:"utenti();",Statistiche:"statistiche();"};
var inputUserMenuRoot={Username:"11",Administrator:"1",Password:"32",Nome:"11",Cognome:"11"};
//array di configurazione menu utente 
var inputMenuUser={Id:"11",Nome_Prodotto:"16",Marca:"16",Magazzino:"11",Prezzo_Acquisto:"9",Iva:"3"};
var actionUser={Search:"Search();"};
var optionMenuUser={Prodotti:"prodotti();",Statistiche:"statistiche();"};


var infoxmlhttp = new XMLHttpRequest();
var server_address = "FrontEnd.php";

//funzione per l'inizializzazione dell'interfaccia 
function Init()
{
		params = "query=init";		
	//interrogo il server per recuperare i dati di sessione
	if(infoxmlhttp)
	{
		//tentiamo la connessione al server
		try
		{
			infoxmlhttp.open("POST" , server_address , true);
			infoxmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			infoxmlhttp.onreadystatechange = InitialRequest;
			infoxmlhttp.send(params);
		}	
		catch(e)
		{
			var log="errore di connessione al server";
			alert(log); 
		}
	}
}

function InitialRequest()
{
	//quando readystate assume valore 4 possiamo leggere la risposta del server
	if(infoxmlhttp.readyState == 4) 
	{
		//continuiamo solo se lo stato http  200
		if(infoxmlhttp.status == 200) 
		{
			//utilizziamo la risposta del server
			try
			{
				InitInterface();
			} 
			catch(e)
			{
				var log="errore nella lettura dei dati";
				alert(log);
			}
		}
		else
		{
			var log ="errrore nella ricezione dei dati";
			alert(log); 
		}
	}	

}

function InitInterface()
{
	var response=infoxmlhttp.responseXML;
	var USER = response.getElementsByTagName("USER")[0].textContent;
	var TYPE = response.getElementsByTagName("TYPE")[0].textContent;

	createLogoutButton("topOptionMenu",USER);
	var topMenu =document.createElement("div");
	topMenu.setAttribute("class","menuWrapper");
	if(TYPE==true)
	{

		createDisplayMenuButton("topOptionMenu",actionRoot);
		//creo il menu per la sezione prodotti
		menuInflater("ActionMenu","prodotti",inputMenuRoot,actionRoot,"prodotti",true);	 
		menuInflater("ActionMenu","utenti",inputUserMenuRoot,actionRoot,"utenti",false);	
		optionMenuInflater("topOptionMenu",optionMenuRoot);
	}
	else
	{
		createDisplayMenuButton("topOptionMenu",actionUser);
		menuInflater("ActionMenu","prodotti",inputMenuUser,actionUser,"prodotti",true);
		optionMenuInflater("topOptionMenu",optionMenuUser);
	}
	document.getElementById("Prodotti").setAttribute("class","disabled optionMenuButton");
}

function inflater(targetId, elemRef)
{
	var target = document.getElementById(targetId);
	target.appendChild(elemRef);
}

function menuInflater(targetId,viewId,inputMenu,action,db,display)
{
	var menu = document.createElement("div");
	menu.setAttribute("class","menuWrapper");
	for(x in inputMenu)
	{
		var wrapper=document.createElement("div");
		wrapper.setAttribute("id","input"+x);
		var label = document.createElement("label");
		label.setAttribute("for",x);
		var txt = document.createTextNode(x);
		label.appendChild(txt);
		var input =document.createElement("input");
		input.setAttribute("type","text");
		input.setAttribute("id",x);
		input.setAttribute("maxlength",inputMenu[x]);
		wrapper.appendChild(label);
		wrapper.appendChild(input);
		menu.appendChild(wrapper);
	}
	for(x in action)
	{
		var a=document.createElement("a");
		a.setAttribute("class","myButton");
		a.setAttribute("href","#");
		a.setAttribute("id","button"+db+x);
		a.setAttribute("onclick",action[x]);
		var txt =document.createTextNode(x);
		a.appendChild(txt);
		menu.appendChild(a);
	} 
	menu.setAttribute("id",viewId);
	if(!display)
	{
		menu.style.display="none";
	}
	inflater(targetId,menu);
}

function optionMenuInflater(targetId,action)
{
	var menu = document.createElement("div");
	menu.setAttribute("class","menuWrapper");
	for(x in action)
	{
		var a=document.createElement("a");
		a.setAttribute("class","optionMenuButton");
		a.setAttribute("href","#");
		a.setAttribute("onclick",action[x]);
		a.setAttribute("id",x);
		var txt =document.createTextNode(x);
		a.appendChild(txt);
		menu.appendChild(a);
	} 
	inflater(targetId,menu);
}

function createLogoutButton(targetId,username) 
{
	var a=document.createElement("a");
	a.setAttribute("class","logoutButton");
	a.setAttribute("href","#");
	a.setAttribute("onclick","logout();");
	var txt = document.createTextNode("Logout: "+username.toUpperCase());
	a.appendChild(txt);
	inflater(targetId,a);

}

function createDisplayMenuButton(targetId,displayMenuId,menuName)
{
		var a=document.createElement("a");
		a.setAttribute("id",displayMenuId);
		a.setAttribute("class","displayMenuButton");
		a.setAttribute("href","#");
		a.setAttribute("onclick",menuName+"();");
		var txt =document.createTextNode(menuName);
		a.appendChild(txt);
		inflater(targetId,a);
}

function logout()
{
	
	message = "query=logout";		
	//interrogo il server per recuperare i dati di sessione
	if(infoxmlhttp)
	{
		//tentiamo la connessione al server
		try
		{
			infoxmlhttp.open("POST" , server_address , true);
			infoxmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			infoxmlhttp.onreadystatechange =LogOutRequest;
			infoxmlhttp.send(message);
		}	
		catch(e)
		{
			var log="errore di connessione al server";
			alert(log); 
		}
	}
}

function LogOutRequest()
{
	//quando readystate assume valore 4 possiamo leggere la risposta del server
	if(infoxmlhttp.readyState == 4) 
	{
		//continuiamo solo se lo stato http  200
		if(infoxmlhttp.status == 200) 
		{
			//utilizziamo la risposta del server
			try
			{				
				window.location.replace("index.php");
			} 
			catch(e)
			{
				var log="errore nella lettura dei dati";
				alert(log);
			}
		}
		else
		{
			var log ="errrore nella ricezione dei dati";
			alert(log); 
		}
	}	

}

function createDisplayMenuButton(targetId,action)
{
	var menu=document.createElement("div");
	menu.setAttribute("class","menuWrapper");
	for(x in action)
	{
		var a=document.createElement("a");
		a.setAttribute("id",x);
		a.setAttribute("class","displayMenuButton");
		a.setAttribute("href","#");
		a.setAttribute("onclick","selectInput(this);");
		var txt =document.createTextNode(x);
		a.appendChild(txt);
		menu.appendChild(a);
	}
	inflater(targetId,menu);
}
