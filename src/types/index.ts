export type Id = string
export type Url = string
export type Price = number | null
export type PayMethod = 'online' | 'cash'

export interface IProduct {
   id: Id
   title: string
   price: Price
   image: Url
   descrtiption: string
   category: string
}

export interface IDeliveryForm {
    payMethod: PayMethod
    address: string
}

export interface IContactsForm {
    email: string
    phone: string
}

export type FormErrors = Partial<Record<keyof (IDeliveryForm & IContactsForm), string>>

export interface IAppState {
    delivery: IDeliveryForm
    contacts: IContactsForm
    basket: string[]
    formErrors: FormErrors
}

export interface IPage {
  counter: number
  catalog: IProduct[]
  locked: boolean
}

export interface IModal {
  content: HTMLElement
}

export interface IFormState {
  valid: boolean
  errors: string
}

export type ICard = Pick<IProduct, 'title' | 'descrtiption' | 'price' | 'image' | 'id' | 'category'>

export interface ISuccess {
  total: number
}