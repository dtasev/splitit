interface DebtApiResponse {
    id: number
    amount: number
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