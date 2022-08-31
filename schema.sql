CREATE DATABASE workouts;
use workouts;

CREATE TABLE users(
    user_id int unsigned not null auto_increment primary key,
    username varchar(127),
    password varchar(255),
    createdAt timestamp default now(),
    updatedAt timestamp
);

CREATE TABLE exercise_plans(
    exercise_plan_id int unsigned not null auto_increment primary key,
    exercise_plan_name varchar(127),
    user_id int unsigned not null,
    createdAt timestamp default now(),
    updatedAt timestamp,
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE exercises(
    exercise_id int unsigned not null auto_increment primary key,
    exercise_plan_id int unsigned not null,
    exercise_name varchar(127),
    createdAt timestamp default now(),
    updatedAt timestamp,
    FOREIGN KEY (exercise_plan_id) 
    REFERENCES exercise_plans(exercise_plan_id) 
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
);

CREATE TABLE exercise_details(
    exercise_detail_id int unsigned not null auto_increment primary key,
    exercise_id int unsigned not null,
    type tinyint,
    comment varchar(127),
    weight float unsigned,
    createdAt timestamp default now(),
    updatedAt timestamp,
    FOREIGN KEY (exercise_id)
    REFERENCES exercises(exercise_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE workouts(
    workout_id int unsigned not null auto_increment primary key,
    exercise_plan_id int unsigned not null,
    completed boolean default false not null,
    user_id int unsigned not null,
    createdAt timestamp default now(),
    updatedAt timestamp,
    FOREIGN KEY (exercise_plan_id) 
    REFERENCES exercise_plans(exercise_plan_id) 
    ON UPDATE CASCADE 
    ON DELETE RESTRICT,
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE workout_exercises(
    workout_exercise_id int unsigned not null auto_increment primary key,
    weight float unsigned,
    exercise_id int unsigned not null,
    workout_id int unsigned not null,
    createdAt timestamp default now(),
    updatedAt timestamp,
    FOREIGN KEY (exercise_id)
    REFERENCES exercises(exercise_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
    FOREIGN KEY (workout_id)
    REFERENCES workouts(workout_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

/*
INSERT INTO users (user_id, username, password) VALUES (1, 'viktor', '$2b$10$xStDu78oN/ob774CCBV1zuS9Xvi.lk7UciB6T2KmkbtDIW48noncq');
INSERT INTO exercise_plans (exercise_plan_id, exercise_plan_name, user_id) VALUES (1, 'Gymma', 1);
INSERT INTO exercises (exercise_plan_id, exercise_name) VALUES (1, 'Marklyft'), (1, 'Benböj');
*/