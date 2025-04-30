import { IBasket } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";

export class Basket extends Component<IBasket> {
  _basketContainer: HTMLElement
  button: HTMLButtonElement
  _price: HTMLSpanElement

  constructor(container: HTMLElement, events: IEvents) {
    super(container)
    this._basketContainer = ensureElement('.basket__list', container)
    this.button = ensureElement<HTMLButtonElement>('.button', container)
    this._price = ensureElement<HTMLSpanElement>('.basket__price', container)

    this.button.addEventListener('click', () => {
       events.emit('delivery:open')
    })
  }

  set basketContainer(items: HTMLElement[]) {
    if(items.length === 0) {
      this.setDisabled(this.button, true)
    } else {
      this.setDisabled(this.button, false)
    }
    this._basketContainer.replaceChildren(...items)
  }

  set price(value: number) {
    this.setText(this._price, `${value.toLocaleString('ru-RU')} синапсов`)
  }
}