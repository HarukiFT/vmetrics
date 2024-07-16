export interface UserData {
    _id: string
    username: string
}

export interface AuthContextProps {
    setToken: (token: string) => void
    userData?: UserData
}