import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { game } from '@game/sdk';

console.log(game);
const PORT = process.env.PORT || 8000;

async function main() {
  try {
    const httpServer = createServer();
    const io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    httpServer.listen(PORT);

    io.on('connection', async socket => {
      console.log('socket connected', socket.id);
    });
    console.log(`Server running on port ${PORT}`);
  } catch (err) {}
}

main();
