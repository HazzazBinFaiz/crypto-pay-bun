
type Payment = {
    tx_id: string,
    chain_id: number,
    address: string,
    amount: number,
    created_at: number,
    age: 0,
    app_id: string?,
    application: Application?
}

interface Application {
    id: string,
    key: string;
    chainId: int;
    secret: string;
    contractAddress: string;
    decimal: number;
    mnemonics: string;
}