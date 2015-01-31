<?php


function Login()
{
	$con = mysqli_connect(HOST,USR,PSWD,DB);
	$query='SELECT * FROM '.TBU.' WHERE Username="'.$_POST['usr'].'"';
	$result = mysqli_fetch_array(mysqli_query($con,$query));
	$error;
	if(!$result['Username'])
	{
		$error='username non valido';
	}
	else
	{
		if($result['Password']==md5($_POST['pwd']))
		{
			session_start();
			$_SESSION['User']=$result['Username'];
			$_SESSION['Type']=$result['Administrator'];
			header('Location: newLayout.html');
		}
		else
		{
			$error='username o password non validi';
		}
	}
	mysqli_close($con);
	return $error;
} 

function rememberMe()
{
	session_start();
	if(isset($_SESSION['User']) && isset($_SESSION['Type']))
	{
			header('Location: newLayout.html');	
	}
	else
	{
		session_unset();
	}
}
?>
