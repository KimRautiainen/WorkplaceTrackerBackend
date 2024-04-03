-- Insert into `company`
INSERT INTO `company` (`businessId`, `name`, `address`, `phone`, `email`, `password`, `picture`) VALUES
(1001, 'Tech Innovations', '123 Tech Lane', '555-0101', 'info@techinnovations.com', 'hashed_password', 'url/to/company_logo.jpg'),
(1002, 'Data Analytics Inc.', '456 Data Drive', '555-0102', 'contact@dataanalytics.com', 'hashed_password', 'url/to/data_analytics_logo.jpg');
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

-- Insert test data into `work_log`
INSERT INTO `work_log` (`worker_id`, `company_id`, `workArea_id`, `start_time`, `end_time`, `hours_worked`, `date_recorded`, `work_type`, `comment`, `photo_url`) VALUES
(1, 1, 1, '2023-10-01 08:00:00', '2023-10-01 16:00:00', '08:00:00', '2023-10-01', 'regular', 'Completed project X tasks', 'url/to/photo1.jpg'),
(1, 1, 1, '2023-10-02 09:00:00', '2023-10-02 17:00:00', '08:00:00', '2023-10-02', 'regular', 'Worked on project Y', NULL);

-- Insert test data into `workArea_files`
INSERT INTO `workArea_files` (`workArea_id`, `title`, `file_url`, `file_type`, `description`, `uploaded_at`) VALUES
(1, 'Safety Guidelines', 'url/to/safety_guidelines.pdf', 'document', 'The safety guidelines for the Main Office', CURRENT_TIMESTAMP),
(1, 'Office Layout', 'url/to/office_layout.jpg', 'photo', 'The layout plan of the Main Office', CURRENT_TIMESTAMP);

-- Additional departments for the new company
INSERT INTO `department` (`name`, `company_id`) VALUES
('Data Science', 2),
('Marketing', 2);

-- Additional positions for the new departments
INSERT INTO `position` (`title`, `department_id`) VALUES
('Data Scientist', 2),
('Marketing Manager', 3);

-- Additional workers
INSERT INTO `worker` (`name`, `email`, `phone`, `picture`, `salary`, `password`) VALUES
('Jane Smith', 'jane.smith@example.com', '555-0203', 'path/to/picture2', 85000.00, 'hashed_password'),
('Erik Brown', 'erik.brown@example.com', '555-0204', 'path/to/picture3', 65000.00, 'hashed_password');

-- Associating new workers with the company and work area
INSERT INTO `worker_company` (`worker_id`, `company_id`, `department_id`, `position_id`, `is_approved`) VALUES
(2, 2, 2, 2, TRUE),
(3, 2, 3, 3, TRUE);

INSERT INTO `worker_workArea` (`worker_id`, `workArea_id`, `is_active`, `joined_at`) VALUES
(2, 1, TRUE, CURRENT_TIMESTAMP),
(3, 1, TRUE, CURRENT_TIMESTAMP);
