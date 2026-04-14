import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

async function main() {
  console.log("🚀 开始初始化数据库...");

  try {
    // 检查是否已存在默认管理员
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: "admin" },
    });

    if (existingAdmin) {
      console.log("ℹ️  默认管理员账号已存在");
      return;
    }

    // 创建默认管理员
    const hashedPassword = await bcrypt.hash("helen2026", 10);

    await prisma.admin.create({
      data: {
        username: "admin",
        password: hashedPassword,
        email: "admin@whelen.local",
        role: "super_admin",
      },
    });

    console.log("✅ 默认管理员账号创建成功！");
    console.log("   用户名: admin");
    console.log("   密码: helen2026");
  } catch (error) {
    console.error("❌ 数据库初始化失败:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
