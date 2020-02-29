import LoginService from "Services/user.service";
import { message } from "antd";
import { observable } from "mobx";

class LoginStore {
  @observable isBtnLoading = false;
  constructor(
    allStore
  ) {
    this.allStore = allStore;
  }

  handleRegisterSubmit = (e, form, history) => {
    e.preventDefault();
    form.validateFields(async (err, { email, password, first_name, last_name }) => {
      if (!err) {
        try {
          this.isBtnLoading = true;
          const res = await LoginService.register({
            email,
            password,
            first_name,
            last_name
          });
          if (res.success) {
            message.success(res.message, 3)
            //set global data
            // this.allStore.users.userId = res.user.user_id;
            // this.allStore.users.getChatsAndUserList()
            history.push("/login");
          }
          this.isBtnLoading = false;
        } catch (error) {
          this.isBtnLoading = false;
        }
      }
    });
  };

  handleLoginSubmit = (e, form, history) => {
    e.preventDefault();
    form.validateFields(async (err, { email, password }) => {
      if (!err) {
        try {
          this.isBtnLoading = true;
          const res = await LoginService.logIn({
            email,
            password,
          });
          if (res.success) {
            //set global data
            this.allStore.users.userId = res.data.user_id;
            this.allStore.users.user = res.data;
            localStorage.setItem("userId", res.data.user_id)
            localStorage.setItem("user_token", res.data.user_token)
            this.allStore.users.getChatsAndUserList()
            history.push("/dashboard");
          }
          this.isBtnLoading = false;
        } catch (error) {
          this.isBtnLoading = false;
        }
      }
    });
  };

  getChatRooms = async (data, history) => {
    this.globals.getChatRooms(data, res => {
      this.locale.value = res.user.lang;
      this.socket.connectSocket();

    });
  };


  onLogout = (e, history) => {
    //disconnect socket
    this.allStore.socket.disconnectSocket();
    localStorage.clear();
    // and redirect to login screen
    history.push("/login");
  };



}
export default LoginStore;
