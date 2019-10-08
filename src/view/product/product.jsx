import  React,{Component} from 'react';
import {Switch,Redirect,Route} from 'react-router-dom';

import ProductAdd from './add';
import ProductDetail from './detail';
import Home from './home';
import './product.less';
export default class Products extends  Component {
  render() {
    return (
        <Switch>
          <Route path='/product' component={Home} exact/>
          <Route path='/product/add' component={ProductAdd}/>
          <Route path='/product/detail' component={ProductDetail}/>
          <Redirect to='/product'/>
        </Switch>
    );
  }
}