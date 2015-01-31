<?php 

//creo una connessione al database
require_once('config.php');

$parameter_name_prodotti = array('Id','Nome_Prodotto','Marca','Magazzino','Prezzo_Acquisto','Iva');
$parameter_name_utenti = array('Username','Password','Administrator','Nome','Cognome');
$QueryType = $_POST['query'];

switch($QueryType)
{
	case 'init':
		Init();
		break;
	case 'logout':
		session_start();
		session_destroy();
		break;

	default :
		if(checkUser($QueryType))
		{
			if($_POST['currentTable']=='Prodotti')
			{
				SendResponse($QueryType,$parameter_name_prodotti);
			}
			else
			{
				SendResponse($QueryType,$parameter_name_utenti);
			}	
		}
		break;
}




//------------------------------------------------------------------------------

function SendResponse($QueryType ,$index,$type='empty',$message='empty' )
{

	$con= mysqli_connect(HOST,USR,PSWD,DB);
	if($QueryType == 'add' || $QueryType == 'remove' || $QueryType == 'update')
	{
		
		$query = AddParams($QueryType ,$index);
		$log;	
		$Ltype;
		if(!mysqli_query($con,$query))
		{
			$log='esecuzione query('.$query.') fallita : '.mysqli_error($con);	
			$Ltype='qerr';
		}
		else
		{
			$log =$query;
			$Ltype ='query';
		}	
		//aggiorno i record visualizzati chiamando nuovamente la funzione con querytype = 1
		$QueryType = 'load';
		SendResponse($QueryType ,$index,$Ltype,$log);
		
	}
	else
	{
		
	 	$query = AddParams($QueryType,$index);	
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
				$log='esecuzione query ('.$query.') fallita : '.mysqli_error($con).'</p>' ;	
				$Ltype='qerr';
			}
			else
			{
				$log=$message;
				$Ltype=$type;
			}
		
		}
	 	PrintResult($result,$log,$Ltype,$index);
	}

	mysqli_close($con);
	
}



//funzione per il ritorno dei valori
//genera la risposta in formato xml 
function PrintResult($result,$log,$type,$index)
{ 	
	 
	header( "content-type: application/xml; charset=UTF-8" );	
	$xmlDoc= new DOMDocument('1.0','UTF-8');
	$xmlDoc->formatOutput = true;
	$xmlRoot = $xmlDoc->createElement('xml');
	$xmlRoot= $xmlDoc->appendChild($xmlRoot);
	$xmlResult = $xmlDoc->createElement('result');
	$xmlRoot->appendChild($xmlResult);
	foreach($index as $value)
	{
		$int =$xmlDoc->createElement('int');
		$pint=$xmlDoc->createTextNode($value);
		$int->appendChild($pint);
		$xmlResult->appendChild($int);
	}
	while($row = mysqli_fetch_array($result))
	{	
		$rowElem =$xmlDoc->createElement('row');
		foreach($index as $value)
		{
			
			$colElem =$xmlDoc->createElement('col');
			$valElem=$xmlDoc->createTextNode($row[$value]);
			$colElem->appendChild($valElem);
			$rowElem->appendChild($colElem);
		}
		$xmlResult->appendChild($rowElem);
	}

	$xmlLog = $xmlDoc->createElement('log',$log);
	$xmlRoot->appendChild($xmlLog);
	$xmlLType = $xmlDoc->createElement('type',$type);
	$xmlRoot->appendChild($xmlLType);

	//stampa del file xml
	echo $xmlDoc->saveXML();

}



