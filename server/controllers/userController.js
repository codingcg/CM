const mysql = require('mysql');
var fs = require('fs');


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
    if (req.session.loggedin /*&& req.session.admin*/) {
      
      // User the connection
      connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
        // When done with the connection, release it
        if (!err) {
          let removedUser = req.query.removed;
          let username = req.session.username;
          var admin = req.session.admin;

          res.render('sus', { rows, removedUser, username, admin});
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



// show my sheets --> for students: all their sheets are displayed here
exports.sheets = (req, res) => {

  if (req.session.loggedin) {
    connection.query('SELECT * FROM sheets s, results r, user u WHERE s.sheet_id = r.sheet_id AND r.username = u.username AND u.username = ?', [req.session.username], (err, rows) => {

      // When done with the connection, release it
      if (!err) {
        //let removedUser = req.query.removed;
        var admin = req.session.admin;
        res.render('sheets', { rows, admin });
      } else {
        console.log(err);
      }
    });
  } else {
    // Not logged in: please log in to view this page .....
    res.render('login', {layout: 'loginLayout.hbs'});
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


exports.displayOneSheet = (req, res) => {  
  var sheetData = [];
  var max_points = 0;

  if (req.session.loggedin) {
      connection.query('SELECT * FROM sheets WHERE sheet_id = ?', [req.params.sheet_id], (err, results) => {


      // Load all the info for this sheet from the corresponding txt file 
      fs.readFile( __dirname + '/../../views/' + results[0].subject + '/' + results[0].name+ '.txt', function (err, data) {
        if (err) {
          throw err; 
        }

        // read question, exercises, solutions, points and hints
        var splittedArray  = data.toString().split("***************");
        sheetData = new Array(splittedArray.length);

        for (var i = 0; i < splittedArray.length; i++) {
          var splittedTwice = splittedArray[i].split("&&&");

          var foo = {
                "question" : splittedTwice[0].replace(undefined,''),
                "exercise" : splittedTwice[1].replace(undefined,''),
                "solution" : splittedTwice[2].replace(undefined,'').replace(",", "."),
                "points" : splittedTwice[3].replace(undefined,''),
                "hint1" : splittedTwice.length > 4 ? splittedTwice[4].replace(undefined,''): "Kein Tip verfügbar",
                "hint2" : splittedTwice.length > 5 ? splittedTwice[5].replace(undefined,''): "Kein Tip verfügbar",
                "hint3" : splittedTwice.length > 6 ? splittedTwice[6].replace(undefined,''): "Kein Tip verfügbar",
                "hint4" : splittedTwice.length > 7 ? splittedTwice[7].replace(undefined,''): "Kein Tip verfügbar",
                "hint5" : splittedTwice.length > 8 ? splittedTwice[8].replace(undefined,''): "Kein Tip verfügbar",
          };

          max_points += parseFloat(splittedTwice[3].replace(undefined,''));
          sheetData[i] = foo;
        }
        
        connection.query('UPDATE sheets SET max_points = ?, number_of_exercises = ?', [max_points, splittedArray.length]);

        // make sheet Variable global and construct a complete clone of sheetData in it to access txt file data it in other routes
        sheet = Object.assign({}, sheetData);

        connection.query('SELECT * FROM results WHERE sheet_id = ? AND username = ?', [req.params.sheet_id, req.session.username], (err, rows) => {

            //var reached_points = rows[0].reached_points;
+
            // I can use handlebars {{{}}}-notation in HTML with all the info that is given with the render command,
            // but for the send command I need ajax and can use this in js but not in html/handlebars
            res.render(results[0].subject + '/' + results[0].name, {sheetData, /*max_points: max_points, reached_points: reached_points, percentage: percentage*/});
        });
      });
    });
  } else {
    // Not logged in: please log in to view this page .....
    res.render('login', {layout: 'loginLayout.hbs'});
  }
}



exports.storeAnswer = (req, res) => {
  //let currentExercise = req.params.currentExercise;
  let currentExercise = req.body.currentExercise;
  let answerGiven = parseFloat(req.body.answerGiven.replace(",", "."));
  let tries = req.body.tries;

  var numberOfExercises = Object.keys(sheet).length;
  let pointsForThisExercise = 0;
  let max_points;

  // continue only if the user entered a float number which is in correct format
  //if(/^\d{1,2}(\.\d{0,2})?$|^\.\d\d?$/.test(answerGiven)) {
  if(!isNaN(answerGiven) || !isNaN(parseInt(answerGiven))) {

      //if an answer was given in the correct format for this exercise
      if (answerGiven) {

        connection.query('SELECT * FROM results WHERE sheet_id = ? AND username = ?', [req.params.sheet_id, req.session.username], function(error, rows, fields) {
          // reached_points is a global variable -- dangerous maybe?
          reached_points = parseFloat(rows[0].reached_points) + pointsForThisExercise;
        });

        connection.query('SELECT * FROM sheets WHERE sheet_id = ?', [req.params.sheet_id], function(error, results, fields) {
            let correctSolution = parseFloat(sheet[currentExercise].solution);
            max_points = parseFloat(results[0].max_points);

            // given answer is right
            if (correctSolution == answerGiven){
              if (tries == 1){
                pointsForThisExercise = parseFloat(sheet[currentExercise].points);
              } else if (tries == 2) {
                pointsForThisExercise = parseFloat(sheet[currentExercise].points * 0.5);
              } 
            // given answer is wrong
            } else {
              pointsForThisExercise = 0;
            }
              
            

            // check if the column exists in the database
            /*connection.query('SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "results" AND COLUMN_NAME = ?', [tmp], function(error, results, fields) {
              //console.log(results[0].count);
              if (results[0].count == 0) {
                //if it doesn't exist, add it
                connection.query('ALTER TABLE results ADD COLUMN ans'+currentExercise+' float(1) NOT NULL DEFAULT 0, ADD COLUMN p'+currentExercise+' float(1) NOT NULL DEFAULT 0');
              } 
            });
            // now add the user input to the new or existing column
            connection.query('UPDATE results SET ans'+currentExercise+' = ?, p'+currentExercise+' = ?, number_of_exercises = ? WHERE sheet_id = ? AND username = ?', [answerGiven, points_for_this_exercise, number_of_exercises, req.params.sheet_id, req.session.username]);
            */

            var tmp = "ans" + currentExercise;
            // check if the column exists in the database, if it doesn't exist, add it
            connection.query('IF NOT EXISTS( SELECT NULL FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "results" AND COLUMN_NAME = ?) THEN ALTER TABLE results ADD COLUMN ans'+currentExercise+' float(1) NOT NULL DEFAULT 0, ADD COLUMN p'+currentExercise+' float(1) NOT NULL DEFAULT 0; END IF', [tmp]);

            // now add the user input to the new or existing column
            connection.query('UPDATE results SET ans'+currentExercise+' = ?, p'+currentExercise+' = ?, number_of_exercises = ? WHERE sheet_id = ? AND username = ?', [answerGiven, pointsForThisExercise, numberOfExercises, req.params.sheet_id, req.session.username]);


            // if this is the last question, mark the sheet as done
            if (parseInt(currentExercise)+1 == numberOfExercises) {
              connection.query('UPDATE results SET done = 1 WHERE sheet_id = ? AND username = ?', [req.params.sheet_id, req.session.username]);

            }

            var percentage =  (reached_points / max_points ) * 100;

            // I can use handlebars {{{}}}-notation in HTML with all the info that is given with the render command,
            // but for the send command I need ajax and can use this in js but not in html/handlebars
            res.send({results, answerGiven, correctSolution, numberOfExercises, max_points, reached_points, percentage});
          
        });		
      }
  } else {
      //res.send({"wrong": "Falsches Format"});
  }
}

exports.nextQuestion = (req, res) => {

  connection.query('UPDATE results SET reached_points = ? WHERE sheet_id = ? AND username = ?', [reached_points, req.params.sheet_id, req.session.username]);

  var numberOfExercises = Object.keys(sheet).length;
  let currentExercise = req.params.currentExercise;
  currentExercise++;

  connection.query('SELECT * FROM sheets WHERE sheet_id = ?', [req.params.sheet_id], function(error, results, fields) {

      // get all the user results for this sheet up to this point, to display it in the progress bar
      connection.query('SELECT * FROM results WHERE sheet_id = ? AND username = ?', [req.params.sheet_id, req.session.username], function(error, results, fields) {

        // I can use handlebars {{{}}}-notation in HTML with all the info that is given with the render command,
        // but for the send command I need ajax and can use this in js but not in html/handlebars
        res.send({currentExercise, results, numberOfExercises});

      });
  });		
}




// all student progress
exports.overview = (req, res) => {
  if (req.session.loggedin /*&& req.session.admin*/) {
    
    connection.query('SELECT * FROM results WHERE sheet_id = ?', [1], function(error, rows) {
      if (!error) {
        //console.log(results);
        var admin = req.session.admin;
        res.render('overview', {rows, admin});
      } else {
        console.log(error);
      }
    });
  } else {
    res.render('login', {layout: 'loginLayout.hbs'});
  }
}















