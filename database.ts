import { Database } from "bun:sqlite";
import { randomUUID } from "node:crypto";

const db = new Database("db.sqlite");
const query = db.exec(`CREATE TABLE IF NOT EXISTS transactions(
    tx_id TEXT NOT NULL,
    chain_id INT NOT NULL,
    amount INT NOT NULL DEFAULT 0,
    address TEXT NOT NULL,
    created_at INT NOT NULL,
    age INT NOT NULL
)`);

// db.exec('INSERT INTO transactions (tx_id, chain_id, amount, address) VALUES (\'fccd45644\', \'0x56\', 100, \'0x462351C935dF52945393c4dDF36963e9a9714c6e\')');


// console.log(db.query('SELECT * FROM transactions').all())
console.log(randomUUID().split('-'))