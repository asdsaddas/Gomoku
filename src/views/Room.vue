<template style="width:100vw;height:100vh;">
<div id="container">
    <div id="board">
        <div v-for="(item, key) in board" :key="key" class="grid" :id="`point${Math.floor(key/19)}-${key%19}`" @click="click(Math.floor(key/19), key%19)"></div>
    </div>
    <div id="information">
        <div>欢迎您:{{username}}!</div>
        <div id="roomId">{{roomId}}号房</div>
        <div id="host">房主:{{hostname}}</div>
        <div id="players">{{username1}} VS {{username2}}</div>
    </div>
</div>
</template>
<script lang="ts">
import { defineComponent} from 'vue';
import {
    getRoomData,
    editContent,
} from "../services/mainServ";
import { message } from "../tools/messageBox";
export default defineComponent({
    /*
    0------------------>y
    |
    |
    |
    |
    |
    |
    x
    */
    //返回的数据，templte中使用的数据
    data: () => ({
        roomId:0,
        username:"",
        hostname:"",
        username1:"",
        username2:"",
        content:"",
        board:[] as string[],
        //是否有赢家
        win:false,
        timer:""
    }),
    //页面加载后执行的函数， 执行性一次.
    async created() {
        const res = this.$route.query;
        const res1=(await getRoomData({roomId:Number(res.roomId!)})).data[0]
        this.roomId = Number(res.roomId!);
        this.username = res.username!.toString();
        this.hostname = res1.hostname!.toString();
        this.username1 = res1.username1!.toString();
        if(res1.username2!=null){
            this.username2 = res1.username2.toString();
        }
        this.content=res1.content!.toString();
        this.board=this.content.split('')
    },
    mounted() {
        this.timer = setInterval(this.upDate, 1000) as unknown as string;
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    //页面加载后执行的函数， 执行性多次
    methods: {
        async upDate(){
            if(this.win){
                return
            }
            let res=(await getRoomData({roomId:this.roomId})).data[0];
            console.log(res)
            console.log(res.username2)
            if (res != null) {
                this.roomId = Number(res.roomId!);
                this.hostname = res.hostname!.toString();
                this.username1 = res.username1!.toString();
                this.username2 = res.username2.toString();
                this.content=res.content!.toString();
            }
            for(let x=0;x<19;x++){
                for(let y=0;y<19;y++){
                    if(this.content[x*19+y]=='1'){
                        document.getElementById(`point${x}-${y}`)!.innerHTML="<img class='image' src='../src/assets/img/blackGo.png'>"
                    }else if(this.content[x*19+y]=='2'){
                        document.getElementById(`point${x}-${y}`)!.innerHTML="<img class='image' src='../src/assets/img/whiteGo.png'>"
                    }
                }
            }
            this.Check()
        },
        async click(x:number,y:number){
            if(this.win){
                return
            }
            let count=0;
            for(let i=0;i<this.content.length;i++){
                if(this.content[i]!='0'){
                    count++
                }
            }
            if((this.username==this.username1&&count%2==1)||(this.username==this.username2&&count%2==0)){
                message(this, "现在不该你行棋！");
                return 
            }else if(this.content[x*19+y]!='0'){
                return
            }else{
                let c=(this.hostname==this.username)?'1':'2';
                this.content = this.content.slice(0, x*19+y) + c + this.content.slice(x*19+y +1);
                document.getElementById(`point${x}-${y}`)!.innerHTML=(this.hostname==this.username)?"<img class='image' src='../src/assets/img/blackGo.png'>":"<img class='image' src='../src/assets/img/whiteGo.png'>";
                let res=(await editContent({roomId:this.roomId,content:this.content})).data;
            }
            this.Check()
        },
        Check(){
            //检测是否有赢家
            let arr=[]
            for(let i=0;i<19;i++){
                let temp=this.content.substring(i*19,i*19+19).split('')
                arr.push(temp)
            }
            console.log(arr)
            //行检测
            for(let i=0;i<19;i++){
                for(let j=0;j<15;j++){
                    if(arr[i][j]=='1'&&arr[i][j+1]=='1'&&arr[i][j+2]=='1'&&arr[i][j+3]=='1'&&arr[i][j+4]=='1'){
                        var informationElement = document.getElementById('information');
                        informationElement!.innerHTML += "<div id='win'>黑方胜</div>";
                        this.win=true
                        return
                    }else if(arr[i][j]=='2'&&arr[i][j+1]=='2'&&arr[i][j+2]=='2'&&arr[i][j+3]=='2'&&arr[i][j+4]=='2'){
                        var informationElement = document.getElementById('information');
                        informationElement!.innerHTML += "<div id='win'>白方胜</div>";
                        this.win=true
                        return
                    }
                }
            }
            //列检测
            for(let i=0;i<15;i++){
                for(let j=0;j<19;j++){
                    if(arr[i][j]=='1'&&arr[i+1][j]=='1'&&arr[i+2][j]=='1'&&arr[i+3][j]=='1'&&arr[i+4][j]=='1'){
                        var informationElement = document.getElementById('information');
                        informationElement!.innerHTML += "<div id='win'>黑方胜</div>";
                        this.win=true
                        return
                    }else if(arr[i][j]=='2'&&arr[i+1][j]=='2'&&arr[i+2][j]=='2'&&arr[i+3][j]=='2'&&arr[i+4][j]=='2'){
                        var informationElement = document.getElementById('information');
                        informationElement!.innerHTML += "<div id='win'>白方胜</div>";
                        this.win=true
                        return
                    }
                }
            }
            //左上-右下斜检测
            for(let i=0;i<15;i++){
                for(let j=0;j<15;j++){
                    if(arr[i][j]=='1'&&arr[i+1][j+1]=='1'&&arr[i+2][j+2]=='1'&&arr[i+3][j+3]=='1'&&arr[i+4][j+4]=='1'){
                        var informationElement = document.getElementById('information');
                        informationElement!.innerHTML += "<div id='win'>黑方胜</div>";
                        this.win=true
                        return
                    }else if(arr[i][j]=='2'&&arr[i+1][j+1]=='2'&&arr[i+2][j+2]=='2'&&arr[i+3][j+3]=='2'&&arr[i+4][j+4]=='2'){
                        var informationElement = document.getElementById('information');
                        informationElement!.innerHTML += "<div id='win'>白方胜</div>";
                        this.win=true
                        return
                    }
                }
            }
            //左下-右上斜检测
            for(let i=4;i<19;i++){
                for(let j=0;j<15;j++){
                    if(arr[i][j]=='1'&&arr[i-1][j+1]=='1'&&arr[i-2][j+2]=='1'&&arr[i-3][j+3]=='1'&&arr[i-4][j+4]=='1'){
                        var informationElement = document.getElementById('information');
                        informationElement!.innerHTML += "<div id='win'>黑方胜</div>";
                        this.win=true
                        return
                    }else if(arr[i][j]=='2'&&arr[i-1][j+1]=='2'&&arr[i-2][j+2]=='2'&&arr[i-3][j+3]=='2'&&arr[i-4][j+4]=='2'){
                        var informationElement = document.getElementById('information');
                        informationElement!.innerHTML += "<div id='win'>白方胜</div>";
                        this.win=true
                        return
                    }
                }
            }
        }
      }
    });
</script>
<style>
#container{
    display: flex; 
}
.grid {
    position: relative; /* 设置相对定位，为了让图片的绝对定位相对于容器 */
}
.image {
    width: 100%; /* 设置图片宽度为容器宽度 */
    height: 100%; /* 设置图片高度为容器高度 */
    object-fit: cover; /* 控制图片如何填充容器，可以根据需要进行调整 */
    position: absolute; /* 设置绝对定位，让图片相对于容器进行定位 */
    top: 0; /* 图片定位在容器顶部 */
    left: 0; /* 图片定位在容器左侧 */
}
#board{
    width:1315px;
    height:1315px;
    background-image: url(../assets/img/board.png);
    background-repeat: no-repeat;
    display:grid;
    grid:repeat(19,1fr)/repeat(19,1fr)
}
#information{
    margin:auto;
    font-size: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center; /* 水平居中 */
    align-items: center; 
}
#win{
    font-size:80px;
    color: red;
}
.function{
    position: relative;
    background-color: rgb(56, 205, 125);
    color: #0c0b0b;
    font-size: 20px;
    text-align: center;
    border: solid;
    border-radius: 5px;
    width: 100px;
    height: 28px;
    cursor: pointer;
  }
</style>