import {BACKEND_PORT} from "../../backend.config.json";
export async function AuthLogin(loginData: { email: string; password: string }) {
    const res = await fetch(`http://localhost:${BACKEND_PORT}/admin/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });
    return res.json();
}

export async function AuthRegister(registerData: { name: string; email: string; password: string }) {
    const res = await fetch(`http://localhost:${BACKEND_PORT}/admin/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
    });
    return res.json();
}

export async function GetStore(token: string) {
    const res = await fetch(`http://localhost:${BACKEND_PORT}/store`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    return res.json();
}

export async function UpdateStore(token: string, storeData: { presentations: any[] }) {
    const res = await fetch(`http://localhost:${BACKEND_PORT}/store`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(storeData)
    });
    return res.json();
}