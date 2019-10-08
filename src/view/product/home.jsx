import React, {Component} from 'react';
import {Card, Select, Input, Button, Icon, Table, message} from 'antd';

import LinkButton from '../../components/link-button/button';
import {reqProduct,reqSearchProduct,reqUpdateStatus} from '../../api/index';
import {PAGE_SIZE} from '../../utils/contains';
const Option=Select.Option;
export default class Home extends Component {
  state={
    total:0,
    product:[],
    searchType:'productName',
    searchName:''
  };
  initColunms=()=>{
    this.columns = [
      {
        title: '商品名称',
        align:'center',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        align:'center',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        align:'center',
        dataIndex: 'price',
        render: (price) => '¥' + price  //
      },
      {
        width: 100,
        title: '状态',
      align:'center',
          render: (product) => {
        const {status,_id} = product;
        const newStatus= status===1?2:1;
        return (
            <span>
              <Button
                  type='primary'
                  onClick={()=>this.updateStatus(newStatus,_id)}
              >
                {status==1?'下架':'上架'}
              </Button>
              <span>{status==1?'在售':'待售'}</span>
            </span>
        )
      }
    },
    {
      width: 100,
          title: '操作',
        align:'center',
        render: (product) => {
      return (
          <span>
                <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>详情</LinkButton>
              <LinkButton onClick={()=>this.props.history.push('/product/add',{product})}>修改</LinkButton>
            </span>
      )
    }
    }
  ]
  };
  getProduct=async (pageNum)=>{
    const {searchType,searchName} =this.state;
    this.pageNum=pageNum;
    let result;
    if(searchName){
      result =await reqSearchProduct(pageNum,PAGE_SIZE,searchName,searchType);
      console.log('123');
    }else{
      result=await reqProduct(pageNum,PAGE_SIZE)
    }
    if(result.status===0){
      const {list,total}=result.data;
      this.setState({
        product:list,
        total
      })
    }
  };
  updateStatus=async (newStatus,productId)=>{
    const result = await reqUpdateStatus(productId,newStatus);
    if(result.status==0){
      message.success('更新成功');
      this.getProduct(this.pageNum);
    }
  };
  componentWillMount() {

  };
  componentDidMount() {
    this.getProduct(1);
  }

  render() {
    const {product,total,searchType,searchName}=this.state;
    const title = (
        <span>
        <Select
            value= {searchType}
            style={{width: 150}}
            onChange={value => this.setState({searchType: value})}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
            placeholder='关键字'
            style={{width: 150, margin: '0 15px'}}
            value={searchName}
            onChange={event => this.setState({searchName: event.target.value})}
        />
        <Button type='primary' onClick={()=>this.getProduct(1)} >搜索</Button>
      </span>
    );

    const extra = (
        <Button type='primary' onClick={()=>this.props.history.push('/product/add')} >
          <Icon type='plus'/>
          添加商品
        </Button>
    );
    this.initColunms();
    return (
        <Card title={title} extra={extra}>
          <Table
              bordered
              rowKey='_id'
              dataSource={product}
              columns={this.columns}
              pagination={{
                current:this.pageNum,
                defaultPageSize:PAGE_SIZE,
                showQuickJumper:true,
                total,
                onChange:page=>this.getProduct(page)
              }}
          />
        </Card>
    );
  }
}