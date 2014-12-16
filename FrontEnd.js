//la comunicazione server-client avviene tutta attraverso ajax

//creao un istanza di xmlhttprequest
var xmlhttp = CreateXmlHttpRequestObject();

//indirizzo del server ed eventuali parametri
var server_address = "FrontEnd.php";


//********************** FUNZIONI GENERICHE*****************************

//creo un istanza dell'oggetto xmlhttprequest
function CreateXmlHttpRequestObject()
{
	var xmlhttp = new XMLHttpRequest();
	if(!xmlhttp)
	{
		var log="<p class=\"err\">>>> errore nella creazione dell'oggetto xmlhttp</p>";
		mydiv = document.getElementById("log");
		mydiv.innerHTML += log; 
	}
	else
	{
		return xmlhttp;
	}
}
//funzione per l'invio di dati al server
function SendData (xmlhttp , params )
{
	//continuiamo solo se xmlhttp non  null
	if(xmlhttp)
	{
		//tentiamo la connessione al server
		try
		{
			xmlhttp.open("POST" , server_address , true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.onreadystatechange = HandleRequestStateChange;
			xmlhttp.send(params);
		}	
		catch(e)
		{
			var log="<p class=\"err\">>>> errore di connessione al server</p>";
			mydiv = document.getElementById("log");
			mydiv.innerHTML += log; 
		}
	}
}



//handler delle richieste
function HandleRequestStateChange()
{
	//quando readystate assume valore 4 possiamo leggere la risposta del server
	if(xmlhttp.readyState == 4) 
	{
		//continuiamo solo se lo stato http  200
		if(xmlhttp.status == 200) 
		{
			//utilizziamo la risposta del server
			try
			{
				ServerResponse();
			} 
			catch(e)
			{
				var log="<p class=\"err\">>>> errore nella lettura dei dati</p>";
				mydiv = document.getElementById("log");
				mydiv.innerHTML += log; 
			}
		}
		else
		{
			var log ="<p class=\"err\">>>> errrore nella ricezione dei dati</p>";
			mydiv = document.getElementById("log");
			mydiv.innerHTML += log; 
		}
	}	
}

//funzione che riceve i risultati
function ServerResponse()
{
	//prende la risposta sottoforma di documento XML
	var response = xmlhttp.responseXML;
	var mydiv = document.getElementById("mydiv");
	mydiv.innerHTML = response.getElementsByTagName("result")[0].childNodes[0].nodeValue;
	var log = "<p class=\"query\">"+" >>> " + response.getElementsByTagName("log")[0].childNodes[0].nodeValue;+"</p>"
	mydiv = document.getElementById("log");
	mydiv.innerHTML += log; //TODO aggiungere un pulsante per resettare il logbox 
	ResetInput();

	
} 
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//funzione per l'inpacchettamento dei parametri
function Packer(query)
{       
	//prezzo vendita dovrebbe essere calcolato direttamente dal sistema  
	params = "query=" + query;
	pattrn = /[A-z,1-9]+/;
	pattrnId = /[1-9]+/;
	if(query=='4'||query=='5')
	{
		if(pattrnId.test(document.getElementById("Id").value))
		{
			x=document.getElementById("Id").value;
			params += "&Id="+x ;
		}
	}
	if( pattrn.test(document.getElementById("Nome").value))
	{	
		x=document.getElementById("Nome").value;
		params += "&Nome="+x ;
	}

	if( pattrn.test(document.getElementById("Marca").value))
	{
		x=document.getElementById('Marca').value;	
		params += "&Marca="+x;
	}

	if(  pattrn.test(document.getElementById("PrezzoVendita").value))
	{
		x=document.getElementById('PrezzoVendita').value;	
		params += "&Prezzo_Vendita="+x;
	}

	if( pattrn.test(document.getElementById("PrezzoAcquisto").value))
	{
		x=document.getElementById('PrezzoAcquisto').value;	
		params += "&Prezzo_Acquisto="+x;
	}

	if( pattrn.test(document.getElementById("Iva").value))
	{
		x=document.getElementById('Iva').value;	
		params += "&Iva="+x;
	}

	return params;
	/*
	nuova funzione ottimizzata
	params = "query=" + query;
	var pattrn = /[A-z,1-9]+/;
	var index = new Array ("Nome", "Marca","PrezzoVendita","PrezzoAcquisto","Iva");
	for(var i = 0;i<index.length;i++)
	{
		if(document.getElementById(index[i]).value||pattrn.test(document.getElementById(index[i]).value))
		{
			params += "&" + index[i] + "=" + document.getElementById(index[i]).value;
		}
	}

	return params;
	*/
}


function CheckParameter(query)
{   
	var index = {Id:/[^1-9]/, Nome:/[^a-z,A-Z,0-9, ]/, Marca:/[^a-z,A-Z,0-9, ]/,PrezzoVendita:/[^1-9]/,PrezzoAcquisto:/[^1-9]/,Iva:/[^1-9]/}
	var err=">>> valore non corretto per i seguenti campi: ";
	var testResult = true;
	for(x in index)
	{
		if(query=='4'||query=='5')
		{
			if(index[x].test(document.getElementById("Id")))
			{
				testResul=false;
				err += " Id  ";
			}
		}
		else
		{	
			if(document.getElementById(x).value)
			{
				if(index[x].test(document.getElementById(x).value))
				{
					testResult = false;
			       		err +=" "+x+" ";	
				}
			}
		}
	}
	if(!testResult)//levare l'esecuzione nell'html
	{
		var log = "<p class=\"qerr\">"+err+"</p>";
		document.getElementById("log").innerHTML += log;
	       	return false;	
			
	}
	return true;
}

function ResetInput ()
{
	var index = new Array ("Id","Nome", "Marca","PrezzoVendita","PrezzoAcquisto","Iva");
	for(var i = 0 ; i<index.length ; i ++)
	{
		
		document.getElementById(index[i]).value = "";
		
	}
	

}

//************************************* FUNZIONI SPECIFICHE**********************************************************************

//funzione che carica l'intera tabella al caricamento
function LoadDatabase(xmlhttp)
{	
	var params = "query=1";
	SendData(xmlhttp,params);
}

//funzione per la ricerca di valori nel database
function Search()
{

	var query ="2";
	if(CheckParameter(query))
	{
		var params = Packer(query);
		SendData(xmlhttp,params);
	}
	
}

//funzione per aggiungere un record al database 
function NewRecord()
{

	var query ="3";
	if(CheckParameter(query))
	{
		var params = Packer(query);
		SendData(xmlhttp,params);
	}

}

//funzione per la rimozione di un record dal database
function DeleteRecord()
{
	var query = "4";
	if(CheckParameter(query))
	{
		var params = Packer(query);
		SendData(xmlhttp,params);
	}
}
//funzione di modifica
function UpdateRecord()
{
	var query="5";
	if(CheckParameter(query))
	{
		var params = Packer(query);
		SendData(xmlhttp,params);
	}
}


//funzione di selezione 
function Commit()
{
	var select = document.getElementById("function").value;
	if(select == "add")
	{
		NewRecord();
	}
	if(select == "search")
	{
		Search();
	}
	if(select == "remove")
	{
		DeleteRecord();
	}
	if(select == "update")
	{
		UpdateRecord();
	}
}

//refresh
function Refresh(xmlhttp)
{
	ResetInput();
	LoadDatabase(xmlhttp);

}

//funzione per nascondere il campo id
function hide()
{	
		document.getElementById("Id").disabled =(document.getElementById("function").value=="remove"||document.getElementById("function").value=="update")?false:true;
//		document.getElementById("mode").disabled =(document.getElementById("function").value=="search")?false:true;
} 

















