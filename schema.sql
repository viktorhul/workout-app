CREATE DATABASE workouts;
use workouts;

CREATE TABLE exercises(
    id int auto_increment primary key,
    exercise_name varchar(127),
    comment varchar(255),
    lastCompleted timestamp,
    createdAt timestamp default now(),
    updatedAt timestamp
);