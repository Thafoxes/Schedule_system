CREATE DATABASE IF NOT EXISTS schedule_management;
USE schedule_management;

CREATE TABLE schedule_management.user(
    user_id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL UNIQUE,
    first_name varchar(255),
    last_name varchar(255),
    role ENUM('student', 'teacher', 'itstaff') NOT NULL,
    password_hash varchar(255) NOT NULL,
    created_at TIMESTAMP CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

);

CREATE TABLE student(
    user_id INT PRIMARY KEY,
    student_matrix_number VARCHAR(20) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES schedule_management.user(user_id) ON DELETE CASCADE
);

CREATE TABLE teacher(
    user_id INT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES schedule_management.user(user_id) ON DELETE CASCADE
);

CREATE TABLE it_staff(
    user_id INT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES schedule_management.user(user_id) ON DELETE CASCADE
);