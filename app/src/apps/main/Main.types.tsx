interface DebtDetailApiResponse {
    id: number
    amount: number
    lent: number
    ratio: number
    settled: boolean
    added: string
    updated: string | null
    title: string
    description: string
    owner: number
    is_owed: number
    owner_username: string
    is_owed_username: string
}

interface UserDetailApiResponse {
    email: string
    id: number
    token: string
    username: string
}