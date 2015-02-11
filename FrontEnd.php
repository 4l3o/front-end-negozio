<?php 

require_once('config.php');
include('library.php');
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

?>
