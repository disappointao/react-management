import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Tree
} from 'antd';
import menuConfig from '../../config/menuConfig';
import role from './role';
const Item = Form.Item;
const TreeNode=Tree.TreeNode;
export default class Auth extends Component {
  static propTypes = {
    name: PropTypes.string,
    menus:PropTypes.array
  };
  state={
    menus:this.props.menus
  };
  getTreeNodes=(menu)=>{
    return menu.reduce((pre,item)=>{
      pre.push(
          <TreeNode title={item.title} key={item.key}>
            {item.children?this.getTreeNodes(item.children):null}
          </TreeNode>
      );
      return pre;
    },[])
  };
  onCheck = checkedKeys => {
    this.setState({ menus:checkedKeys });
  };
  getMenus=()=>{return this.state.menus};
  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      menus:nextProps.menus
    })
  }

  componentWillMount() {
  this.tree=this.getTreeNodes(menuConfig);
}

  render() {
  const {menus}=this.state;
    return (
        <Form>
          <Item label='角色' labelCol={{span:2}} wrapperCol={{span:22}}>
            <Input disabled value={this.props.name}/>
          </Item>
          <Tree
              checkable
              defaultExpandAll={true}
              checkedKeys={menus}
              onCheck={this.onCheck}
          >
            <TreeNode
                title='平台权限'
                key='all'
            >
              {this.tree}
            </TreeNode>
          </Tree>
        </Form>
    );
  }
}
