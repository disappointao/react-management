import  React,{Component} from 'react';
import {Card, Icon, Form, Input, Cascader, Button, message} from 'antd';

import LinkButton from '../../components/link-button/button';
import RichTextEditor from './richTextEditor';
import PicturesWall from './picturesWall';
import {reqCategorys,reqAddOrUpdateProduct} from '../../api/index';
const Item=Form.Item;
const TextArea=Input.TextArea;
class ProductAdd extends  Component {
  state={
    options:[]
  };
  constructor(props) {
    super(props);
    this.getImg = React.createRef();
    this.getHtml= React.createRef();
  }
  validatePrice(rule,value,callback){
    if(value*1>0){
      callback();
    }else if(value*1<=0){
      callback('单价必须大于零')
    }
  }
  initOptions = async (categorys) => {
    const options = categorys.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false,
    }));
    const {update, product} = this;
    const {pCategoryId} = product;
    if(update && pCategoryId!=='0') {
      const subCategorys = await this.getCategorys(pCategoryId);
      const childOptions = subCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }));
      const targetOption = options.find(option => option.value===pCategoryId);
      targetOption.children = childOptions
    }
    this.setState({
      options:options,
    })
    };

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    if (result.status===0) {
      const categorys = result.data;
      if (parentId==='0') {
        this.initOptions(categorys)
      } else {
        return categorys;
      }
    }
  };
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;
    const subCategorys = await this.getCategorys(targetOption.value);
    targetOption.loading = false;
    if (subCategorys && subCategorys.length>0) {
      const childOptions = subCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }));
      targetOption.children = childOptions
    } else {
      targetOption.isLeaf = true
    }
    this.setState({
      options: [...this.state.options],
    })
  };
  submit=()=>{
    this.props.form.validateFields(async (error,values)=>{
      if (!error) {
        const {name, desc, price, categoryIds} = values;
        let pCategoryId, categoryId;
        if (categoryIds.length===1) {
          pCategoryId = '0';
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        const imgs = this.getImg.current.getImg();
        const detail = this.getHtml.current.getDetail();
        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId};
        if(this.update) {
          product._id = this.product._id
        }
        const result = await reqAddOrUpdateProduct(product);

        if (result.status===0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`);
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`);
        }
      }
    })
  };
  componentWillMount() {
    const {product}=this.props.location.state||{product:''};
    this.update=!!product;
    this.product=product||{}
  }

  componentDidMount() {
    this.getCategorys('0');
  }

  render() {
    const {getFieldDecorator} =this.props.form;
    const {product,update}=this;
    const {categoryId,pCategoryId}=this.product;
    const categoryArry=[];
    if(update){
      if(pCategoryId=='0'){
        categoryArry.push(categoryId);
      }else{
        categoryArry.push(pCategoryId);
        categoryArry.push(categoryId);
      }
    }
    const title = (
        <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20}}/>
        </LinkButton>
        <span>{this.update?'修改商品':'添加商品'}</span>
      </span>
    );
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };
    return (
        <Card title={title}>
          <Form {...formItemLayout}>
            <Item label="商品名称">
              {
                getFieldDecorator('name', {
                  initialValue:product.name,
                  rules: [
                    {required: true, message: '必须输入商品名称'}
                  ]
                })(<Input placeholder='请输入商品名称' />)
            }
          </Item>
            <Item label="商品描述">
              {
                getFieldDecorator('desc', {
                  initialValue: product.desc,
                  rules: [
                    {required: true, message: '必须输入商品描述'}
                  ]
                })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />)
              }

            </Item>
            <Item label="商品价格">

              {
                getFieldDecorator('price', {
                  initialValue: product.price,
                  rules: [
                    {required: true, message: '必须输入商品价格'},
                    {validator:this.validatePrice}
                  ]
                })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'/>)
              }
            </Item>
            <Item label='商品图片'>
              <PicturesWall ref={this.getImg} imgs={product.imgs}/>
            </Item>
            <Item label="商品分类">
              {
                getFieldDecorator('categoryIds', {
                  initialValue: categoryArry,
                  rules: [
                    {required: true, message: '必须指定商品分类'},
                  ]
                })(
                    <Cascader
                        placeholder='请指定商品分类'
                        options={this.state.options}
                        loadData={this.loadData}
                        changeOnSelect
                    />
                )
              }

            </Item>
            <Item labelCol={{span:2}} wrapperCol={{span:20}}>
              <RichTextEditor ref={this.getHtml} html={product.detail}/>
            </Item>
            <Item>
              <Button type='primary' onClick={this.submit}>提交</Button>
            </Item>
          </Form>
        </Card>

    );
  }
}
export default Form.create()(ProductAdd);