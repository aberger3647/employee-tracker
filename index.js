const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to ${process.env.DB_NAME} database`)
);

const startQuestion = [
  {
    type: "list",
    name: "start",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add A Department",
      "Add A Role",
      "Add An Employee",
      "Update Employee Role",
    ],
  },
];

function mainMenu() {
  inquirer.prompt(startQuestion).then((answers) => {
    switch (answers.start) {
      case "View All Departments":
        viewAllDepartments();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "View All Employees":
        viewAllEmployees();
        break;
      case "Add A Department":
        addDepartment();
        break;
      case "Add A Role":
        addRole();
        break;
      case "Add An Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateRole();
        break;
    }
  });
}

function viewAllDepartments() {
  db.query("SELECT * FROM departments", (err, results) =>
    console.table(results)
  );
  mainMenu();
}

function viewAllRoles() {
  db.query("SELECT * FROM roles", (err, results) => console.table(results));
  mainMenu();
}

function viewAllEmployees() {
  db.query("SELECT * FROM employees", (err, results) => console.table(results));
  mainMenu();
}

function addDepartment() {
  const addDepartment = [
    {
      type: "input",
      name: "department",
      message: "Department name:",
    },
  ];
  inquirer.prompt(addDepartment).then((answers) => {
    db.query(
      "INSERT INTO departments (dept_name) VALUES (?)",
      answers.department,
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(`Added ${answers.department} department to database`);
        mainMenu();
      }
    );
  });
}

const addRole = () => {

  db.query("SELECT dept_name AS name, id AS value FROM departments", (err, depts) => {
    if (err) throw err;
    const addRoleInput = [
      {
        type: "input",
        name: "role",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "roledept",
        message: "What department does the role belong to?",
        choices: depts,
      }
    ];

    inquirer.prompt(addRoleInput).then((answers) => {
        console.log(answers);
      db.query(
        "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
       [answers.role, answers.salary, answers.roledept],
        (err, results) => {
          if (err) {
            throw err;
          }
          console.log(`Added ${answers.role} role to database`);
          mainMenu();
        }
      );
    });
  });
};

const addEmployee = () => {
    // const fullName = db.query("SELECT CONCAT_WS(' ', first_name, last_name) AS full_name FROM employees");
    // console.log(fullName);
    const managers = db.query("SELECT first_name AS name, manager_id AS value FROM employees WHERE manager_id IS NOT NULL", (err, managers) => {
    console.log(managers);
        if (err) throw err;
    const addEmployeeInput = [
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "input",
        name: "role",
        message: "What is the employee's role?",
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managers,
      },
    ];
  
    inquirer.prompt(addEmployeeInput).then((answers) => {
    //   console.log(answers);
    // role_id in employees table = id in roles table
    // need title in roles table
    // join the tables 
    db.query("SELECT roles.id, title.id, employees.first_name, employees.last_name FROM employees INNER JOIN employees ON roles.id=employees.role_id; INSERT INTO employees (first_name, last_name, title, managers) VALUES (?, ?, ?, ?)",
    [answers.firstName, answers.lastName, answers.role, answers.manager],
    (err, data) => {
      if (err) throw err;
            console.log(`Added ${answers.firstName} ${answers.lastName} to database`);
            mainMenu();
          }
        );
      });
    })
}
mainMenu();