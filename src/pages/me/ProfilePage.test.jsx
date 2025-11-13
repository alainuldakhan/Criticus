import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import ProfilePage from './ProfilePage';

jest.mock('../../api/me', () => ({
  profileApi: {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  },
}));

jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { profileApi } = jest.requireMock('../../api/me');
const useAuth = jest.requireMock('../../hooks/useAuth').default;

describe('ProfilePage', () => {
  beforeEach(() => {
    profileApi.getProfile.mockResolvedValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      birthDate: '1815-12-10T00:00:00.000Z',
      avatarUrl: 'https://example.com/avatar.png',
      bio: 'Mathematician and writer.',
    });
    profileApi.updateProfile.mockResolvedValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      birthDate: '1815-12-10T00:00:00.000Z',
      avatarUrl: 'https://example.com/avatar.png',
      bio: 'Mathematician and writer.',
    });

    useAuth.mockReturnValue({
      user: {
        userId: 'user-1',
        email: 'ada@example.com',
        roles: ['Student'],
      },
      refresh: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile fields after loading', async () => {
    renderWithProviders(<ProfilePage />);

    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();

    expect(await screen.findByDisplayValue('Ada')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lovelace')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/avatar.png')).toBeInTheDocument();
  });

  test('submits updated profile information', async () => {
    renderWithProviders(<ProfilePage />);

    const bioInput = await screen.findByLabelText(/bio/i);
    await userEvent.clear(bioInput);
    await userEvent.type(bioInput, 'Exploring analytical engines.');

    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      const [variables] = profileApi.updateProfile.mock.calls[0];
      expect(variables).toEqual(
        expect.objectContaining({ bio: 'Exploring analytical engines.' })
      );
    });
  });
});
