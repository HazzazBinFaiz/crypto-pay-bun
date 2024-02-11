import { Database as SqliteDatabase } from "bun:sqlite";
import type { DataLayer, Database as BaseDatabase } from './index';

import config from '../../config.toml';

class Database implements BaseDatabase, DataLayer {
    #db: SqliteDatabase;
    constructor(path = "db.sqlite") {
        this.#db = new SqliteDatabase(path);
    }

    initialize() {
        this.#db.exec(`CREATE TABLE IF NOT EXISTS payments (
    app_id INT NOT NULL,
    payment_id TEXT NOT NULL,
    chain_id INT NOT NULL,
    amount INT NOT NULL DEFAULT 0,
    address TEXT NOT NULL,
    created_at INT NOT NULL,
    age INT NOT NULL
)`);
    }

    getApplicationByAppId(app_id: string): Application | null {
        return config.applications[app_id];
    }

    getPaymentById(payment_id: string): Payment | null {
        const query = this.#db.query("SELECT * FROM payments ");
        return query.get() as Payment;
    }

    createPayment(tx: Payment) {
        const insert = this.#db.prepare(`INSERT INTO payments (
                app_id,
                payment_id,
                chain_id,
                address,
                amount,
                created_at,
                age
            ) VALUES (
                $app_id,
                $payment_id,
                $chain_id,
                $address,
                $amount,
                $created_at,
                $age
            )`);
        const result = insert.run({
            $app_id: tx.app_id,
            $payment_id: tx.tx_id,
            $chain_id: tx.chain_id,
            $address: tx.address,
            $amount: tx.amount,
            $created_at: tx.created_at,
            $age: tx.age,
        });

        return true;
    }
}


export default Database;