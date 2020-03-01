import React from "react";
import { withRouter } from "react-router";
import { Button, Layout, Typography, List, Spin, Input } from "antd";
import { observer } from "mobx-react";
import ChatList from "./chatMessages";
import "./users.css";

const { Paragraph } = Typography;
const { Header, Sider, Content } = Layout;
@observer
class UsersComponent extends React.Component {
  render() {
    const {
      users: {
        userListFetching,
        chatUsers,
        onChangeUser,
        viewInput,
        selectedChatRoom,
        handleChangeUserId,
        reload,
        user
      },
      login: { onLogout }
    } = this.props;
    const { user_id } = user;
    return <Spin spinning={reload}>
      {!reload && <div style={{
        padding: "0px 150px"
      }}>
        <Layout>
          <Header style={{ background: "#aad3fb" }}>
            {/* <strong> {user.user_id} </strong> */}
            <Paragraph style={{
              display: "inline-block",
              padding: "0px 30px"
            }}
            // editable={{ onChange: onChangeUserName }}
            >
              Welcome, <strong>{user.first_name}</strong></Paragraph>
            {viewInput && (
              <span style={{ display: "inline-block" }}>
                <Input onChange={e => handleChangeUserId(e.target.value)} />
              </span>
            )}
            <Button onClick={(e) => onLogout(e, this.props.history)}
              type="primary"
              style={{
                float: "right",
                display: "inline - block",
                padding: "0px 30px",
                margin: "15px 0",
              }}> {"Sign Out"} </Button>
          </Header>
          <Layout>
            <Sider style={{ background: "#ffffff" }}>
              <List
                size="small"
                bordered
                loading={userListFetching}
                dataSource={chatUsers.filter(chatItem => chatItem.user_id !== user_id)}
                renderItem={item => <List.Item
                  onClick={() => onChangeUser(item)}
                ><div> {item.first_name} {item.last_name} </div></List.Item>}
              />
            </Sider>
            <Content>{
              (selectedChatRoom && selectedChatRoom.user_id) &&
              <ChatList {...this.props} />
            }</Content>
          </Layout>
          <Layout>

          </Layout>
        </Layout>
      </div>
      }
    </Spin>
  }
}

export default withRouter(UsersComponent);