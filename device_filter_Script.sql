-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema devicefilter_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema devicefilter_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `devicefilter_db` DEFAULT CHARACTER SET utf8 ;
USE `devicefilter_db` ;

-- -----------------------------------------------------
-- Table `devicefilter_db`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devicefilter_db`.`category` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `cname` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cname_UNIQUE` (`cname` ASC) VISIBLE,
  UNIQUE INDEX `cname_UN` (`cname` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 94
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `devicefilter_db`.`device_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devicefilter_db`.`device_type` (
  `device_id` INT(11) NOT NULL AUTO_INCREMENT,
  `device_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`device_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `devicefilter_db`.`feature_spec`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devicefilter_db`.`feature_spec` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `model_id` INT(11) NOT NULL,
  `Display` DOUBLE NULL DEFAULT 1,
  `Storage` INT(11) NULL DEFAULT 1,
  `Size` INT(11) NULL DEFAULT 1,
  `Camera` DOUBLE NULL DEFAULT 1,
  `Battery` DOUBLE NULL DEFAULT 1,
  `Processor` VARCHAR(255) NULL DEFAULT NULL,
  `ROM` VARCHAR(255) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1369
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `devicefilter_db`.`model`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devicefilter_db`.`model` (
  `model_id` INT(11) NOT NULL AUTO_INCREMENT,
  `model_name` VARCHAR(45) NOT NULL,
  `price` FLOAT(10,2) NOT NULL,
  `device_id` INT(11) NOT NULL,
  PRIMARY KEY (`model_id`),
  INDEX `device_id` (`device_id` ASC) VISIBLE,
  CONSTRAINT `device_id`
    FOREIGN KEY (`device_id`)
    REFERENCES `devicefilter_db`.`device_type` (`device_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2267
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `devicefilter_db`.`productimg`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devicefilter_db`.`productimg` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `model_id` VARCHAR(45) NOT NULL,
  `File_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 188
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `devicefilter_db`.`sliderrange`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devicefilter_db`.`sliderrange` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `min` INT(11) NOT NULL,
  `max` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `devicefilter_db`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devicefilter_db`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
