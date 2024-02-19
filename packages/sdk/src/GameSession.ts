import { JSONValue, Point } from '@game/shared';
import mitt from 'mitt';
import { InputReducer, SerializedInput } from './input/_InputReducer';
import { TICKRATE } from './config';

type Player = {
  position: Point;
};

// the state used by the session internally
export type GameState = {
  player: Player;
};

// the state that the session exposes to the outside world. Must be JSON Serializable
export type SerializedGameState = JSONValue & {
  player: Player;
};

type Events = {
  update: SerializedGameState;
};

export class GameSession {
  static createServerSession() {
    return new GameSession(true);
  }

  static createClientSession() {
    return new GameSession(false);
  }

  private emitter = mitt<Events>();

  private inputReducer = new InputReducer(this);

  private state: {
    player: {
      position: Point;
    };
  };

  private interval: ReturnType<typeof setInterval> | undefined;

  constructor(public readonly isAuthoritative: boolean) {
    this.state = {
      player: {
        position: {
          x: 0,
          y: 0
        }
      }
    };

    this.getSerializedState = this.getSerializedState.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  getState(): GameState {
    return this.state;
  }

  getSerializedState() {
    return { ...this.state };
  }

  setState(newstate: SerializedGameState) {
    if (this.isAuthoritative) {
      throw new Error(
        'Canot set the state on an authoritative GameSession. Use gameSession.disptchGameInput() instead.'
      );
    }
    this.state = newstate;
    this.emitter.emit('update', this.getSerializedState());
  }

  subscribe(cb: (newState: SerializedGameState) => void) {
    this.emitter.on('update', cb);

    return () => {
      return this.emitter.off('update', cb);
    };
  }

  dispatchGameInput(action: SerializedInput) {
    this.inputReducer.reduce(action);
  }

  start() {
    if (!this.isAuthoritative) {
      throw new Error(
        'Non authoritative session cannot run. Do not call start() on a non authoritative GameSession.'
      );
    }
    if (this.interval) return;
    this.interval = setInterval(() => {
      this.emitter.emit('update', this.getSerializedState());
    }, TICKRATE);
  }
}
