const { initDefaultAdmin } = require("../src/lib/admin-db");
const { prisma } = require("../src/lib/prisma");

async function main() {
  console.log("🚀 开始初始化数据库...");

  try {
    // 初始化默认管理员账号
    await initDefaultAdmin();

    console.log("✅ 数据库初始化完成！");
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
