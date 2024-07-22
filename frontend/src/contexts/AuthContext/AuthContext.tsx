import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextProps, UserData } from "./AuthContext.interface";
import axiosRequest from "../../shared/services/axiosInstance";

const AuthContext = createContext<AuthContextProps>({
    setToken: () => {}
})

const AuthContextProvider = ({children}: {children: JSX.Element[] | JSX.Element}) => {
    const [token, setToken] = useState<string | undefined>(localStorage.getItem('AUTH_TOKEN') ?? undefined)
    const [userData, setUserData] = useState<UserData>()

    useEffect(() => {
        if (!token || token === '') {
            setUserData(undefined)
            localStorage.removeItem('AUTH_TOKEN')

            return
        }

        localStorage.setItem('AUTH_TOKEN', token)

        axiosRequest.get<UserData>('/auth/info').then((value) => {
            if (!value) {
                setToken('')
            } else {
                setUserData(value)
            }
        }).catch(err => {
            if (err.response.status == 401) {
                setToken('')

                return
            } else {
                //Network | Server error
            }
        })
    }, [token])

    const payload: AuthContextProps = {
        setToken,
        userData
    }

    return (<AuthContext.Provider value={payload}>{children}</AuthContext.Provider>)
}

const useAuth = () => {
    return useContext(AuthContext)
}

export {
    AuthContextProvider,
    useAuth
}