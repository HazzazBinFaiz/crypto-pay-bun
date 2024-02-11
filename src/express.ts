import { randomUUID } from 'node:crypto';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import Database from './data/sqlite';
import config from '../config.toml';
import { keyBy } from 'lodash';
import { mnemonicToAccount } from 'viem/accounts';
import { uuidToPath } from './utils';

const app = express();
const db = new Database('db.sqlite');

const applications = keyBy(config.applications, 'key');

db.initialize();
app.use(morgan('combined'));
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send();
});

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/payment/:paymentId', async (req, res) => {
    const paymentId = req.params.paymentId;
    const payment = db.getPaymentById(paymentId);
    res.render('payment', { payment });
});

app.post('/payment', async (req, res) => {
    const { app_id: query_app_id, amount: query_amount } = req.query;
    const { app_id: body_app_id, amount: body_amount } = req.body;
    const app_id = body_app_id || query_app_id;
    const amount = body_amount || query_amount;


    if (!app_id || isNaN(amount) || !applications[app_id]) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    const application = applications[app_id] as Application;

    try {
        const uid = randomUUID();
        const path = uuidToPath(uid)
        let wallet = mnemonicToAccount(application.mnemonics, { path });
        db.createPayment({
            tx_id: uid,
            chain_id: application.chainId,
            address: wallet.address as string,
            amount,
            created_at: (new Date()).getTime(),
            age: 0,
            app_id: application.id,
            application: application
        });

        const pay_url = `${req.protocol}://${req.get('host')}/payment/${uid}`;

        res.status(200).json({
            message: 'Payment successfully stored',
            pay_url
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to store payment data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.info(`Server is listening on port ${PORT}`);
});