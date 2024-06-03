<template style="width:100vw;height:100vh;">
  <div id="container">
    <div id="header">
      <div id="welcome">-----欢迎您,{{username}}!</div>
      <div style="display:flex">
        <div class="function" @click="upDate()">刷新</div>
        <div class="function" @click="createRoom(username)">创建房间</div>
      </div>
    </div>
    <div id="rooms">
      <div class="room" v-for="item in dataList">
        房间号:{{ item.roomId }}<br>
        房主:{{ item.hostname }}<br>
        玩家一:{{ item.username1 }}<br>
        玩家二:{{ item.username2 }}
        <div class="buttonGroup">
          <div class="button" v-if="item.username2==null&&item.username1!=username" @click="joinRoom(item.roomId,item.username1,username)">
            加入
          </div>
          <div class="button"  v-if="item.hostname == username" @click="deleteRoom(item.roomId)">
            删除
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  <script lang="ts">
  import { defineComponent } from "vue";
  import {
    getRoomList,
    createRoom,
    deleteRoom,
    joinRoom,
  } from "../services/mainServ";
  import { message } from "../tools/messageBox";
  import { type RoomItem } from "~/models/general";
  export default defineComponent({
    //返回的数据，templte中使用的数据
    data: () => ({
      username: "",
      dataList:[] as RoomItem[]
    }),
    //页面加载后执行的函数， 执行性一次.
    async created() {
        const res = this.$route.query.username;
        if (res != null) {
            this.username = res.toString();
        }
        if (this.username != null) {
            this.dataList = (await getRoomList()).data;
        }
    },
    //页面加载后执行的函数， 执行性多次
    methods: {
      async upDate(){
        this.dataList = (await getRoomList()).data;
        message(this, "刷新成功！");
      },
      async createRoom(username:string){
      let res = await createRoom({
        hostname:this.username,
        username1: this.username,
        content:'0'.repeat(361)
      });
      if (res.code == 0) {
        this.dataList = (await getRoomList()).data;
        let roomId=0;
        for(let i=0;i<this.dataList.length;i++){
          if(this.dataList[i].hostname==this.username){
            roomId=this.dataList[i].roomId
          }
        }
        this.$router.push({ path: "/Room", query: { 
          roomId:roomId,
          username:this.username,
          hostname:this.username,
         }})
        message(this, "创建成功！");
      } else {
        message(this, res.msg);
      }
     },
     async deleteRoom(roomId:number){
      let res = await deleteRoom({
        roomId:roomId
      });
      if (res.code == 0) {
        this.dataList = (await getRoomList()).data;
        message(this, "删除成功！");
      } else {
        message(this, res.msg);
      }
     },
     async joinRoom(roomId:number,username1:string,username2:string){
      let res = await joinRoom({
        roomId:roomId,
        username2:username2
      });
      if (res.code == 0) {
        this.dataList = (await getRoomList()).data;
        this.$router.push({ path: "/Room", query: { 
          roomId:roomId,
          username:this.username,
          hostname:username1,
         }})
        message(this, "加入成功！");
      } else {
        message(this, res.msg);
      }
     }
    },
  });
  </script>
  <style>
  #container{
    width:100%;
    height:100%;
  }
  #header{
    width:100%;
    height:30px;
    text-align:left;
    font-size:25px;
    color:black;
    border-style: solid;
    border-color: black;
    display:flex;
    justify-content:space-between;
  }
  #welcome{
    width:200px;
    height:100%;
    overflow: hidden;
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
  #rooms{
    width:100%;
    display:flex;
    flex-wrap: wrap;
  }
  .room{
    display:flex;
    position: relative;
    flex-direction: column;
    width:150px;
    height:150px;
    margin-right: 30px;
    margin-bottom: 30px;
    font-size:20px;
    line-height: 20px;
    color:black;
    border-style: solid;
    border-color: black;
  }
.button {
    overflow: hidden;
    background-color: rgb(137, 137, 253);
    color: #fff;
    border: none;
    width: 50px;
    height: 20px;
    font-size: 18px;
    cursor: pointer;
    outline: none;
    text-align: center;
  }
  .buttonGroup{
    width:100%;
    display:flex;
    justify-content: space-around;
    position: absolute;
    bottom: 0;
    margin-bottom:20px;
  }
  </style>