INSERT INTO department (name)
VALUES ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 001),
    ("Salesperson", 80000, 001),
    ("Lead Engineer", 150000, 002),
    ("Software Engineer", 120000, 002),
    ("Account Manager", 160000, 003),
    ("Accountant", 125000, 003),
    ("Legal Team Lead", 250000, 004),
    ("Lawyer", 190000, 004);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 001, null),
    ("Mike", "Chan", 002, 001),
    ("Ashley", "Rodgriguez", 003, null),
    ("Kevin", "Tupik", 004, 003),
    ("Kunal", "Singh", 005, null),
    ("Malia", "Brown", 006, 005),
    ("Sarah", "Lourd", 007, null),
    ("Tom", "Allen", 008, 007);