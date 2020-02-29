import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Form, Icon, Input, Button, Card } from "antd";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";


const FormItem = Form.Item;

@observer
class LoginPage extends Component {
  render() {
    const { props } = this;
    const { getFieldDecorator } = props.form;
    return (
      <Card style={{
        width: "50 %",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        margin: "0px 360px",
        height: "600px",
      }
      }>
        <div className="login-container">
          <div className="main-div">
            <h2>LOGIN</h2>
            <p className="description">
              Please enter details to register.
          </p>
            <Form
              layout="vertical"
              className="login-form"
              onSubmit={e =>
                props.login.handleRegisterSubmit(e, props.form, props.history)
              }
            >

              <FormItem
                required={false}
                label={
                  <span>
                    <Icon type="user" /> FIRST NAME
                </span>
                }
              >
                {getFieldDecorator("first_name", {
                  rules: [
                    {
                      required: true,
                      message: "Please enter your firstname"
                    }
                  ]
                })(
                  <Input
                    size="large"
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="First Name"
                  />
                )}
              </FormItem>
              <FormItem
                required={false}
                label={
                  <span>
                    <Icon type="user" /> LAST NAME
                </span>
                }
              >
                {getFieldDecorator("last_name", {
                  rules: [
                    {
                      required: true,
                      message: "Please enter your lastname"
                    }
                  ]
                })(
                  <Input
                    size="large"
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Last Name"
                  />
                )}
              </FormItem>
              <FormItem
                required={false}
                label={
                  <span>
                    <Icon type="user" /> EMAIL
                </span>
                }
              >
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      type: "email",
                      message: "Please enter your email!"
                    }
                  ]
                })(
                  <Input
                    size="large"
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Email"
                  />
                )}
              </FormItem>
              <FormItem
                required={false}
                label={
                  <span>
                    <Icon type="key" /> PASSWORD
                </span>
                }
              >
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "Please enter your password!" }
                  ]
                })(
                  <Input
                    size="large"
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    type="password"
                    placeholder="Password"
                  />
                )}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  loading={props.login.isBtnLoading}
                  htmlType="submit"
                  style={{ width: "100%" }}
                  size="large"
                >
                  Register
              </Button>
              </FormItem>
              <FormItem>
                <Link to="login">

                  Login
                </Link>
              </FormItem>
            </Form>
          </div>
        </div>
      </Card >
    );
  }
}

const WrappedLoginPage = Form.create()(LoginPage);

export default inject("login", "users")(withRouter(WrappedLoginPage));
