<template>
<div id="vpfe" class="vpfe">
  <el-container class="vpfe-inner">
    <el-header></el-header>
    <el-main>
        <router-view></router-view>
    </el-main>
    <el-footer></el-footer>
</el-container>
</div>

</template>

<script>
import ElContainer from 'element-ui/lib/container'
import ElMain from 'element-ui/lib/main'
import ElFooter from 'element-ui/lib/footer'
import ElHeader from 'element-ui/lib/header'
export default {
    components: {
        ElHeader,
        ElContainer,
        ElMain,
        ElFooter,
    }
}
</script>

<style>
.vpfe{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.vpfe-inner {
  height: 100%;
}

</style>