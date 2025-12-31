'use client';

import { useEffect, useRef } from 'react';
import styles from '@/styles/error.module.scss';

export default function Error() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const fontSize: number = 16;
        const columns: number = Math.floor(canvas.width / fontSize);
        const drops: number[] = Array(columns).fill(1);

        const binary: string = '01';

        const draw = () => {
            // Black background with slight transparency for trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = `${fontSize}px monospace`;

            for (let i: number = 0; i < drops.length; i++) {
                // Random binary character
                const text: string = binary[Math.floor(Math.random() * binary.length)];

                // Draw the character
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop to top randomly
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        // Handle window resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={styles.errorContainer}>
            <canvas ref={canvasRef} className={styles.matrixCanvas} />

            <div className={styles.errorContent}>
                <div className={styles.errorBox}>
                    <div className={styles.errorIcon}>
                        <span className={styles.exclamation}>!</span>
                    </div>

                    <h1 className={styles.errorTitle}>SYSTEM ERROR</h1>

                    <div className={styles.errorCode}>ERROR_CODE: 0x{Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase()}</div>

                    <p className={styles.errorMessage}>
                        Error 404: The requested resource was not found on this server.
                    </p>


                    <div className={styles.buttonGroup}>
                        <button onClick={() => window.location.reload()} className={styles.retryButton}>
                            <span className={styles.buttonPrefix}>{'>'}</span> RETRY
                        </button>
                        <button onClick={() => window.location.href = '/'} className={styles.homeButton}>
                            <span className={styles.buttonPrefix}>{'>'}</span> LINKS
                        </button>
                    </div>

                    <div className={styles.terminal}>
                        <div className={styles.terminalLine}>
                            <span className={styles.prompt}>$</span> Analyzing error...
                        </div>
                        <div className={styles.terminalLine}>
                            <span className={styles.prompt}>$</span> <span className={styles.blinking}>_</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}