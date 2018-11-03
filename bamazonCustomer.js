// the required variables
var mysql = require('mysql');
var inquirer = require('inquirer');

// connecting to the database
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'Bamazon'
});

// connect to the server
connection.connect(function(err) {
    if (err) throw err;
    console.log('connected...');
});

// ending the connection
var end = function() {
    connection.end(function(err) {
        // The connection is terminated now
    });
}

// reset console screen
console.reset = function() {
    console.log('');
    console.log('');
    console.log('no worries, maybe next time. Goodbye.')
    console.log('');
    console.log('');

    setTimeout(function() {
        return process.stdout.write('\033c');
    }, 1000);

};

// =========================

// INITIAL START AND RESTART

// =========================

// start the app
function startApp() {
    var query = {};
    var dataList = '';
    var stock = '';
    var price = '';
    initialQuestions(); // this will initialize the app
}
// restart the query
function restartQuery() {
    inquirer.prompt([{
        type: 'confirm',
        message: 'Would you like to purchase another item?',
        name: 'confirm',
        default: true
    }]).then(function(choice) {
        if (choice.confirm) {
            startApp();
        } else {
            console.reset();
            end();
        }
    })
    
} 


// ============
// DISPLAY DATA
// ============

// prompt questions
function initialQuestions() {

    dataList = 'SELECT * FROM products';

    query = connection.query(dataList, function(err, res) {

        if (err) throw err;
            inquirer.prompt([
            	{
                    name: 'id',
                    type: 'list',
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name);
                        }
                        
                        return choiceArray;
                    
                	},

                    message: 'Choose the product you\'d like to purchase: '

                },
                {
                    type: 'input',
                    message: 'How many would you like to purchase? ',
                    name: 'amount',
                    validate: function(val) {
                        if (isNaN(val) === false) {
                            return true;
                        }
                        return false;
                    }
                }

                    // WE WANT TO GRAB THIS INFORMATION AND MODIFY OUR TABLES

            ]).then(function(answer) {

                var chosenItem;

                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.id) {
                        chosenItem = res[i];
                    }
                }

                stock = chosenItem.stock_quantity;
                price = chosenItem.price;

                console.log(answer.id);
                console.log('in stock: ' + stock);
                console.log('requested ' + answer.amount);

                if (answer.amount <= stock) {
                    var updateFrom = 'UPDATE products SET stock_quantity = stock_quantity - ' + answer.amount + ' WHERE ?';
                    // I don't know if I need to connect again, as I already have an open connection, but better safe than sorry.
                    connection.query(updateFrom, [(stock - answer.amount)], function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log((stock - answer.amount) + ' left in stock.');
                            console.log('That will be ' + '$' + (price * answer.amount) + '.');
                        }
                        answerAmountQuery()
                        // after
                        function answerAmountQuery() {
                            inquirer.prompt([{
                                type: 'confirm',
                                message: 'Would you like to purchase another item?',
                                name: 'confirm',
                                default: true
                        	}]).then(function(choice) {
                                if (choice.confirm) {
                                    startApp();
                                    end();
                                } else {
                                    console.reset();
                                    end();
                                }
                            })
                            
                        } 

                    })
            	} else {
	            	console.log('Sorry, we don\'t have enough');
	            }
        })
	})
}

startApp();