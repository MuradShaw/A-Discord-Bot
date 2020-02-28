//For interacting with a MySql DB

//Adding more currency to the db
const increaseCurrency = (did) => {

	//Get user from db
	connection.query(`SELECT * FROM currency WHERE id = '${did}'`, (err, rows) => {
		if(err) throw err;
		
		let sql;
		var newAmount = Math.floor(Math.random() * Math.floor(3));
		
		//User doesn't exist in db
		if(rows < 1)
			sql = `INSERT into currency (id, amount) VALUES ('${did}', ${newAmount})`;
		else { //Exists, just update them
			let amount = rows[0].amount;
			sql = `UPDATE currency SET amount = '${amount + newAmount}' WHERE id = '${did}'`;
		}
		
		//Do the thing
		connection.query(sql);
	});
}
