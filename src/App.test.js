import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page hero headline', () => {
  render(<App />);
  const heading = screen.getByRole('heading', {
    name: /empower critical thinkers/i,
  });
  expect(heading).toBeInTheDocument();
});
