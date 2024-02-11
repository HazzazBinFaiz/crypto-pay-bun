

export interface DataLayer {
    getApplicationByAppId(app_id: string) : Application|null
    getPaymentById(payment_id: string) : Payment|null
    createPayment(payment: Payment): Boolean
}

export interface Database {
    initialize() : void
}