import { observable } from "mobx";
import userService from "./../Services/user.service";
import { message } from "antd";

class UsersStore {
  @observable reload = true;
  @observable userId = null;
  @observable user = {};
  @observable availableUsers = []
  @observable chatUsers = []
  @observable userListFetching = true;
  @observable chatList = [];
  @observable searchString = ""
  @observable selectedChatRoom = {};

  @observable viewInput = false;

  constructor(allStore) {
    this.allStore = allStore;
    // if ( !localStorage.getItem( "userId" ) ) {
    //     this.getGeneratedUserId();
    // }
    if (localStorage.getItem("userId")) {
      this.getChatsAndUserList()
    }
  }

  getChatsAndUserList = async () => {
    this.userListFetching = true;
    try {
      const res = await userService.getUserList(localStorage.getItem("userId"));
      this.user = res.data.user
      this.chatUsers = res.data.chatedUsers;
      this.allStore.socket.connectSocket();
      this.userListFetching = false;
      this.reload = false;
      const res1 = await userService.getUsers()
      this.chatUsers = res1.data
    } catch (error) {
      if (error && error.status && error.status === 421) {
      }
    }
  }

  addNewMessage = e => {
    this.viewInput = !this.viewInput
  }

  getGeneratedUserId = async () => {
    try {
      const res = await userService.getUserId();
      this.userId = res.data;
      localStorage.setItem("userId", this.userId)
      this.getChatsAndUserList()
    } catch (error) {
      console.log(error);

      this.usFetchingList = false;
      // message.error( error, 3 )
    }
  }

  handleChangeUserId = value => {
    this.searchString = value
  }

  handleAddChatUser = async () => {
    try {
      if (isNaN(this.searchString)) {
        message.error("Please enter proper ID", 3)
        return false
      }
      const res = await userService.getUserInfo(this.user.user_id, Number(this.searchString));
      if (res.data.user && res.data.user.user_id) {
        this.viewInput = !this.viewInput
        this.searchString = "";
      }
    } catch (error) {
      this.usFetchingList = false;
      message.error(error, 3)
    }
  }

  pushToUsers = data => {
    let chatUsers = [...this.chatUsers]
    chatUsers.push(data);
    this.chatUsers = chatUsers
  }

  onChangeUser = async item => {
    try {
      this.selectedChatRoom = item
      this.chatList = []
      const res = await userService.getMessages(this.user.user_id, item.user_id);
      this.chatList = res.data.messages
    } catch (error) {
      this.usFetchingList = false;
      message.error(error, 3)
    }
  }

  onSendMessage = (e, form) => {
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        if (values.message) {
          const objectToSend = {
            message: values.message,
            msg_from: this.user.user_id,
            msg_to: this.selectedChatRoom.user_id,
            created_on: new Date().toISOString(),
            dept: String(this.user.user_id) + String(this.selectedChatRoom.user_id)
          }
          this.allStore.socket.sendChatMessage(objectToSend);
          form.resetFields();
        }
      }
    });
  };

  pushToMessages = data => {
    const chatList = [...this.chatList];
    chatList.push(data);
    this.chatList = chatList;
    this.scrollToBottom();
  }

  messagesBoxElement = () => {
    let element = [];
    element = window.document.querySelectorAll(".chat-messages .ant-spin-nested-loading");
    return element;
  };

  scrollToBottom = () => {
    const elements = this.messagesBoxElement();
    const elementsLength = elements.length;
    if (elementsLength) {
      if (!this.isLoadeMore) {
        for (let index = 0; index < elementsLength; index += 1) {
          elements[index].scrollTop = elements[index].scrollHeight - elements[index].clientHeight;
        }
      } else {
        for (let index = 0; index < elementsLength; index += 1) {
          elements[index].scrollTop = elements[index].scrollHeight / 4;
        }
      }
    }
  };

  onChangeUserName = (str) => {
    console.log(str);
    const objectToSend = {
      user_id: this.user.user_id,
      user_name: str
    }
    this.allStore.socket.sendUserNameChange(objectToSend);
  }

  userNameChanges = (data) => {
    if (data.user_id === this.user.user_id) {
      const user = { ...this.user };
      user.user_name = data.user_name;
      this.user = user;
    }
    const indexInChatList = this.chatUsers.findIndex(obj => obj.user_id === data.user_id)
    if (data.user_id !== this.user.user_id && indexInChatList > -1) {
      const user = { ...this.chatUsers[indexInChatList] };
      user.user_name = data.user_name;
      const users = [...this.chatUsers];
      users[indexInChatList] = user;
      this.chatUsers = users;
    }
    if (data.user_id !== this.user.user_id && this.selectedChatRoom.user_id === data.user_id) {
      const user = { ...this.selectedChatRoom };
      user.user_name = data.user_name;
      this.selectedChatRoom = user;
    }
  }

  removeUser = data => {
    if (data.user_id === this.user.user_id) {
      //  localStorage.clear();
    }
    const indexInChatList = this.chatUsers.findIndex(obj => obj.user_id === data.user_id)
    console.log("indexInChatList", indexInChatList);

    if (data.user_id !== this.user.user_id && indexInChatList > -1) {
      const users = [...this.chatUsers];
      delete users[indexInChatList];
      this.chatUsers = users;
    }
    if (data.user_id !== this.user.user_id && this.selectedChatRoom.user_id === data.user_id) {
      this.selectedChatRoom = null;
    }
  }
}

export default UsersStore;