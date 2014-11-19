<?php 
//costanti contenenti le informazioni per l'accesso al database
//Nome del database
define('DB', 'DB_Pweb');
//tabella all'interno del database
define('TB','Prodotti');
//colonne della tabella e proprietà
$parameter_name = array('Nome'=>'[^A-z,0-9,_]','Marca'=>'[^A-z,0-9,_]','Prezzo_Vendita'=>'[^0-9]','Prezzo_Acquisto'=>'[^0-9]','Iva'=>'[^0-9]');
//Host , Username e Password del database
define('HOST','localhost');
define('USR', 'root');
define('PSWD', 'root');
?>
