import  React,{Component} from 'react';
import {Redirect,Switch,Route} from 'react-router-dom';
import { Layout } from 'antd';

import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';
import Nav from '../../components/nav/nav';
import Head from '../../components/head/head';
import Foot from '../../components/foot/foot';
import Home from '../home/home';
import Product from '../product/product'
import Category from '../category/category'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Order from '../order/order'
import Line from '../charts/line'
import Pie from '../charts/pie'
const {Content,Header} =Layout;
export default class Admin extends  Component {
  handleClick(){
    storageUtils.removeUser();
  }
  render() {
    const user = memoryUtils.user;
    if(!user || !user._id) {
      return <Redirect to='/login'/>
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>
          <Nav/>
          <Layout style={{marginLeft:200}}>
            <Head/>
            <Content style={{backgroundColor: '#fff',margin:50,marginTop:105}}>
              <Switch>
                <Route path='/home' component={Home}/>
                <Route path='/category' component={Category}/>
                <Route path='/product' component={Product}/>
                <Route path='/role' component={Role}/>
                <Route path='/order' component={Order}/>
                <Route path='/user' component={User}/>
                <Route path='/charts/bar' component={Bar}/>
                <Route path='/charts/line' component={Line}/>
                <Route path='/charts/pie' component={Pie}/>
                <Redirect to='/home' />
              </Switch>
            </Content>
            <Foot/>
          </Layout>
        </Layout>
    );
  }
}