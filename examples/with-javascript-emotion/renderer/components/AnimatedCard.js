import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { basicStyles } from './BasicCard';
import { hoverStyles } from './HoverableCard';

export const bounce = keyframes`
from {
  transform: scale(1.01);
}
to {
  transform: scale(0.99);
}
`;

export const AnimatedCard = styled.div`
  ${basicStyles};
  ${hoverStyles};
  & code {
    background-color: linen;
  }
  animation: ${props => props.animation} 0.2s infinite ease-in-out alternate;
`;
