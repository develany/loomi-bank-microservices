import * as amqp from 'amqplib';
import * as dotenv from 'dotenv';

dotenv.config();

export class EventService {
    private static async getConnection() {
        const url = process.env.RABBITMQ_URL || 'amqp://localhost';
        return await amqp.connect(url);
    }

    static async publishTransactionCreated(transactionId: string) {
        const connection = await this.getConnection();
        const channel = await connection.createChannel();
        const exchange = 'transaction_events';

        await channel.assertExchange(exchange, 'fanout', { durable: false });

        const payload = {
            event: 'transaction.created',
            transactionId,
            timestamp: new Date()
        };

        channel.publish(exchange, '', Buffer.from(JSON.stringify(payload)));
        console.log('[x] Sent transaction.created event for transaction', transactionId);

        setTimeout(() => {
            connection.close();
        }, 500);
    }
}