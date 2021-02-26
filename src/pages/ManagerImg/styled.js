import styled from 'styled-components';
// componente link usado para criação de nova imagem na página 'Image'
import { Link } from 'react-router-dom';

export const ImgContainer = styled.div`
  margin-top: 20px;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
    a {
      margin: 0;
      position: relative;
      bottom: 5px;
    }
    .title {
      width: 60%;
    }
  }
  /*Inserindo borda para separar cada imagem, retirando do primeiro */
  div + div {
    border-top: 1px solid #eee;
  }
`;
export const ThumbImage = styled.div`
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`;

// Componente react (Link) da página 'Image'
export const NewImage = styled(Link)`
  display: block;
  padding: 5px 0;
  text-align: right;
  font-weight: 550;
`;
