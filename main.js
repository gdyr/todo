var inquirer = require('inquirer');
var chalk = require('chalk');
var fs = require('fs');

var cmd = process.argv[2];
if(cmd != 'c' && cmd != 'a') {
  console.log(chalk.red('> Invalid command!'));
  return;
}

var todos = [];
try {
  todos = fs.readFileSync('TODO').toString().trim().split('\n');
} catch(e) {
  if(cmd == 'd') {
    console.log(chalk.yellow('> There is no TODO file.'));
    return;
  }
}

/* Adding to-dos */
if(cmd == 'a') {
  if(!process.argv[3]) {
    inquirer.prompt([{
      type: 'input',
      name: 'todo',
      message: 'New to-do:'
    }]).then(function(a) {
      saveNewTodo(a.todo);
    })
  } else {
    saveNewTodo(process.argv[3]);
  }
}

function saveNewTodo(todo) {
  // TODO: check if duplicate
  for(var i in todos) {
    console.log(chalk.blue('  ' + todos[i]));
  };
  todos.push(todo);
  console.log(chalk.green('+ ' + todo));
  fs.writeFileSync('TODO', todos.join('\n') + '\n');
}

/* Completing to-dos */
if(cmd == 'c') {
  inquirer.prompt([{
    type: 'checkbox',
    name: 'which',
    message: 'Which to-dos are complete?',
    choices: todos.map(function(t, i) { return { name: " " + t, value: i }; })
  }]).then(function(a) {
    for(var i in todos) {
      if(a.which.indexOf(parseInt(i, 10)) == -1) {
        console.log(chalk.blue('  ' + todos[i]));
      } else {
        console.log(chalk.red('- ' + todos[i]));
        todos[i] = null;
      }
    }
    todos = todos.filter(function(i) { return !!i; });
    fs.writeFileSync('TODO', todos.join('\n') + '\n');
  });
}