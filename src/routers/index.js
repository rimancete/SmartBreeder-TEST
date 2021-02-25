import React from 'react';
// importando componentes de rota
import { Switch } from 'react-router-dom';
import MyRoute from './myRoute';

// recebendo as páginas
import Login from '../pages/Login';
import Image from '../pages/Image';
import Register from '../pages/Register';
import ManagerImg from '../pages/ManagerImg';
import Page404 from '../pages/Page404';

export default function Routes() {
  return (
    <Switch>
      <MyRoute exact path="/" component={ManagerImg} isClosed={false} />
      <MyRoute exact path="/album-image/:id/edit" component={Image} isClosed />
      <MyRoute exact path="/album-image/" component={Image} isClosed />
      <MyRoute exact path="/login/" component={Login} isClosed={false} />
      <MyRoute exact path="/register/" component={Register} isClosed={false} />
      <MyRoute path="*" component={Page404} />
    </Switch>
  );
}
