
export type AgentInvite = {
    _id: string,
    name: string,
    email: string,
    split_percentage?: string,
    status?: string,
}

export type AgentRequest = {
    _id: string,
    name: string,
    email: string,
    status?: string,
}


export type Agent = {
    _id: string,
    name: string,
    email: string,
    phone: string,
    address?: string,
    password?: string,
    role: string
}

