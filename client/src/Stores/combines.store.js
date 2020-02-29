import SocketStore from "./socket.store";
import UserStore from "./users.store"
import LoginStore from "./login.store";

class CombinesStore {
  constructor() {
    this.socket = new SocketStore(this);
    this.users = new UserStore(this);
    this.login = new LoginStore(this);
  }
}

export default CombinesStore