-- Create the main issues table
CREATE TABLE IF NOT EXISTS issues (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_by VARCHAR(255) DEFAULT 'unknown',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) DEFAULT 'unknown',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the revisions table with foreign key
CREATE TABLE IF NOT EXISTS issue_revisions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    issue_id INT UNSIGNED NOT NULL,
    title VARCHAR(255),
    description TEXT,
    issue_snapshot JSON NOT NULL,
    changes JSON NOT NULL,
    updated_by VARCHAR(255) DEFAULT 'unknown',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_issue
        FOREIGN KEY (issue_id) REFERENCES issues(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
