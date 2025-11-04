<style>
    .gradient-background {
        position: fixed;
        inset: 0;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
        background: var(--color-background);
    }

    .blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.08;
        animation: float 20s ease-in-out infinite;
    }

    .blob-1 {
        width: 500px;
        height: 500px;
        top: -10%;
        right: -5%;
        background: linear-gradient(135deg, oklch(0.623 0.214 259.815), oklch(0.546 0.245 262.881));
        animation-delay: 0s;
        animation-duration: 25s;
    }

    .blob-2 {
        width: 400px;
        height: 400px;
        bottom: 10%;
        left: 5%;
        background: linear-gradient(135deg, oklch(0.546 0.245 262.881 / 0.7), oklch(0.488 0.243 264.376 / 0.7));
        animation-delay: -7s;
        animation-duration: 30s;
    }

    .blob-3 {
        width: 450px;
        height: 450px;
        top: 40%;
        left: 50%;
        background: linear-gradient(135deg, oklch(0.623 0.214 259.815 / 0.8), oklch(0.967 0.001 286.375));
        animation-delay: -14s;
        animation-duration: 35s;
    }

    @keyframes float {
        0%,
        100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(30px, -50px) scale(1.1);
        }
        66% {
            transform: translate(-20px, 20px) scale(0.9);
        }
    }
</style>

<div class="gradient-background">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
</div>
