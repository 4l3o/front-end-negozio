<?php 
$parameter_name = array('Nome','Marca','Prezzo_Vendita','Prezzo_Acquisto','Iva'); //array di riferimento dei parametri del database @todo spostarlo in php config
//creo una connessione al database
//require_once('config.php');
$con= mysqli_connect('localhost','root','root','DB_Pweb');
$QueryType = $_POST['query'];
$query = AddParams($QueryType);
echo $query;
SendResponse($QueryType , $con);
//SimpleSendResponse($con);
//chiudo la connessione al DB
mysqli_close($con);



//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//funzione semplice di prova

function SimpleSendResponse($con)
{
	$query ='SELECT * FROM Prodotti';
	$result = mysqli_query($con , $query);
	//stampa dei risultati
	while ($row = mysqli_fetch_array($result)) 
	{
		echo '<tr>';
		echo ('<td>'.$row['Id'].'</td>'.'<td>'.$row['Nome'].'</td>');
		echo '</tr>';
	}
}

//funzione "ufficiale"

function SendResponse($QueryType , $con)
{
	if($QueryType == 3)
	{
		$query = AddParams( $QueryType);
		mysqli_query($con,$query);
		//aggiorno i record visualizzati chiamando nuovamente la funzione con querytype = 1
		$QueryType = 1;
		SendResponse($QueryType);
	}
	else
	{
		
		//$query = 'SELECT * FROM Prodotti';
	 	$query = AddParams($QueryType);	
	 	$result = mysqli_query($con,$query);
	 	//PrintResult($result);
		while ($row = mysqli_fetch_array($result)) 
		{
			echo '<tr>';	
			echo ('<td>'.$row['Id'] . '</td>'.'<td>' . $row['Nome'].'</td>'); //<---- MODIFICARE RIGHE
			echo '</tr>';
		}
	}
	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//funzione per il ritorno dei valori 
function PrintResult($result)
{
	while ($row = mysqli_fetch_array($result)) 
	{
		echo '<tr>';
		echo ('<td>'.$row['Id'] . '</td>'.'<td>' . $row['Nome'].'</td>'); //<---- MODIFICARE RIGHE
		echo '</tr>';
	}
}


//funzione che crea la query a partira dai dati inviati al server
function AddParams($QueryType)
{
	global $parameter_name;
	//**********************************************
	//carico il database
	if($QueryType ==1)
	{
		$query_1 = 'SELECT * FROM Prodotti';
		return $query_1;
	}
	//*********************************************AREA UNDER TEST***********************************************************************************
	//non viene eseguita la seconda query eseguita problema di connessione con il database (credo ) o di invio delle richieste
	//cerco un valore nel database
	if($QueryType == 2)
	{
	$query_2 = 'SELECT * FROM Prodotti WHERE ';
	foreach($parameter_name as $value)
	{
		if($_POST[$value]!= NULL || $_POST[$value]!= '')
		{
			$query_2.=$value.'='.'"'.$_POST[$value].'"'.' ';
		}		
	}
	return $query_2;
	}
	//******************************************** ******************************************************************************************************
	//aggiungo un nuovo record
	if($QueryType==3)
	{
		$query_3 = 'INSERT INTO Prodotti VALUES(';
		//************************************
		foreach($parameter_name as $value)
		{
			if($_POST[$value])
			{
				$query_3.=$_POST[$value];//se non funziona è perchè mancano le virgolette ai valori 
			}
			else
			{
				$query_3.='NULL';
			}
			if($value != $parameter_name[count($parameter_name)-1])
			{
				$query_3.=',';
			}	
		}
		$query_3 .=')';
		return $query_3;	
	}
}
 
?>
