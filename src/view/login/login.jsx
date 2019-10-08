import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {
  Form,
  Icon,
  Input,
  Button, message,
} from 'antd';

import logo from '../../assets/images/logo.png';
import './login.less';
import {reqLogin} from '../../api/index';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

class Login extends Component {
  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {username, password} = values;
        let response = await reqLogin(username, password);
        if(response.status===0){
          message.success('登录成功！');
          memoryUtils.user = response.data;
          storageUtils.saveUser(response.data);
          this.props.history.replace('/');
        }else{
          message.error('账号或密码错误');
        }
      }
    });
  };
  validator = (rule, value, callback) => {
    if (!value) {
      callback('请输入用户名');
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('非法用户名');
    } else if (value.length < 4) {
      callback('用户名长度不小于4位');
    } else if (value.length > 10) {
      callback('用户名长度不超过10位');
    } else {
      callback();
    }
  };

  render() {
    const user = memoryUtils.user;
    if(user && user._id) {
      return <Redirect to='/'/>
    }
    const form = this.props.form;
    const {getFieldDecorator} = form;
    return (
        <div className="login">
          <header className="login-header">
            <img src={logo} alt="logo"/>
            <h1>XXX后台管理系统</h1>
          </header>
          <section className="login-content">
            <h2>用户登陆</h2>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                {
                  getFieldDecorator('username', {
                    rules: [
                      {
                        validator: this.validator,
                      },
                    ],
                  })(<Input prefix={<Icon type="user"
                                          style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="用户名"/>)
                }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ],
                  })(<Input prefix={<Icon type="lock"
                                          style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password" placeholder="密码"
                  />)
                }
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit"
                        className="login-form-button">
                  登陆
                </Button>
              </Form.Item>
            </Form>
          </section>
        </div>
    );
  }
}

const WrapLogin = Form.create()(Login);
export default WrapLogin;