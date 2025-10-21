import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib";
import { ConfigService } from "../../config/config.service";
import { LoggerService } from "./logger.service";

@Injectable()
export class EventService {
  constructor(
    private configService: ConfigService,
    private logger: LoggerService
  ) {
    this.logger.setContext("EventService");
  }

  private async getConnection() {
    const url = this.configService.rabbitmq.url;
    return await amqp.connect(url);
  }

  async publishTransactionCreated(transactionId: string): Promise<void> {
    try {
      const connection = await this.getConnection();
      const channel = await connection.createChannel();
      const exchange = "transaction_events";

      await channel.assertExchange(exchange, "fanout", { durable: false });

      const payload = {
        event: "transaction.created",
        transactionId,
        timestamp: new Date(),
      };

      channel.publish(exchange, "", Buffer.from(JSON.stringify(payload)));
      this.logger.log(
        `Sent transaction.created event for transaction ${transactionId}`
      );

      setTimeout(() => {
        connection.close();
      }, 500);
    } catch (error) {
      this.logger.error(
        `Failed to publish transaction.created event for ${transactionId}`,
        error.stack
      );
      throw error;
    }
  }
}
