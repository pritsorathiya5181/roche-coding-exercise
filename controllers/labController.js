const db = require("../db");

exports.uploadData = async (req, res) => {
    try {
        const data = req.body;

        for (const measurement of data) {
            db.connection.query(
                'SELECT id FROM Labs WHERE id = ?',
                [measurement.lab_id],
                (error, results, fields) => {
                    if (error) {
                        console.error('Error checking lab ID in MySQL', error);
                        res.status(500).json({ error: 'Internal server error' });
                    } else if (results.length === 0) {
                        console.error(`Lab ID ${measurement.lab_id} not found in database`);
                        res.status(400).json({ error: `Lab ID ${measurement.lab_id} not found in database` });
                    } else {
                        const { lab_id, temperature, humidity, timestamp } = measurement;
                        const temperatureValue = parseFloat(temperature);
                        const humidityValue = parseFloat(humidity);

                        if (isNaN(temperatureValue) || isNaN(humidityValue)) {
                            return res.status(400).json({ error: 'Invalid temperature or humidity value' });
                        }

                        db.connection.query(
                            'INSERT INTO Measurements (lab_id, timestamp, temperature, humidity) VALUES (?, ?, ?, ?)',
                            [lab_id, timestamp, temperatureValue, humidityValue],
                            (error, results, fields) => {
                                if (error) {
                                    console.error('Error inserting data into MySQL', error);
                                    res.status(500).json({ error: 'Internal server error' });
                                } else {
                                    console.log('Data inserted into MySQL', results);
                                }
                            }
                        );
                    }
                }
            );
        }
        res.status(200).json({ message: 'Data inserted successfully', status: true });

    } catch (error) {
        console.log('error is ', error)
        res.status(500).send('Error in SignIn')
    }
}

exports.fetchAllData = async (req, res) => {
    try {
        const currentTime = new Date();
        const startTime = new Date(currentTime - 24 * 60 * 60 * 1000);

        const query = `SELECT lab_id, CONCAT(ROUND(AVG(temperature), 2), '°C') AS avg_temp, 
                CONCAT(ROUND(AVG(humidity), 2), '%') AS avg_humidity 
                FROM Measurements 
                WHERE timestamp >= ? AND timestamp <= ?
                GROUP BY lab_id`;

        db.connection.query(query, [startTime, currentTime], (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).json(results);
            }
        });
    } catch (error) {
        console.log('error is ', error)
        res.status(500).send('Error in SignIn')
    }
}
