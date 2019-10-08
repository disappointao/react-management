import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Select,
} from 'antd';

const Item = Form.Item;
const Option = Select.Option;

class userForm extends PureComponent {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user:PropTypes.object
  };

  render() {
    const {user,roles}=this.props;
    const {getFieldDecorator} = this.props.form;
    const formStyle = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    };
    this.props.setForm(this.props.form);
    return (
        <Form {...formStyle}>
          <Item label='用户名'>
            {
              getFieldDecorator('username', {
                    initialValue: user.username,
                    rules: [
                      {required: true, message: '用户名不能为空'},
                    ],
                  },
              )(
                  <Input placeholder='请输入用户名称'/>,
              )
            }
          </Item>
          {
            user._id?null:(
                <Item label='密码'>
                  {
                    getFieldDecorator('password', {
                          initialValue: '',
                          rules: [
                            {required: true, message: '密码不能为空'},
                          ],
                        },
                    )(
                        <Input type='password' placeholder='请输入用户密码'/>,
                    )
                  }
                </Item>
            )
          }
          <Item label='手机号'>
            {
              getFieldDecorator('phone', {
                initialValue: user.phone,
                rules: [
                  {required: true, message: '手机号不能为空'},
                ],
              })(
                  <Input placeholder='请输入手机号'/>,
              )
            }
          </Item>
          <Item label='邮箱'>
            {
              getFieldDecorator('email', {
                initialValue: user.email,
                rules: [
                  {required: true, message: '邮箱不能为空'},
                ],
              })(
                  <Input placeholder='请输入邮箱'/>,
              )
            }
          </Item>
          <Item label='所属角色'>
            {
              getFieldDecorator('role_id', {
                initialValue: user.role_id ,
              })(
                  <Select>
                    {roles.map((role, index) => (
                        <Option value={role._id}
                                key={index}>{role.name}</Option>))}
                  </Select>
              )
            }
          </Item>
        </Form>
    );
  }
}

export default Form.create()(userForm);