import { Id, PayMethod, Price, Url } from "./basic"

export interface IProduct {
   id: Id
   title: string
   price: Price
   image: Url
   descrtiption: string
   category: string
}

export interface IProductsData {
    items: IProduct[]
    add(item: IProduct): void
    remove(item: IProduct): void
    getItem(id: Id): IProduct
}

export interface IUser {
    basket: IProductsData
    basketTotalPrice: Price
    address: string
    email: string
    payMethod: PayMethod
    phoneNumber: string
}

export interface IUserData {
    setUserInfo(userData: IUser): void
    checkUserValidation(data: Record<keyof TUserDeliverySettings, string> | Record<keyof TUserContactInfo, string>): boolean
}

export type TProductInfo = Pick<IProduct, 'title' | 'price' | 'image' | 'category'>

export type TProductDetailedInfo = Pick<IProduct, 'title' | 'price' | 'image' | 'category' | 'descrtiption'>

export type TProductShortInfo = Pick<IProduct, 'title' | 'price'>

export type TUserDeliverySettings = Pick<IUser, 'payMethod' | 'address'>

export type TUserContactInfo = Pick<IUser, 'phoneNumber'| 'email'>
