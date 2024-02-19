import { SerializedGameState } from "@game/sdk";
import { Stage, Sprite } from "@pixi/react";

import nerd from "@/assets/nerd.png";

type Props = {
  state: SerializedGameState;
};

export function GameView({ state }: Props) {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Sprite
        image={nerd}
        position={state.player.position}
        anchor={{ x: 0.5, y: 0.5 }}
      />
    </Stage>
  );
}
