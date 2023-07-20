import { makeAutoObservable } from "mobx";

class Counter {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increase() {
    this.count += 1;
  }

  decrease() {
    this.count -= 1;
  }

  reset() {
    this.count = 0;
  }
}

export default Counter;
