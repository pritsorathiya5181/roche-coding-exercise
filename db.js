const mysql = require('mysql');
require('dotenv').config()

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT
});

const labTableSchema = `
CREATE TABLE IF NOT EXISTS Labs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL
)`;

const measurementTableSchema = `
CREATE TABLE IF NOT EXISTS Measurements (
  measurement_id INT AUTO_INCREMENT PRIMARY KEY,
  lab_id INT NOT NULL,
  timestamp DATETIME NOT NULL,
  temperature DECIMAL(5,2) NOT NULL,
  humidity DECIMAL(5,2) NOT NULL,
  INDEX (lab_id),
  INDEX (timestamp),
  CONSTRAINT fk_lab_data_lab_id
        FOREIGN KEY (lab_id)
        REFERENCES Labs(id)
)
`;

con.connect(function (err) {
    if (err) throw err;

    con.query('CREATE DATABASE IF NOT EXISTS laboratory;');
    con.query('USE laboratory;');

    con.query(labTableSchema, (error, results, fields) => {
        if (error) throw error;
        con.query('SELECT COUNT(*) FROM Labs', function (error, results, fields) {
            if (error) throw error;
            if (results[0]['COUNT(*)'] <= 0) {
                const newLabRecords = []
                for (let i = 0; i < 46327; i++) {
                    newLabRecords.push({
                        name: `Lab ${i}`,
                        address: `${i} Main St, Anytown, USA`
                    });
                }
                const values = newLabRecords.map(record => [record.name, record.address]);

                con.query('INSERT INTO Labs (name, address) VALUES ?', [values], (error, results, fields) => {
                    if (error) throw error;
                    console.log(`${results.affectedRows} Lab records inserted successfully`);
                    con.end();
                });
            }
        });
    });

    con.query(measurementTableSchema, (error, results, fields) => {
        if (error) throw error;
    });
});

exports.connection = con;