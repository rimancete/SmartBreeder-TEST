import React, { useEffect, useState } from 'react';
// importar get lodash para coleta do id da imagem
import { get } from 'lodash';
// importa PropTypes para validação do match
import PropTypes from 'prop-types';
// importar componentes para validação dos campos
import { toast } from 'react-toastify';
import { isEmail, isInt, isFloat } from 'validator';

// importando componentes para consumo da api
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

// ICONS

// LOADING
import Loading from '../../components/Loading';

// STYLES
import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';

export default function Image({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', '');

  // configurar campos do fomulário
  const [title, setTitle] = useState('');
  const [idImg, setImgId] = useState('');
  const [foto, setPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // recebendo/atualizando dados para os inputs
  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        // recebendo os dados da imagem em uma variável para serem retornados após cadastro como edição de imagem
        const { data } = await axios.get(`/albums/1/photos?id=${id}`);
        const Photo = data[0].url;
        setPhoto(Photo);
        setTitle(data[0].title);
        setImgId(data[0].id);

        setIsLoading(false);
        // eslint-disable-next-line no-empty
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) errors.map((error) => toast.error(error));
        history.push('/');
      }
    }
    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validação de campos
    let formErrors = false;
    if (title.length < 3 || title.length > 20) {
      toast.error('Título deve ter entre 3 e 20 caracteres');
      formErrors = true;
    }
    if (!isInt(String(idImg))) {
      toast.error('Id da imagem deve ser um número inteiro');
      formErrors = true;
    }
    if (formErrors) return;
    // tenta envio dos dados para API
    try {
      setIsLoading(true);
      // se tem id é uma edição
      if (id) {
        const updateImg = await axios.patch(`/albums/1/photos?id=${id}`, {
          title,
        });
        console.log('Update response', updateImg);
        toast.success('Imagem editada com sucesso');
      } else {
        // se não tem id é uma criação
        const { data } = await axios.post(`/albums/1/photos/`, {
          title,
          id,
        });
        console.log('Create response', data);
        toast.success('Imagem criada com sucesso');
        history.push(`/album-image/${data.id}/edit`);
      }
      setIsLoading(false);
      // se der erro, tratar
    } catch (err) {
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);
      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Erro desconhecido');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };
  return (
    <Container>
      <Loading isLoading={isLoading} />
      {id && (
        <ProfilePicture>
          {foto ? <img src={foto} alt={title} /> : <FaUserCircle size={180} />}
          <Link to={`/fotos/${id}`}>
            <FaCamera size={18} />
          </Link>
        </ProfilePicture>
      )}
      <Title>{id ? 'Editar Imagem' : 'Nova Imagem'}</Title>
      <Form onSubmit={handleSubmit}>
        {!id && (
          <label htmlFor="id-img">
            Id da imagem:
            <input
              type="number"
              placeholder="Id da imagem"
              value={idImg}
              onChange={(e) => setImgId(e.target.value)}
            />
          </label>
        )}
        <label htmlFor="title">
          Título:
          <input
            type="text"
            placeholder="Título da imagem"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <button type="submit">{id ? `Salvar Dados` : `Criar Imagem`}</button>
      </Form>
    </Container>
  );
}

// validação do match como objeto
Image.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
