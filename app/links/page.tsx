'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/links.module.scss';

interface Link {
  id: number;
  title: string;
  url: string;
  description: string;
  icon?: string;
}

export default function Links() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Sample links - replace with your actual links
  const links: Link[] = [
    {
      id: 1,
      title: 'GitHub',
      url: 'https://github.com/enVId-tech',
      description: 'Source code repositories',
      icon: '⌨'
    },
    {
      id: 2,
      title: 'Portfolio',
      url: 'https://etran.dev',
      description: 'My work and projects',
      icon: ''
    }
  ];

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const binary = '01';

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = binary[Math.floor(Math.random() * binary.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

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

  const handleCopyLink = (link: Link) => {
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={styles.linksContainer}>
      <canvas ref={canvasRef} className={styles.matrixCanvas} />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>ACCESS DIRECTORY</h1>
            <div className={styles.subtitle}>
              <span className={styles.prompt}>$</span> cat links.db
            </div>
          </div>
          
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>ENTRIES:</span>
              <span className={styles.statValue}>{links.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>STATUS:</span>
              <span className={styles.statValue}>ONLINE</span>
            </div>
          </div>
        </div>

        <div className={styles.linksGrid}>
          {links.map((link, index) => (
            <div 
              key={link.id} 
              className={styles.linkCard}
              style={mounted ? { animationDelay: `${index * 0.1}s` } : undefined}
            >
              <div className={styles.linkHeader}>
                <div className={styles.linkIcon}>{link.icon}</div>
                <div className={styles.linkNumber}>
                  [{String(link.id).padStart(2, '0')}]
                </div>
              </div>
              
              <h3 className={styles.linkTitle}>{link.title}</h3>
              <p className={styles.linkDescription}>{link.description}</p>
              
              <div className={styles.linkUrl}>
                <code>{link.url}</code>
              </div>

              <div className={styles.linkActions}>
                <a 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.visitButton}
                >
                  <span className={styles.buttonPrefix}>{'>'}</span> ACCESS
                </a>
                
                <button 
                  onClick={() => handleCopyLink(link)}
                  className={styles.copyButton}
                >
                  <span className={styles.buttonPrefix}>{'>'}</span>
                  {copiedId === link.id ? 'COPIED' : 'COPY'}
                </button>
              </div>

              <div className={styles.cardScanline}></div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.terminal}>
            <div className={styles.terminalLine}>
              <span className={styles.prompt}>$</span> Connection established
            </div>
            <div className={styles.terminalLine}>
              <span className={styles.prompt}>$</span> Ready for access_
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
