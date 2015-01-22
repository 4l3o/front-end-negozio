
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


CREATE DATABASE IF NOT EXISTS `DB_Pweb` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `DB_Pweb`;
CREATE TABLE `Prodotti` (
`Id` int(11) NOT NULL,
  `Nome` varchar(16) NOT NULL,
  `Marca` varchar(16) NOT NULL,
  `Magazzino` int(11) NOT NULL,
  `Prezzo_Acquisto` decimal(5,3) NOT NULL,
  `Iva` int(3) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

INSERT INTO `Prodotti` (`Id`, `Nome`, `Marca`, `Magazzino`, `Prezzo_Acquisto`, `Iva`) VALUES
(1, 'hello', 'world', 1, 1.100, 1),
(2, 'prova', 'prova', 1, 1.000, 1),
(3, 'prova 1', 'prova 1', 1, 0.100, 10),
(4, 'hello world', 'prova', 3, 2.000, 4);

ALTER TABLE `Prodotti`
 ADD PRIMARY KEY (`Id`), ADD UNIQUE KEY `Nome` (`Nome`);

ALTER TABLE `Prodotti`
MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
