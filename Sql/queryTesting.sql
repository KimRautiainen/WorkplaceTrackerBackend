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