import amqp from "amqplib";
import { IEventService } from "../interfaces/IEventService";
import config from "../config/config";
import { logger } from "../utils/logger";

export class EventService implements IEventService {
  private async getChannel() {
    const connection = await amqp.connect(config.rabbitmq.url);
    const channel = await connection.createChannel();
    await channel.assertExchange(
      config.rabbitmq.exchanges.userEvents,
      "fanout",
      { durable: false }
    );
    return { channel, connection };
  }

  public async publishUserUpdated(userId: string): Promise<void> {
    try {
      const { channel, connection } = await this.getChannel();

      const payload = {
        event: "user.updated",
        userId,
        timestamp: new Date(),
      };

      channel.publish(
        config.rabbitmq.exchanges.userEvents,
        "",
        Buffer.from(JSON.stringify(payload))
      );

      logger.info(`Sent user.updated event for userId: ${userId}`, { userId });

      setTimeout(() => {
        connection.close();
      }, 500);
    } catch (error) {
      logger.error("Failed to publish user.updated event", error as Error, {
        userId,
      });
      throw error;
    }
  }
}
