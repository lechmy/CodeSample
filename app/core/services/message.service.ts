import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as Noty from 'noty';

export interface IMessage {
  show(): void;
  close(): void;
  stop(): void;
  resume(): void;
}

class NoopMessage implements IMessage {
  show(): void { }
  close(): void { }
  stop(): void { }
  resume(): void { }
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _options: Noty.Options = {
    layout: "bottomRight",
    theme: "bootstrap-v4",
    closeWith: ['click'],
    timeout: 10000
  };
  private _isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this._isBrowser = isPlatformBrowser(platformId);
  }

  alert(msg: string, show = true): IMessage {
    return this._message(msg, 'alert', show);
  }

  success(msg: string, show = true): IMessage {
    return this._message(msg, 'success', show);
  }

  warning(msg: string, show = true): IMessage {
    return this._message(msg, 'warning', show);
  }

  error(msg: string, show = true): IMessage {
    return this._message(msg, 'error', show);
  }

  info(msg: string, show = true): IMessage {
    return this._message(msg, 'info', show);
  }

  closeAll() {
    if (this._isBrowser)
      Noty.closeAll();
  }

  setMaxVisible(max: number) {
    if (this._isBrowser)
      Noty.setMaxVisible(max);
  }

  private _message(msg: string, type: string, show: boolean): IMessage {
    if (!this._isBrowser)
      return new NoopMessage();

    const htmlMsg = msg.replace(/(?:\r\n|\r|\n)/g, '<br>');

    const noty = new Noty(Object.assign({}, this._options, {
      type: type,
      text: htmlMsg
    }))
    if (show)
      noty.show();
    return noty as IMessage;
  }
}
