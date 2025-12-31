'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/error.module.scss';

export default function Error() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const promptLines = [
        '',
        'Analyzing error...',
        'Checking system logs...',
        'Link status: unreachable',
        'Please try again later.'
    ];
    const [currentLine, setCurrentLine] = useState<number>(0);
    const [currentPrompt, setCurrentPrompt] = useState<string>(promptLines[0]);
    const [errorCode, setErrorCode] = useState<string>('');
    const cursorRef = useRef<HTMLSpanElement>(null);

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

        const randomErrorCode = Math.floor(Math.random() * 0xFFFFF).toString(16).toUpperCase().padStart(5, '0');
        setErrorCode(randomErrorCode);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const promptInterval = setInterval(() => {
            
            setCurrentLine((prevLine) => {
                if (prevLine >= promptLines.length - 1) {
                    return prevLine;
                }
                const nextLine = (prevLine + 1)
                for (let i = 0; i < promptLines[nextLine].length; i++) {
                    setTimeout(() => {
                        setCurrentPrompt(promptLines[nextLine].substring(0, i + 1));
                        if (cursorRef.current) {
                            if (i === promptLines[nextLine].length - 1) {
                                cursorRef.current.classList.add(styles.visible);
                            } else {
                                cursorRef.current.classList.remove(styles.visible);
                            }
                        }
                    }, i * 20);
                }
                return nextLine;
            });
        }, 1500);

        return () => clearInterval(promptInterval);
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

                    <div className={styles.errorCode}>ERROR_CODE: 0x{errorCode}</div>

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
                            <span>
                                {promptLines.slice(1, currentLine).map((line, index) => (
                                    <span key={index}>
                                        <span className={styles.prompt}>$</span>{line}
                                        <span className={styles.terminalBreak}></span>
                                    </span>
                                ))}

                                <span className={styles.prompt}>$</span> 
                                {currentPrompt}
                                <span ref={cursorRef}>█</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}