import  React,{Component} from 'react';
import {Card,Button,Table,Modal,message} from 'antd';

import {PAGE_SIZE} from '../../utils/contains';
import {reqRole,reqAddRole,reqUpdateRole} from '../../api/index';
import memoryUtils from '../../utils/memoryUtils';
import {formateDate} from '../../utils/dateUtils';
import Add from './add';
import Auth from './auth';
import storageUtils from '../../utils/storageUtils';
export default class Role extends  Component {
  state={
    roles:[],
    role:{},
    onshow:false,
    auth:false
  };
  constructor(props){
    super(props);
    this.auth=React.createRef();
  }
  onRow=(role)=>{
    return {
      onClick:event=>{
       this.setState({
         role
       })
      }
    }
  };
  getRole=async ()=>{
    const result=await reqRole();
    if(result.status==0){
      this.setState({
        roles:result.data,
      })
    }
  };
  initColumns=()=>{
    this.columns=[
      {
        title: '角色名称',
        dataIndex: 'name',
        align:'center'
      },
      {
        title: '创建时间',
        align:'center',
        dataIndex: 'create_time',
        render:formateDate
      },
      {
        title: '授权时间',
        align:'center',
        dataIndex: 'auth_time',
        render:formateDate
      },
      {
        title: '授权人',
        align:'center',
        dataIndex: 'auth_name'
      },
    ]
  };
  handleOk=()=>{
    this.setState({
      onshow:false
    });
    this.form.validateFields(async (error,value)=>{
      if(!error){
        const role=value.roleName;
        const result =await reqAddRole(role);
        if(result.status===0){
          this.form.resetFields();
          message.success('角色添加成功');
          this.setState(state => ({
            roles: [...state.roles, result.data]
          }));
        }else{
          message.error('角色添加失败');
        }
      }
    })
  };
  handleCancel=()=>{
    this.setState({
      onshow:false,
      auth:false
    })
  };
  updateRole=async ()=>{
    this.setState({
      auth:false
    });
    const role = this.state.role;
    const menus=this.auth.current.getMenus();
    role.menus=menus;
    role.auth_time=Date.now();
    role.auth_name = memoryUtils.user.username;
    const result = await reqUpdateRole(role);
    console.log(result);
    if (result.status===0) {
      if(role._id===memoryUtils.user.role_id){
        memoryUtils.user={};
        storageUtils.removeUser();
        this.props.history.replace('/login');
        message.success('当前用户角色权限成功');
      }else{
        message.success('设置角色权限成功');
      }
    }else{
      message.error('设置权限失败');
    }
  };
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getRole();
  }
  render() {
    const {role,onshow,auth}=this.state;
    const title=(
        <span>
          <Button type='primary' onClick={()=>{this.setState({onshow:true})}}>创建角色</Button>
          <Button type='primary' disabled={!role._id} onClick={()=>{this.setState({auth:true})}} style={{marginLeft:20}}>更新角色权限</Button>
        </span>
    );
    return (
        <Card title={title}>
          <Table
              onRow={this.onRow}
              columns={this.columns}
              dataSource={this.state.roles}
              bordered
              rowKey='_id'
              pagination={{defaultPageSize:PAGE_SIZE}}
              rowSelection={{type:'radio',selectedRowKeys:[role._id],
                onSelect: (role) => {
                  this.setState({
                    role
                  })
                }}}
          />
          <Modal
              title="创建角色"
              visible={onshow}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              okText='确定'
              cancelText='取消'
          >
            <Add setForm={(form)=>{this.form=form}}/>
          </Modal>
          <Modal
              title="设置角色权限"
              visible={auth}
              onOk={this.updateRole}
              onCancel={this.handleCancel}
              okText='确定'
              cancelText='取消'
          >
            <Auth name={role.name} menus={role.menus} ref={this.auth}/>
          </Modal>
        </Card>
    );
  }
}