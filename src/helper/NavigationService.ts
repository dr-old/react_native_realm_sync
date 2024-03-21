import { StackActions, NavigationContainerRef } from "@react-navigation/native";

class NavigationService {
  private instance: NavigationContainerRef | undefined;

  constructor() {
    this.instance = undefined;
    this.setInstance = this.setInstance.bind(this);
    this.navigate = this.navigate.bind(this);
    this.pop = this.pop.bind(this);
    this.push = this.push.bind(this);
    this.replace = this.replace.bind(this);
  }

  setInstance(instance: NavigationContainerRef) {
    this.instance = instance;
  }

  navigate(name: string, options?: object) {
    if (this.instance) {
      this.instance.navigate(name, options);
    }
  }

  replace(name: string, options?: object) {
    if (this.instance) {
      const action = StackActions.replace(name, options);
      this.instance.dispatch(action);
    }
  }

  push(name: string, options?: object) {
    if (this.instance) {
      const action = StackActions.push(name, options);
      this.instance.dispatch(action);
    }
  }

  pop(n?: number) {
    if (this.instance) {
      if (typeof n === "number") {
        const actions = StackActions.pop(n);
        this.instance.dispatch(actions);
      } else {
        this.instance.goBack();
      }
    }
  }
}

export default new NavigationService();
