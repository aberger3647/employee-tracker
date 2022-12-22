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
  db.query("SELECT * FROM departments", (err, results) => {
    console.table(results);
  mainMenu();
  })
}

function viewAllRoles() {
  db.query("SELECT * FROM roles", (err, results) => {
    console.table(results);
  mainMenu();
  })
}

function viewAllEmployees() {
  db.query("SELECT * FROM employees", (err, results) => {
    console.table(results);
  mainMenu();
})
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
  db.query(
    "SELECT dept_name AS name, id AS value FROM departments",
    (err, depts) => {
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
        },
      ];

      inquirer.prompt(addRoleInput).then((answers) => {
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
    }
  );
};

const addEmployee = async () => {
  const [managers] = await db
    .promise()
    .query("SELECT CONCAT (first_name, ' ', last_name) AS name, id AS value FROM employees");
  const [roles] = await db
    .promise()
    .query("SELECT title AS name, id AS value FROM roles");
  const addEmployeeInput = [
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "role_id",
      message: "What is the employee's role?",
      choices: roles,
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's manager?",
      choices: managers,
    },
  ];

  inquirer.prompt(addEmployeeInput).then(async (answers) => {
    const data = await db
      .promise()
      .query("INSERT INTO employees SET ?", answers);
      console.log(`Added ${answers.first_name} ${answers.last_name} to database`)
      mainMenu();
  });
};

const updateRole = async () => {
  const [employees] = await db
  .promise()
  .query("SELECT CONCAT(first_name, ' ', last_name) AS name, id AS value FROM employees");
  const [roles] = await db
    .promise()
    .query("SELECT title AS name, id AS value FROM roles");
      const addRoleInput = [
        {
          type: "list",
          name: "employee",
          message: "Select an employee to update:",
          choices: employees,
        },
        {
          type: "list",
          name: "role",
          message: "Select new role for employee:",
          choices: roles,
        },
      ];

      inquirer.prompt(addRoleInput).then(async (answers) => {
        const data = await db
        .promise()
        .query(
          "UPDATE employees SET role_id = ? WHERE id = ?", [answers.role, answers.employees]);
            console.log(`Updated ${employees[answers.employee - 1].name} to ${roles[answers.role - 1].name}`);
            mainMenu();
          }
        );
      };

mainMenu();
