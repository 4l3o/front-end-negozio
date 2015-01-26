//la comunicazione server-client avviene tutta attraverso ajax
var index = {Id:/[^0-9]/, Nome:/[^a-zA-Z0-9 ]/, Marca:/[^a-zA-Z0-9 ]/,Magazzino:/[^0-9]/,Prezzo_Acquisto:/[^0-9.]/,Iva:/[^0-9]/}
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
	var mybody = document.createElement("tbody");
	var myhead = document.createElement("thead");
	var child = response.getElementsByTagName("result")[0];
	var intLen = child.getElementsByTagName("int").length;
	for(var i=0;i<intLen;i++)
	{
		var intElem = document.createElement("th");
		var intText = document.createTextNode(child.getElementsByTagName("int")[i].textContent);
		intElem.appendChild(intText);
		myhead.appendChild(intElem)
	}
	var rowLen =child.getElementsByTagName("row").length;
	for(var i =0;i<rowLen;i++)
	{
		var rowElem =document.createElement("tr");
		var rowChild =child.getElementsByTagName("row")[i];
		for(var j=0;j<intLen;j++)
		{
			var colElem=document.createElement("td");
			var colText=document.createTextNode(rowChild.getElementsByTagName("col")[j].textContent);
			colElem.appendChild(colText);
			rowElem.appendChild(colElem);
		}
		mybody.appendChild(rowElem);
	}
	var view = document.getElementById("mydiv");	
	view.replaceChild(myhead,view.getElementsByTagName("thead")[0]);
	view.replaceChild(mybody,view.getElementsByTagName("tbody")[0]);
	var log =response.getElementsByTagName("log")[0].childNodes[0].nodeValue;
	var type =response.getElementsByTagName("type")[0].childNodes[0].nodeValue;
	PrintLog(log,type);
	ResetInput();

	
} 
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//funzione per la stampa del log
function PrintLog(log,type)
{
	var message = "-->"+ log;
	mydiv = document.getElementById("log");
	var text = document.createElement("p");
	var textCont = document.createTextNode(message);
	text.appendChild(textCont);
	text.setAttribute("class",type);
	mydiv.appendChild(text);
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

// effettuo un controllo sui parametri con le espressioni regolari
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
	if(!testResult)
	{
		var log = err;
		PrintLog(log,"qerr");
	       	return false;	
			
	}
	return true;
}

function ResetInput ()
{
	for(x in index)
	{
		
		document.getElementById(x).value = "";
		
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

		var hide=(document.getElementById("function").value=="remove")?true:false;
		for(key in index)
		{
			if(key !="Id")
			{
				document.getElementById(key).disabled = hide;
			}
		}
} 

function Inventario()
{
	LoadDatabase(xmlhttp);
	var content = document.getElementById("mydiv").cloneNode(true);
	var newWindow = window.open("","newWindow");
	newWindow.document.write("<html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"print.css\"><title>Inventario</title></head><body></body></html>");
	newWindow.document.body.appendChild(content);
	newWindow.focus();
	newWindow.print();
}


//funzione per l'inizializzazione dell'interfaccia 
function Init(xmlhttp)
{
	params = "query=init";		
	//interrogo il server per recuperare i dati di sessione
	if(xmlhttp)
	{
		//tentiamo la connessione al server
		try
		{
			xmlhttp.open("POST" , server_address , true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.onreadystatechange = InitialRequest;
			xmlhttp.send(params);
		}	
		catch(e)
		{
			var log="errore di connessione al server";
			PrintLog(log,"err"); 
		}
	}
}

function InitialRequest()
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
				InitInterface();
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

function InitInterface()
{
	var response=xmlhttp.responseXML;
	var USER = response.getElementById(USER).nodeValue;
	var TYPE = response.getElementById(TYPE).nodeValue;
	PrintLog(USER+TYPE,"err");

	LoadDatabase(xmlhttp);


}