//funzione che crea la query a partira dai dati inviati al server
function AddParams($QueryType,$index)
{
	$table=$_POST['currentTable'];
	//global $parameter_name; ----->non funziona 
//	$parameter_name = array('Nome','Marca','Magazzino','Prezzo_Acquisto','Iva');
	//carico il database
	switch($QueryType)
	{
	/*if($QueryType =='load')
	{
		$query_1 = 'SELECT * FROM '.$table;
		return $query_1;
	}*/
	case'load':
		$query_1 = 'SELECT * FROM '.$table;
		return $query_1;
		break;
	case'search':
		$query_2 = 'SELECT * FROM '.$table.' WHERE ';
		$tmp=0;
		foreach($index as $value)
		{
			if($_POST[$value]!= NULL ||$_POST[$value]!= '') 
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
		break;

	case'add':
		$query_3 = 'INSERT INTO '.$table.' VALUES(';
		if($table =='Prodotti')
			$query_3.='DEFAULT,';
	
		foreach($index as $value)
		{
			if($value != 'Id')
			{
				if($_POST[$value])
				{
					if($value=='Password')
					{
						$pwd = md5($_POST[$value]);
						$query_3.='"'.$pwd.'"';
					}
					else
					{
						$query_3.='"'.$_POST[$value].'"';
					}
				}
				else
				{
					$query_3.='"'.'NULL'.'"';
				}
				if($value != $index[count($index)-1])
				{
					$query_3.=',';
				}	
			}
		}
		$query_3 .=')';
		return $query_3;	
		break;
	case'remove':
		$query_4 = 'DELETE FROM '.$table.' WHERE ';
		if($table == 'Prodotti')
			$query_4.='Id="'.$_POST['Id'].'"';
		else
			$query_4.='Username="'.$_POST['Username'].'"';

		return $query_4;
		break;
	case'update':
		$query_5 = 'UPDATE '.$table.' SET ' ;
		$tmp1 =0;
		foreach($index as $value)
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
					if($value=='Password')
					{
						$query_5.=', '.$value.'='.'"'.md5($_POST[$value]).'"'.' ';
					}
					else
					{
						$query_5.=', '.$value.'='.'"'.$_POST[$value].'"'.' ';
					}
				}		
			}
		}
		$query_5 .=' WHERE ';
		if($table == 'Prodotti')
			$query_5.='Id="'.$_POST['Id'].'"';
		else
			$query_5.='Username="'.$_POST['Username'].'"';
		return $query_5;
		break;
	
	//cerco un valore nel database
/*	if($QueryType == 'search')
	{
	$query_2 = 'SELECT * FROM '.$table.' WHERE ';
	$tmp=0;
	foreach($index as $value)
	{
		if($_POST[$value]!= NULL ||$_POST[$value]!= '') 
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
 */	
	
	//aggiungo un nuovo record
/*	if($QueryType=='add')
	{
		$query_3 = 'INSERT INTO '.$table.' VALUES(';
		if($table =='Prodotti')
			$query_3.='DEFAULT,';
	
		foreach($index as $value)
		{
			if($value != 'Id')
			{
				if($_POST[$value])
				{
					if($value=='Password')
					{
						$pwd = md5($_POST[$value]);
						$query_3.='"'.$_POST[$value].'"';
					}
					else
					{
						$query_3.='"'.$_POST[$value].'"';
					}
				}
				else
				{
					$query_3.='"'.'NULL'.'"';
				}
				if($value != $index[count($index)-1])
				{
					$query_3.=',';
				}	
			}
		}
		$query_3 .=')';
		return $query_3;	
	}


	//rimuovo il record con id Id
	if($QueryType=='remove')
	{
		$query_4 = 'DELETE FROM '.$table.' WHERE ';
		if($table == 'Prodotti')
			$query_4.='Id="'.$_POST['Id'].'"';
		else
			$query_4.='Username="'.$_POST['Username'].'"';

		return $query_4;
	}


	//aggiorno il record con id Id
	if($QueryType=='update')
	{
		$query_5 = 'UPDATE '.$table.' SET ' ;
		$tmp1 =0;
		foreach($index as $value)
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
					if($value=='Password')
					{
						$query_5.=', '.$value.'='.'"'.md5($_POST[$value]).'"'.' ';
					}
					else
					{
						$query_5.=', '.$value.'='.'"'.$_POST[$value].'"'.' ';
					}
				}		
			}
		}
		$query_5 .=' WHERE ';
		if($table == 'Prodotti')
			$query_5.='Id="'.$_POST['Id'].'"';
		else
			$query_5.='Username="'.$_POST['Username'].'"';


		return $query_5;
	}*/
	}
}

function Init()
{
	session_start();
	header( "content-type: application/xml; charset=UTF-8" );	
	$xmlDoc= new DOMDocument('1.0','UTF-8');
	$xmlDoc->formatOutput = true;
	$xmlRoot = $xmlDoc->createElement('xml');
	$xmlRoot= $xmlDoc->appendChild($xmlRoot);
	$xmlResult = $xmlDoc->createElement('USER');
	$xmlResult->nodeValue=$_SESSION['User'];
	$xmlRoot->appendChild($xmlResult);
	$xmlResult = $xmlDoc->createElement('TYPE');
	$xmlResult ->nodeValue=$_SESSION['Type'];
	$xmlRoot->appendChild($xmlResult);
	echo $xmlDoc->saveXML();
}

function checkUser($qType)
{
	session_start();
	$uType=$_SESSION['Type'];
	if($qType =='search'||$qType=='load')
	{
		return true;
	}
	else
	{
		if($uType=='1')
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}
 
?>
