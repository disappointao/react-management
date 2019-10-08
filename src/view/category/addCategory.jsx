import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {
  Form,
  Select,
  Input
} from 'antd'
const Item = Form.Item;
const Option = Select.Option;

class AddCategory extends Component {
  static propTypes={
    category:PropTypes.array.isRequired,
    parentId:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  };
  componentWillMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {category,parentId} =this.props;
    return (
        <Form>
          <Item>
            {
              getFieldDecorator('parentId', {
                initialValue: parentId,
                rules: [
                  {required: true, message: '分类名不为空'}
                ]
              })(
                  <Select>
                    <Option value='0'>一级分类</Option>
                    {
                      category.map((category,index)=>{
                        return (<Option value={category._id} key={index}>{category.name}</Option>)
                      })
                    }
                  </Select>
              )
            }

          </Item>
          <Item>
            {
              getFieldDecorator('categoryName', {
                initialValue: '',
                rules: [
                  {required: true, message: '分类名称必须输入'}
                ]
              })(
                  <Input placeholder='请输入分类名称'/>
              )
            }
          </Item>
        </Form>
    )
  }
}

export default Form.create()(AddCategory);