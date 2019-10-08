import  React,{Component} from 'react';
import {Layout} from 'antd';

const {Footer}=Layout;
export default class Foot extends  Component {
  render() {
    return (
        <Footer style={{textAlign:'center'}}>使用谷歌浏览器，可以或得最佳体验</Footer>
    );
  }
}