<?php


function Login()
{
	$con = mysqli_connect(HOST,USR,PSWD,DB);
	$query='SELECT * FROM '.TBU.' WHERE USR="'.$_POST['usr'].'"';
	$result = mysqli_fetch_array(mysqli_query($con,$query));
	$error;
	if(!$result['USR'])
	{
		$error='username non valido';
	}
	else
	{
		if($result['PWD']==md5($_POST['pwd']))
		{
			session_start();
			$_SESSION['User']=$result['USR'];
			$_SESSION['Type']=$result['TYPE'];
			header('Location: FrontEnd.html');
		}
		else
		{
			$error='username o password non validi';
		}
	}
	mysqli_close($con);
	return $error;
} 

?>
