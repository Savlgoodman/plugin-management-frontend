<template>
    <el-tooltip
        :content="content"
        placement="top"
        effect="light"
        :show-arrow="true"
        class="help-tooltip"
    >
        <el-icon class="help-icon" :size="16">
            <QuestionFilled />
        </el-icon>
    </el-tooltip>
</template>

<script>
export default {
    name: "HelpTooltip",
    props: {
        content: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped>
.help-icon {
    color: #909399;
    cursor: help;
    transition: color 0.3s ease;
}

.help-icon:hover {
    color: #409eff;
}
</style>
