<?php
		require_once('config.php');
		require('autenticazione.php');
		$error='';
		if($_SERVER['REQUEST_METHOD']== 'POST')
		{	
			$error=Login($error);
		}
	?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="author" content="Bachechi Andrea">
		<meta name="description" content="applicazione per la gestione di un magazzino">
		<title>Magazzino</title>
	</head>
	<body>

		<form id="autenticazione" action="<?php echo(htmlspecialchars($_SERVER['PHP_SELF']));?>" method="post">
			<input type="text" name="usr" id="usr" required >
			<input type="password" name="pwd" id="pwd" required>
			<input type="submit" name="submit"  value="login">
		</form>
		<span class="error"><?php echo $error;?></span>
	</body>
</html>
