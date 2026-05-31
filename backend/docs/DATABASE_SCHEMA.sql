-- Team Task Tracker - Expected Database Schema
-- Database: TeamTaskTrackerDB
-- This is a reference for the existing database tables

SELECT @@SERVERNAME;


IF NOT EXISTS (SELECT * FROM SYS.DATABASES WHERE NAME = 'TEAMTASKTRACKERDB')
BEGIN
    CREATE DATABASE TEAMTASKTRACKERDB;
END
GO

USE TEAMTASKTRACKERDB;
GO

-- ============================================
-- ORGANIZATIONS
-- ============================================

CREATE TABLE Organizations
(
    Id INT IDENTITY(1,1) PRIMARY KEY,

    Name NVARCHAR(200) NOT NULL,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    UpdatedAt DATETIME2 NULL,

    IsDeleted BIT NOT NULL DEFAULT 0
);
GO

-- ============================================
-- USERS
-- ============================================

CREATE TABLE Users
(
    Id INT IDENTITY(1,1) PRIMARY KEY,

    OrganizationId INT NOT NULL,

    FullName NVARCHAR(200) NOT NULL,

    Email NVARCHAR(255) NOT NULL,

    PasswordHash NVARCHAR(MAX) NOT NULL,

    Role NVARCHAR(20) NOT NULL,

    IsActive BIT NOT NULL DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    UpdatedAt DATETIME2 NULL,

    IsDeleted BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_Users_Organizations
        FOREIGN KEY (OrganizationId)
        REFERENCES Organizations(Id),

    CONSTRAINT UQ_Users_Email
        UNIQUE (Email),

    CONSTRAINT CK_Users_Role
        CHECK (Role IN ('ADMIN', 'MANAGER', 'MEMBER'))
);
GO

-- ============================================
-- PROJECTS
-- ============================================

CREATE TABLE Projects
(
    Id INT IDENTITY(1,1) PRIMARY KEY,

    OrganizationId INT NOT NULL,

    Name NVARCHAR(200) NOT NULL,

    Description NVARCHAR(1000) NULL,

    CreatedBy INT NOT NULL,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    UpdatedAt DATETIME2 NULL,

    IsDeleted BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_Projects_Organizations
        FOREIGN KEY (OrganizationId)
        REFERENCES Organizations(Id),

    CONSTRAINT FK_Projects_CreatedBy
        FOREIGN KEY (CreatedBy)
        REFERENCES Users(Id)
);
GO

-- ============================================
-- TASKS
-- ============================================

CREATE TABLE Tasks
(
    Id INT IDENTITY(1,1) PRIMARY KEY,

    ProjectId INT NOT NULL,

    Title NVARCHAR(250) NOT NULL,

    Description NVARCHAR(MAX) NULL,

    Priority NVARCHAR(20) NOT NULL DEFAULT 'MEDIUM',

    Status NVARCHAR(30) NOT NULL DEFAULT 'TODO',

    AssigneeId INT NULL,

    CreatedBy INT NOT NULL,

    DueDate DATETIME2 NULL,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    UpdatedAt DATETIME2 NULL,

    IsDeleted BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_Tasks_Project
        FOREIGN KEY (ProjectId)
        REFERENCES Projects(Id),

    CONSTRAINT FK_Tasks_Assignee
        FOREIGN KEY (AssigneeId)
        REFERENCES Users(Id),

    CONSTRAINT FK_Tasks_CreatedBy
        FOREIGN KEY (CreatedBy)
        REFERENCES Users(Id),

    CONSTRAINT CK_Tasks_Priority
        CHECK (Priority IN ('LOW', 'MEDIUM', 'HIGH')),

    CONSTRAINT CK_Tasks_Status
        CHECK (
            Status IN
            (
                'TODO',
                'IN_PROGRESS',
                'IN_REVIEW',
                'DONE',
                'BLOCKED'
            )
        )
);
GO

-- ============================================
-- REFRESH TOKENS
-- ============================================

CREATE TABLE RefreshTokens
(
    Id INT IDENTITY(1,1) PRIMARY KEY,

    UserId INT NOT NULL,

    Token NVARCHAR(MAX) NOT NULL,

    ExpiresAt DATETIME2 NOT NULL,

    IsRevoked BIT NOT NULL DEFAULT 0,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT FK_RefreshTokens_User
        FOREIGN KEY (UserId)
        REFERENCES Users(Id)
);
GO

-- ============================================
-- INDEXES (ASSIGNMENT REQUIREMENT)
-- ============================================

CREATE INDEX IX_Tasks_Status
ON Tasks(Status);
GO

CREATE INDEX IX_Tasks_AssigneeId
ON Tasks(AssigneeId);
GO

CREATE INDEX IX_Tasks_DueDate
ON Tasks(DueDate);
GO

CREATE INDEX IX_Tasks_ProjectId
ON Tasks(ProjectId);
GO

CREATE INDEX IX_Users_Email
ON Users(Email);
GO

-- ============================================
-- OPTIONAL COMPOSITE INDEXES
-- ============================================

CREATE INDEX IX_Tasks_Status_Assignee
ON Tasks(Status, AssigneeId);
GO

CREATE INDEX IX_Tasks_Status_DueDate
ON Tasks(Status, DueDate);
GO

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO Organizations(Name)
VALUES ('Demo Organization');
GO

INSERT INTO Users
(
    OrganizationId,
    FullName,
    Email,
    PasswordHash,
    Role
)
VALUES
(
    1,
    'System Admin',
    'admin@teamtracker.com',
    'REPLACE_WITH_BCRYPT_HASH',
    'ADMIN'
);
GO