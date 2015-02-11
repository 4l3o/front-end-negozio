//variabili di sincronizzazione
var menuStatus="closed";
var panelStatus="prodotti";
var currentMenu;

function prodotti()
{
	if(panelStatus!="prodotti")
	{
		if(panelStatus=="statistiche")
		{
			setDisplay("vPanel");
			clearDisplay("statistiche");
			displayMenuButtonDisabler("Search","Add","Remove","Update");	
			optionMenuButtonDisabler("Statistiche");
		}
		if(panelStatus=="utenti")
		{	
			optionMenuButtonDisabler("Utenti");
		}

		optionMenuButtonDisabler("Prodotti");
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
				setDisplay("prodotti");	
				clearDisplay("utenti");
				LoadDatabase(myxmlhttp);
			}
		}	
		id=setInterval(wait,15);
	}	
	else
	{
		LoadDatabase(myxmlhttp);
	}
}
function utenti()
{
	if(panelStatus!="utenti")
	{
		if(panelStatus=="statistiche")
		{
			setDisplay("vPanel");
			clearDisplay("statistiche");
			displayMenuButtonDisabler("Search","Add","Remove","Update");	
			optionMenuButtonDisabler("Statistiche");
		}
		if(panelStatus=="prodotti")
		{	
			optionMenuButtonDisabler("Prodotti");
		}

		optionMenuButtonDisabler("Utenti");
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
				setDisplay("utenti");
				clearDisplay("prodotti");	
				LoadDatabase(myxmlhttp);
			}
		}	
		id=setInterval(wait,15);
	}	
	else
	{
		LoadDatabase(myxmlhttp);
	}

}
function statistiche()
{
	if(panelStatus!="statistiche")
	{
		if(panelStatus=="utenti")
		{
			optionMenuButtonDisabler("Utenti");
		}
		if(panelStatus=="prodotti")
		{	
			optionMenuButtonDisabler("Prodotti");
		}
		optionMenuButtonDisabler("Statistiche");
		panelStatus="statistiche";
		if(menuStatus =="open")
		{
			menuClose();
		}
	
		function wait()
		{
			if(menuStatus=="closed")
			{
				clearInterval(id);
				setDisplay("statistiche");
				clearDisplay("vPanel");	
				displayMenuButtonDisabler("Search","Add","Remove","Update");	
			}
		}	
		id=setInterval(wait,15);
	}	
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
					currentMenu="";
					menu.style.display="none";
				}
			}
		}
		var id =setInterval(move,10);
	

}
function menuOpen()
{
	if(panelStatus !="statistiche")
	{
		if(menuStatus=="closed" )
		{
		var menu = document.getElementById("ActionMenu");
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
}

function setDisplay()
{
	for(var i =0;i<arguments.length;i++)
	{
		var work  = document.getElementById(arguments[i]);
		if(work)
		{	
			work.style.display="initial";	
		}
	}
}
function clearDisplay()
{
	for(var i =0;i<arguments.length;i++)
	{
		var work  = document.getElementById(arguments[i]);
		if(work)
		{	
			work.style.display="none";	
		}
	}
}

function optionMenuButtonDisabler(buttonId)
{
	work=document.getElementById(buttonId)
	{
		if(work.getAttribute("class")=="optionMenuButton")
		{
			work.setAttribute("class","disabled optionMenuButton");
		}
		else
		{
			work.setAttribute("class","optionMenuButton");
		}
	}
}

function displayMenuButtonDisabler()
{
	for(var i=0;i<arguments.length;i++)
	{
		work=document.getElementById(arguments[i]);	
		if(work)
		{
			workClass = work.getAttribute("class");
			if(workClass=="displayMenuButton")
			{
				work.setAttribute("class","disabled displayMenuButton");
			}
			else
			{
				work.setAttribute("class","displayMenuButton");
			}
		}
	}
		
}

function selectInput(ElemReference)
{
	if(menuStatus =="closed")
	{
		Menu();
		work=ElemReference.getAttribute("id");
		switch (work)
		{
			case "Search":
				currentMenu="Search";
				if(panelStatus =="prodotti")
				{
					setDisplay("inputId","inputNome_Prodotto","inputMarca","inputMagazzino","inputPrezzo_Acquisto","inputIva");
					setDisplay("buttonprodottiSearch");
					clearDisplay("buttonprodottiAdd","buttonprodottiRemove","buttonprodottiUpdate");
				}
				else
				{
					setDisplay("inputUsername","inputPassword","inputAdministrator","inputNome","inputCognome");
					setDisplay("buttonutentiSearch");
					clearDisplay("buttonutentiAdd","buttonutentiRemove","buttonutentiUpdate");
				}
			break;
			case "Add":
				currentMenu="Add";
				if(panelStatus =="prodotti")
				{	
					setDisplay("inputNome_Prodotto","inputMarca","inputMagazzino","inputPrezzo_Acquisto","inputIva");
					clearDisplay("inputId");
					setDisplay("buttonprodottiAdd");
					clearDisplay("buttonprodottiSearch","buttonprodottiRemove","buttonprodottiUpdate");


				}
				else
				{
					setDisplay("inputUsername","inputPassword","inputAdministrator","inputNome","inputCognome");
					setDisplay("buttonutentiAdd");
					clearDisplay("buttonutentiSearch","buttonutentiRemove","buttonutentiUpdate");
				}
			break;

			case "Remove":
				currentMenu="Remove";
				if(panelStatus =="prodotti")
				{	
					setDisplay("inputId");
					clearDisplay("inputNome_Prodotto","inputMarca","inputMagazzino","inputPrezzo_Acquisto","inputIva");
					setDisplay("buttonprodottiRemove");
					clearDisplay("buttonprodottiAdd","buttonprodottiSearch","buttonprodottiUpdate");


				}
				else
				{
					setDisplay("inputUsername");
					clearDisplay("inputPassword","inputAdministrator","inputNome","inputCognome");
					setDisplay("buttonutentiRemove");
					clearDisplay("buttonutentiAdd","buttonutentiSearch","buttonutentiUpdate");


				}
				break;
			case "Update":
				currentMenu="Update";
				if(panelStatus =="prodotti")
				{	
					setDisplay("inputId","inputNome_Prodotto","inputMarca","inputMagazzino","inputPrezzo_Acquisto","inputIva");
					setDisplay("buttonprodottiUpdate");
					clearDisplay("buttonprodottiAdd","buttonprodottiRemove","buttonprodottiSearch");

				}
				else
				{
					setDisplay("inputUsername","inputPassword","inputAdministrator","inputNome","inputCognome");
					setDisplay("buttonutentiUpdate");
					clearDisplay("buttonutentiAdd","buttonutentiRemove","buttonutentiSearch");

				}
				break;

		}
	}
	else
	{
		Menu();
		if(currentMenu !=ElemReference.getAttribute("id"))
		{
			function wait()
			{
				if(menuStatus=="closed")
				{
					clearInterval(id);
					selectInput(ElemReference);
				}
			}	
			id=setInterval(wait,15);
	
		}
	}
}
