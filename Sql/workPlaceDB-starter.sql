-- Create the main database for the application
CREATE DATABASE `workPlaceTrackingDB`;
USE `workPlaceTrackingDB`;

-- Worker Table: Stores information about individual workers.
CREATE TABLE `worker` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for each worker
    `name` TEXT NOT NULL, -- Worker's full name
    `email` TEXT NOT NULL, -- Worker's email address
    `phone` VARCHAR(20) NOT NULL, -- Worker's phone number
    `picture` TEXT NOT NULL, -- Path or URL to the worker's profile picture
    `salary` DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Worker's salary
    `password` TEXT NOT NULL, -- Worker's password (hashed)
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record creation timestamp
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Company Table: Stores details about companies.
CREATE TABLE `company` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for each company
    `businessId` INT NOT NULL, -- Business registration number or unique company ID
    `name` TEXT NOT NULL, -- Company name
    `address` TEXT NOT NULL, -- Company physical address
    `picture` TEXT NOT NULL, -- Path or URL to the company's logo or picture
    `phone` VARCHAR(20) NOT NULL, -- Company contact phone number
    `email` TEXT NOT NULL, -- Company email address
    `password` TEXT NOT NULL, -- Company password (hashed)
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record creation timestamp
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Department Table: Represents departments within companies.
CREATE TABLE `department` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for each department
    `name` VARCHAR(255) NOT NULL, -- Department name
    `company_id` INT NOT NULL, -- Associated company
    FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) -- Foreign key to the company table
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Position Table: Stores job positions within departments.
CREATE TABLE `position` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for each position
    `title` VARCHAR(255) NOT NULL, -- Position title
    `department_id` INT NOT NULL, -- Associated department
    FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) -- Foreign key to the department table
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Worker_Company Join Table: Manages many-to-many relationships between workers and companies.
CREATE TABLE `worker_company` (
    `worker_id` INT NOT NULL,
    `company_id` INT NOT NULL,
    `department_id` INT, -- Optional: Department within the company
    `position_id` INT, -- Optional: Position within the company
    `is_approved` BOOLEAN NOT NULL DEFAULT FALSE, -- Whether the company has approved the worker
    PRIMARY KEY (`worker_id`, `company_id`),
    FOREIGN KEY (`worker_id`) REFERENCES `worker`(`id`),
    FOREIGN KEY (`company_id`) REFERENCES `company`(`id`),
    FOREIGN KEY (`department_id`) REFERENCES `department`(`id`),
    FOREIGN KEY (`position_id`) REFERENCES `position`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- WorkArea Table: Defines specific work areas within or associated with companies.
CREATE TABLE `workArea` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for each work area
    `company_id` INT NOT NULL, -- Company that owns or operates the work area
    `name` TEXT NOT NULL, -- Name of the work area
    `description` TEXT NOT NULL, -- Description of the work area
    `latitude` DECIMAL(10, 8) NOT NULL DEFAULT 0.00000000, -- Geographical latitude
    `longitude` DECIMAL(11, 8) NOT NULL DEFAULT 0.00000000, -- Geographical longitude
    `radius` DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Radius defining the work area's coverage
    `access_code` VARCHAR(255) NOT NULL, -- Access code required for workers to join the work area
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record creation timestamp
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Worker_WorkArea Join Table: Manages the association between workers and their work areas.
CREATE TABLE `worker_workArea` (
    `worker_id` INT NOT NULL,
    `workArea_id` INT NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT FALSE, -- Whether the worker is active in the work area
    `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the worker
    PRIMARY KEY (`worker_id`, `workArea_id`),
    FOREIGN KEY (`worker_id`) REFERENCES `worker`(`id`),
    FOREIGN KEY (`workArea_id`) REFERENCES `workArea`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
