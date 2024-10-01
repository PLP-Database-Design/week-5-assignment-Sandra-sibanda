// initialize dependancies
// express framework provides platform to handle the http requestsand responses

const express = require('express'); //declare the function
const app = express(); // call the function
const mysql = require('mysql2');
const dotenv = require ('dotenv');
const cors = require('cors');

app.use(express.json()); // Express is a JS framework used for backend
app.use(cors()); //cross origin resourse sharing CORS
dotenv.config();

//connect to the database
const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    //check if database connection works
    db.connect((err)=> {
        //No
        if(err) return console.log("Error connection to the database");

        //yes
        console.log("successfully connected to the database as id: ", db.threadId);

        app.listen(process.env.PORT, () => {
            console.log(`Server listening port ${process.env.PORT}`);
       
            //send a message to the browser
            console.log('Sending message to browser...')
            app.get('/', (req, res) => {
                res.send('Server started successfully')
            }) //get is used to retrieve 
        
        });

        //retrieve all patients
        app.get('/patients', (req, res) => {
            const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

            db.query(query, (err, results) => {
                if (err) {
                    return res.status(500).json({error: 'Failed to retrieve patients'
            
                    });
                }
                res.json(results);
            });
        });

        //retrieve all providers
        
        app.get('/providers', (req, res) => {
            const query = 'SELECT first_name, last_name, provider_specialty FROM providers';

            db.query(query, (err, results) => {
                if(err) {
                    return res.status (500).json({ error: 'Failed to retrieve providers'

                    });
                }
                res.json(results);
            });
        });

        // // retrieve patients by first name
        //use :http://localhost:3300/patients/search?first_name=Lanni to test if code is working.
         app.get('/patients/search', (req, res) => {
           const { first_name} = req.query;
             const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?'; 

            db.query(query,[first_name], (err, results) => {
                if(err) {
             return res.status(500).json({ error: 'Failed to retrieve patients by first name'
                    });
                 }
                 res.json(results);
             });
         });


        //retrieve providers by specialty
        // use :  http://localhost:3300/providers/specialty?specialty=surgery to test if code works.

    app.get('/providers/specialty', (req, res) => {
        const {specialty} = req.query;
        const query = ' SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

        db.query(query, [specialty], (err, results) =>{
            if(err) {
                return res.status(500).json({error: 'Failed to retrieve providers by specialty'});
                }
                res.json(results);
        });
    });

          
    });

        



   