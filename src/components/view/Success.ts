import { ISuccess } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";

export class Success extends Component<ISuccess> {
  _total: HTMLSpanElement
  button: HTMLButtonElement

  constructor(container: HTMLElement, events: IEvents) {
    super(container)

    this._total = ensureElement<HTMLSpanElement>('.order-success__description', container)
    this.button = ensureElement<HTMLButtonElement>('.button', container)

    this.button.addEventListener('click', () => {
      events.emit('success:close')
    })
  }

  set total(value: number) {
    this.setText(this._total, `Списано ${value.toLocaleString('ru-RU')} синапсов`)
  }
}