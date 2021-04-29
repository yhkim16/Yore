CREATE DATABASE IF NOT EXISTS `yore`;
CREATE TABLE IF NOT EXISTS `yore`.`menu` (
  `name` VARCHAR(20) NOT NULL,
  `tools` INT NULL,
  `difficulty` INT NULL,
  `youtube` VARCHAR(45) NULL,
  `recipe` MEDIUMTEXT NULL,
  `ingredients` JSON NULL,
  PRIMARY KEY (`name`));
