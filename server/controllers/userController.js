const mysql = require('mysql');

// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Start page - not in use
exports.home = (req, res) => {

  res.render('home', { });

}
// View Users -- only for teachers to show all the students and their progress
exports.view = (req, res) => {

    // If the user is loggedin
    if (req.session.loggedin && req.session.admin) {
      
      // User the connection
      connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
        // When done with the connection, release it
        if (!err) {
          let removedUser = req.query.removed;
          let username = req.session.username;
          res.render('sus', { rows, removedUser, username });
        } else {
          console.log(err);
        }
        //console.log('The data from user table: \n', rows);
      });
    } else {
      // Not logged in: please log in to view this page .....
      res.render('login', {layout: 'loginLayout.hbs'});
      //res.send('Please login to view this page!');
    }
}

// Find User by Search
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  // User the connection
  connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      res.render('sus', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

exports.form = (req, res) => {
  res.render('add-user');
}

// Add new user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  let searchTerm = req.body.search;

  // User the connection
  connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
    if (!err) {
      res.render('add-user', { alert: 'User added successfully.' });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}


// Edit user
exports.edit = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.log(err);
    }
    //console.log('The data from user table: \n', rows);
  });
}


// Update User
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  // User the connection
  connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {

    if (!err) {
      // User the connection
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        // When done with the connection, release it
        
        if (!err) {
          res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
        } else {
          console.log(err);
        }
        //console.log('The data from user table: \n', rows);
      });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

// Delete User
exports.delete = (req, res) => {

  // Delete a record

  // User the connection
  // connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {

  //   if(!err) {
  //     res.redirect('/');
  //   } else {
  //     console.log(err);
  //   }
  //   console.log('The data from user table: \n', rows);

  // });

  // Hide a record

  connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('User successeflly removed.');
      res.redirect('/?removed=' + removedUser);
    } else {
      console.log(err);
    }
    //console.log('The data from beer table are: \n', rows);
  });

}

// view only one user
exports.viewall = (req, res) => {

  // User the connection
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-user', { rows });
    } else {
      console.log(err);
    }
    //console.log('The data from user table: \n', rows);
  });

}



// show my sheets --> for students here all their sheets are displayed
exports.sheets = (req, res) => {

   // If the user is loggedin
   if (req.session.loggedin) {
      
    //connection.query('SELECT * FROM sheets WHERE username = ?', [req.session.username], (err, rows) => {
    connection.query('SELECT * FROM sheets s, results r, user u WHERE s.sheet_id = r.sheet_id AND r.username = u.username AND u.username = ?', [req.session.username], (err, rows) => {

      // When done with the connection, release it
      if (!err) {
        //let removedUser = req.query.removed;
        var admin = req.session.admin;
        res.render('sheets', { rows, admin });
      } else {
        console.log(err);
      }
    //console.log('The data output from table: \n', rows);
    });
  } else {
    // Not logged in: please log in to view this page .....
    res.render('login', {layout: 'loginLayout.hbs'});
    //res.send('Please login to view this page!');
  }
  
}





// Login
exports.login = (req, res) => {
  res.render('login', {layout: 'loginLayout.hbs'});
}


exports.auth = (req, res) => {

  // Capture the input fields
	let username = req.body.username;
	let password = req.body.password;
  
	// Ensure the input fields exists and are not empty
	if (username && password) {
		//console.log("Username is: " + username);

		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM user WHERE first_name = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
        req.session.admin = (results[0].role == 'teacher') ? true : false;
        //var admin = req.session.admin;
        //console.log("The user " + req.session.username + " has the role " +  results[0].role + " which equals admin = " + req.session.admin);

				// Redirect to home page
        if (req.session.admin) {
          //res.render('overview', {admin});
          res.redirect('/overview');

        } else {
          //res.render('sheets', {admin});
          res.redirect('/sheets');
        }

			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			//res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
  }
}

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.render('login', {layout: 'loginLayout.hbs', alert: `Du wurdest wurdest abgemeldet.`});
}


// display one sheet, for example Bruch_T1
exports.displayOneSheet = (req, res) => {  
  if (req.session.loggedin) {
    //console.log(req.params.sheet_id);
    //connection.query('SELECT * FROM sheets s, results r WHERE s.sheet_id = r.sheet_id AND s.sheet_id = ? AND s.username = ?', [req.params.sheet_id, req.session.username], (err, results) => {
    connection.query('SELECT * FROM sheets WHERE sheet_id = ?', [req.params.sheet_id], (err, results) => {

      res.render(results[0].subject + '/' + results[0].name);
    });
 } else {
   // Not logged in: please log in to view this page .....
   res.render('login', {layout: 'loginLayout.hbs'});
 }
}


