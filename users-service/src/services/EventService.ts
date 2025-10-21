import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const USER_EVENTS_EXCHANGE = 'user_events';

export class EventService {
    private static async getChannel() {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(USER_EVENTS_EXCHANGE, 'fanout', { durable: false });
        return { channel, connection };
    }

    public static async publishUserUpdated(userId: string) {
        const { channel, connection } = await this.getChannel();

        const payload = {
            event: 'user.updated',
            userId,
            timestamp: new Date(),
        };

        channel.publish(
            USER_EVENTS_EXCHANGE,
            '',
            Buffer.from(JSON.stringify(payload))
        );

        console.log('[x] Sent user.updated for userId:', userId);

        setTimeout(() => {
            connection.close();
        }, 500);
    }
}