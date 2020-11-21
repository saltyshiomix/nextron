import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const basicStyles = css`
background-color: white;
color: cornflowerblue;
border: 1px solid lightgreen;
border-right: none;
border-bottom: none;
box-shadow: 5px 5px 0 0 lightgreen, 8px 8px 0 0 lightyellow;
transition: all 0.1s linear;
margin: 3rem 0;
padding: 2rem;
`;

export const BasicCard = styled.div`
  ${basicStyles};
`;
