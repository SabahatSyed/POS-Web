export type Role = {
    _id: string,
    name: string,
    role: string,
    permissions: string[]
}

export type User = {
    _id: string,
    name: string,
    email: string,
    phone: string,
    address?: string,
    password?: string,
    role: string
}

export type Customer = {
    _id: string,
    name: string,
    email: string,
    phone: string,
    address?: string,
    password?: string,
    role: string
}

export type Checklist = {
    _id: string,
    name: string,
}

export type Label = {
    _id: string,
    title: string,
}

export type Newsletter = {
    _id: string,
    email: string,
}

export type ContactUs = {
    _id: string,
    name: string,
    email: string,
    phone: string,
    message: string
}
