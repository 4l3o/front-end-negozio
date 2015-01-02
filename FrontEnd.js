//la comunicazione server-client avviene tutta attraverso ajax
var index = {Id:/[^1-9]/, Nome:/[^a-z,A-Z,0-9, ]/, Marca:/[^a-z,A-Z,0-9, ]/,Magazzino:/[^1-9]/,PrezzoAcquisto:/[^1-9]/,Iva:/[^1-9]/}
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
		var log="errore nella creazione dell'oggetto xmlhttp";
		PrintLog(log,"err");
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
			var log="errore di connessione al server";
			PrintLog(log,"err"); 
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
				var log="errore nella lettura dei dati";
				PrintLog(log ,"err");
			}
		}
		else
		{
			var log ="errrore nella ricezione dei dati";
			PrintLog(log,"err"); 
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
	var log =response.getElementsByTagName("log")[0].childNodes[0].nodeValue;
	var type =response.getElementsByTagName("type")[0].childNodes[0].nodeValue;
	PrintLog(log,type);
	ResetInput();

	
} 
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//funzione per la stampa del log
function PrintLog(log,type)
{
	var message = "<p class=\""+type+"\">-->"+ log+"</p>";
	mydiv = document.getElementById("log");
	mydiv.innerHTML += message;
}
//funzione per l'inpacchettamento dei parametri
function Packer(query,index)
{       	
	params = "query=" + query;		
	for(var key in index)
	{
		if(document.getElementById(key).value)
		{
			x=document.getElementById(key).value;	
			params += "&"+key+"="+x;
		}		
	}
	return params;	

}


function CheckParameter(query,index)
{   
	var err="valore non corretto per i seguenti campi: ";
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
		var log = err;
		PrintLog(log,"qerr");
	       	return false;	
			
	}
	return true;
}

function ResetInput ()
{
	var index = new Array ("Id","Nome", "Marca","Magazzino","PrezzoAcquisto","Iva");
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
	if(CheckParameter(query,index))
	{
		var params = Packer(query,index);
		SendData(xmlhttp,params);
	}
	
}

//funzione per aggiungere un record al database 
function NewRecord()
{

	var query ="3";
	if(CheckParameter(query,index))
	{
		var params = Packer(query,index);
		SendData(xmlhttp,params);
	}

}

//funzione per la rimozione di un record dal database
function DeleteRecord()
{
	var query = "4";
	if(CheckParameter(query,index))
	{
		var params = Packer(query,index);
		SendData(xmlhttp,params);
	}
}
//funzione di modifica
function UpdateRecord()
{
	var query="5";
	if(CheckParameter(query,index))
	{
		var params = Packer(query,index);
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

















