const inquirer = require('inquirer');
const ctable = require('console.table');
const mysql = require('mysql2');
const dotenv = require('dotenv').config();

const db = mysql.createConnection(
    {
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to ${process.env.DB_NAME} database`)
);

const startQuestion = [
    {
        type: 'list',
        name: 'start',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
    }];

function startTracker() {
    inquirer
        .prompt(startQuestion)
        .then((answers) => {
            switch (answers.start) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployeePrompt();
                    break;
                case 'Update Employee Role':
                    updateRolePrompt();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRolePrompt();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartmentPrompt();
                    break;
            }
        });
}

function viewAllEmployees() {
    db.query('SELECT * FROM employees', (err, results) => console.log(results));
};

startTracker();