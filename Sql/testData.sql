-- Insert into `company`
INSERT INTO `company` (`businessId`, `name`, `address`, `phone`, `email`, `password`) VALUES
(1001, 'Tech Innovations', '123 Tech Lane', '555-0101', 'info@techinnovations.com', 'hashed_password');

-- Insert into `department`
INSERT INTO `department` (`name`, `company_id`) VALUES
('Development', 1);

-- Insert into `position`
INSERT INTO `position` (`title`, `department_id`) VALUES
('Senior Developer', 1);

-- Insert into `worker`
INSERT INTO `worker` (`name`, `email`, `phone`, `picture`, `salary`, `password`) VALUES
('John Doe', 'john.doe@example.com', '555-0202', 'path/to/picture', 75000.00, 'hashed_password');

-- Assume company with ID 1 and worker with ID 1 exists for these inserts
-- Insert into `worker_company`
INSERT INTO `worker_company` (`worker_id`, `company_id`, `department_id`, `position_id`, `is_approved`) VALUES
(1, 1, 1, 1, TRUE);

-- Insert into `workArea`
INSERT INTO `workArea` (`company_id`, `name`, `description`, `latitude`, `longitude`, `radius`, `access_code`) VALUES
(1, 'Main Office', 'Headquarters of Tech Innovations', 40.712776, -74.005974, 100.00, 'ACCESS123');

-- Insert into `worker_workArea`
INSERT INTO `worker_workArea` (`worker_id`, `workArea_id`, `is_active`, `joined_at`) VALUES
(1, 1, TRUE, CURRENT_TIMESTAMP);
