module.exports={
  setItem(key,value,module_name){
    if(module_name){
   let module_name_info=this.getItem(module_name);
      module_name_info[key]=value;
      wx.setStorageSync(module_name, module_name_info)
    }else{
      wx.setStorageSnync(key,value)
    }
  }
}