<?php
		require_once('config.php');
		require('autenticazione.php');
		rememberMe();
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
		<link rel="stylesheet" type="text/css" href="ElemStyle.css">
		<link rel="stylesheet" type="text/css" href="logStyle.css">
		<title>Magazzino</title>
	</head>
	<body>
		<div class="loginBox">
		<h2>Login</h2>
		<form id="autenticazione" action="<?php echo(htmlspecialchars($_SERVER['PHP_SELF']));?>" method="post">
			<label for="usr">Username:</label>
			<input type="text" name="usr" id="usr" required >
			<label for="pwd">Password:</label>
			<input type="password" name="pwd" id="pwd" required>
			<input type="submit" name="submit" class="myButton loginButton"  value="login">
		</form>
		<span class="error"><?php echo $error;?></span>
		</div>
	</body>
</html>
