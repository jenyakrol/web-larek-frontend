import { IPage, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";

export class Page extends Component<IPage> {
  basket: HTMLButtonElement
  _counter: HTMLSpanElement
  _catalog: HTMLElement
  wrapper: HTMLElement

  constructor(page: HTMLElement, events: IEvents) {
    super(page)

    this.basket = ensureElement<HTMLButtonElement>('.header__basket', page)
    this._counter = ensureElement<HTMLSpanElement>('.header__basket-counter', this.basket)
    this._catalog = ensureElement('.gallery', page)
    this.wrapper = ensureElement('.page__wrapper', page)

    this.basket.addEventListener('click', () => {
      events.emit('basket:open')
    })
  }

  set counter(value: number) {
    this.setText(this._counter, value)
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items)
  }

  set locked(value: boolean) {
    this.wrapper.classList.toggle('page__wrapper_locked', value)
  }
}