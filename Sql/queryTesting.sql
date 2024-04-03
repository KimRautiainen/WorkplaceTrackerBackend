-- Query to get workers and their companies
SELECT w.`name` AS WorkerName, c.`name` AS CompanyName
FROM `worker` w
JOIN `worker_company` wc ON w.`id` = wc.`worker_id`
JOIN `company` c ON wc.`company_id` = c.`id`
WHERE wc.`is_approved` = TRUE;

-- Query to get workers, their positions, and departments
SELECT w.`name` AS WorkerName, p.`title` AS PositionTitle, d.`name` AS DepartmentName
FROM `worker` w
JOIN `worker_company` wc ON w.`id` = wc.`worker_id`
JOIN `position` p ON wc.`position_id` = p.`id`
JOIN `department` d ON wc.`department_id` = d.`id`;

--  Retrieve All Work Logs for a Specific Worker
SELECT 
    wl.`start_time`, 
    wl.`end_time`, 
    wl.`hours_worked`, 
    wl.`date_recorded`, 
    wl.`work_type`, 
    wl.`comment`, 
    wl.`photo_url`
FROM `work_log` wl
WHERE wl.`worker_id` = 1; -- Change the worker_id as needed

-- List All Workers, Their Companies, and Work Areas
SELECT 
    w.`name` AS WorkerName, 
    c.`name` AS CompanyName, 
    wa.`name` AS WorkAreaName,
    wc.`is_approved`,
    www.`is_active`
FROM `worker` w
JOIN `worker_company` wc ON w.`id` = wc.`worker_id`
JOIN `company` c ON wc.`company_id` = c.`id`
JOIN `worker_workArea` www ON w.`id` = www.`worker_id`
JOIN `workArea` wa ON www.`workArea_id` = wa.`id`;

-- Retrieve Documents and Photos Posted to a Work Area
SELECT 
    wf.`title`, 
    wf.`file_url`, 
    wf.`file_type`, 
    wf.`description`, 
    wf.`uploaded_at`
FROM `workArea_files` wf
WHERE wf.`workArea_id` = 1; 

-- Get Work Logs with Attached Comments or Photos
SELECT 
    wl.`worker_id`, 
    w.`name` AS WorkerName,
    wl.`date_recorded`, 
    wl.`comment`, 
    wl.`photo_url`
FROM `work_log` wl
JOIN `worker` w ON wl.`worker_id` = w.`id`
WHERE wl.`comment` IS NOT NULL OR wl.`photo_url` IS NOT NULL;

--List Workers with Their Positions and Departments in a Specific Company
SELECT 
    w.`name` AS WorkerName, 
    p.`title` AS PositionTitle, 
    d.`name` AS DepartmentName,
    c.`name` AS CompanyName
FROM `worker` w
JOIN `worker_company` wc ON w.`id` = wc.`worker_id`
JOIN `position` p ON wc.`position_id` = p.`id`
JOIN `department` d ON wc.`department_id` = d.`id`
JOIN `company` c ON d.`company_id` = c.`id`
WHERE c.`id` = 2; -- Specify the company ID
