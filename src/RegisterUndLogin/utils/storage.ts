export const saveUser = (user: any) => {
localStorage.setItem("auth_user", JSON.stringify(user));
};


export const getUser = () => {
const data = localStorage.getItem("auth_user");
return data ? JSON.parse(data) : null;
};


export const clearUser = () => {
localStorage.removeItem("auth_user");
};