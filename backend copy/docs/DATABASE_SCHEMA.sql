-- Team Task Tracker - Expected Database Schema
-- Database: TeamTaskTrackerDB
-- This is a reference for the existing database tables

-- Organizations Table
CREATE TABLE Organizations (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    createdAt DATETIME DEFAULT GETUTCDATE(),
    updatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Users Table
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    organizationId INT NOT NULL,
    fullName NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    passwordHash NVARCHAR(MAX) NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'MEMBER')),
    isActive BIT DEFAULT 1,
    createdAt DATETIME DEFAULT GETUTCDATE(),
    updatedAt DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (organizationId) REFERENCES Organizations(id)
);

-- RefreshTokens Table
CREATE TABLE RefreshTokens (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL,
    token NVARCHAR(MAX) NOT NULL,
    expiresAt DATETIME NOT NULL,
    isRevoked BIT DEFAULT 0,
    createdAt DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Projects Table
CREATE TABLE Projects (
    id INT PRIMARY KEY IDENTITY(1,1),
    organizationId INT NOT NULL,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    status NVARCHAR(50) NOT NULL CHECK (status IN ('ACTIVE', 'ARCHIVED')),
    createdBy INT NOT NULL,
    createdAt DATETIME DEFAULT GETUTCDATE(),
    updatedAt DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (organizationId) REFERENCES Organizations(id),
    FOREIGN KEY (createdBy) REFERENCES Users(id)
);

-- Tasks Table
CREATE TABLE Tasks (
    id INT PRIMARY KEY IDENTITY(1,1),
    projectId INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    status NVARCHAR(50) NOT NULL CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    priority NVARCHAR(50) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    assignedTo INT,
    createdBy INT NOT NULL,
    dueDate DATETIME,
    createdAt DATETIME DEFAULT GETUTCDATE(),
    updatedAt DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (projectId) REFERENCES Projects(id),
    FOREIGN KEY (assignedTo) REFERENCES Users(id),
    FOREIGN KEY (createdBy) REFERENCES Users(id)
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_organizationId ON Users(organizationId);
CREATE INDEX idx_refreshTokens_userId ON RefreshTokens(userId);
CREATE INDEX idx_refreshTokens_token ON RefreshTokens(token);
CREATE INDEX idx_projects_organizationId ON Projects(organizationId);
CREATE INDEX idx_tasks_projectId ON Tasks(projectId);
CREATE INDEX idx_tasks_assignedTo ON Tasks(assignedTo);
