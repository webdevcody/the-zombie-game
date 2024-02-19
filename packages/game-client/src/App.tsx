import { GameSession } from "@game/sdk";
import { useEffect, useState } from "react";
import { GameView } from "./GameView";
import { useKey } from "react-use";

const serverSession = GameSession.createServerSession();
serverSession.start();
const clientSession = GameSession.createClientSession();

serverSession.subscribe((state) => {
  clientSession.setState(state);
});

function App() {
  const [state, setState] = useState(clientSession.getSerializedState());
  useEffect(() => {
    return clientSession.subscribe((newState) => {
      setState(newState);
    });
  }, []);

  const move = (xDiff: number, yDiff: number) => () => {
    serverSession.dispatchGameInput({
      type: "move",
      payload: {
        x: state.player.position.x + xDiff,
        y: state.player.position.y + yDiff,
      },
    });
  };

  useKey((e) => e.code === "ArrowUp", move(0, -10));
  useKey((e) => e.code === "ArrowDown", move(0, 10));
  useKey((e) => e.code === "ArrowLeft", move(-10, 0));
  useKey((e) => e.code === "ArrowRight", move(10, 0));

  return (
    <>
      <GameView state={state} />
    </>
  );
}

export default App;
