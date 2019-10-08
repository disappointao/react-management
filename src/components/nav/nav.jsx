import React, {Component} from 'react';
import {Menu, Icon, Layout} from 'antd';
import {Link,withRouter} from 'react-router-dom';

import menuList from '../../config/menuConfig';
import logo from '../../assets/images/logo.png';
import memoryUser from '../../utils/memoryUtils';
import './nav.less';

const SubMenu = Menu.SubMenu;
const Sider = Layout.Sider;
class Nav extends Component {
  getMenuNodes = (menuList) => {
    return menuList.map(item => {
      if(this.hasAuth(item)){
        if (!item.children) {
          return (
              <Menu.Item key={item.key}>
                <Link to={item.key}>
                  <Icon type={item.icon}/>
                  <span>{item.title}</span>
                </Link>
              </Menu.Item>
          );
        } else {
          const cItem=item.children.find(cItem=>this.props.location.pathname.indexOf(cItem.key)===0);
          if(cItem){
            this.openKey=item.key;
          }
          return (
              <SubMenu
                  key={item.key}
                  title={
                    <span>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </span>
                  }
              >
                {this.getMenuNodes(item.children)}
              </SubMenu>
          );
        }
      }
    });
  };
  hasAuth=(item)=>{
    if(memoryUser.user.username==='admin'||item.isPublic||memoryUser.user.role.menus.includes(item.key)){
      return true;
    }else if(item.children){
      return !!item.children.find(child=>memoryUser.user.role.menus.includes(child.key))
    }
    return false;
  };
  componentWillMount() {
    this.menuNodes=this.getMenuNodes(menuList);
  }

  render() {
    let path=this.props.location.pathname;
    if(path.indexOf('/product')===0){
      path='/product';
    }
    return (
        <Sider style={{
          backgroundColor: '#2f4050',
          position: 'fixed',
          height: '100%',
        }}>
          <div className="left-nav-header">
            <img src={logo} alt=""/>
            <h1>刘创凹</h1>
          </div>
          <Menu theme='dark' defaultSelectedKeys={['1']} mode="inline"
                style={{backgroundColor: '#2f4050'}} selectedKeys={[path]} defaultOpenKeys={[this.openKey]}>
            {this.menuNodes}
          </Menu>
        </Sider>
    );
  }
}
export default withRouter(Nav);