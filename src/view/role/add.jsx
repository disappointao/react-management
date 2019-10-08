import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
} from 'antd';

const Item = Form.Item;

class Add extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    this.props.setForm(this.props.form);
    return (
        <Form>
          <Item label='角色名称' labelCol={{span:4}} wrapperCol={{span:20}}>
            {
              getFieldDecorator('roleName', {
                    initialValue: '',
                    rules: [
                      {required: true, message: '角色名称必须输入'},
                    ],
                  },
              )(
                  <Input placeholder='请输入角色名称'/>,
              )
            }
          </Item>
        </Form>
    );
  }
}

export default Form.create()(Add);