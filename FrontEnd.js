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
		var log="<p class=\"err\">errore nella creazione dell'oggetto xmlhttp</p>";
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
			var log="<p class=\"err\">errore di connessione al server</p>";
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
				var log="<p class=\"err\">errore nella lettura dei dati</p>";
				mydiv = document.getElementById("log");
				mydiv.innerHTML += log; 
			}
		}
		else
		{
			var log ="<p class=\"err\">errrore nella ricezione dei dati</p>";
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
//DA CONTROLLARE
//funzione che controlla la correttezza dei parametri
//da chiamare ogni volta che esco da un campo (sblocca il pulsante per l'invio dati ) 
function CheckParameter()
{   
	var index = new Array ("Nome", "Marca","PrezzoVendita","PrezzoAcquisto","Iva");
	var pattrn = /[^a-z,A-Z,0-9, ]/;//ricerco tutti i caratteri diversi da a-z,0-9,A-Z e spazio(voglio la possibilit di inserire campi vuoti o con degli spazi)
	var testResult = true;//<-- problema il campo id andrebbe tetsato separatamente @TODO definire i campi obbligatori per l'inserimento (aggiunta di un record)
	for(var i = 0 ; i<index.length ; i ++)
	{
		if(pattrn.test(document.getElementById(index[i]).value))
		{
			testResult = false; 
		}
	}
	//se test reult  true ha passatotutti i test
	if(testResult)
	{
	
		document.getElementById("submit").disabled = false;
	}
	else
	{

		document.getElementById("submit").disabled = true;
	}
	 
}

function ResetInput ()
{
	var index = new Array ("Nome", "Marca","PrezzoVendita","PrezzoAcquisto","Iva");
	for(var i = 0 ; i<index.length ; i ++)
	{
		
		document.getElementById(index[i]).value = "";
		
	}
	

	document.getElementById("submit").disabled = true;
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
	var params = Packer(query);
	//invio parametri al server
	SendData(xmlhttp,params);	
}

//funzione per aggiungere un record al database 
function NewRecord()
{

	var query ="3";
	var params = Packer(query);
	
	//invio i dati al server
	SendData(xmlhttp,params);
}

//funzione per la rimozione di un record dal database
function DeleteRecord()
{
	var query = "4";
	var params = packer(query);
	
	//invio dati al server
	SendData(xmlhttp,params);
}
//funzione di modifica
function ModifyRecord()
{
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
}

//refresh
function Refresh(xmlhttp)
{
	ResetInput();
	LoadDatabase(xmlhttp);

}











