export type Id = string
export type Url = string
export type Price = number | null
export type PayMethod = 'online' | 'cash'

export type APIProductResponse = {
  items: IProduct[]
  total: number
}

export type APIOrderPost = {
  payment: PayMethod
  email: string
  phone: string
  address: string
  total: Price
  items: Id[]
}

export type APIOrderPostResponse = {
  id: Id
  total: number
}

export interface IProduct {
   id: Id
   title: string
   price: Price
   image: Url
   description: string
   category: string
   isPurchased: boolean
   togglePurchasedStatus(): void
}

export interface IDeliveryForm {
    payMethod: PayMethod
    address: string
}

export interface IContactsForm {
    email: string
    phone: string
}

export type FormErrors = {
  delivery: string
  contacts: string
}

export interface IAppState {
    delivery: IDeliveryForm
    contacts: IContactsForm
    basket: string[]
    formErrors: FormErrors
    catalog: IProduct[]
}

export interface IPage {
  counter: number
  catalog: HTMLElement[]
  locked: boolean
}

export interface IModal {
  content: HTMLElement
}

export interface IBasket {
  basketContainer: HTMLElement[],
  price: number
}

export interface IFormState {
  valid: boolean
  errors: string
}

export type ICard = Pick<IProduct, 'title' | 'description' | 'price' | 'image' | 'id' | 'category' | 'isPurchased'>

export interface ISuccess {
  total: number
}