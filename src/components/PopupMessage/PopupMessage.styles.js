import styled, { keyframes } from 'styled-components';
import { theme } from 'assets/styles/theme';

const colors = {
  success: theme.colors.primary,
  error: theme.colors.red,
};

const shrinkAnimation = keyframes`
from {
    transform: translateX(-50%) scaleX(1);
}
to {
    transform: translateX(-50%) scaleX(0);
}`;

const slideAnimation = keyframes`
from {
    transform: translateX(-50%) translateY(400%);
}
to {
    transform: translateX(-50%) translateY(0);
}
`;

export const Wrapper = styled.div`
  opacity: 0.98;
  position: absolute;
  left: 50%;
  bottom: 5rem;

  padding: 4.4rem 4rem 2rem;
  background-color: ${theme.colors.background};

  border-radius: 1.5rem;
  border: 2px solid ${theme.colors.darkGrey};

  animation: ${slideAnimation} 1s ease-in-out 1 forwards,
    ${slideAnimation} 1s 6s ease-in-out 1 reverse forwards;

  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  h2 {
    font-size: 1.5rem;
    line-height: 0;
  }

  p {
    font-size: 1.3rem;
    line-height: 1.2;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 2rem;
    transform: translateX(-50%);

    width: 10rem;
    height: 0.5rem;
    border-radius: 5rem;
    background-color: ${({ popupType }) => colors[popupType]};
  }

  &::before {
    opacity: 0.45;
  }

  &::after {
    transform: translateX(-50%) scaleX(1);
    transform-origin: left top;
    animation: ${shrinkAnimation} 5s 1s linear 1 forwards;
  }
`;
