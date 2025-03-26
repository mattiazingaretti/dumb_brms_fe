import { HttpInterceptorFn } from '@angular/common/http';
import {LocalKeys} from "../app.routes";



export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem(LocalKeys.AUTH_TOKEN);

  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next(authReq);
  }

  return next(req);
};


