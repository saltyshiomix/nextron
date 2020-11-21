import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { basicStyles } from './BasicCard';

export const hoverStyles = css`
&:hover {
  color: white;
  background-color: lightgray;
  border-color: purple;
  box-shadow: -15px -15px 0 0 aqua, -30px -30px 0 0 cornflowerblue;
}
`;

export const HoverableCard = styled.div`
${basicStyles};
${hoverStyles};
& code {
  background-color: linen;
}
`;
