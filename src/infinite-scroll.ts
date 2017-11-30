import { autoinject, bindable } from 'aurelia-framework';

@autoinject()
export class InfiniteScrollCustomAttribute {
    private isTicking: boolean = false;

    @bindable topCallback: Function;
    @bindable bottomCallback: Function;
    @bindable scrollBuffer: number = 10;
    @bindable isActive: boolean = true;

    public static ScrollEventName: string = 'scroll';

    constructor(private element: Element) {
        this.element = element;
    }

    attached() {
        window.addEventListener(InfiniteScrollCustomAttribute.ScrollEventName, this.onScrollChange);
        this.onScrollChange();
    }

    detached() {
        window.removeEventListener(InfiniteScrollCustomAttribute.ScrollEventName, this.onScrollChange);
    }

    topCallbackChanged(newCallback: Function) {
        this.topCallback = newCallback;
    }

    bottomCallbackChanged(newCallback: Function) {
        this.bottomCallback = newCallback;
    }

    scrollBufferChanged(buffer: number) {
        this.scrollBuffer = +buffer;
    }

    isActiveChanged(isActive: string) {
        this.isActive = (isActive === 'true');
    }

    private onScrollChange = () => {
        if (!this.isActive) {
            return false;
        }

        if (!this.isTicking) {
            window.requestAnimationFrame(() => {
                this.checkScrollPosition();
                this.isTicking = false;
            });
        }

        this.isTicking = true;
    }

    private checkScrollPosition() {
        if (this.topCallback && this.isPageScrolledToTop()) {
            //NOTE: Maintaining the scroll position is the responsibility of the topCallback function.
            //      It is impossible to do it smoothly here.
            this.topCallback();
        }
        if (this.bottomCallback && this.isPageScrolledToBottom()) {
            this.bottomCallback();
        }
    }

    private isPageScrolledToTop() {
        const windowScrollPosition = window.pageYOffset;
        var result = windowScrollPosition <= ((<any>this.element).offsetTop + this.scrollBuffer);
        return result;
    }

    private isPageScrolledToBottom() {
        const elementHeight = this.element.scrollHeight;
        const elementOffsetTop = (<any>this.element).offsetTop;
        const windowScrollPosition = window.innerHeight + window.pageYOffset;
        var result = (windowScrollPosition + this.scrollBuffer) >= (elementHeight + elementOffsetTop);
        return result;
    }
}