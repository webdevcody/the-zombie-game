import { AnyObject, Constructor } from '@game/shared';
import { GameSession } from '../GameSession';
import { MoveInput } from './MoveInput';
import { GameInput } from './_GameInput';

const inputMap: Record<string, Constructor<GameInput<any>>> = {
  move: MoveInput
};

export type SerializedInput = {
  type: string;
  payload: unknown;
};

export class InputReducer {
  constructor(private session: GameSession) {}

  reduce({ type, payload }: SerializedInput) {
    if (!this.session.isAuthoritative) {
      throw new Error(
        'Non authoritative game session cannot receive player inputs. Use gameSession.setState() instead'
      );
    }

    const input = inputMap[type];

    new input(payload, this.session).execute();
  }
}
