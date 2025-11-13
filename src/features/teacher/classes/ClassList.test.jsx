import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import ClassList from './ClassList';

jest.mock('../../../api/classes', () => ({
  classesApi: {
    list: jest.fn(),
    create: jest.fn(),
  },
}));

const { classesApi } = jest.requireMock('../../../api/classes');

describe('ClassList', () => {
  beforeEach(() => {
    classesApi.list.mockResolvedValue([]);
    classesApi.create.mockResolvedValue({
      id: 'new-class',
      name: 'New Class',
      grade: 7,
      year: 2026,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders classes returned from the API', async () => {
    classesApi.list.mockResolvedValueOnce([
      { id: '1', name: 'Critical Thinking 7A', grade: 7, year: 2025 },
    ]);

    renderWithProviders(<ClassList />);

    expect(await screen.findByText('Your classes')).toBeInTheDocument();
    expect(await screen.findByText('Critical Thinking 7A')).toBeInTheDocument();
  });

  test('submits new class creation', async () => {
    renderWithProviders(<ClassList />);

    await waitFor(() => expect(classesApi.list).toHaveBeenCalled());

    await userEvent.type(screen.getByLabelText(/class name/i), 'Creative Writing');
    await userEvent.click(screen.getByRole('button', { name: /create class/i }));

    await waitFor(() => {
      const [variables] = classesApi.create.mock.calls[0];
      expect(variables).toEqual(
        expect.objectContaining({ name: 'Creative Writing', grade: undefined, year: undefined })
      );
    });
  });
});
