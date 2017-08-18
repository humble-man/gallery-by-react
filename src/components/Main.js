require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';


let imageDatas = require('../data/imageDatas.json');
//利用自执行函数  将图片名信息转换成图片url路径信息
imageDatas = (function genImageURL(imageDatasArr){
	for(let i=0,j=imageDatasArr.length;i<j;i++){
		let singleImageData = imageDatasArr[i];
		
		singleImageData.imageURL = require('../images/'+singleImageData.fileName);
		
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

function getRangeRandom(low,high){
	return Math.ceil(Math.random() * (high - low) + low);
}

//获取角度
function get30DegRandom(){
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component{
	
	constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick(e){
		 
		  if(this.props.arrange.isCenter){
		  	this.props.inverse();
		  }else{
		  	this.props.center();
		  }
		  e.stopPropagation();
		  e.preventDefault();
	}
	
	
	render(){
		   
		
		let styleObj = {};
		
//		//如果props属性中指定了这张图片的位置  则使用样式
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		
		//如果图片的旋转角度有值  且不为零  添加旋转角度
		if(this.props.arrange.rotate){
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function (value){
				styleObj[value] = 'rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));
		}
		
		
		if(this.props.arrange.isCenter){
			styleObj.zindex=11;
		}
		
		
		let imgFigureClassName = 'img-figure';
		    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		
		
		
		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
			    <img src={this.props.data.imageURL} alt={this.props.data.title}/>
			    <figcaption>
			      <h2  className="img-title"> {this.props.data.title} </h2>
			      <div className = "img-back" onClick = {this.handleClick}>
			         <p>
			           {this.props.data.desc}
			         </p>
			      </div>
			    </figcaption>
			</figure>
		);
	}
}

//控制组件
class ControllerUnit extends React.Component{
	
	constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this);
	}
	
	
	handleClick(e){
		 
		  //如果点击的是正在选中态的按钮 则翻转图片 否则 居中
		  if(this.props.arrange.isCenter){
		  	this.props.inverse();
		  }else{
		  	this.props.center();
		  }
		  
		  e.stopPropagation();
		  e.preventDefault();
	}
	
	render(){
		
		let controlelrUnitClassName = 'controller-unit';
				
		if(this.props.arrange.isCenter){
			controlelrUnitClassName += ' is-center';
			
			if(this.props.arrange.isInverse){
				controlelrUnitClassName += ' is-inverse';
			}
		}
		return (
			<span className = {controlelrUnitClassName} onClick={this.handleClick}>
			</span>
		);
	}
	
}



class AppComponent extends React.Component {
	

constructor(props){
        super(props);
         /***位置范围常量***/
        this.state = {imgsArrangeArr:[]};
        this.Constant= {
          centerPos:{
            left:0,
            top: 0
          },
          hPosRange:{
            leftSecX:[0,0],
            rightSecX:[0,0],
            y:[0,0]
          },
          vPosRange:{
            x:[0,0],
            topY:[0,0]
          }
        };
}

inverse(index){
        	return function(){
        		 let imgsArrangeArr = this.state.imgsArrangeArr;
        		 
        		 imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
        		 
        		 this.setState({
        		 	imgsArrangeArr: imgsArrangeArr
        		 });
        	}.bind(this);
}

//重新布局图片  指定居中哪个图片
rearrange(centerIndex){
	 let imgsArrangeArr = this.state.imgsArrangeArr,
	     Constant = this.Constant,
	     centerPos = Constant.centerPos,
	     hPosRange = Constant.hPosRange,
	     vPosRange = Constant.vPosRange,
	     hPosRangeLeftSecX = hPosRange.leftSecX,
	     hPosRangeRightSecX = hPosRange.rightSecX,
	     hPosRangeY = hPosRange.y,
	     vPosRangeTopY = vPosRange.topY,
	     vPosRangeX = vPosRange.x,



	     imgsArrangeTopArr = [],
	     topImgNum = Math.floor(Math.random() * 2),//取出零张或者一张图片
	     topImgSpliceIndex = 0,
	     imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
	     
	     
	     //居中 centerIndex 的图片,居中的图片不需要旋转
	     imgsArrangeCenterArr[0]={
	     	pos:centerPos,
	     	rotate:0,
	     	isCenter: true
	     }
	     
	     
	     //取出要布局上侧的图片的状态信息
	     topImgSpliceIndex = Math.ceil(Math.random * (imgsArrangeArr.length - topImgNum));
	     imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
	     
	     
	     
//	     //布局位于上侧的图片
	     imgsArrangeTopArr.forEach(function(value,index){
	     	imgsArrangeTopArr[index] = {
	     		pos : {
	     			    top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
	     		        left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
	     		     },
	     		rotate : get30DegRandom(),
	     		isCenter: false
	     	};
	     });



	     //布局两侧的图片信息
	     for(let i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
	     	let hPosRangeLORX = null;
	     	//前左  后右边
	     	if(i<k){
	     		hPosRangeLORX = hPosRangeLeftSecX;
	     	}
	     	else {
	     		hPosRangeLORX = hPosRangeRightSecX;
	     	}


	     	imgsArrangeArr[i] = {
	     		pos:{
	     			  top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
	     		      left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
	     		 },
	     		rotate: get30DegRandom(),
	     		isCenter: false
	     	};
	     	
	     }
     

	     if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
	     	  imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
	     }
	     
	     imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
	     
	     this.setState({
	     	imgsArrangeArr: imgsArrangeArr
	     });
	     
}


//指定要居中的图片
center(index){
	return function(){
		this.rearrange(index);
	}.bind(this);
}



componentDidMount(){
	//取得舞台的大小
	 let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
	     stageW = stageDOM.scrollWidth,
	     stageH = stageDOM.scrollHeight,
	     halfStageW = Math.ceil(stageW / 2),
	     halfStageH = Math.ceil(stageH / 2);
	     
	     
	//获取一个imgFigure 的大小
	 let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
         imgW = imgFigureDOM.scrollWidth,
         imgH = imgFigureDOM.scrollHeight,
         halfImgW = Math.ceil(imgW / 2),
         halfImgH = Math.ceil(imgH / 2);
         
         
     this.Constant.centerPos = {//计算中心点的位置
          left:halfStageW - halfImgW,
          top: halfStageH - halfImgH
     };
     
     //计算左右两侧区域图片的排布位置的取值范围
     this.Constant.hPosRange.leftSecX[0] = -halfImgW;
     this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
     this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
     this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
     this.Constant.hPosRange.y[0] = -halfImgH;
     this.Constant.hPosRange.y[1] = stageH - halfImgH;
     
     
     //计算上侧区域图片排布位置的取值范围
     this.Constant.vPosRange.topY[0] = -halfImgH;
     this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
     this.Constant.vPosRange.x[0] = halfStageW - imgW;
     this.Constant.vPosRange.x[1] = halfStageW;
     
     
     this.rearrange(0);
	 
}


  render(){
  	let that=this, controllerUnits = [],imgFigures = [];
	imageDatas.forEach(function(value,index){
		
		if(!that.state.imgsArrangeArr[index]){
			this.state.imgsArrangeArr[index] = {
				pos:{
					left: 0,
					top: 0
				},
				rotate: 0,
				isInverse: false,
				isCenter: false
			};
		}
		
		imgFigures.push(<ImgFigure key={index} data={value} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)} ref={'imgFigure'+index}/>);
		
		controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		
	}.bind(this));
  	
    return (
      <section className="stage" ref="stage">
          <section className="img-sec">
             {imgFigures}
          </section>
          <nav className="controller-nav">
             {controllerUnits}
          </nav>
      </section>
    );
  }
}
AppComponent.defaultProps = {
};
export default AppComponent;