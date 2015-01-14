<?php 

//creo una connessione al database
require_once('config.php');
$con= mysqli_connect(HOST,USR,PSWD,DB);
$QueryType = $_POST['query'];
SendResponse($QueryType , $con);

//chiudo la connessione al DB
mysqli_close($con);


//------------------------------------------------------------------------------

function SendResponse($QueryType , $con ,$type='empty',$message='empty' )
{
	if($QueryType == 3 || $QueryType == 4 || $QueryType == 5)
	{
		$query = AddParams($QueryType);
		$log;	
		$Ltype;
		if(!mysqli_query($con,$query))
		{
			$log='esecuzione query fallita : '.mysqli_error($con);	
			$Ltype='qerr';
		}
		else
		{
			$log =$query;
			$Ltype ='query';
		}	
		//aggiorno i record visualizzati chiamando nuovamente la funzione con querytype = 1
		$QueryType = 1;
		SendResponse($QueryType , $con,$Ltype,$log);
	}
	else
	{
		
	 	$query = AddParams($QueryType);	
	 	$result = mysqli_query($con,$query);
		$log;
		$Ltype;
		if($result)
		{	
			if($message == 'empty')
			{
				$log=$query;
				$Ltype='query';
			}
			else
			{
				$log=$message;
				$Ltype=$type;
			}
		}
		else
		{
			if($message == 'empty')
			{
				$log='esecuzione query fallita : '.mysqli_error($con).'</p>' ;	
				$Ltype='qerr';
			}
			else
			{
				$log=$message;
				$Ltype=$type;
			}
		
		}
	 	PrintResult($result,$log,$Ltype);
	}
	
}



//funzione per il ritorno dei valori
//genera la risposta in formato xml 
function PrintResult($result,$log,$type)
{ 	
	//nuova funzione adattata all'utilizzo di xml 
	header( "content-type: application/xml; charset=UTF-8" );	
	$xmlDoc= new DOMDocument('1.0','UTF-8');
	$xmlDoc->formatOutput = true;
	$xmlRoot = $xmlDoc->createElement('xml');
	$xmlRoot= $xmlDoc->appendChild($xmlRoot);
	$xmlResult = $xmlDoc->createElement('result');
	$xmlRoot->appendChild($xmlResult);
	$int = '<th>Id</th><th>Nome</th><th>Marca</th><th>Magazzino</th><th>Prezzo Acquisto</th><th>Iva</th>'; 

	$pint = $xmlDoc->createTextNode($int);
	$xmlResult->appendChild($pint);
	while($row = mysqli_fetch_array($result))
	{	
		$e ='<tr>'.'<td>'.$row['Id'].'</td>'.'<td>'.$row['Nome'].'</td>'.'<td>'.$row['Marca'].'</td>'.'<td>'.$row['Magazzino'].'</td>'.'<td>'.$row['Prezzo_Acquisto'].'</td>'.'<td>'.$row['Iva'].'</td>'.'</tr>';
		$p = $xmlDoc->createTextNode($e);
		$xmlResult->appendChild($p);
	}

	$xmlLog = $xmlDoc->createElement('log',$log);
	$xmlRoot->appendChild($xmlLog);
	$xmlLType = $xmlDoc->createElement('type',$type);
	$xmlRoot->appendChild($xmlLType);

	//stampa del file xml
	echo $xmlDoc->saveXML();

}



//funzione che crea la query a partira dai dati inviati al server
function AddParams($QueryType)
{
	//global $parameter_name; ----->non funziona 
	$parameter_name = array('Nome','Marca','Magazzino','PrezzoAcquisto','Iva');
	//carico il database
	if($QueryType ==1)
	{
		$query_1 = 'SELECT * FROM '.TB;
		return $query_1;
	}
	
	//cerco un valore nel database
	if($QueryType == 2)
	{
	$query_2 = 'SELECT * FROM '.TB.' WHERE ';
	$tmp=0;
	foreach($parameter_name as $value)
	{
		if($_POST[$value]!= NULL ||$_POST[$value]!= '') //---->devo controllare che contenga almeno un carattere
		{
			$tmp++;
			if($tmp==1)
			{
				$query_2.=$value.'='.'"'.$_POST[$value].'"'.' ';
			}
			else
			{
				$query_2.='AND '.$value.'='.'"'.$_POST[$value].'"'.' ';
			}
		}		
	}
	return $query_2;
	}
	
	
	//aggiungo un nuovo record
	if($QueryType==3)
	{
		$query_3 = 'INSERT INTO '.TB.' VALUES(DEFAULT,';
	
		foreach($parameter_name as $value)
		{
			if($_POST[$value])
			{
				$query_3.='"'.$_POST[$value].'"';
			}
			else
			{
				$query_3.='"'.'NULL'.'"';
			}
			if($value != $parameter_name[count($parameter_name)-1])
			{
				$query_3.=',';
			}	
		}
		$query_3 .=')';
		return $query_3;	
	}


	//rimuovo il record con id Id
	if($QueryType==4)
	{
		$query_4 = 'DELETE FROM '.TB.' WHERE Id="'.$_POST['Id'].'"';
		return $query_4;
	}


	//aggiorno il record con id Id
	if($QueryType==5)
	{
		$query_5 = 'UPDATE '.TB.' SET ' ;
		$tmp1 =0;
		foreach($parameter_name as $value)
		{
			if($_POST[$value]!= NULL ||$_POST[$value]!= '') 
			{
				$tmp1++; 
				if($tmp1==1)
				{
					$query_5.=$value.'='.'"'.$_POST[$value].'"'.' ';
				}	
				else
				{
					$query_5.=', '.$value.'='.'"'.$_POST[$value].'"'.' ';
				}		
			}
		}
		$query_5 .=' WHERE Id="'.$_POST['Id'].'"';
		return $query_5;
	}
}
 
?>
