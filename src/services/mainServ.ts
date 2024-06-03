import { generalRequest } from "~/services/genServ";
import {
  type MenuInfo,
} from "~/models/general";
import { setUncaughtExceptionCaptureCallback } from "process";

//获取菜单列表后台数据请求方法
export async function getMenuList(): Promise<MenuInfo[]> {
  const res = await generalRequest("/api/base/getMenuList", null);
  return res.data as MenuInfo[];
}
//用户注册后台数据请求方法
export async function registerUser(data: Object) {
  return generalRequest("/auth/user/registerUser", data);
}
//用户登录后台数据请求方法
export async function loginUser(data: Object) {
  return generalRequest("/auth/user/loginUser", data);
}
//用户获取房间列表
export async function getRoomList() {
  return generalRequest("/auth/lobby/getRoomList",null);
}
//用户创建房间
export async function createRoom(data:Object) {
  return generalRequest("/auth/lobby/createRoom",data);
} 
//用户删除房间
export async function deleteRoom(data:Object) {
  return generalRequest("/auth/lobby/deleteRoom",data);
} 
//用户进入房间
export async function joinRoom(data:Object) {
  return generalRequest("/auth/lobby/joinRoom",data);
} 
//用户获取房间信息
export async function getRoomData(data:Object) {
  return generalRequest("/auth/room/getRoomData",data);
}
//用户修改棋盘内容
export async function editContent(data:Object) {
  return generalRequest("/auth/room/editContent",data);
}
