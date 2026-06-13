//Criei essa interface para representar o usuário autenticado, que pode
//ser utilizado em várias partes do sistema, como por exemplo, para verificar
//se o usuário tem permissão para acessar determinada rota ou recurso.

export interface UsuarioAutenticado {
    id: number; //ID do usuário
    email: string; //email do usuário
    role: string; //papel do usuário ('admin', 'user', etc.)
}