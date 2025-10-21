export interface IEventService {
  publishUserUpdated(userId: string): Promise<void>;
}
