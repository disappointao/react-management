import  React,{Component} from 'react';
import {Button,Icon,Card,Table,message,Modal} from 'antd';

import {reqAddCategory, reqCategorys, reqUpdateCategory} from '../../api/index';
import LinkButton from '../../components/link-button/button';
import AddCategory from './addCategory';
import UpdateCategory from './updateCategory';
export default class Category extends  Component {
  state={
    loading: false,
    parentId:'0',
    category: [],
    subCategory: [],
    parentName: '',
    showStatus:0,
  };
  getColumns=()=>{
    this.columns=[
      {
        title: '分类',
        dataIndex: 'name',
        key: 'name',
      },
      {
        width:300,
        title: '操作',
        align:'center',
        render:(category)=>{
          return (
              <span>
                  <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
                {this.state.parentId==='0'?<LinkButton onClick={()=>this.showSubCategory(category)}>查看子分类</LinkButton>:''}
                </span>
          )
        }
      },
    ];
  };
  getData=async (parentId)=>{
    this.setState({
      loading:true,
    });
    parentId = parentId || this.state.parentId;
    const result=await reqCategorys(parentId);
    if(result.status===0){
      const category = result.data;
      if(parentId==='0') {
        this.setState({
          category,
          loading:false,
        });
      } else {
        this.setState({
          subCategory: category,
          loading:false,
        })
      }
    }else{
      message.error('获取分类失败！');
    }
  };
  showSubCategory = (category) => {
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      this.getData();
    })
  };
  showCategory=()=>{
    this.setState({
      parentId: '0',
      parentName: '',
      subCategory: []
    })
  };
  addCategory= ()=>{
    this.form.validateFields(async (err,value)=>{
      if(!err){
        const {parentId, categoryName}=value;
        this.form.resetFields();
        const result=await reqAddCategory(categoryName,parentId);
        if(result.status===0){
          this.setState({
            showStatus:0
          });
          if(parentId===this.state.parentId){
            this.getData();
          }else if(parentId==='0'){
            this.getData(parentId);
          }
        }
      }
    })
  };
  updateCategory= ()=>{
    this.form.validateFields(async (err,value)=>{
      if(!err){
        const categoryId=this.category._id;
        const {categoryName}=value;
        this.form.resetFields();
        const result=await reqUpdateCategory({categoryId,categoryName});
        if(result.status===0){
          this.setState({
            showStatus:0
          });
          this.getData();
        }
      }
    } );
  };
  showAdd=()=>{
    this.setState({
      showStatus:1
    })
  };
  showUpdate=(category)=>{
    this.category=category;
    this.setState({
      showStatus:2
    })
  };
  handleCancel=()=>{
    this.form.resetFields();
    this.setState({
      showStatus:0
    })
  };
  componentWillMount() {
    this.getColumns();
  };
  componentDidMount() {
    this.getData();
  }

  render() {
    const {category,loading,parentId,subCategory,parentName,showStatus} =this.state;
    const extra = (
        <Button type='primary' onClick={this.showAdd}>
          <Icon type='plus'/>
          添加
        </Button>
    );
    const title = parentId === '0' ? '一级分类列表' : (
        <span>
        <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{marginRight: 5}}/>
        <span>{parentName}</span>
      </span>
    );
    const categoryItem=this.category || {};
    return (
        <div>
          <Card title={title} extra={extra} style={{height:500}}>
            <Table loading={loading} bordered dataSource={parentId==='0'?category:subCategory} columns={this.columns} rowKey='_id' pagination={
              {defaultPageSize:5,defaultCurrent:1,showQuickJumper: true}
            } />
            <Modal
                title="添加分类"
                visible={showStatus===1}
                onOk={this.addCategory}
                onCancel={this.handleCancel}
            >
              <AddCategory category={category} setForm={(form)=>{this.form=form}} parentId={parentId}/>
            </Modal>

            <Modal
                title="更新分类"
                visible={showStatus===2}
                onOk={this.updateCategory}
                onCancel={this.handleCancel}
            >
              <UpdateCategory categoryName={categoryItem.name} setForm={(form)=>{this.form=form}}/>
            </Modal>          </Card>
        </div>
    );
  }
}