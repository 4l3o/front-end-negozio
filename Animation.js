//variabili di sincronizzazione
var menuStatus="closed";
var panelStatus="prodotti";


function prodotti()
{
	if(panelStatus!="prodotti")
	{
		panelStatus="prodotti";
		currentTable="Prodotti";
		if(menuStatus =="open")
		{
			menuClose();
		}
	
		function wait()
		{
			if(menuStatus=="closed")
			{
				clearInterval(id);
				setDisplay("utenti","prodotti");	
				LoadDatabase(myxmlhttp);
			}
		}	
		id=setInterval(wait,15);
	}	
}
function utenti()
{
	if(panelStatus!="utenti")
	{
		panelStatus="utenti";
		currentTable="Utenti";
		if(menuStatus =="open")
		{
			menuClose();
		}
	
		function wait()
		{
			if(menuStatus=="closed")
			{
				clearInterval(id);
				setDisplay("utenti","prodotti");	
				LoadDatabase(myxmlhttp);
			}
		}	
		id=setInterval(wait,15);
	}	

}
function statistiche()
{

}
function Menu()
{
	if(menuStatus=="closed")
	{
		menuOpen();
	}	
	else
	{
		menuClose();
	}
}
			
function menuClose()
{
	
	if(menuStatus=="open")
	{
	//	menuStatus="closed";
		var menu = document.getElementById("ActionMenu");
		var panel = document.getElementById("vPanel");	
		var mWidth=15;
		var pWidth=84;
		function move()
		{
				mWidth--;
				pWidth++;
				menu.style.width=mWidth+"%";
				panel.style.width=pWidth+"%";
				if(mWidth == 0 )
				{
					menuStatus="closed";
					clearInterval(id);
					menu.style.display="none";
				}
			}
		}
		var id =setInterval(move,10);
	

}
function menuOpen()
{
	if(menuStatus=="closed")
	{
	//	menuStatus="open";
		var menu = document.getElementById("ActionMenu");
	//	menu.style.display="initial";
		var panel = document.getElementById("vPanel");	
		var mWidth=0;
		var pWidth=99;
		function move()
		{
				menu.style.display="initial";
				mWidth++;
				pWidth--;
				menu.style.width=mWidth+"%";
				panel.style.width=pWidth+"%";
				if(mWidth == 15 )
				{
					menuStatus="open";
					clearInterval(id);
				}
			}
		}
		var id =setInterval(move,10);

	
}

function setDisplay()
{
	for(var i =0;i<arguments.length;i++)
	{
		var work  = document.getElementById(arguments[i]);
		if(work)
		{
			if(work.style.display=="none")
			{
				work.style.display="initial";
			}
			else
			{
				work.style.display="none";
			}
		}
	}
}
