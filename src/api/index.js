import jsonp from 'jsonp';
import {message} from 'antd';
import ajax from './ajax';
const BASE = '';
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');
export const reqWeather = (city)=>{
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (err, data) => {
      if (!err && data.status==='success') {
        // 取出需要的数据
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        message.error('获取天气信息失败!')
      }

    })
  })
};
// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId});

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST');

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST');
//获取商品列表
export const reqProduct=(pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize});
//搜索商品,有两种SearchType类型，一种是更具名字搜索，一种是更具内容描述进行搜索
export const reqSearchProduct=(pageNum,pageSize,SearchName,SearchType)=>ajax(BASE+'/manage/product/search',{pageNum,pageSize,[SearchType]:SearchName});
//更新商品的状态，判断是否已上架
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST');
//获取商品所属分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId});
//删除图片列表
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST');
//更新或添加商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST');
//获取所有角色
export const reqRole = ()=>ajax(BASE+'/manage/role/list');
//添加角色
export const reqAddRole = (name)=>ajax(BASE+'/manage/role/add',{name},'POST');
//更新角色
export const reqUpdateRole = (role)=>ajax(BASE+'/manage/role/update',role,'POST');
//获取所有用户
export const reqUsers=()=>ajax(BASE+'/manage/user/list');
//删除用户
export const reqDeleteUser=(userId)=>ajax(BASE+'/manage/user/delete',{userId},'POST');
//添加用户
export const reqAddOrUpdateUser=(user)=>ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,'POST');