import { AnyObject } from '@game/shared';
import { z } from 'zod';
import { GameSession } from '../GameSession';

export const defaultInputSchema = z.object({});
export type DefaultSchema = typeof defaultInputSchema;

export abstract class GameInput<TSchema extends DefaultSchema> {
  abstract readonly name: string;

  protected abstract payloadSchema: TSchema;

  protected payload!: z.infer<TSchema>;

  constructor(
    protected rawPayload: AnyObject,
    protected session: GameSession
  ) {}

  protected abstract impl(): void;

  execute() {
    const parsed = this.payloadSchema.safeParse(this.rawPayload);

    if (!parsed.success) return;
    this.payload = parsed.data;

    return this.impl();
  }

  serialize() {
    return { type: this.name, payload: this.rawPayload };
  }
}
