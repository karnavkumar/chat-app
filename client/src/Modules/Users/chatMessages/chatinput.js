import React from "react";
import { Form, Icon, Input, message } from "antd";

const FormItem = Form.Item;

const validateMsgField = (e, form, props) => {
  e.preventDefault();
  const msg = form.getFieldValue("message");
  if (msg && msg.trim() !== "") {
    props.users.onSendMessage(e, props.form);
  } else {
    message.error("Please enter some message", 3);
  }
};

const ChatFooter = props => {
  const {
    form,
  } = props;

  return (
    <div
      style={{ marginTop: 8 }}
    >
      <Form>
        <div style={{
          display: "inline-block",
          width: "91%"
        }}>
          <FormItem>
            {form.getFieldDecorator("message", {})(
              <Input.TextArea
                style={{ resize: "none" }}
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder={"Enter message here"}
                autoSize={{ minRows: 1, maxRows: 4 }}
                onKeyPress={event => {
                  const code = event.which || event.keyCode;
                  if (code === 13 && !event.shiftKey) {
                    validateMsgField(event, form, props);
                  }
                }}
              />
            )}
          </FormItem>
        </div>
        <div style={{
          display: "inline-block",
          width: "8%",
          textAlign: "center"
        }}>
          <FormItem>
            <span
              role="presentation"
              onClick={event => {
                validateMsgField(event, form, props);
              }}
            >
              <Icon type="to-top" />
            </span>
          </FormItem>
        </div>
      </Form>
    </div>
  );
};
export default ChatFooter;
