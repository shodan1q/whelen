import { hashPassword, verifyPassword } from "./auth";
import { prisma } from "./prisma";

export interface Admin {
  id: string;
  username: string;
  email: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建管理员
 */
export async function createAdmin(
  username: string,
  password: string,
  email?: string,
  role: string = "admin"
): Promise<Admin> {
  const hashedPassword = await hashPassword(password);

  return await prisma.admin.create({
    data: {
      username,
      password: hashedPassword,
      email,
      role,
    },
  });
}

/**
 * 通过用户名查找管理员
 */
export async function findAdminByUsername(
  username: string
): Promise<Admin | null> {
  return await prisma.admin.findUnique({
    where: { username },
  });
}

/**
 * 通过 ID 查找管理员
 */
export async function findAdminById(id: string): Promise<Admin | null> {
  return await prisma.admin.findUnique({
    where: { id },
  });
}

/**
 * 验证管理员登录
 */
export async function verifyAdminLogin(
  username: string,
  password: string
): Promise<Admin | null> {
  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return null;
  }

  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) {
    return null;
  }

  return admin;
}

/**
 * 初始化默认管理员账号
 */
export async function initDefaultAdmin(): Promise<void> {
  const existingAdmin = await findAdminByUsername("admin");

  if (!existingAdmin) {
    await createAdmin("admin", "helen2026", "admin@whelen.local", "super_admin");
    console.log("✅ Default admin account created: admin / helen2026");
  } else {
    console.log("ℹ️  Default admin account already exists");
  }
}

/**
 * 获取所有管理员
 */
export async function getAllAdmins(): Promise<Admin[]> {
  return await prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/**
 * 更新管理员密码
 */
export async function updateAdminPassword(
  id: string,
  newPassword: string
): Promise<Admin> {
  const hashedPassword = await hashPassword(newPassword);

  return await prisma.admin.update({
    where: { id },
    data: { password: hashedPassword },
  });
}

/**
 * 删除管理员
 */
export async function deleteAdmin(id: string): Promise<void> {
  await prisma.admin.delete({
    where: { id },
  });
}
