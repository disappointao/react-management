import  React,{Component} from 'react';
import {Layout,Icon,Modal} from 'antd';
import {withRouter} from 'react-router-dom';


import './head.less';
import LinkButton from '../link-button/button';
import {formateDate} from '../../utils/dateUtils';
import {reqWeather} from '../../api/index';
import menuList from '../../config/menuConfig';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
const {Header}=Layout;
class Head extends  Component {
  state = {
    currentTime: formateDate(Date.now()),
    dayPictureUrl: '',
    weather: '',
  };
  getWeather=async ()=>{
    const {dayPictureUrl, weather} = await reqWeather('成都');
    this.setState({dayPictureUrl, weather});
  };
  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({currentTime})
    }, 1000)
  };
  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(item => {
      if (item.key===path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0);
        if(cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };
  handleLogout=()=>{
    Modal.confirm({
      content: '确定退出吗?',
      onOk: () => {
        memoryUtils.user={};
        storageUtils.removeUser();
        this.props.history.push('/login');
      }
    });
  };

  componentDidMount(){
    this.getTime();
    this.getWeather();
  }
  componentWillMount() {
    this.title=this.getTitle();
    clearInterval(this.intervalId);
  }

  render() {
    const {currentTime, dayPictureUrl, weather} = this.state;
    const username = memoryUtils.user.username;
    const title=this.getTitle();
    return (
        <Header style={{ background: '#fff', padding: 0,height:80,position:'fixed',left:200,right:0,zIndex:10}} >
          <div className="header-top">
            <span style={{float:'left'}}>欢迎, {username}</span>
            <LinkButton onClick={this.handleLogout}><Icon type="logout" style={{}}/> 退出</LinkButton>
          </div>
          <div className="header-bottom">
            <div className="header-bottom-left">{title}</div>
            <div className="header-bottom-right">
              <span>{currentTime}</span>
              <img src={dayPictureUrl} alt="weather" style={{margin:'0 10px'}}/>
              <span>{weather}</span>
            </div>
          </div>
        </Header>
    );
  }
}
export default withRouter(Head);