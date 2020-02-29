import socketIO from "socket.io-client";
import { SocketServerLink } from "./../utils/environment"
import { observable } from "mobx";

class SocketStore {
  @observable socket = null;
  @observable isOnline = false
  constructor(allStore) {
    this.allStore = allStore;
  }
  disconnectSocket = () => {
    console.log("disconnectSocket");
    this.socket && this.socket.close(SocketServerLink);
  };

  connectSocket = () => {
    console.log("connectSocket");
    let isConnect = this.socket && this.socket.connected;
    if (!isConnect) {
      this.socket = socketIO.connect(SocketServerLink, {
        transports: ["websocket"],
        upgrade: false
      });

      this.onlineSocket();
    }
  };
  onlineSocket = () => {
    let { user: { user_id, chatsTopic } } = this.allStore.users;
    console.log("online");
    this.socket.emit("online", {
      tag: "user",
      type: "web",
      user_id
    });
    this.socket.on("online", data => {
      data.success && this.subscribeSocket(chatsTopic);
    });
  };
  subscribeSocket = subscribeIdList => {
    console.log("subscribeSocket");
    this.socket.emit("subscribe", { rooms: subscribeIdList });
    window.addEventListener("online", () => {
      console.log("online window");
      this.isOnline = true;
    });

    window.addEventListener("offline", () => {
      console.log("offline window");
      this.isOnline = false;
    });

    this.socket.on("disconnect", () => {
      this.isDisconnect = true;
      this.disconnectSocket();
      if (localStorage.getItem("userId")) {
        this.connectSocket();
      }
    });

    this.socket.on("broadcast-chat-add", (data) => {
      this.allStore.users.pushToUsers(data)
    });

    this.socket.on("message", data => {
      this.allStore.users.pushToMessages(data)
    })

    this.socket.on("name-change", data => {
      this.allStore.users.userNameChanges(data)
    })

    this.socket.on("broadcast-register", (data) => {
      this.allStore.users.pushToUsers(data)
    })

    this.socket.on("user-removed", data => {
      this.allStore.users.removeUser(data);
    })
  }
  sendChatMessage = message => {
    this.socket.emit("message", message);
  };

  sendUserNameChange = changedObject => {
    this.socket.emit("name-change", changedObject);

  }
}

export default SocketStore;