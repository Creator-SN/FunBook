(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6c3093e0"],{"2bb0":function(e,i,t){},"44e7":function(e,i,t){"use strict";t.r(i);var a=function(){var e=this,i=e._self._c;return i("div",{attrs:{id:"app"}},[i("div",[i("div",{staticClass:"nav"},[e._v("Microsoft Graph API")]),i("ul",{staticClass:"api-list"},[i("li",{staticClass:"api-item"},[i("div",{staticClass:"title"},[e._v("ONEDRIVE")]),i("input",{ref:"file",attrs:{type:"file"}}),i("button",{on:{click:e.uploadLarge}},[e._v("上传")])])])])])},n=[],s=(t("d048"),{name:"OneDrive",mounted(){},methods:{async upload(){let e=new OneDrive(client),i=this.$refs.file,t=await e.getMyDriveRootInfo();if(void 0!=i.files){let a=i.files[0];await e.putMyDriveSmallFile(t.id,a)}},async uploadLarge(){let e=new OneDrive(client),i=this.$refs.file,t=await e.getMyDriveRootInfo();if(void 0!=i.files){let a=i.files[0];await e.putMyDriveLargeFile(t.id,a,"rename")}},async getRoot(){let e=new OneDrive(client);await e.getMyDriveItemChildren("B5C6E21C3CAF1327!1528")}}}),l=s,o=(t("9f9e"),t("560e"),t("8e3e")),r=Object(o["a"])(l,a,n,!1,null,"f40fcbaa",null);i["default"]=r.exports},"560e":function(e,i,t){"use strict";t("e949")},"9f9e":function(e,i,t){"use strict";t("2bb0")},e949:function(e,i,t){}}]);
//# sourceMappingURL=chunk-6c3093e0.20c72b2f.js.map