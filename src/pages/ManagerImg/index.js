import React, { useState } from 'react';
// importando link do react router dom
import { Link } from 'react-router-dom';
// importando lodash => tratamento excessão
import { get } from 'lodash';
// importando ícones que serão exibidos no lugar de fotos inexistentes de alunos
import { FaUserCircle, FaEdit, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';
import { ImgContainer, ProfilePicture, NovoAluno } from './styled';
// importando componentes para consumo da api
import axios from '../../services/axios';

// importando componente de loading da página
import Loading from '../../components/Loading';

// DIALOG
import AlertDialog from '../../components/Dialog';

export default function ManagerImg() {
  // definindo estado isLoading da página
  const [isLoading, setIsLoading] = useState(false);
  // definindo os estados, dados(api) e forma de manipulação
  const [images, setImages] = useState([]);

  // DIALOG
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const openDialog = () => setDialogIsOpen(true);
  const closeDialog = () => setDialogIsOpen(false);

  React.useEffect(() => {
    async function getData() {
      // antes de comunicar com api, informar o loading
      setIsLoading(true);
      const response = await axios.get('/albums/1/photos?_sort=id&_order=desc');
      // enviando dados da api para o app
      setImages(response.data);
      // depois de retornar da api retirar o loading
      setIsLoading(false);
    }
    getData();
  }, []);

  // criando função que realiza a exclusão do aluno
  const handleDelete = async (e, id, index) => {
    e.persist();
    try {
      setIsLoading(true);
      // excluir aluno
      await axios.delete(`/albums/1`);
      // apagar a linha com os dados da página
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', []);
      if (status === 401) {
        toast.error('Você precisa fazer login');
      } else {
        toast.error('Ocorreu um erro ao excluir o aluno');
      }
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <NovoAluno to="/image">
        Nova Imagem <FaFileAlt size={22} />
      </NovoAluno>
      <h1>Imagens</h1>
      {/* exibindo dados da api na página */}
      <ImgContainer>
        {images.map((image, index) => (
          <div key={String(image.id)}>
            {/* Se o image não tiver foto, exibir ícone */}
            <ProfilePicture>
              {image.url ? (
                <img src={image.url} alt="" />
              ) : (
                <FaUserCircle className="within-pic" size={50} />
              )}
            </ProfilePicture>
            {/* Coletando dados da api */}
            <span>{image.title}</span>
            <span>{image.id}</span>
            {/* Inserindo link para edição e exclusão de alunos */}
            <Link to={`/image/${image.id}/edit`}>
              <FaEdit size={24} />
            </Link>
            <Link onClick={() => setDialogIsOpen(true)} to="/">
              <AlertDialog
                title="Deseja realmente deletar o aluno selecionado?"
                // eslint-disable-next-line react/no-children-prop
                children="Após exclusão, todos os dados do aluno serão excluídos definitivamente."
                open={dialogIsOpen}
                setOpen={openDialog}
                onConfirm={(e) => handleDelete(e, image.id, index)}
                onClose={closeDialog}
              />
            </Link>
          </div>
        ))}
      </ImgContainer>
    </Container>
  );
}
