import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input
} from 'antd'

const Item = Form.Item;

class UpdateCategory extends Component {
  static propTypes ={
    categoryName:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  };
  componentWillMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {categoryName}=this.props;
    return (
        <Form>
          <Item>
            {
              getFieldDecorator('categoryName', {
                initialValue:categoryName,
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

export default Form.create()(UpdateCategory);