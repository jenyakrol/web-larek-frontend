import { IEvents } from "../components/base/events"
import { IProductsData, TProductDetailedInfo, TProductInfo, TProductShortInfo } from "./data"

export interface IProductCard {
    container: HTMLElement
    title: HTMLHeadingElement
    price: HTMLSpanElement
    category?: HTMLSpanElement
    description?: HTMLParagraphElement
    image?: HTMLImageElement
    deleteButton?: HTMLButtonElement
    events: IEvents
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