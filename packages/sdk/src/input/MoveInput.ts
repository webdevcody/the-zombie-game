import { z } from 'zod';
import { GameInput } from './_GameInput';

const schema = z.object({
  x: z.number(),
  y: z.number()
});

export class MoveInput extends GameInput<typeof schema> {
  name = 'move';
  payloadSchema = schema;

  protected impl(): void {
    this.session.getState().player.position = this.payload;
  }
}