// store answer is called every time the user clicks Prüfen 
//--> it stores the result in the database,  calculates the points for the exercise as well as stores the points 
// and returns the points to the frontend

/*exports.storeAnswer = (req, res) => {
  let currentExercise = req.params.currentExercise
  let answerGiven = req.body['a' + currentExercise].replace(",", ".");

  // continue only if the user entered a float number which is in correct format
  if(/^\d{1,2}(\.\d{0,2})?$|^\.\d\d?$/.test(answerGiven)) {

      if (answerGiven) {
        connection.query('SELECT * FROM sheets WHERE sheet_id = ?', [req.params.sheet_id], function(error, results, fields) {

            let correctSolution = results[0]['lsg' + currentExercise];
            let pointsForThisExercise = (correctSolution == answerGiven)? results[0]['p' + currentExercise]: 0;
        
            var tmp = "ans" + currentExercise;
            // check if the column exists in the database
            connection.query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "results" AND COLUMN_NAME = ?', [tmp], function(error, results, fields) {
              console.log(results[0].count);
              if (results[0].count == 0) {
                //if it doesn't exist, add it
                connection.query('ALTER TABLE results ADD COLUMN ans'+currentExercise+' float(1) NOT NULL DEFAULT 0, ADD COLUMN p'+currentExercise+' float(1) NOT NULL DEFAULT 0');
              }
            });
            // now add the user input to the new or existing column
            connection.query('UPDATE results SET ans'+currentExercise+' = ?, p'+currentExercise+' = ? WHERE sheet_id = ? AND username = ?', [answerGiven, pointsForThisExercise, req.params.sheet_id, req.session.username]);


            res.render(results[0].subject + '/' + results[0].name, {currentExercise, answerGiven, correctSolution});
        });		
      }
  } else {
    //res.send("Falsches Format");
  }

}*/

exports.storeAnswer = (req, res) => {
  console.log("TEst");

  let currentExercise = req.params.currentExercise
  let answerGiven = req.body.answer.replace(",", ".");
  console.log(answerGiven, currentExercise);
  // continue only if the user entered a float number which is in correct format
  if(/^\d{1,2}(\.\d{0,2})?$|^\.\d\d?$/.test(answerGiven)) {

      if (answerGiven) {
        connection.query('SELECT * FROM sheets WHERE sheet_id = ?', [req.params.sheet_id], function(error, results, fields) {

            let correctSolution = results[0]['lsg' + currentExercise];
            let pointsForThisExercise = (correctSolution == answerGiven)? results[0]['p' + currentExercise]: 0;
        
            var tmp = "ans" + currentExercise;
            // check if the column exists in the database
            connection.query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "results" AND COLUMN_NAME = ?', [tmp], function(error, results, fields) {
              console.log(results[0].count);
              if (results[0].count == 0) {
                //if it doesn't exist, add it
                connection.query('ALTER TABLE results ADD COLUMN ans'+currentExercise+' float(1) NOT NULL DEFAULT 0, ADD COLUMN p'+currentExercise+' float(1) NOT NULL DEFAULT 0');
              }
            });
            // now add the user input to the new or existing column
            connection.query('UPDATE results SET ans'+currentExercise+' = ?, p'+currentExercise+' = ? WHERE sheet_id = ? AND username = ?', [answerGiven, pointsForThisExercise, req.params.sheet_id, req.session.username]);


            //res.render(results[0].subject + '/' + results[0].name, {currentExercise, answerGiven, correctSolution});
            //res.send({results, currentExercise, answerGiven, correctSolution});
            res.send({"answer": "true"});

        });		
      }
  } else {
    //res.send("Falsches Format");
  }

}

exports.nextQuestion = (req, res) => {
  let currentExercise = req.params.currentExercise;
  currentExercise++;
  connection.query('SELECT * FROM sheets WHERE sheet_id = ?', [req.params.sheet_id], function(error, results, fields) {
    res.render(results[0].subject + '/' + results[0].name, {currentExercise});
  });		
}




// all student progress
exports.overview = (req, res) => {
  if (req.session.loggedin /*&& req.session.admin*/) {
    
    connection.query('SELECT * FROM results WHERE sheet_id = ?', [1], function(error, results) {
      if (!error) {
        //console.log(results);
        var admin = req.session.admin;
        res.render('overview', {results, admin});
      } else {
        console.log(error);
      }
    });
  } else {
    res.render('login', {layout: 'loginLayout.hbs'});
  }
}















