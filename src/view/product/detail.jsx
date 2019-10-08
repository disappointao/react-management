import React, {Component} from 'react'
import {Card, Icon, List} from 'antd'

import LinkButton from '../../components/link-button/button';
import {reqCategory} from '../../api/index';
import {BASE_IMG_URL} from '../../utils/contains';
const Item = List.Item;

export default class ProductDetail extends Component {
  state={
    cname1:'',
    cname2:''
  }
   async componentDidMount() {
   const {pCategoryId,categoryId} =this.props.location.state.product;
   let result;
   if(pCategoryId==='0'){
      result =await reqCategory(categoryId);
     if(result.status===0){
       this.setState({
         cname1:result.data.name
       })
     }
   }else{
     result=await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)]);
     this.setState({
       cname1:result[0].data.name,
       cname2:result[1].data.name
     })
   }
  }
  render() {
    const {desc,detail,price,imgs,name} =this.props.location.state.product;
    const {cname1,cname2}=this.state;
    const title = (
        <span>
        <LinkButton>
          <Icon
              type='arrow-left'
              style={{marginRight: 10, fontSize: 20}}
              onClick={() => this.props.history.goBack()}
          />
        </LinkButton>

        <span>商品详情</span>
      </span>
    );
    return (
        <Card title={title} className='product-detail'>
          <List>
            <Item>
              <span className="left">商品名称:</span>
              <span>{name}</span>
            </Item>
            <Item>
              <span className="left">商品描述:</span>
              <span>{desc}</span>
            </Item>
            <Item>
              <span className="left">商品价格:</span>
              <span>{price}元</span>
            </Item>
            <Item>
              <span className="left">所属分类:</span>
              <span>{cname1}{cname2?'-->'+cname2:''}</span>
            </Item>
            <Item>
              <span className="left">商品图片:</span>
              <span>
                {imgs.map((item)=>{
                  return (
                      <img className='product-img' key={item} src={BASE_IMG_URL+item} alt="img"/>
                  )
                })}
              </span>
            </Item>
            <Item>
              <span className="left">商品详情:</span>
              <span dangerouslySetInnerHTML={{__html: detail}}>
            </span>
            </Item>

          </List>
        </Card>
    )
  }
}