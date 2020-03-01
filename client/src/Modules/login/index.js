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
        height: "450px",
      }
      }>
        <div className="login-container">
          <div className="main-div">
            <h2>LOGIN</h2>
            <p className="description">
              Please enter email id and password to login.
          </p>
            <Form
              layout="vertical"
              className="login-form"
              onSubmit={e =>
                props.login.handleLoginSubmit(e, props.form, props.history)
              }
            >
              <FormItem
                required={false}
                label={
                  <span>
                    <Icon type="mail" /> EMAIL
                </span>
                }
              >
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      message: "Please enter your email!"
                    }
                  ]
                })(
                  <Input
                    size="large"
                    prefix={
                      <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
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
                  Log In
              </Button>
              </FormItem>
              <FormItem>
                <Link to="register">

                  Register
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
