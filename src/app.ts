let App: any;

export function setApp(appClass: any): void {
  App = appClass;
}

export function getApp(): any {
  return App;
}
