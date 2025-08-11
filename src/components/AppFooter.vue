<template>
    <footer class="app-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-left">
                    <div class="copyright">
                        © 2025 Plugin Management Platform. 保留所有权利。
                    </div>
                </div>
                <div class="footer-right">
                    <div class="footer-links">
                        <a href="#" class="footer-link">帮助文档</a>
                        <span class="separator">|</span>
                        <a href="#" class="footer-link">技术支持</a>
                        <span class="separator">|</span>
                        <a href="#" class="footer-link">意见反馈</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: "AppFooter",
};
</script>

<style scoped>
.app-footer {
    background: white;
    color: black;
    padding: 20px 0;
    margin-top: auto;
    border-radius: 20px 20px 0 0;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
}

.footer-left {
    flex: 1;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
}

.footer-right {
    flex: 0 0 auto;
}

.footer-links {
    display: flex;
    align-items: center;
    gap: 12px;
}

.footer-link {
    color: rgba(0, 0, 0, 0.8);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s ease;
}

.footer-link:hover {
    color: white;
}

.separator {
    color: rgba(0, 0, 0, 0.5);
    font-size: 12px;
}

@media (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        text-align: center;
    }

    .footer-left {
        margin-bottom: 8px;
    }

    .footer-links {
        justify-content: center;
    }
}
</style>
