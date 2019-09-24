-- MySQL Script generated by MySQL Workbench
-- Tue Sep 24 22:40:37 2019
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema quizwars
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema quizwars
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `quizwars` DEFAULT CHARACTER SET utf8 ;
USE `quizwars` ;

-- -----------------------------------------------------
-- Table `quizwars`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizwars`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `telegramId` BIGINT(1) NOT NULL,
  `score` BIGINT(1) NULL DEFAULT 0,
  `username` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `telegramId_UNIQUE` (`telegramId` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `quizwars`.`task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizwars`.`task` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `correctOption` VARCHAR(10) NOT NULL,
  `name` VARCHAR(100) NULL,
  `content` VARCHAR(1000) NOT NULL,
  `option1` VARCHAR(500) NULL,
  `option2` VARCHAR(500) NULL,
  `option3` VARCHAR(500) NULL,
  `option4` VARCHAR(500) NULL,
  `worth` BIGINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `quizwars`.`user_task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizwars`.`user_task` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `userId` INT(11) NOT NULL,
  `taskId` INT(11) NOT NULL,
  `hasCreated` TINYINT NULL DEFAULT NULL,
  `isSolved` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `userId_idx` (`userId` ASC),
  INDEX `taskId_idx` (`taskId` ASC),
  CONSTRAINT `userId`
    FOREIGN KEY (`userId`)
    REFERENCES `quizwars`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `taskId`
    FOREIGN KEY (`taskId`)
    REFERENCES `quizwars`.`task` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;