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

export type InventoryGroup = {
    _id: string,
    code: string,
    description: string
}

export type CompanyInfo = {
    _id: string,
    seqNumber: number,
    name: string,
    logoURL: string,
    address: string,
    phone: string,
    email: string,
    website: string,
    description: string,
    contact: string,
    pageAccess: Page,
    status: string,
    isDelete: boolean,
    companyType: CompanyType,
}
export type CompanyType ={
    _id: string,
    seqNumber: number,
    name: string,
    isDelete: boolean,
}

export type Page = {
    seqNumber: number,
    name: string,
    companyType: CompanyType,
    isDelete: boolean,
}