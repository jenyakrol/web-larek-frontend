import { IEvents } from "../components/base/events"

export type Id = string
export type Url = string
export type Price = number

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

export type PayMethod = 'online' | 'cash'

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

export interface IProductCard {
    container: HTMLElement
    title: HTMLHeadingElement
    price: HTMLSpanElement
    category?: HTMLSpanElement
    description?: HTMLParagraphElement
    image?: HTMLImageElement
    deleteButton?: HTMLButtonElement
    render(item: TProductInfo | TProductDetailedInfo | TProductShortInfo): HTMLElement
    deleteCard(cardsContainer: IProductsData): void
}

export interface IModalWindow {
    modal: HTMLElement
    events: IEvents
    open(template: HTMLElement): void
    close(): void
}

export interface IModalContent {
    content: HTMLElement
    modalWindow: IModalWindow
    events: IEvents
    open(): void
}
