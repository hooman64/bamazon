// the required variables
var mysql = require('mysql');
var inquirer = require('inquirer');
var query;

// connecting to the database
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'Bamazon'
});


// Function to end the connection
var end = function() {
    connection.end(function(err) {
    	console.log('connection has ended...')
    // The connection is terminated now
    });
}

// reset console screen
console.reset = function() {
    console.log('');
    console.log('');
    console.log('Goodbye.')
    console.log('');
    console.log('');

    // this function waits a minute and then inputs 'ctrl + L', or 'clear' in the console
    setTimeout(function() {
        return process.stdout.write('\033c');
    }, 1000);

};



// ===================================
//
// INITIAL START AND RESTART FUNCTIONS
//
// ===================================

// this must be a global variable or it doesn't work
// select all items from my products 
var dataList = 'SELECT * FROM products';


// start the app
function startApp() {

    initialQuestions(); // this will initialize the app

}

// restart the original prompt query
function restartQuery() {
    inquirer.prompt([
    	{
	        type: 'confirm',
	        message: 'Would you like to view the list again?',
	        name: 'confirm',
	        default: true
    	}
    ]).then(function(choice) {
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

	// prompt a series of questions
 	inquirer.prompt([

    	{
            name: 'menu',
            type: 'list',
            message: 'What would you like to do: ',
            choices: ['View Products for Sale', 'View low Inventory', 'Add to Inventory', 'Add new Product']
        },

    ]).then(function(choice) {
		
		//switch case for the options
		switch(choice.menu) {
			case 'View Products for Sale':
				
				productsForSale();
			break;

			case 'View low Inventory':
				viewLowInventory();
				
			break;
			
			case 'Add to Inventory':
				
				addToInventory();
				
			break;

			case 'Add new Product':
				addNewProduct();
				
			break;
		}
	})
}

// =============================== //
// 			SWITCH CASES
// =============================== //
    
// -----------------
// VIEW PRODUCT LIST
// -----------------
function productsForSale() {
	// connect to the database and use the global variable dataList
	// the second run of this causes an error where `res` cannot be read.
    var productForSaleQuery = connection.query(dataList, function(err, res) {
    	if (err) {
    		console.log('err is ' + err);
    	}	
        
        var choiceArray = [];
        // run a for loop to get all the data from the database
        for (var i = 0; i < res.length; i++) {
        	// push that data to our empty aray
            choiceArray.push(
            	// display of information to screen
            	'ID#' + res[i].item_id + ', ' +
            	res[i].product_name + ' ' + 
            	'[$' + res[i].price + ']' +
            	' [stock: ' + res[i].stock_quantity + ']'
            );
        };
        // display our information
        console.log(choiceArray);

        restartQuery();
    });
};

// ------------------
// VIEW LOW INVENTORY
// ------------------
function viewLowInventory() {

	lowInventoryList();
    
    function lowInventoryList() {
    	// open a connection to the database
	    var lowInventoryListquery = connection.query(dataList, function(err, res) {	
            // create an empty array
            var choiceArray = [];
            
            for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < 5) {
                	console.log(
                		// display only the ID and product name of low stock items
                		'ID#' + res[i].item_id + ' ' + 
                		res[i].product_name + ' is low in stock.'

                	)
                }
			
            }

            // ask if they want to do anything else
            restartQuery();
	    })
	}
}

// ------------------
// ADD MORE INVENTORY
// ------------------

function addToInventory(){
	// var addToDatabase = 'SELECT' 

	var addToInventoryQuery = connection.query(dataList, function(err, res) {	
		if (err) throw err;

		var chosenItem;

		inquirer.prompt([
			{
				name: 'stockincrease',
				type:'list',
				message: 'Which item would you like to add stock to?',
				choices: function(){                         
					var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].product_name);
                    }
                    
                    return choiceArray;                
            	}
			},
        	{
		        type: 'confirm',
		        message: 'Are you sure',
		        name: 'confirm',
		        default: true
    		}
		]).then(function(choice){
				for (var i = 0; i < res.length; i++) {
	                if (res[i].product_name === choice.stockincrease) {
	                    chosenItem = res[i];
	                }
	            }
      
				if (choice.confirm) {
			        howMuch();
		        } else {
		            addToInventory();
		        }
	    })

		function howMuch(){
			// currently the function updates all quantity in all fields instead of just the chosen one.
			inquirer.prompt([
				{
					type: 'input',
					name: 'addedamount',
					message: 'How much would you like to add?'

				}
			]).then(function(answer){
				var updateFrom = 'UPDATE products SET stock_quantity = stock_quantity + ' + answer.addedamount + ' WHERE ?';
				var stock = chosenItem.stock_quantity;
				console.log(JSON.stringify(chosenItem) + ' ' + stock)

				connection.query(updateFrom, [stock], function(err, res) {
                    if (err) {

                        console.log(err);
                    
                    } else if (answer.addedamount < 2) {
					
						console.log('We\'ve added ' + answer.addedamount + ' ' + chosenItem.product_name + ' order.' );	
					
					} else {
					
						console.log('We\'ve added ' + answer.addedamount + ' ' + chosenItem.product_name + ' orders.' );
					
					}
					
					console.log(chosenItem.stock_quantity);
					restartQuery();
				})
			})
		}

	});
}

function addNewProduct(){
	console.log('The add a new item function currently offline.')
    restartQuery();
}

startApp();