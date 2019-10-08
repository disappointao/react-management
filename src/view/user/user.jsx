import  React,{Component} from 'react';
import {Card,Table,Button,Modal,message} from 'antd';

import LinkButton from '../../components/link-button/button';
import UserForm from './user-form';
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api/index';
import {formateDate} from '../../utils/dateUtils';
export default class User extends  Component {
  state={
    columns:[],
    users:[],
    roles:[],
    isShow:false
  };
  initColumns(){
    this.setState({
      columns:[
        {
          title: '用户名',
          dataIndex: 'username',
          align:'center'
        },
        {
          title: '邮箱',
          align:'center',
          dataIndex: 'email'
        },

        {
          title: '电话',
          dataIndex: 'phone',
          align:'center'
        },
        {
          title: '注册时间',
          align:'center',
          dataIndex: 'create_time',
          render:(time)=>formateDate(time)
        },
        {
          title: '所属角色',
          align:'center',
          dataIndex: 'role_id',
          render:(role_id)=>this.roleNames[role_id]
        },
        {
          title: '操作',
          align:'center',
          render: (user) => (
              <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
          )
        },
      ]
    })
  }
  async initUsers(){
    const result= await reqUsers();
    if(result.status===0){
      const {users,roles}=result.data;
      this.initRoles(roles);
      this.setState({
        users,
        roles
      });
    }
  }
  initRoles=(roles)=>{
    const roleNames=roles.reduce((pre,role)=>{
      pre[role._id]=role.name;
      return pre;
    },{});
    this.roleNames=roleNames;
  };
  showUpdate=(user)=>{
    this.setState({isShow:true});
    this.user=user;
  };
  deleteUser=(user)=>{
    Modal.confirm({
      title:'删除用户',
      content:`确认删除用户 ${user.username} 吗`,
      okText:"确认",
      cancelText:'取消',
      onOk:async ()=>{
        const result=await reqDeleteUser(user._id);
        if(result.status===0){
          message.success('删除成功');
          this.initUsers();
        }else{
          message.error('删除失败');
        }
      }
    })
  };
  addOrUpdateUser=()=>{
    const user=this.form.getFieldsValue();
    this.form.validateFields(async (err,data)=>{
      if(!err){
        if(this.user){
          user._id=this.user._id;
        }
        const result=await reqAddOrUpdateUser(user);
        if(result.status===0){
          this.form.resetFields();
          message.success(this.user?'修改成功':'添加成功');
          this.setState({
            isShow:false
          });
          this.initUsers();
        }else{
          message.error(result.msg);
        }
      }else{
        message.error('信息录入不完整');
      }
    })
  };
  componentWillMount() {
   this.initColumns();
  }
  componentDidMount(){
    this.initUsers();
  }
  render() {
    const title=(
        <Button type={'primary'} onClick={()=>{this.setState({isShow:true});this.user=null;}}>
          创建用户
        </Button>
    );
    const {columns,users,isShow,roles}=this.state;
    const user=this.user||{};
    return (
        <Card title={title}>
          <Table
              rowKey='_id'
              bordered={true}
              columns={columns}
              dataSource={users}
              pagination={{defaultPageSize:4}}
          />
          <Modal
              title={user._id?'修改用户':'添加用户'}
              visible={isShow}
              onOk={()=>this.addOrUpdateUser()}
              onCancel={()=>{this.setState({isShow:false});this.form.resetFields();}}
              cancelText='取消'
          >
            <UserForm
                setForm={(form)=>{this.form=form}}
                roles={roles}
                user={user}
            />
          </Modal>
        </Card>
    );
  }
}