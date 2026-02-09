export const LoginService = {
    
    login: async (username: string, password: string) => {
        // Aquí iría la lógica real de autenticación, por ejemplo, una llamada a una API
        console.log("Attempting login with:", { username, password });
        // Simulamos una respuesta exitosa después de 1 segundo
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, token: "fake-jwt-token" });
            }, 1000);
            sessionStorage.setItem('token', 'fake-jwt-token');
        });
    }

}