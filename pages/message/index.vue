<template>
  <view>
    <scroll-view scroll-y="true" style="height: 100%">
      <template v-if="userList.length > 0">
        <block  v-for="(item, index) in userList" :key="index">
          <usercard :item="item" :index="index" />
        </block>
      </template>
    </scroll-view>
  </view>
</template>

<script>
import usercard from "./components/user-card/user-card";
export default {
  components: {
    usercard,
  },
  data() {
    return {
      userList: [

        
 
      ],
    };
  },

  onShow(){
    this.getMeaasge()
  },

  methods: {
    getMeaasge(){
			uniCloud.callFunction({
					name: "chat",
					data: {
						name: "getChatList",
						data: {},
					},
				})
				.then((res) => {
			//		console.log(JSON.stringify(res.result.data))
          this.userList = res.result.data
				});	


    }



  },
};
</script>

<style>
page {
  background-color: #f5f6f7;
}

</style>
