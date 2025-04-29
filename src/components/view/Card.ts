import { ICard, Price, Url } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class Card extends Component<ICard> {
	button: HTMLButtonElement;
	_title: HTMLElement;
	_price: HTMLSpanElement;

	constructor(container: HTMLElement, onClick: (event: MouseEvent) => void) {
		super(container);

		this.button =
			(container.querySelector('button') as HTMLButtonElement) ||
			(container as HTMLButtonElement);
		this._title = ensureElement('.card__title', container);
		this._price = ensureElement<HTMLSpanElement>('.card__price', container);

		this.button.addEventListener('click', onClick);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}
	set price(value: Price) {
		if (value)
			this.setText(this._price, `${value.toLocaleString('ru-RU')} синапсов`);
		else this.setText(this._price, 'Бесценно');
	}
}

export class MainPageCard extends Card {
	_image: HTMLImageElement;
	_category: HTMLSpanElement;

	constructor(container: HTMLElement, onClick: (event: MouseEvent) => void) {
		super(container, onClick);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLSpanElement>(
			'.card__category',
			container
		);
	}

	set image(value: Url) {
		this.setImage(this._image, value)
	}

	set category(value: string) {
		this.setText(this._category, value);

		let className = '';

		switch (value) {
			case 'софт-скил':
				className = '_soft';
				break;
			case 'хард':
				className = '_hard';
				break;
			case 'другое':
				className = '_other';
				break;
			case 'дополнительное':
				className = '_additional';
				break;
			case 'кнопка':
				className = '_button';
				break;
		}
    this._category.classList.add('card__category' + className)
	}
}

export class PreviewCard extends Card {
	_image: HTMLImageElement;
	_category: HTMLSpanElement;
	_description: HTMLParagraphElement;

  constructor(container: HTMLElement, onClick: (event: MouseEvent) => void) {
    super(container, onClick)

    this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLSpanElement>(
			'.card__category',
			container
		);
    this._description = ensureElement<HTMLParagraphElement>('.card__text', container)
  }

  set image(value: Url) {
    this.setImage(this._image, value)
	}

	set category(value: string) {
		this.setText(this._category, value);

		let className = '';

		switch (value) {
			case 'софт-скил':
				className = '_soft';
				break;
			case 'хард':
				className = '_hard';
				break;
			case 'другое':
				className = '_other';
				break;
			case 'дополнительное':
				className = '_additional';
				break;
			case 'кнопка':
				className = '_button';
				break;
		}
    this._category.classList.add('card__category' + className)
	}

  set description(value: string) {
    this.setText(this._description, value)
  }

  set isPurchased(state: boolean) {
    if (state) {
      this.button.classList.add('button_alt')
      this.setText(this.button, 'Убрать из корзины')
    }
    else {
      this.button.classList.remove('button_alt')
      this.setText(this.button, 'В корзину')
    }
  }
}

export class BasketCard extends Card {
  constructor(index: number, container: HTMLElement, onClick: (event: MouseEvent) => void) {
    super(container, onClick)
    this.setText(ensureElement<HTMLSpanElement>('.basket__item-index', container), index)
  }
}
