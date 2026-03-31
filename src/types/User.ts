export type Role = "admin" | "user";

export interface User {
  id: number;
  name: string;
  role: Role;
}

// Текущий пользователь (для демонстрации)
export const currentUser: User = {
  id: 1,
  name: "Admin",
  role: "admin", // "user" для теста обычного пользователя,"admin" - для администратора
};