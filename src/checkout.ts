declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (
    paths: string[],
    callback: (require: <T>(path: string) => T) => void
  ) => void;
};


require('./paybear.js');

interface PSCOpts {
    key: string
};

export class PaybearShopifyCheckout {
    private key: string;
    private orderName: number = null;

    constructor (opts: PSCOpts) {
        this.key = opts.key;

        let that = this;
        document.addEventListener("DOMContentLoaded", function(event) {
          that.init();
        });
    }

    public isPaybearPaymentMethod(): boolean {
        const paymentMethod = document.querySelector('.payment-method-list .payment-method-list__item__info');

        if (paymentMethod && paymentMethod.innerHTML.toLowerCase().indexOf('paybear') !== -1) {
            return true;
        }

        return false;
    }

    public getOrderName()
    {
        if (this.orderName === null) {
            const orderNumberEl = document.querySelector('.os-order-number');
            if (orderNumberEl) {
                this.orderName = parseInt(orderNumberEl.innerHTML.replace(/[^0-9]/gi, ''));
            }
        }

        return this.orderName;
    }

    public init() {
        if (!this.isPaybearPaymentMethod() || !this.getOrderName()) {
            return;
        }

        this.loadCss();
        this.insertButton();
        this.initPaybear();
    }

    public loadCss() {
        var cssId = 'paybear-css';  // you could encode the css path itself to generate id..
        if (!document.getElementById(cssId)) {
            const head  = document.getElementsByTagName('head')[0];
            let link  = document.createElement('style');
            link.id   = cssId;
            link.innerHTML = require('./paybear.css');
            head.appendChild(link);
        }
    }

    public insertButton() {
        const thanksEl = document.querySelector('.os-step__special-description,.os-step__description');
        let button = document.createElement('button');
        button.id = 'paybear-all';
        button.innerHTML = 'Pay with Crypto';
        button.className = 'btn';

        let parentNode = thanksEl.parentNode;
        parentNode.replaceChild(button, thanksEl);
        var paybearFormWrapper = document.createElement('div');
        paybearFormWrapper.innerHTML = require('./form.html');
        parentNode.appendChild(paybearFormWrapper);
    }

    public initPaybear() {
        (<any>window).paybearWidget = new (<any>window).Paybear({
            button: '#paybear-all',
            settingsUrl: `https://localhost:8000/shopify/${this.key}/${this.getOrderName()}/payment/settings`,
            modal: true
        });
    }
}

(<any>window).PaybearShopifyCheckout = PaybearShopifyCheckout;
