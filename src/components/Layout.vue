<template>
    <div class="layout">
        <TopNavbar />
        <main class="main-content">
            <router-view />
        </main>
        <AppFooter />
    </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import AppFooter from "./AppFooter.vue";

export default {
    name: "Layout",
    components: {
        TopNavbar,
        AppFooter,
    },
};
</script>

<style scoped>
.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
    padding-top: 20px;
    min-height: calc(100vh - 120px);
}
</style>
