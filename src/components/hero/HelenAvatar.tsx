"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

export function HelenAvatar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 400, H = 520;
    canvas.width = W;
    canvas.height = H;

    let frame = 0;
    let animId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const t = frame * 0.015;

      ctx.save();
      ctx.translate(W / 2, H / 2 - 20);

      // 外层海洋波浪环
      for (let ring = 0; ring < 3; ring++) {
        const r = 165 + ring * 18;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.02) {
          const wave = Math.sin(a * 5 + t * (1 + ring * 0.3)) * (3 + ring * 2);
          const x = Math.cos(a) * (r + wave);
          const y = Math.sin(a) * (r + wave);
          a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(46, 134, 171, ${0.12 - ring * 0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 内圈光晕
      const pulseR = 125 + Math.sin(t) * 5;
      const grad = ctx.createRadialGradient(0, 0, pulseR * 0.2, 0, 0, pulseR);
      grad.addColorStop(0, "rgba(201, 169, 110, 0.06)");
      grad.addColorStop(0.5, "rgba(46, 134, 171, 0.03)");
      grad.addColorStop(1, "rgba(10, 22, 40, 0)");
      ctx.beginPath();
      ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // === 机器人头部 ===
      const headY = -50;

      // 天线
      ctx.beginPath();
      ctx.moveTo(0, headY - 52);
      ctx.lineTo(0, headY - 38);
      ctx.strokeStyle = "rgba(201, 169, 110, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
      // 天线顶部圆球
      const antGlow = 0.5 + Math.sin(t * 3) * 0.3;
      ctx.beginPath();
      ctx.arc(0, headY - 55, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${antGlow})`;
      ctx.fill();
      // 天线光晕
      ctx.beginPath();
      ctx.arc(0, headY - 55, 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${antGlow * 0.15})`;
      ctx.fill();

      // 头部（圆角矩形）
      roundRect(ctx, -38, headY - 38, 76, 70, 18);
      ctx.fillStyle = "rgba(20, 45, 70, 0.5)";
      ctx.fill();
      ctx.strokeStyle = "rgba(201, 169, 110, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 面板光泽
      const shineGrad = ctx.createLinearGradient(-38, headY - 38, 38, headY + 32);
      shineGrad.addColorStop(0, "rgba(46, 134, 171, 0.08)");
      shineGrad.addColorStop(0.5, "rgba(201, 169, 110, 0.03)");
      shineGrad.addColorStop(1, "rgba(46, 134, 171, 0.05)");
      roundRect(ctx, -38, headY - 38, 76, 70, 18);
      ctx.fillStyle = shineGrad;
      ctx.fill();

      // 眼睛（发光圆形，带扫描效果）
      const eyeGlow = 0.6 + Math.sin(t * 2) * 0.2;
      [-16, 16].forEach((ex) => {
        // 眼眶
        ctx.beginPath();
        ctx.arc(ex, headY - 5, 12, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(10, 22, 40, 0.6)";
        ctx.fill();
        ctx.strokeStyle = `rgba(201, 169, 110, ${eyeGlow * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        // 瞳孔
        ctx.beginPath();
        ctx.arc(ex, headY - 5, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${eyeGlow})`;
        ctx.fill();
        // 高光
        ctx.beginPath();
        ctx.arc(ex + 2, headY - 7, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${eyeGlow * 0.5})`;
        ctx.fill();
        // 外发光
        ctx.beginPath();
        ctx.arc(ex, headY - 5, 14, 0, Math.PI * 2);
        const eyeGlowGrad = ctx.createRadialGradient(ex, headY - 5, 6, ex, headY - 5, 14);
        eyeGlowGrad.addColorStop(0, `rgba(201, 169, 110, ${eyeGlow * 0.15})`);
        eyeGlowGrad.addColorStop(1, "rgba(201, 169, 110, 0)");
        ctx.fillStyle = eyeGlowGrad;
        ctx.fill();
      });

      // 嘴巴（LED条）
      const mouthWidth = 20 + Math.sin(t * 1.5) * 3;
      ctx.beginPath();
      ctx.moveTo(-mouthWidth / 2, headY + 18);
      ctx.lineTo(mouthWidth / 2, headY + 18);
      ctx.strokeStyle = `rgba(46, 134, 171, ${0.5 + Math.sin(t * 2) * 0.2})`;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.lineCap = "butt";

      // 耳朵/传感器
      [-42, 42].forEach((ex) => {
        ctx.beginPath();
        ctx.roundRect(ex - 4, headY - 15, 8, 24, 3);
        ctx.fillStyle = "rgba(27, 73, 101, 0.4)";
        ctx.fill();
        ctx.strokeStyle = "rgba(201, 169, 110, 0.2)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // 传感器灯
        ctx.beginPath();
        ctx.arc(ex, headY - 3, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(46, 134, 171, ${0.4 + Math.sin(t * 2.5 + (ex > 0 ? 1 : 0)) * 0.3})`;
        ctx.fill();
      });

      // === 脖子 ===
      ctx.beginPath();
      ctx.moveTo(-8, headY + 32);
      ctx.lineTo(-10, headY + 45);
      ctx.lineTo(10, headY + 45);
      ctx.lineTo(8, headY + 32);
      ctx.fillStyle = "rgba(27, 73, 101, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "rgba(201, 169, 110, 0.15)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // === 身体 ===
      const bodyY = headY + 45;

      // 躯干
      roundRect(ctx, -35, bodyY, 70, 85, 12);
      ctx.fillStyle = "rgba(20, 45, 70, 0.4)";
      ctx.fill();
      ctx.strokeStyle = "rgba(201, 169, 110, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 胸部面板
      roundRect(ctx, -22, bodyY + 10, 44, 30, 6);
      ctx.fillStyle = "rgba(10, 22, 40, 0.5)";
      ctx.fill();
      ctx.strokeStyle = "rgba(46, 134, 171, 0.2)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 胸部数据流（滚动的数字/线条）
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-22, bodyY + 10, 44, 30, 6);
      ctx.clip();
      for (let i = 0; i < 4; i++) {
        const lineY = bodyY + 16 + i * 7;
        const offset = (t * 30 + i * 20) % 44;
        ctx.beginPath();
        ctx.moveTo(-22 + offset, lineY);
        ctx.lineTo(-22 + offset + 15, lineY);
        ctx.strokeStyle = `rgba(201, 169, 110, ${0.15 + Math.sin(t + i) * 0.08})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // 核心能量（胸口中心）
      const coreGlow = 0.4 + Math.sin(t * 1.8) * 0.2;
      ctx.beginPath();
      ctx.arc(0, bodyY + 55, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${coreGlow})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, bodyY + 55, 12, 0, Math.PI * 2);
      const coreGrad = ctx.createRadialGradient(0, bodyY + 55, 3, 0, bodyY + 55, 12);
      coreGrad.addColorStop(0, `rgba(201, 169, 110, ${coreGlow * 0.3})`);
      coreGrad.addColorStop(1, "rgba(201, 169, 110, 0)");
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // 手臂
      [-1, 1].forEach((dir) => {
        const ax = dir * 38;
        ctx.beginPath();
        ctx.moveTo(ax, bodyY + 8);
        ctx.lineTo(ax + dir * 8, bodyY + 8);
        ctx.lineTo(ax + dir * 10, bodyY + 50);
        ctx.lineTo(ax + dir * 2, bodyY + 50);
        ctx.closePath();
        ctx.fillStyle = "rgba(27, 73, 101, 0.3)";
        ctx.fill();
        ctx.strokeStyle = "rgba(201, 169, 110, 0.15)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // 关节
        ctx.beginPath();
        ctx.arc(ax + dir * 5, bodyY + 30, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(46, 134, 171, 0.3)";
        ctx.fill();
      });

      // 旋转数据点
      ctx.save();
      ctx.rotate(t * 0.1);
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const r = 150 + Math.sin(t * 0.5 + i) * 8;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        const size = 1.5 + Math.sin(t + i * 0.5) * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${0.25 + Math.sin(t + i) * 0.15})`;
        ctx.fill();
      }
      ctx.restore();

      // 浮动宏观标签
      const labels = ["黄金", "白银", "原油", "利率", "汇率", "PMI"];
      labels.forEach((label, i) => {
        const angle = (i / labels.length) * Math.PI * 2 + t * 0.06;
        const r = 140 + Math.sin(t + i * 0.8) * 10;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        ctx.font = "11px 'PingFang SC', sans-serif";
        ctx.fillStyle = i % 2 === 0
          ? `rgba(201, 169, 110, ${0.3 + Math.sin(t + i) * 0.1})`
          : `rgba(46, 134, 171, ${0.3 + Math.sin(t + i) * 0.1})`;
        ctx.fillText(label, x - 11, y);
      });

      // 金色沉淀粒子
      for (let i = 0; i < 8; i++) {
        const px = -160 + (i * 320 / 8) + Math.sin(t * 0.3 + i * 2) * 15;
        const py = ((t * 12 + i * 50) % 350) - 175;
        const alpha = Math.abs(py) > 150 ? 0 : 0.3;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${alpha})`;
        ctx.fill();
      }

      ctx.restore();
      frame++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <canvas ref={canvasRef} className="w-[400px] h-[520px]" style={{ maxWidth: "100%" }} />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="rounded-full border border-[var(--accent-gold)]/30 bg-[var(--bg-card)]/80 backdrop-blur px-6 py-2">
          <span className="text-sm text-gradient-gold font-medium">Helen</span>
          <span className="text-xs text-[var(--text-muted)] ml-2">{t("avatar.label")}</span>
        </div>
      </div>
    </motion.div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
