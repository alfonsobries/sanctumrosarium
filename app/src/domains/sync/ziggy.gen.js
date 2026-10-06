const Ziggy = {"url":"http:\/\/localhost:8000","port":8000,"defaults":{},"routes":{"api.auth.anonymous":{"uri":"api\/auth\/anonymous","methods":["POST"]},"api.auth.identity":{"uri":"api\/auth\/{provider}","methods":["POST"],"wheres":{"provider":"apple|google"},"parameters":["provider"]},"api.auth.logout":{"uri":"api\/auth\/token","methods":["DELETE"]},"api.me.show":{"uri":"api\/me","methods":["GET","HEAD"]},"api.me.update":{"uri":"api\/me","methods":["PATCH"]},"api.me.destroy":{"uri":"api\/me","methods":["DELETE"]},"api.sync":{"uri":"api\/sync","methods":["POST"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
